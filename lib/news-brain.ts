import { timingSafeEqual } from "node:crypto";
import { revalidatePath } from "next/cache";
import { createServiceClient } from "@/lib/supabase-server";
import { findStoryImage } from "@/lib/news-images";
import {
  EDITABLE_FIELDS,
  autoPublishBlockers,
  validateArticle,
  type ArticleInput,
  type Block,
  type NewsArticle,
  type Source,
} from "@/lib/news";

// Server side of the News Brain API. The Brain (a scheduled Claude routine)
// decides what to write; this module decides what it's *allowed* to do —
// the publish policy and admin overrides are enforced here, not trusted to
// the prompt.

export function isBrainRequest(request: Request) {
  const token = process.env.NEWS_BRAIN_TOKEN;
  const header = request.headers.get("authorization") ?? "";
  if (!token || !header.startsWith("Bearer ")) return false;
  const given = Buffer.from(header.slice(7));
  const expected = Buffer.from(token);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

export const json = (status: number, body: unknown) =>
  Response.json(body, { status });

// Route wrapper: token check, then any thrown error (e.g. a missing env
// var) comes back as JSON the Brain can read, not an HTML error page.
export async function handle(request: Request, fn: () => Promise<Response>) {
  if (!isBrainRequest(request)) return json(401, { error: "unauthorized" });
  try {
    return await fn();
  } catch (err) {
    console.error("news brain api:", err);
    return json(500, { error: err instanceof Error ? err.message : "server error" });
  }
}

const today = () => new Date().toISOString().slice(0, 10);

function pickEditable(input: Record<string, unknown>) {
  const out: Record<string, unknown> = {};
  for (const k of EDITABLE_FIELDS) if (k in input) out[k] = input[k];
  return out as Partial<ArticleInput>;
}

function revalidateNews(slug: string) {
  revalidatePath("/news");
  revalidatePath("/news/" + slug);
  revalidatePath("/sitemap.xml");
}

async function logEvent(
  db: ReturnType<typeof createServiceClient>,
  article: { id: string; slug: string },
  action: string,
  note = "",
) {
  await db.from("news_events").insert({
    article_id: article.id,
    article_slug: article.slug,
    actor: "brain",
    action,
    note,
  });
}

// Compact index the Brain checks before writing anything (duplicate
// detection), including rejected stories so it doesn't keep re-proposing
// them, and admin "force update" requests.
export async function listForBrain() {
  const db = createServiceClient();
  const { data, error } = await db
    .from("news_articles")
    .select(
      "slug,title,summary,game,category,importance,status,lifecycle,verification_status,confidence_level,needs_update,brain_locked,flagged_incorrect,published_at,updated_at,last_checked_at,editor_notes",
    )
    .order("updated_at", { ascending: false })
    .limit(300);
  if (error) return json(500, { error: error.message });
  return json(200, { articles: data });
}

export async function getForBrain(slug: string) {
  const db = createServiceClient();
  const { data, error } = await db
    .from("news_articles")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) return json(500, { error: error.message });
  if (!data) return json(404, { error: "no article " + slug });
  return json(200, { article: data });
}

const DUPLICATE_WINDOW_DAYS = 10;

export async function createFromBrain(input: Record<string, unknown>) {
  const slug = String(input.slug ?? "");
  const fields = pickEditable(input);
  const errors = validateArticle({ ...fields, slug });
  if (errors.length) return json(422, { error: "validation failed", errors });
  const a = fields as ArticleInput;
  const db = createServiceClient();

  const { data: existing } = await db
    .from("news_articles")
    .select("slug,status")
    .eq("slug", slug)
    .maybeSingle();
  if (existing)
    return json(409, {
      error: "slug exists — update that article instead",
      existing,
    });

  // Same game, recent article: almost always an update, not a new story.
  // The Brain has to say why if it really is separate.
  if (a.game && !input.duplicate_rationale) {
    const since = new Date(Date.now() - DUPLICATE_WINDOW_DAYS * 864e5).toISOString();
    const { data: sameGame } = await db
      .from("news_articles")
      .select("slug,title,status,updated_at")
      .ilike("game", a.game)
      .neq("status", "rejected")
      .gte("updated_at", since);
    if (sameGame && sameGame.length)
      return json(409, {
        error:
          "recent article(s) about this game exist — update one, or resend with duplicate_rationale explaining why this is a separate story",
        possible_duplicates: sameGame,
      });
  }

  // No image supplied: the game's IGDB art, else the official source's
  // own image; the PlayThruu card is the last resort.
  if (!a.image_url) Object.assign(a, await findStoryImage(a));

  const blockers = autoPublishBlockers(a);
  const publish = blockers.length === 0;
  const now = new Date().toISOString();
  const notes = [
    a.editor_notes,
    input.duplicate_rationale ? "Separate story because: " + input.duplicate_rationale : "",
    publish ? "" : "Queued for review: " + blockers.join("; "),
  ]
    .filter(Boolean)
    .join("\n");

  const { data, error } = await db
    .from("news_articles")
    .insert({
      ...a,
      slug,
      editor_notes: notes,
      status: publish ? "published" : "review",
      lifecycle: publish ? "published" : a.confidence_level === "Low" ? "discovered" : "verified",
      published_at: publish ? now : null,
      updated_at: now,
      last_checked_at: now,
    })
    .select("id,slug,status,lifecycle")
    .single();
  if (error) return json(500, { error: error.message });

  await logEvent(db, data, publish ? "published" : "queued", publish ? "" : blockers.join("; "));
  if (publish) revalidateNews(slug);
  return json(201, { article: data, queued_because: blockers });
}

function mergeSources(existing: Source[], added: Source[]) {
  const key = (s: Source) => (s.url || s.name).toLowerCase();
  const seen = new Set(existing.map(key));
  return [...existing, ...added.filter((s) => !seen.has(key(s)))];
}

// PATCH body: any editable fields (full replacement per field), plus
//   add_sources:   Source[]  appended, never replacing history
//   append_update: string    adds "UPDATE — <today>" above the original text
//   archive:       true      takes a published story off the feed
//   checked:       true      alone = "looked, nothing new" (no timestamp bump)
export async function updateFromBrain(slug: string, input: Record<string, unknown>) {
  const db = createServiceClient();
  const { data: current, error: readErr } = await db
    .from("news_articles")
    .select("*")
    .eq("slug", slug)
    .maybeSingle<NewsArticle>();
  if (readErr) return json(500, { error: readErr.message });
  if (!current) return json(404, { error: "no article " + slug });
  if (current.brain_locked)
    return json(423, { error: "locked by an admin — the Brain may not edit this article" });
  if (current.status === "rejected")
    return json(409, { error: "rejected by an admin — do not revive" });

  const now = new Date().toISOString();
  const keys = Object.keys(input);

  if (keys.length === 1 && input.checked === true) {
    await db
      .from("news_articles")
      .update({ last_checked_at: now, needs_update: false })
      .eq("id", current.id);
    return json(200, { article: { slug, status: current.status }, changed: false });
  }

  if (input.archive === true) {
    if (current.status !== "published")
      return json(409, { error: "only published articles can be archived" });
    await db
      .from("news_articles")
      .update({ status: "archived", lifecycle: "archived", last_checked_at: now, needs_update: false })
      .eq("id", current.id);
    await logEvent(db, current, "archived", String(input.note ?? ""));
    revalidateNews(slug);
    return json(200, { article: { slug, status: "archived" }, changed: true });
  }

  const patch = pickEditable(input);
  const next = {
    ...pickEditable(current as unknown as Record<string, unknown>),
    ...patch,
  } as ArticleInput;

  if (Array.isArray(input.add_sources))
    next.sources = mergeSources(next.sources, input.add_sources as Source[]);
  if (typeof input.append_update === "string" && input.append_update.trim()) {
    const update: Block = { type: "update", date: today(), text: input.append_update.trim() };
    next.body = [update, ...next.body];
  }

  if (!next.image_url) Object.assign(next, await findStoryImage(next));

  const errors = validateArticle(next);
  if (errors.length) return json(422, { error: "validation failed", errors });

  const resolved =
    current.verification_status !== "confirmed" && next.verification_status === "confirmed";
  const blockers = autoPublishBlockers({ ...next, flagged_incorrect: current.flagged_incorrect });

  let status = current.status;
  let lifecycle = current.lifecycle;
  let published_at = current.published_at;

  if (current.status === "published" || current.status === "archived") {
    lifecycle = resolved ? "resolved" : "updated";
  } else if (current.status === "review" && blockers.length === 0) {
    // e.g. a queued rumour the developer has now confirmed
    status = "published";
    lifecycle = resolved ? "resolved" : "published";
    published_at = now;
  }

  const { error } = await db
    .from("news_articles")
    .update({
      ...next,
      status,
      lifecycle,
      published_at,
      updated_at: now,
      last_checked_at: now,
      needs_update: false,
    })
    .eq("id", current.id);
  if (error) return json(500, { error: error.message });

  const action =
    status !== current.status ? "published" : resolved ? "resolved" : "updated";
  await logEvent(db, current, action, typeof input.note === "string" ? input.note : "");
  if (status === "published" || current.status !== "review") revalidateNews(slug);

  return json(200, {
    article: { slug, status, lifecycle },
    changed: true,
    queued_because: status === "review" ? blockers : [],
  });
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/supabase-server";
import {
  textToBody,
  validateArticle,
  type ArticleInput,
  type NewsArticle,
  type Source,
} from "@/lib/news";

// Admin overrides. Every one runs as the signed-in user, so RLS
// (is_news_admin) is the real gate; the explicit check just gives a clear
// error. Admin decisions always win: the Brain can't edit a locked article
// or revive a rejected one.

async function requireAdmin() {
  const { client, user, isAdmin } = await getAdmin();
  if (!user || !isAdmin) redirect("/admin/login");
  return { client, actor: user.email ?? user.id };
}

function back(id: string, key: "msg" | "error", text: string): never {
  redirect("/admin/news/" + id + "?" + key + "=" + encodeURIComponent(text));
}

function revalidateNews(slug: string) {
  revalidatePath("/news");
  revalidatePath("/news/" + slug);
  revalidatePath("/sitemap.xml");
}

export async function signOut() {
  const { client } = await getAdmin();
  await client.auth.signOut();
  redirect("/admin/login");
}

const list = (v: FormDataEntryValue | null) =>
  String(v ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
const opt = (v: FormDataEntryValue | null) => String(v ?? "").trim() || null;

// Sources are edited one per line: "tier | name | url"
function parseSources(text: string): Source[] {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const [tier, name, url] = line.split("|").map((p) => p.trim());
      return { tier: Number(tier) as 1 | 2 | 3, name, ...(url ? { url } : {}) };
    });
}

export async function saveArticle(id: string, form: FormData) {
  const { client, actor } = await requireAdmin();
  const input: ArticleInput = {
    title: String(form.get("title") ?? "").trim(),
    summary: String(form.get("summary") ?? "").trim(),
    body: textToBody(String(form.get("body") ?? "")),
    why_it_matters: String(form.get("why_it_matters") ?? "").trim(),
    category: String(form.get("category") ?? "").trim(),
    importance: String(form.get("importance")) as ArticleInput["importance"],
    verification_status: String(form.get("verification_status")) as ArticleInput["verification_status"],
    confidence_level: String(form.get("confidence_level")) as ArticleInput["confidence_level"],
    confidence_reason: String(form.get("confidence_reason") ?? "").trim(),
    primary_source: opt(form.get("primary_source")),
    first_reported_by: opt(form.get("first_reported_by")),
    sources: parseSources(String(form.get("sources") ?? "")),
    editor_notes: String(form.get("editor_notes") ?? ""),
    game: opt(form.get("game")),
    publisher: opt(form.get("publisher")),
    developer: opt(form.get("developer")),
    platforms: list(form.get("platforms")),
    genres: list(form.get("genres")),
    tags: list(form.get("tags")),
    image_url: opt(form.get("image_url")),
    image_credit: opt(form.get("image_credit")),
    seo_title: String(form.get("seo_title") ?? "").trim(),
    seo_description: String(form.get("seo_description") ?? "").trim(),
    keywords: list(form.get("keywords")),
    social_caption: String(form.get("social_caption") ?? "").trim(),
    card_description: String(form.get("card_description") ?? "").trim(),
  };

  const errors = validateArticle(input);
  if (errors.length) back(id, "error", errors.join("\n"));

  const { data, error } = await client
    .from("news_articles")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("slug,status")
    .single();
  if (error) back(id, "error", error.message);

  await client.from("news_events").insert({
    article_id: id,
    article_slug: data.slug,
    actor,
    action: "edited",
  });
  if (data.status === "published" || data.status === "archived") revalidateNews(data.slug);
  back(id, "msg", "Saved.");
}

type Op =
  | "approve"
  | "unpublish"
  | "reject"
  | "archive"
  | "verify"
  | "incorrect"
  | "clear-flag"
  | "force-update"
  | "lock"
  | "unlock"
  | "delete";

export async function runOp(id: string, form: FormData) {
  const { client, actor } = await requireAdmin();
  const op = String(form.get("op")) as Op;
  const note = String(form.get("note") ?? "").trim();

  const { data: a } = await client
    .from("news_articles")
    .select("id,slug,status,lifecycle,published_at")
    .eq("id", id)
    .maybeSingle<Pick<NewsArticle, "id" | "slug" | "status" | "lifecycle" | "published_at">>();
  if (!a) redirect("/admin/news");

  const log = (action: string) =>
    client.from("news_events").insert({
      article_id: a.id,
      article_slug: a.slug,
      actor,
      action,
      note,
    });

  if (op === "delete") {
    await log("deleted");
    const { error } = await client.from("news_articles").delete().eq("id", id);
    if (error) back(id, "error", error.message);
    revalidateNews(a.slug);
    redirect("/admin/news?tab=" + a.status);
  }

  const now = new Date().toISOString();
  const updates: Record<Op, Record<string, unknown>> = {
    approve: {
      status: "published",
      lifecycle: a.published_at ? a.lifecycle : "published",
      published_at: a.published_at ?? now,
      flagged_incorrect: false,
      updated_at: now,
    },
    unpublish: { status: "review" },
    reject: { status: "rejected" },
    archive: { status: "archived", lifecycle: "archived" },
    verify: {
      verification_status: "confirmed",
      flagged_incorrect: false,
      lifecycle: a.status === "published" ? "resolved" : "verified",
      updated_at: now,
    },
    // Pulls a live story off the site until someone fixes it.
    incorrect: {
      flagged_incorrect: true,
      needs_update: true,
      ...(a.status === "published" ? { status: "review" } : {}),
    },
    "clear-flag": { flagged_incorrect: false },
    "force-update": { needs_update: true },
    lock: { brain_locked: true },
    unlock: { brain_locked: false },
    delete: {},
  };

  const { error } = await client.from("news_articles").update(updates[op]).eq("id", id);
  if (error) back(id, "error", error.message);
  await log(op);
  revalidateNews(a.slug);
  back(id, "msg", "Done: " + op + ".");
}

import { supabase } from "@/lib/supabase";

// PlayThruu News. Articles live in the news_articles table (see
// supabase-migrations/2026-09-30_news.sql). The News Brain writes them
// through /api/news/brain, admins through /admin/news, and the public
// pages read published rows with the anon key.

export const VERIFICATION = ["confirmed", "reported", "rumor", "leak"] as const;
export const IMPORTANCE = ["breaking", "important", "standard", "minor"] as const;
export const CONFIDENCE = ["High", "Medium", "Low"] as const;
export const STATUS = ["review", "published", "rejected", "archived"] as const;
export const LIFECYCLE = [
  "discovered",
  "verified",
  "published",
  "updated",
  "resolved",
  "archived",
] as const;
export const BLOCK_LABELS = ["Confirmed", "Reported", "Rumor", "Leak"] as const;

export type Verification = (typeof VERIFICATION)[number];
export type Importance = (typeof IMPORTANCE)[number];
export type Status = (typeof STATUS)[number];
export type BlockLabel = (typeof BLOCK_LABELS)[number];

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  // A passage whose certainty differs from the article's overall status —
  // e.g. a rumour inside an otherwise confirmed story.
  | { type: "status"; label: BlockLabel; text: string }
  // "UPDATE — <date>": new information added after publication. Newest
  // first, above the original text, which is kept intact.
  | { type: "update"; date: string; text: string };

// tier 1 = official/primary, 2 = established journalism, 3 = community
// (discovery only — never enough on its own to confirm anything).
export type Source = { name: string; url?: string; tier: 1 | 2 | 3 };

export type NewsArticle = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  body: Block[];
  why_it_matters: string;
  category: string;
  importance: Importance;
  status: Status;
  lifecycle: (typeof LIFECYCLE)[number];
  verification_status: Verification;
  confidence_level: (typeof CONFIDENCE)[number];
  confidence_reason: string;
  primary_source: string | null;
  first_reported_by: string | null;
  sources: Source[];
  editor_notes: string;
  game: string | null;
  publisher: string | null;
  developer: string | null;
  platforms: string[];
  genres: string[];
  tags: string[];
  image_url: string | null;
  image_credit: string | null;
  seo_title: string;
  seo_description: string;
  keywords: string[];
  social_caption: string;
  card_description: string;
  flagged_incorrect: boolean;
  needs_update: boolean;
  brain_locked: boolean;
  published_at: string | null;
  updated_at: string;
  last_checked_at: string;
  created_at: string;
};

// Fields an author (Brain or admin) supplies; the rest is managed state.
export const EDITABLE_FIELDS = [
  "title",
  "summary",
  "body",
  "why_it_matters",
  "category",
  "importance",
  "verification_status",
  "confidence_level",
  "confidence_reason",
  "primary_source",
  "first_reported_by",
  "sources",
  "editor_notes",
  "game",
  "publisher",
  "developer",
  "platforms",
  "genres",
  "tags",
  "image_url",
  "image_credit",
  "seo_title",
  "seo_description",
  "keywords",
  "social_caption",
  "card_description",
] as const;

export type ArticleInput = Pick<NewsArticle, (typeof EDITABLE_FIELDS)[number]>;

const isStr = (v: unknown): v is string => typeof v === "string";
const isStrArr = (v: unknown): v is string[] =>
  Array.isArray(v) && v.every(isStr);

// The brief's hard rules, enforced in code for every write path.
export function validateArticle(a: Partial<ArticleInput> & { slug?: string }) {
  const errors: string[] = [];
  const need = (cond: boolean, msg: string) => {
    if (!cond) errors.push(msg);
  };

  if (a.slug !== undefined)
    need(/^[a-z0-9]+(-[a-z0-9]+)*$/.test(a.slug), "slug: lowercase words joined by hyphens");
  need(isStr(a.title) && a.title.trim().length > 0 && a.title.length <= 140, "title: required, ≤ 140 chars");
  need(isStr(a.summary) && a.summary.trim().length > 0, "summary: required");
  need(isStr(a.why_it_matters) && a.why_it_matters.trim().length > 0, "why_it_matters: required");
  need(isStr(a.category) && a.category.trim().length > 0, "category: required");
  need(IMPORTANCE.includes(a.importance as Importance), "importance: " + IMPORTANCE.join(" | "));
  need(VERIFICATION.includes(a.verification_status as Verification), "verification_status: " + VERIFICATION.join(" | "));
  need(CONFIDENCE.includes(a.confidence_level as "High"), "confidence_level: High | Medium | Low");
  need(isStr(a.confidence_reason) && a.confidence_reason.trim().length > 0, "confidence_reason: required");

  const body = a.body;
  if (!Array.isArray(body) || body.length === 0) {
    errors.push("body: at least one block");
  } else {
    body.forEach(function (b, i) {
      const ok =
        b &&
        isStr(b.text) &&
        b.text.trim().length > 0 &&
        (b.type === "p" ||
          b.type === "h2" ||
          (b.type === "status" && BLOCK_LABELS.includes(b.label)) ||
          (b.type === "update" && /^\d{4}-\d{2}-\d{2}$/.test(b.date)));
      need(!!ok, "body[" + i + "]: invalid block");
    });
  }

  const sources = a.sources;
  if (!Array.isArray(sources) || sources.length === 0) {
    errors.push("sources: at least one");
  } else {
    sources.forEach(function (s, i) {
      need(
        !!s && isStr(s.name) && s.name.trim().length > 0 && [1, 2, 3].includes(s.tier) &&
          (s.url === undefined || s.url === null || /^https?:\/\//.test(s.url)),
        "sources[" + i + "]: needs name, tier 1|2|3, optional http(s) url",
      );
    });
    // A claim backed only by community chatter can't be called confirmed.
    if (a.verification_status === "confirmed")
      need(
        sources.some((s) => s && s.tier === 1),
        "verification_status confirmed requires a tier-1 (official) source",
      );
  }

  const seoDesc = a.seo_description ?? "";
  need(isStr(a.seo_title) && a.seo_title.trim().length > 0 && a.seo_title.length <= 70, "seo_title: required, ≤ 70 chars");
  need(seoDesc.length >= 150 && seoDesc.length <= 160, "seo_description: 150–160 chars (is " + seoDesc.length + ")");
  need(isStrArr(a.keywords) && a.keywords.length >= 5 && a.keywords.length <= 10, "keywords: 5–10");
  need(isStr(a.card_description) && a.card_description.length > 0 && a.card_description.length <= 100, "card_description: 1–100 chars");
  need(isStr(a.social_caption), "social_caption: string");
  for (const k of ["platforms", "genres", "tags"] as const)
    need(a[k] === undefined || isStrArr(a[k]), k + ": string[]");
  need(
    a.image_url === undefined || a.image_url === null || (isStr(a.image_url) && /^https:\/\//.test(a.image_url)),
    "image_url: https URL or null",
  );
  need(!a.image_url || (isStr(a.image_credit) && a.image_credit.length > 0), "image_credit: required when image_url is set");

  return errors;
}

// The autonomy rule. Only a confirmed, high-confidence, officially sourced,
// non-minor story may go live without an admin. Returns why not, if not.
export function autoPublishBlockers(a: ArticleInput & { flagged_incorrect?: boolean }) {
  const why: string[] = [];
  if (a.verification_status !== "confirmed") why.push("not confirmed (" + a.verification_status + ")");
  if (a.confidence_level !== "High") why.push("confidence " + a.confidence_level);
  if (!a.sources.some((s) => s.tier === 1)) why.push("no official source");
  if (a.importance === "minor") why.push("minor story");
  if (a.flagged_incorrect) why.push("flagged incorrect by an admin");
  return why;
}

// ---- body <-> plain text (the admin editor) ----
//   blank line between blocks
//   ## Heading
//   [Rumor] text            (also [Confirmed] [Reported] [Leak])
//   [UPDATE 2026-09-30] text
export function bodyToText(body: Block[]) {
  return body
    .map(function (b) {
      if (b.type === "h2") return "## " + b.text;
      if (b.type === "status") return "[" + b.label + "] " + b.text;
      if (b.type === "update") return "[UPDATE " + b.date + "] " + b.text;
      return b.text;
    })
    .join("\n\n");
}

export function textToBody(text: string): Block[] {
  return text
    .replace(/\r\n/g, "\n")
    .split(/\n\s*\n/)
    .map((chunk) => chunk.trim().replace(/\s*\n\s*/g, " "))
    .filter(Boolean)
    .map(function (chunk): Block {
      if (chunk.startsWith("## ")) return { type: "h2", text: chunk.slice(3).trim() };
      const upd = chunk.match(/^\[UPDATE (\d{4}-\d{2}-\d{2})\]\s*(.*)$/);
      if (upd) return { type: "update", date: upd[1], text: upd[2] };
      const st = chunk.match(/^\[(Confirmed|Reported|Rumor|Leak)\]\s*(.*)$/);
      if (st) return { type: "status", label: st[1] as BlockLabel, text: st[2] };
      return { type: "p", text: chunk };
    });
}

// ---- public reads (anon key; RLS only exposes published/archived) ----

const PUBLIC_COLUMNS =
  "id,slug,title,summary,body,why_it_matters,category,importance,status,lifecycle,verification_status,confidence_level,confidence_reason,primary_source,first_reported_by,sources,game,publisher,developer,platforms,genres,tags,image_url,image_credit,seo_title,seo_description,keywords,social_caption,card_description,published_at,updated_at";

export type PublicArticle = Omit<
  NewsArticle,
  "editor_notes" | "flagged_incorrect" | "needs_update" | "brain_locked" | "last_checked_at" | "created_at"
>;

export async function getPublishedArticles(): Promise<PublicArticle[]> {
  const { data, error } = await supabase
    .from("news_articles")
    .select(PUBLIC_COLUMNS)
    .eq("status", "published")
    .order("updated_at", { ascending: false })
    .limit(200);
  if (error) {
    console.error("news: failed to load feed", error.message);
    return [];
  }
  return (data ?? []) as unknown as PublicArticle[];
}

export async function getPublicArticle(slug: string): Promise<PublicArticle | null> {
  const { data, error } = await supabase
    .from("news_articles")
    .select(PUBLIC_COLUMNS)
    .eq("slug", slug)
    .in("status", ["published", "archived"])
    .maybeSingle();
  if (error) console.error("news: failed to load " + slug, error.message);
  return (data as unknown as PublicArticle) ?? null;
}

// Feed order. "Top stories" are fresh breaking/important items, strongest
// first; everything else follows newest-updated first. Freshness windows
// keep an old "breaking" story from squatting at the top forever — the
// ordering is by editorial weight, never by anything hidden from readers.
const TOP_WINDOW_HOURS: Partial<Record<Importance, number>> = {
  breaking: 72,
  important: 48,
};

export function rankFeed(articles: PublicArticle[], now = Date.now()) {
  const top: PublicArticle[] = [];
  const latest: PublicArticle[] = [];
  for (const a of articles) {
    const window = TOP_WINDOW_HOURS[a.importance];
    const ageHours = (now - Date.parse(a.updated_at)) / 36e5;
    (window && ageHours <= window ? top : latest).push(a);
  }
  const weight = (a: PublicArticle) =>
    a.importance === "breaking" ? 3 : a.verification_status === "confirmed" ? 2 : 1;
  top.sort((a, b) => weight(b) - weight(a) || b.updated_at.localeCompare(a.updated_at));
  return { top, latest };
}

export const VERIFICATION_LABEL: Record<Verification, string> = {
  confirmed: "Confirmed",
  reported: "Reported",
  rumor: "Rumor",
  leak: "Leak",
};

export function formatDate(iso: string) {
  const d = /^\d{4}-\d{2}-\d{2}$/.test(iso) ? new Date(iso + "T12:00:00Z") : new Date(iso);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

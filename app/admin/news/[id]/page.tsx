import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import VerificationBadge from "@/components/VerificationBadge";
import ConfirmButton from "@/components/ConfirmButton";
import { getAdmin } from "@/lib/supabase-server";
import {
  CONFIDENCE,
  IMPORTANCE,
  VERIFICATION,
  bodyToText,
  formatDate,
  type NewsArticle,
} from "@/lib/news";
import { runOp, saveArticle } from "../actions";

export const metadata: Metadata = {
  title: "Edit story",
  robots: { index: false, follow: false },
};

export default async function EditArticle({
  params,
  searchParams,
}: PageProps<"/admin/news/[id]">) {
  const { client, user, isAdmin } = await getAdmin();
  if (!user) redirect("/admin/login");
  if (!isAdmin) redirect("/admin/news");

  const { id } = await params;
  const sp = await searchParams;
  const { data } = await client.from("news_articles").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const a = data as NewsArticle;

  const { data: events } = await client
    .from("news_events")
    .select("id,actor,action,note,created_at")
    .eq("article_id", id)
    .order("created_at", { ascending: false })
    .limit(50);

  const op = runOp.bind(null, a.id);

  return (
    <main className="admin-page">
      <p>
        <Link href={"/admin/news?tab=" + a.status} className="text-link">
          ← Back to list
        </Link>
      </p>
      <h1>{a.title}</h1>
      <p className="admin-muted">
        <VerificationBadge status={a.verification_status} /> · status{" "}
        <strong>{a.status}</strong> · lifecycle {a.lifecycle} · updated{" "}
        {formatDate(a.updated_at)} · Brain last checked{" "}
        {new Date(a.last_checked_at).toLocaleString("en-GB")}
        {(a.status === "published" || a.status === "archived") && (
          <>
            {" · "}
            <Link href={"/news/" + a.slug} className="text-link">
              View live ↗
            </Link>
          </>
        )}
      </p>

      {typeof sp.msg === "string" && <p className="admin-notice">{sp.msg}</p>}
      {typeof sp.error === "string" && (
        <p className="admin-notice is-error" role="alert">
          {sp.error}
        </p>
      )}
      {a.editor_notes && (
        <p className="admin-notice">
          <strong>Editor notes (not public)</strong>
          {"\n" + a.editor_notes}
        </p>
      )}

      <div className="admin-actions">
        {a.status !== "published" && <Op action={op} name="approve" label="Approve & publish" tone="primary" />}
        {a.status === "published" && <Op action={op} name="unpublish" label="Unpublish (back to review)" />}
        {a.status !== "rejected" && (
          <Op action={op} name="reject" label="Reject" confirm="Reject this story? The Brain won't be able to revive it." />
        )}
        {a.status === "published" && <Op action={op} name="archive" label="Archive" />}
        {a.verification_status !== "confirmed" && <Op action={op} name="verify" label="Mark as verified" />}
        {a.flagged_incorrect ? (
          <Op action={op} name="clear-flag" label="Clear incorrect flag" />
        ) : (
          <Op
            action={op}
            name="incorrect"
            label="Mark as incorrect"
            confirm="Flag as incorrect? A published story is pulled from the site until fixed."
          />
        )}
        <Op action={op} name="force-update" label={a.needs_update ? "Update requested ✓" : "Force update"} />
        {a.brain_locked ? (
          <Op action={op} name="unlock" label="Unlock for Brain" />
        ) : (
          <Op action={op} name="lock" label="Lock from Brain" />
        )}
        <Op action={op} name="delete" label="Delete" tone="danger" confirm="Permanently delete this story?" />
      </div>

      <h2>Edit</h2>
      <form action={saveArticle.bind(null, a.id)} className="admin-form">
        <label className="is-wide">
          Headline
          <input name="title" defaultValue={a.title} required />
        </label>
        <label className="is-wide">
          Summary
          <textarea name="summary" rows={3} defaultValue={a.summary} required />
        </label>
        <label className="is-wide">
          Body — blank line between blocks. <code>## Heading</code>,{" "}
          <code>[Rumor] text</code> (also Confirmed/Reported/Leak),{" "}
          <code>[UPDATE 2026-09-30] text</code>
          <textarea name="body" rows={18} defaultValue={bodyToText(a.body)} required />
        </label>
        <label className="is-wide">
          Why it matters
          <textarea name="why_it_matters" rows={3} defaultValue={a.why_it_matters} required />
        </label>
        <label>
          Category
          <input name="category" defaultValue={a.category} required />
        </label>
        <label>
          Importance
          <select name="importance" defaultValue={a.importance}>
            {IMPORTANCE.map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </label>
        <label>
          Verification
          <select name="verification_status" defaultValue={a.verification_status}>
            {VERIFICATION.map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </label>
        <label>
          Confidence
          <select name="confidence_level" defaultValue={a.confidence_level}>
            {CONFIDENCE.map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </label>
        <label className="is-wide">
          Confidence reason
          <input name="confidence_reason" defaultValue={a.confidence_reason} required />
        </label>
        <label className="is-wide">
          Sources — one per line: <code>tier | name | url</code> (1 official,
          2 journalism, 3 community)
          <textarea
            name="sources"
            rows={6}
            defaultValue={a.sources
              .map((s) => [s.tier, s.name, s.url].filter(Boolean).join(" | "))
              .join("\n")}
          />
        </label>
        <label>
          Primary source
          <input name="primary_source" defaultValue={a.primary_source ?? ""} />
        </label>
        <label>
          First reported by
          <input name="first_reported_by" defaultValue={a.first_reported_by ?? ""} />
        </label>
        <label>
          Game
          <input name="game" defaultValue={a.game ?? ""} />
        </label>
        <label>
          Developer
          <input name="developer" defaultValue={a.developer ?? ""} />
        </label>
        <label>
          Publisher
          <input name="publisher" defaultValue={a.publisher ?? ""} />
        </label>
        <label>
          Platforms (comma-separated)
          <input name="platforms" defaultValue={a.platforms.join(", ")} />
        </label>
        <label>
          Genres (comma-separated)
          <input name="genres" defaultValue={a.genres.join(", ")} />
        </label>
        <label>
          Tags (comma-separated)
          <input name="tags" defaultValue={a.tags.join(", ")} />
        </label>
        <label>
          Image URL (official/licensed only)
          <input name="image_url" defaultValue={a.image_url ?? ""} />
        </label>
        <label>
          Image credit
          <input name="image_credit" defaultValue={a.image_credit ?? ""} />
        </label>
        <label className="is-wide">
          SEO title (≤ 70)
          <input name="seo_title" defaultValue={a.seo_title} required />
        </label>
        <label className="is-wide">
          Meta description (150–160)
          <textarea name="seo_description" rows={2} defaultValue={a.seo_description} required />
        </label>
        <label className="is-wide">
          Keywords (5–10, comma-separated)
          <input name="keywords" defaultValue={a.keywords.join(", ")} />
        </label>
        <label className="is-wide">
          Social caption
          <textarea name="social_caption" rows={2} defaultValue={a.social_caption} />
        </label>
        <label className="is-wide">
          News card description (≤ 100)
          <input name="card_description" defaultValue={a.card_description} maxLength={100} required />
        </label>
        <label className="is-wide">
          Editor notes (never public)
          <textarea name="editor_notes" rows={4} defaultValue={a.editor_notes} />
        </label>
        <div className="is-wide">
          <button className="admin-button is-primary">Save changes</button>
        </div>
      </form>

      <h2>History</h2>
      <ul className="admin-events">
        {(events ?? []).map((e) => (
          <li key={e.id}>
            <strong>{e.actor}</strong> {e.action}
            {e.note ? " — " + e.note : ""} ·{" "}
            {new Date(e.created_at).toLocaleString("en-GB")}
          </li>
        ))}
      </ul>
    </main>
  );
}

function Op({
  action,
  name,
  label,
  tone,
  confirm,
}: {
  action: (form: FormData) => Promise<void>;
  name: string;
  label: string;
  tone?: "primary" | "danger";
  confirm?: string;
}) {
  return (
    <form action={action}>
      <input type="hidden" name="op" value={name} />
      <ConfirmButton
        className={"admin-button" + (tone ? " is-" + tone : "")}
        confirm={confirm}
      >
        {label}
      </ConfirmButton>
    </form>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import VerificationBadge from "@/components/VerificationBadge";
import { getAdmin } from "@/lib/supabase-server";
import { STATUS, formatDate, type NewsArticle } from "@/lib/news";
import { signOut } from "./actions";

export const metadata: Metadata = {
  title: "News admin",
  robots: { index: false, follow: false },
};

const TAB_LABEL: Record<string, string> = {
  review: "Review queue",
  published: "Published",
  archived: "Archived",
  rejected: "Rejected",
  flagged: "Flagged / force update",
};

export default async function AdminNews({
  searchParams,
}: PageProps<"/admin/news">) {
  const { client, user, isAdmin } = await getAdmin();
  if (!user) redirect("/admin/login");
  if (!isAdmin) return <NotAdmin email={user.email ?? ""} />;

  const sp = await searchParams;
  const tab = typeof sp.tab === "string" && sp.tab in TAB_LABEL ? sp.tab : "review";

  let query = client
    .from("news_articles")
    .select(
      "id,slug,title,category,importance,status,lifecycle,verification_status,confidence_level,flagged_incorrect,needs_update,brain_locked,updated_at,last_checked_at",
    )
    .order("updated_at", { ascending: false })
    .limit(200);
  query =
    tab === "flagged"
      ? query.or("flagged_incorrect.eq.true,needs_update.eq.true")
      : query.eq("status", tab);
  const { data: rows } = await query;
  const articles = (rows ?? []) as NewsArticle[];

  const { data: events } = await client
    .from("news_events")
    .select("id,article_slug,actor,action,note,created_at")
    .order("created_at", { ascending: false })
    .limit(25);

  return (
    <main className="admin-page">
      <div className="admin-top">
        <div>
          <h1>News</h1>
          <p className="admin-muted">
            Signed in as {user.email}. The News Brain publishes confirmed,
            high-confidence stories itself; everything else lands in the
            review queue.
          </p>
        </div>
        <form action={signOut}>
          <button className="admin-button">Sign out</button>
        </form>
      </div>

      <nav className="admin-tabs" aria-label="Article status">
        {[...STATUS.filter((s) => s !== "rejected"), "rejected", "flagged"].map(
          (t) => (
            <Link
              key={t}
              href={"/admin/news?tab=" + t}
              aria-current={t === tab ? "page" : undefined}
            >
              {TAB_LABEL[t]}
            </Link>
          ),
        )}
      </nav>

      {articles.length === 0 ? (
        <p className="admin-muted">Nothing here.</p>
      ) : (
        <div className="admin-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Story</th>
                <th>Verification</th>
                <th>Importance</th>
                <th>Confidence</th>
                <th>Lifecycle</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((a) => (
                <tr key={a.id}>
                  <td>
                    {a.flagged_incorrect && <span className="admin-flag">INCORRECT</span>}
                    {a.needs_update && <span className="admin-flag">UPDATE REQUESTED</span>}
                    {a.brain_locked && <span className="admin-flag">LOCKED</span>}
                    <Link href={"/admin/news/" + a.id}>{a.title}</Link>
                    <div className="admin-muted">{a.category}</div>
                  </td>
                  <td>
                    <VerificationBadge status={a.verification_status} />
                  </td>
                  <td>{a.importance}</td>
                  <td>{a.confidence_level}</td>
                  <td>{a.lifecycle}</td>
                  <td>{formatDate(a.updated_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h2>Recent activity</h2>
      <ul className="admin-events">
        {(events ?? []).map((e) => (
          <li key={e.id}>
            <strong>{e.actor}</strong> {e.action} <code>{e.article_slug}</code>
            {e.note ? " — " + e.note : ""} · {new Date(e.created_at).toLocaleString("en-GB")}
          </li>
        ))}
      </ul>
    </main>
  );
}

function NotAdmin({ email }: { email: string }) {
  return (
    <main className="admin-page">
      <h1>Not a news admin</h1>
      <p className="admin-muted">
        {email} is signed in but isn&rsquo;t in the news_admins table. Add it
        from the Supabase SQL editor (see supabase-migrations/2026-09-30_news.sql).
      </p>
      <form action={signOut}>
        <button className="admin-button">Sign out</button>
      </form>
    </main>
  );
}

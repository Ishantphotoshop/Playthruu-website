import type { Metadata } from "next";
import Link from "next/link";
import BrandMark from "@/components/BrandMark";
import VerificationBadge from "@/components/VerificationBadge";
import {
  formatDate,
  getPublishedArticles,
  rankFeed,
  type PublicArticle,
} from "@/lib/news";

// The News Brain and admins also revalidate on every change; this is the
// fallback so the "top stories" freshness windows roll over on their own.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Gaming News",
  description:
    "Clear, sourced gaming news from PlayThruu — what happened, what's confirmed, and why it matters to players.",
  alternates: { canonical: "/news" },
};

export default async function NewsIndex() {
  const { top, latest } = rankFeed(await getPublishedArticles());

  return (
    <main className="news-page">
      <Link href="/" className="brand news-brand">
        <BrandMark className="brand-mark" />
        <span className="brand-word">PlayThruu</span>
      </Link>

      <header className="news-masthead">
        <p className="news-kicker">The PlayThruu wire</p>
        <h1>News</h1>
        <p className="news-lede">
          What happened, what&rsquo;s confirmed, and why it matters. Every
          story shows how solid it is and lists its sources.
        </p>
      </header>

      {top.length + latest.length === 0 && (
        <p className="news-empty">No stories yet.</p>
      )}

      {top.length > 0 && (
        <section aria-labelledby="top-heading">
          <h2 id="top-heading" className="news-section-heading">
            Top stories
          </h2>
          <Feed articles={top} />
        </section>
      )}

      {latest.length > 0 && (
        <section aria-labelledby="latest-heading">
          <h2 id="latest-heading" className="news-section-heading">
            Latest
          </h2>
          <Feed articles={latest} />
        </section>
      )}

      <Link href="/" className="text-link news-back">
        ← Back to PlayThruu
      </Link>
    </main>
  );
}

function Feed({ articles }: { articles: PublicArticle[] }) {
  return (
    <ol className="news-feed">
      {articles.map(function (a) {
        const updated =
          a.published_at && a.updated_at.slice(0, 10) > a.published_at.slice(0, 10);
        return (
          <li key={a.slug}>
            <Link href={"/news/" + a.slug} className="news-card">
              <span className="news-card-meta">
                {a.importance === "breaking" && (
                  <span className="news-breaking">Breaking</span>
                )}
                <span className="news-category">{a.category}</span>
                <VerificationBadge status={a.verification_status} />
                <time dateTime={a.updated_at}>
                  {updated ? "Updated " : ""}
                  {formatDate(a.updated_at)}
                </time>
              </span>
              <h3>{a.title}</h3>
              <p>{a.card_description}</p>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}

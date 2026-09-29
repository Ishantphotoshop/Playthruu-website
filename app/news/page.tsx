import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "@/components/site/SiteNav";
import SiteFooter from "@/components/site/SiteFooter";
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
    <>
      <SiteNav />
      <main id="main" className="page page--narrow">
        <header className="news-masthead">
          <h1 className="display-1">News</h1>
          <p className="lead">
            Gaming news checked against official sources. Every story shows how solid it is and lists where it came
            from.
          </p>
        </header>

        {top.length + latest.length === 0 && <p className="news-empty">No stories yet.</p>}

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
      </main>
      <SiteFooter />
    </>
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
              <span className="news-card__image">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={a.image_url || "/news/" + a.slug + "/thumb"} alt="" loading="lazy" />
              </span>
              <span className="news-card__text">
                <span className="news-card-meta">
                  {a.importance === "breaking" && <span className="news-breaking">Breaking</span>}
                  <span className="news-category">{a.category}</span>
                  <VerificationBadge status={a.verification_status} />
                  <time dateTime={a.updated_at}>
                    {updated ? "Updated " : ""}
                    {formatDate(a.updated_at)}
                  </time>
                </span>
                <h3>{a.title}</h3>
                <p>{a.card_description}</p>
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}

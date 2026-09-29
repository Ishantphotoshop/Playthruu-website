import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteNav from "@/components/site/SiteNav";
import SiteFooter from "@/components/site/SiteFooter";
import VerificationBadge from "@/components/VerificationBadge";
import { formatDate, getPublicArticle, type Source } from "@/lib/news";

export const revalidate = 300;

// Nothing is prebuilt: each story renders on first visit and is cached,
// then refreshed when the Brain or an admin changes it.
export function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: PageProps<"/news/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const a = await getPublicArticle(slug);
  if (!a) return {};
  return {
    title: { absolute: a.seo_title + " | PlayThruu" },
    description: a.seo_description,
    keywords: a.keywords,
    alternates: { canonical: "/news/" + a.slug },
    openGraph: {
      title: a.title,
      description: a.seo_description,
      type: "article",
      publishedTime: a.published_at ?? undefined,
      modifiedTime: a.updated_at,
      siteName: "PlayThruu",
      tags: a.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: a.title,
      description: a.seo_description,
    },
  };
}

export default async function NewsArticlePage({
  params,
}: PageProps<"/news/[slug]">) {
  const { slug } = await params;
  const a = await getPublicArticle(slug);
  if (!a) notFound();

  const primary = a.sources.filter((s) => s.tier === 1);
  const reported = a.sources.filter((s) => s.tier !== 1);
  const wasUpdated =
    a.published_at && a.updated_at.slice(0, 10) > a.published_at.slice(0, 10);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: a.title,
    description: a.seo_description,
    datePublished: a.published_at,
    dateModified: a.updated_at,
    keywords: a.keywords.join(", "),
    ...(a.image_url ? { image: [a.image_url] } : {}),
    ...(a.game ? { about: { "@type": "VideoGame", name: a.game } } : {}),
    publisher: { "@type": "Organization", name: "PlayThruu" },
    mainEntityOfPage: "https://playthruu.com/news/" + a.slug,
  };

  return (
    <>
    <SiteNav />
    <main id="main" className="page page--narrow">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <article className="news-article">
        {a.status === "archived" && (
          <p className="news-archived">
            Archived — this story is no longer being updated and may be out
            of date.
          </p>
        )}
        <header>
          <p className="news-card-meta">
            {a.importance === "breaking" && (
              <span className="news-breaking">Breaking</span>
            )}
            <span className="news-category">{a.category}</span>
            <VerificationBadge status={a.verification_status} />
            {a.published_at && (
              <time dateTime={a.published_at}>{formatDate(a.published_at)}</time>
            )}
            {wasUpdated && (
              <time dateTime={a.updated_at}>
                Updated {formatDate(a.updated_at)}
              </time>
            )}
          </p>
          <h1>{a.title}</h1>
          <p className="news-summary">{a.summary}</p>
        </header>

        {a.image_url && (
          <figure className="news-figure">
            {/* Official/licensed assets on arbitrary press-kit hosts, so
                a plain img rather than next/image's allow-listed loader. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={a.image_url} alt="" />
            {a.image_credit && <figcaption>{a.image_credit}</figcaption>}
          </figure>
        )}

        <div className="news-body">
          {a.body.map(function (block, i) {
            if (block.type === "h2") return <h2 key={i}>{block.text}</h2>;
            if (block.type === "update") {
              return (
                <aside key={i} className="news-update">
                  <span className="news-status-label">
                    Update — {formatDate(block.date)}
                  </span>
                  <p>{block.text}</p>
                </aside>
              );
            }
            if (block.type === "status") {
              return (
                <aside
                  key={i}
                  className={"news-status is-" + block.label.toLowerCase()}
                >
                  <span className="news-status-label">{block.label}</span>
                  <p>{block.text}</p>
                </aside>
              );
            }
            return <p key={i}>{block.text}</p>;
          })}
        </div>

        <section className="news-why" aria-labelledby="why-heading">
          <h2 id="why-heading">Why it matters</h2>
          <p>{a.why_it_matters}</p>
        </section>

        <footer className="news-sources">
          <h2>Sources &amp; credits</h2>
          <SourceList label="Official source" items={primary} />
          <SourceList label="Reported by" items={reported} />
          {a.first_reported_by && (
            <p>
              <span className="news-sources-label">First reported by</span>
              {a.first_reported_by}
            </p>
          )}
          <p>
            <span className="news-sources-label">Confidence</span>
            <strong>{a.confidence_level}</strong> — {a.confidence_reason}
          </p>
          {(a.game || a.platforms.length > 0) && (
            <p className="news-tags">
              {[a.game, a.developer, a.publisher, ...a.platforms, ...a.genres]
                .filter(Boolean)
                .filter((t, i, all) => all.indexOf(t) === i)
                .map((t) => (
                  <span key={t}>{t}</span>
                ))}
            </p>
          )}
        </footer>
      </article>

      <Link href="/news" className="text-link news-back">
        All news
      </Link>
    </main>
    <SiteFooter />
    </>
  );
}

function SourceList({ label, items }: { label: string; items: Source[] }) {
  if (items.length === 0) return null;
  return (
    <p>
      <span className="news-sources-label">{label}</span>
      {items.map(function (s, i) {
        return (
          <span key={s.url ?? s.name}>
            {i > 0 && "; "}
            {s.url ? (
              <a href={s.url} target="_blank" rel="noreferrer">
                {s.name}
              </a>
            ) : (
              s.name
            )}
          </span>
        );
      })}
    </p>
  );
}

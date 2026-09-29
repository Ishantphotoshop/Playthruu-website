import Link from "next/link";
import VerificationBadge from "@/components/VerificationBadge";
import { formatDate, rankFeed, type PublicArticle } from "@/lib/news";

// The three stories the News page would lead with, straight from the
// newsroom. Renders nothing if there's no news yet.
export default function NewsPreview({ articles }: { articles: PublicArticle[] }) {
  const { top, latest } = rankFeed(articles);
  const picks = [...top, ...latest].slice(0, 3);
  if (picks.length === 0) return null;

  return (
    <section className="section" id="news" aria-labelledby="news-title">
      <div className="container">
        <div className="section__head section__head--row">
          <div>
            <h2 id="news-title" className="display-2">
              News, written here.
            </h2>
            <p className="lead">Gaming news checked against official sources, with every source listed.</p>
          </div>
          <Link href="/news" className="btn btn--ghost">
            All news
          </Link>
        </div>

        <ul className="news-grid">
          {picks.map((a, i) => (
            <li key={a.slug} className={i === 0 ? "news-grid__lead" : ""}>
              <Link href={"/news/" + a.slug} className="news-tile">
                <span className="news-tile__image">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={a.image_url || "/news/" + a.slug + "/thumb"} alt="" loading="lazy" />
                </span>
                <span className="news-tile__meta">
                  <VerificationBadge status={a.verification_status} />
                  <span>{a.category}</span>
                  <time dateTime={a.updated_at}>{formatDate(a.updated_at)}</time>
                </span>
                <span className="news-tile__title">{a.title}</span>
                {i === 0 && <span className="news-tile__summary">{a.card_description}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

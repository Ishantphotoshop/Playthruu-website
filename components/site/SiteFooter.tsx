import Link from "next/link";
import { Wordmark } from "@/components/ui";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div className="site-footer__brand">
          <Wordmark />
          <p>A diary for every game you play.</p>
        </div>
        <nav className="site-footer__links" aria-label="Footer">
          <Link href="/news">News</Link>
          <Link href="/#waitlist">Waitlist</Link>
          <a href="https://www.instagram.com/playthruu" target="_blank" rel="noreferrer">
            Instagram
          </a>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </nav>
        <p className="site-footer__fine">
          Game art and covers via{" "}
          <a href="https://www.igdb.com" target="_blank" rel="noreferrer">
            IGDB
          </a>
          . People shown on this page are examples. © 2026 PlayThruu
        </p>
      </div>
    </footer>
  );
}

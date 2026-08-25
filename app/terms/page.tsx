import type { Metadata } from "next";
import Link from "next/link";
import BrandMark from "@/components/BrandMark";

export const metadata: Metadata = {
  title: "Terms of Use",
};

export default function TermsOfUse() {
  return (
    <main className="legal-page">
      <Link href="/" className="brand legal-page-brand">
        <BrandMark className="brand-mark" />
        <span className="brand-word">PlayThruu</span>
      </Link>

      <h1>Terms of Use</h1>
      <p className="legal-updated">Last updated: August 25, 2026</p>

      <p>
        This page covers the website you&rsquo;re on right now &mdash; the
        PlayThruu pre-launch waitlist at playthruu.com. It&rsquo;s not the
        terms for the PlayThruu app itself, which will get its own terms
        when the app launches.
      </p>

      <h2>What this site is</h2>
      <p>
        A waitlist page. Joining it reserves you a spot in line for early
        access &mdash; it isn&rsquo;t a purchase, a contract, or a guarantee
        of access by any particular date. Launch dates shown here are our
        best estimate and can change.
      </p>

      <h2>Using the site</h2>
      <p>
        Use the waitlist form the way it&rsquo;s meant to be used. Don&rsquo;t
        submit fake or someone else&rsquo;s email address, automate
        submissions, or try to abuse, scrape, or disrupt the site.
      </p>

      <h2>Content and trademarks</h2>
      <p>
        Game cover art shown on this site comes from{" "}
        <a href="https://www.igdb.com" target="_blank" rel="noreferrer">
          IGDB
        </a>
        . Game titles, cover art, and related trademarks belong to their
        respective publishers and developers &mdash; we don&rsquo;t claim
        any ownership over them, and their appearance here doesn&rsquo;t
        imply any endorsement of PlayThruu. Everything else on this
        site &mdash; the PlayThruu name, logo, and written content &mdash;
        belongs to us.
      </p>

      <h2>No warranty</h2>
      <p>
        This site and the information on it are provided as-is, without
        warranty of any kind. We&rsquo;re a small team building something
        pre-launch &mdash; features, dates, and details described here may
        change before the app actually ships.
      </p>

      <h2>Your data</h2>
      <p>
        See our{" "}
        <Link href="/privacy">Privacy Policy</Link> for what we collect
        through this site and how it&rsquo;s used.
      </p>

      <h2>Changes</h2>
      <p>
        We may update these terms as the site changes. The date at the top
        reflects the latest version.
      </p>

      <h2>Contact</h2>
      <p>
        Questions? Email{" "}
        <a href="mailto:hello@playthruu.com">hello@playthruu.com</a>.
      </p>

      <Link href="/" className="text-link legal-page-back">
        ← Back to PlayThruu
      </Link>
    </main>
  );
}

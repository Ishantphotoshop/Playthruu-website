import type { Metadata } from "next";
import Link from "next/link";
import BrandMark from "@/components/BrandMark";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPolicy() {
  return (
    <main className="legal-page">
      <Link href="/" className="brand legal-page-brand">
        <BrandMark className="brand-mark" />
        <span className="brand-word">PlayThruu</span>
      </Link>

      <h1>Privacy Policy</h1>
      <p className="legal-updated">Last updated: August 25, 2026</p>

      <p>
        PlayThruu (&ldquo;we,&rdquo; &ldquo;us&rdquo;) runs this site as a
        pre-launch waitlist for the PlayThruu app. This page explains what we
        collect here and why, in plain language.
      </p>

      <h2>What we collect</h2>
      <p>
        If you join the waitlist, we store the email address you enter and a
        rough &ldquo;source&rdquo; tag &mdash; which link or referring site
        brought you here (for example, Instagram or Reddit) &mdash; so we
        know which channels are actually working. We don&rsquo;t ask for your
        name, and we don&rsquo;t require an account to join.
      </p>
      <p>
        Standard web infrastructure (our host, our database) automatically
        logs things like IP address and request metadata as part of normal
        operation. We don&rsquo;t use this to identify you individually.
      </p>

      <h2>How we use it</h2>
      <p>
        To send you one confirmation email when you join, and to email you
        when early access opens. To see which marketing channels bring real
        signups, so we spend effort where it works. That&rsquo;s it &mdash;
        we don&rsquo;t sell your email or use it for anything else.
      </p>

      <h2>Who we share it with</h2>
      <p>
        We use a small number of services to run this site, each only for
        its specific job:
      </p>
      <ul>
        <li>
          <strong>Supabase</strong> &mdash; stores the waitlist (email +
          source tag).
        </li>
        <li>
          <strong>Zoho</strong> &mdash; sends the one confirmation email.
        </li>
        <li>
          <strong>Vercel</strong> &mdash; hosts the site, and its Analytics
          product gives us aggregate, cookieless traffic counts. It
          doesn&rsquo;t track you individually or across other sites.
        </li>
        <li>
          <strong>IGDB</strong> &mdash; your browser loads game cover art
          directly from IGDB&rsquo;s image servers. No personal data of
          yours is sent to IGDB.
        </li>
      </ul>
      <p>We don&rsquo;t sell data to anyone, ever.</p>

      <h2>How long we keep it</h2>
      <p>
        Waitlist entries are kept until launch, or until you ask us to
        delete yours &mdash; whichever comes first.
      </p>

      <h2>Your choices</h2>
      <p>
        Email{" "}
        <a href="mailto:hello@playthruu.com">hello@playthruu.com</a> any time
        to have your email address removed from the waitlist. We&rsquo;ll
        handle it promptly.
      </p>

      <h2>Children</h2>
      <p>
        This site isn&rsquo;t directed at children under 13, and we
        don&rsquo;t knowingly collect their information.
      </p>

      <h2>Changes</h2>
      <p>
        If this policy changes materially, we&rsquo;ll update the date at
        the top of this page.
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

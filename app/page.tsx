import Link from "next/link";
import CountdownTimer from "@/components/CountdownTimer";
import WaitlistForm from "@/components/WaitlistForm";
import Reveal from "@/components/Reveal";
import BrandMark from "@/components/BrandMark";
import PosterWall from "@/components/PosterWall";
import ReviewGallery from "@/components/ReviewGallery";
import MobileNav from "@/components/MobileNav";
import { FeatureIcon } from "@/components/icons";
import { supabase } from "@/lib/supabase";

export const revalidate = 300;

const features = [
  [
    "gamepad",
    "Log everything you play",
    "Every game, the moment you finish it — or the moment you start.",
  ],
  [
    "star",
    "Rate it, half-stars and all",
    "From a rough 2½ to a perfect 5 — say exactly what you thought.",
  ],
  [
    "review",
    "Write reviews, read theirs",
    "Short thoughts or a full write-up — whatever the game deserves.",
  ],
  [
    "people",
    "Follow friends, see what they're playing",
    "Your feed, built from the people you actually care about.",
  ],
  [
    "list",
    "Build lists & a want-to-play queue",
    "Rank your favourites, queue up what's next.",
  ],
] as const;

export default async function Home() {
  const { count: memberCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  return (
    <main>
      <nav className="site-nav" aria-label="Main navigation">
        <a href="#top" className="brand">
          <BrandMark className="brand-mark" />
          <span className="brand-word">PlayThruu</span>
        </a>
        <div className="hidden md:flex items-center gap-8">
          <a href="#inside" className="nav-link">
            How it works
          </a>
          <a href="#why" className="nav-link">
            Why PlayThruu
          </a>
        </div>
        <MobileNav />
        <a href="#waitlist" className="button button-primary">
          Early access
        </a>
      </nav>

      <section id="top" className="hero section-wrap">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="live-dot" /> The diary for everything you play
          </p>
          <h1>
            Log it. Rate it.
            <br />
            <strong>Never forget it.</strong>
          </h1>
          <p className="hero-lede">
            Log, rate, and review the games you play. Follow friends and see
            what they&rsquo;re playing.
          </p>
          <div className="hero-actions">
            <a href="#waitlist" className="button button-primary">
              Join the waitlist
            </a>
            <a href="#inside" className="text-link">
              See how it works <span>↓</span>
            </a>
          </div>
          <p className="launch-note">
            <span>Sept 12, 2026</span> Launching soon, starting with the people who
            care about their backlog.
          </p>
        </div>
        <ReviewGallery />
      </section>

      <PosterWall />

      <section id="inside" className="section-wrap intro-section">
        <Reveal className="intro-grid">
          <h2>
            A better place
            <br />
            for your backlog.
          </h2>
          <p>
            Games are more than a pile of titles you own. They&rsquo;re
            weekends, recommendations, rabbit holes, and the stories you keep
            retelling. PlayThruu gives all of that a home — like a diary, but
            for everything you play.
          </p>
        </Reveal>
      </section>

      <section id="why" className="section-wrap feature-section">
        <Reveal className="section-heading">
          <h2>
            Everything a diary
            <br />
            should do.
          </h2>
        </Reveal>
        <div className="feature-list">
          {features.map(function (feature, i) {
            const [icon, title, body] = feature;
            return (
              <Reveal key={title} delay={i * 70}>
                <article className="feature-row">
                  <span className="feature-index">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="feature-icon">
                    <FeatureIcon name={icon} />
                  </div>
                  <div className="feature-copy">
                    <h3>{title}</h3>
                    <p>{body}</p>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section id="waitlist" className="waitlist-section section-wrap">
        <Reveal>
          <h2>
            Make your
            <br />
            next move.
          </h2>
          <p>Be there when your gaming life gets a proper home.</p>
        </Reveal>
        <div className="waitlist-side">
          <CountdownTimer />
          <WaitlistForm />
          {!!memberCount && (
            <p className="live-stat">
              <strong>{memberCount}</strong> people already tracking their
              backlog
            </p>
          )}
        </div>
      </section>

      <footer className="site-footer">
        <span className="brand">
          <BrandMark className="brand-mark" />
          <span className="brand-word">PlayThruu</span>
        </span>
        <span>
          <a
            href="https://www.instagram.com/playthruu"
            target="_blank"
            rel="noreferrer"
          >
            @playthruu on Instagram
          </a>
        </span>
        <span>Made for the long haul.</span>
        <span>
          Game data &amp; covers via{" "}
          <a href="https://www.igdb.com" target="_blank" rel="noreferrer">
            IGDB
          </a>
        </span>
        <span>
          <Link href="/privacy">Privacy</Link>
          {" · "}
          <Link href="/terms">Terms</Link>
        </span>
        <span>© 2026</span>
      </footer>
    </main>
  );
}

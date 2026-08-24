import Image from "next/image";
import CountdownTimer from "@/components/CountdownTimer";
import WaitlistForm from "@/components/WaitlistForm";
import Reveal from "@/components/Reveal";
import BrandMark from "@/components/BrandMark";
import PosterWall from "@/components/PosterWall";
import { FeatureIcon, StarRow } from "@/components/icons";
import eldenRing from "@/assets/covers/elden-ring.jpg";
import { supabase } from "@/lib/supabase";

export const revalidate = 300;

const features = [
  ["gamepad", "Log everything you play", "Every game, the moment you finish it — or the moment you start."],
  ["star", "Rate it, half-stars and all", "From a rough 2½ to a perfect 5 — say exactly what you thought."],
  ["review", "Write reviews, read theirs", "Short thoughts or a full write-up — whatever the game deserves."],
  ["people", "Follow friends, see what they're playing", "Your feed, built from the people you actually care about."],
  ["list", "Build lists & a want-to-play queue", "Rank your favourites, queue up what's next."],
] as const;

export default async function Home() {
  const { count: memberCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  return (
    <main>
      <nav className="site-nav" aria-label="Main navigation">
        <a href="#top" className="brand"><BrandMark className="brand-mark" /><span className="brand-word">PlayThruu</span></a>
        <div className="hidden md:flex items-center gap-8">
          <a href="#inside" className="nav-link">How it works</a>
          <a href="#why" className="nav-link">Why PlayThruu</a>
        </div>
        <a href="#waitlist" className="button button-primary">Early access</a>
      </nav>

      <section id="top" className="hero section-wrap">
        <div className="hero-copy">
          <p className="eyebrow"><span className="live-dot" /> The diary for everything you play</p>
          <h1>Log it. Rate it.<br /><strong>Never forget it.</strong></h1>
          <p className="hero-lede">Log, rate, and review the games you play. Follow friends and see what they&rsquo;re playing.</p>
          <div className="hero-actions">
            <a href="#waitlist" className="button button-primary">Join the waitlist</a>
            <a href="#inside" className="text-link">See how it works <span>↓</span></a>
          </div>
          <p className="launch-note"><span>12.09.26</span> Launching soon, starting with the people who care about their backlog.</p>
        </div>
        <div className="hero-art" aria-label="A preview of a PlayThruu diary entry">
          <div className="orbit" />
          <div className="entry-card">
            <div className="entry-card__head"><span>Diary Entry</span><span>Aug 24</span></div>
            <div className="entry-card__poster">
              <Image src={eldenRing} alt="" placeholder="blur" sizes="296px" priority />
              <div className="entry-card__poster-label"><small>Now playing</small>Elden Ring</div>
            </div>
            <div className="entry-card__rating"><StarRow rating={4.5} /><b>4.5</b></div>
            <p className="entry-card__review">&ldquo;The kind of game that rearranges your whole week around it.&rdquo;</p>
            <div className="entry-card__meta"><span><strong>184</strong> logged</span><span><strong>27</strong> this year</span></div>
          </div>
          <div className="floating-note note-one"><StarRow rating={5} size={14} /></div>
          <div className="floating-note note-two"><strong>12</strong> friends played this</div>
        </div>
      </section>

      <PosterWall />

      <section id="inside" className="section-wrap intro-section">
        <div className="section-kicker">The idea</div>
        <Reveal className="intro-grid"><h2>A better place<br />for your <strong>backlog.</strong></h2><p>Games are more than a pile of titles you own. They&rsquo;re weekends, recommendations, rabbit holes, and the stories you keep retelling. PlayThruu gives all of that a home — like a diary, but for everything you play.</p></Reveal>
      </section>

      <section id="why" className="section-wrap feature-section">
        <Reveal className="section-heading"><div className="section-kicker">Built for the journey</div><h2>Everything a diary<br />should <strong>do.</strong></h2></Reveal>
        <div className="feature-grid">{features.map(function (feature, i) {
          const [icon, title, body] = feature;
          const edgeClass = i === 0 ? " feature-item-first" : "";
          return (
            <Reveal key={title} delay={i * 80}>
              <article className={"feature-item" + edgeClass}>
                <div className="feature-icon"><FeatureIcon name={icon} /></div>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            </Reveal>
          );
        })}</div>
      </section>

      <section
        id="waitlist"
        className="waitlist-section section-wrap"
      >
        <Reveal><div className="section-kicker">First in line</div><h2>Make your<br /><strong>next move.</strong></h2><p>Be there when your gaming life gets a proper home.</p></Reveal>
        <div className="waitlist-side">
          <CountdownTimer />
          <WaitlistForm />
          {!!memberCount && <p className="live-stat"><strong>{memberCount}</strong> people already tracking their backlog</p>}
        </div>
      </section>

      <footer className="site-footer"><span className="brand"><BrandMark className="brand-mark" /><span className="brand-word">PlayThruu</span></span><span>Made for the long haul.</span><span>© 2026</span>
      </footer>
    </main>
  );
}

import CountdownTimer from "@/components/CountdownTimer";
import WaitlistForm from "@/components/WaitlistForm";
import Reveal from "@/components/Reveal";

const features = [
  ["01", "Keep the record", "Your backlog, finished games, drops, and all the little stories between them."],
  ["02", "Find your people", "Follow players with taste you trust, not a feed tuned to keep you scrolling."],
  ["03", "Make the next pick", "A living map of what you loved, what you missed, and what deserves your time next."],
];

const tickerWords = ["DISCOVER", "TRACK", "RATE", "CONNECT", "REMEMBER"];

export default function Home() {
  return (
    <main>
      <nav className="site-nav" aria-label="Main navigation">
        <a href="#top" className="brand-mark"><span>+</span> PLAYTHRUU</a>
        <div className="hidden md:flex items-center gap-8">
          <a href="#inside" className="nav-link">How it works</a>
          <a href="#why" className="nav-link">Why PlayThruu</a>
        </div>
        <a href="#waitlist" className="nav-cta">Early access <span>▶</span></a>
      </nav>

      <section id="top" className="hero section-wrap">
        <div className="hero-copy">
          <p className="eyebrow"><span className="live-dot" /> System online — for people who play all the way through</p>
          <h1>Your games.<br /><em>Your</em> story.</h1>
          <p className="hero-lede">PlayThruu is the home for your gaming life: a place to log the journey, find your next obsession, and share the moments worth remembering.</p>
          <div className="hero-actions">
            <a href="#waitlist" className="button button-primary">Join the waitlist <span>▶</span></a>
            <a href="#inside" className="text-link">See how it works <span>↓</span></a>
          </div>
          <p className="launch-note"><span>12.09.26</span> Launching soon, starting with the people who care about their backlog.</p>
        </div>
        <div className="hero-art" aria-label="A preview of a PlayThruu save file">
          <div className="orbit orbit-one" /><div className="orbit orbit-two" />
          <div className="profile-card">
            <div className="profile-top"><span className="tiny-label">SAVE SLOT 01</span><span className="profile-menu">•••</span></div>
            <div className="avatar">J</div>
            <h2>julesm</h2><p className="profile-sub">Currently playing <strong>Metaphor: ReFantazio</strong></p>
            <div className="stats"><div><strong>184</strong><span>PLAYED</span></div><div><strong>27</strong><span>THIS YEAR</span></div><div><strong>4.8</strong><span>AVG RATING</span></div></div>
            <div className="now-playing"><div className="game-art"><span>METAPHOR</span></div><div><span className="tiny-label">IN PROGRESS</span><strong>Metaphor:<br />ReFantazio</strong><small>34 hours logged</small></div><span className="progress">68%</span></div>
          </div>
          <div className="floating-note note-one"><span>✦</span> 12 friends played this</div>
          <div className="floating-note note-two">YOUR 2026 <strong>IN GAMES</strong></div>
        </div>
      </section>

      <div className="ticker" aria-hidden="true">
        <div className="ticker-track">
          {[0, 1].map(function (rep) {
            return (
              <div className="ticker-set" key={rep}>
                {tickerWords.map(function (word) {
                  return (
                    <span className="ticker-item" key={word + rep}>
                      <span>{word}</span><b>›</b>
                    </span>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      <section id="inside" className="section-wrap intro-section">
        <div className="section-kicker">01 THE PROBLEM</div>
        <Reveal className="intro-grid"><h2>A better place<br />for your <em>backlog.</em></h2><p>Games are more than a pile of titles you own. They are weekends, recommendations, rabbit holes, and the stories you keep retelling. PlayThruu gives all of that a home.</p></Reveal>
      </section>

      <section id="why" className="section-wrap feature-section">
        <Reveal className="section-heading"><div className="section-kicker">02 BUILT FOR THE JOURNEY</div><h2>Keep playing.<br /><em>Keep the receipts.</em></h2></Reveal>
        <div className="feature-grid">{features.map(function (feature, i) {
          const edgeClass = i === 0 ? " feature-item-first" : "";
          return (
            <Reveal key={feature[0]} delay={i * 90}>
              <article className={"feature-item" + edgeClass}>
                <span className="feature-badge">{feature[0]}</span>
                <span className="unlock-tag">UNLOCKED</span>
                <h3>{feature[1]}</h3>
                <p>{feature[2]}</p>
              </article>
            </Reveal>
          );
        })}</div>
      </section>

      <section
        id="waitlist"
        className="waitlist-section section-wrap"
      >
        <Reveal><div className="section-kicker">03 SAVE YOUR SLOT</div><h2>Insert coin.<br /><em>Continue your story.</em></h2><p>Save your spot — be there when your gaming life gets a proper home.</p></Reveal>
        <div className="waitlist-side"><CountdownTimer /><WaitlistForm /></div>
      </section>

      <footer className="site-footer"><span className="brand-mark"><span>+</span> PLAYTHRUU</span><span>Made for the long haul.</span><span>© 2026</span>
      </footer>
    </main>
  );
}

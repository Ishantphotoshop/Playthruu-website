import CountdownTimer from "@/components/CountdownTimer";
import WaitlistForm from "@/components/WaitlistForm";
import { Poster } from "@/components/ui";
import { GAMES } from "@/lib/showcase";

const FAN = [GAMES.hades2, GAMES.yotei, GAMES.wolverine, GAMES.silksong, GAMES.gta6];

export default function WaitlistSection({ memberCount }: { memberCount: number | null }) {
  return (
    <section className="section waitlist" id="waitlist" aria-labelledby="waitlist-title">
      <div className="container waitlist__inner">
        <div className="waitlist__fan" aria-hidden="true">
          {FAN.map((g, i) => (
            <span key={g.cover} className="waitlist__fan-item" style={{ ["--i" as string]: i - 2 }}>
              <Poster game={g} size="cover_big" />
            </span>
          ))}
        </div>
        <h2 id="waitlist-title" className="display-1 waitlist__title">
          PlayThruu opens 20 October.
        </h2>
        <p className="lead waitlist__lede">Join the waitlist and you&rsquo;re first in when the doors open.</p>
        <CountdownTimer />
        <div className="waitlist__form">
          <WaitlistForm />
        </div>
        {/* Only once it's a number worth showing: a small count reads as
            "nobody's here" rather than as momentum. */}
        {memberCount !== null && memberCount >= 100 && (
          <p className="waitlist__count">
            {memberCount.toLocaleString("en-US")} people are already logging their games.
          </p>
        )}
      </div>
    </section>
  );
}

"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Poster, Stamp } from "@/components/ui";
import { GAMES, LOG_REVIEW, artUrl } from "@/lib/showcase";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const BEATS = [
  { title: "Mark where you are.", body: "Playing, played, backlog or dropped. Every game on your shelf gets a stamp." },
  { title: "Rate it, half stars and all.", body: "From a rough two and a half to a perfect five. Say exactly what you thought." },
  { title: "Say what you thought.", body: "One line or a full review. Spoilers stay hidden until someone taps to read them." },
];

const RATING = 4.5;
const game = GAMES.wolverine;

// The markup is the finished log (PLAYED, 4½ stars, full review), so it
// reads correctly with no JavaScript and under reduced motion. The
// animation only ever plays toward that state.
export default function LogStory() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    function () {
      const mm = gsap.matchMedia();

      const build = (tl: gsap.core.Timeline, pinned: boolean) => {
        tl.fromTo(".log__played", { scale: 2.4, opacity: 0, rotate: -14 }, { scale: 1, opacity: 1, rotate: -3, ease: "back.out(2)", duration: 0.5 }, 0.55)
          .fromTo(".log__playing", { opacity: 1 }, { opacity: 0, scale: 0.85, duration: 0.25 }, 0.5)
          .from(".log__star-fill", { clipPath: "inset(0 100% 0 0)", stagger: 0.14, duration: 0.3, ease: "none" }, pinned ? 1.2 : 0.9)
          .from(".log__word", { opacity: 0.08, stagger: 0.035, duration: 0.2, ease: "none" }, pinned ? 2.3 : 1.6)
          .from(".log__likes", { opacity: 0, y: 8, duration: 0.3 }, pinned ? 3.1 : 2.2);
      };

      mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", function () {
        root.current?.classList.add("is-pinned");
        const tl = gsap.timeline({
          scrollTrigger: { trigger: ".log__stage", start: "top top", end: "+=260%", scrub: 0.8, pin: true },
        });
        // The first beat is already showing when the section pins.
        tl.set(".log__beat--1, .log__beat--2", { opacity: 0, y: 40 }, 0)
          .to(".log__beat--0", { opacity: 0, y: -40, duration: 0.4 }, 1.05)
          .to(".log__beat--1", { opacity: 1, y: 0, duration: 0.4 }, 1.15)
          .to(".log__beat--1", { opacity: 0, y: -40, duration: 0.4 }, 2.15)
          .to(".log__beat--2", { opacity: 1, y: 0, duration: 0.4 }, 2.25)
          .fromTo(".log__backdrop img", { scale: 1.18 }, { scale: 1, ease: "none", duration: 3.6 }, 0)
          .fromTo(".log__progress-fill", { scaleX: 0 }, { scaleX: 1, ease: "none", duration: 3.6 }, 0);
        build(tl, true);
        return () => root.current?.classList.remove("is-pinned");
      });

      mm.add("(max-width: 899px) and (prefers-reduced-motion: no-preference)", function () {
        const tl = gsap.timeline({ scrollTrigger: { trigger: ".log-card", start: "top 75%" } });
        build(tl, false);
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="log" id="log" aria-labelledby="log-title">
      <div className="log__stage">
        <div className="log__backdrop" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={artUrl(game.art!)} alt="" loading="lazy" />
        </div>

        <div className="container log__grid">
          <div className="log__copy">
            <h2 id="log-title" className="sr-only">
              How logging a game works
            </h2>
            <div className="log__beats">
              {BEATS.map((b, i) => (
                <div key={i} className={"log__beat log__beat--" + i}>
                  <h3>{b.title}</h3>
                  <p>{b.body}</p>
                </div>
              ))}
            </div>
            <span className="log__progress" aria-hidden="true">
              <span className="log__progress-fill" />
            </span>
          </div>

          <article className="log-card" aria-label={"A log of " + game.title}>
            <Poster game={game} className="log-card__cover" />
            <div className="log-card__body">
              <div className="log-card__head">
                <h4 className="log-card__title">{game.title}</h4>
                <span className="log-card__stamps">
                  <Stamp status="playing" className="log__playing" />
                  <Stamp status="played" className="log__played" />
                </span>
              </div>
              <div className="log-card__meta">
                <span className="stars stars--live" role="img" aria-label={RATING + " out of 5 stars"} style={{ ["--star-size" as string]: "22px" }}>
                  {[1, 2, 3, 4, 5].map((n) => {
                    const fill = RATING >= n ? 0 : RATING >= n - 0.5 ? 50 : 100;
                    return (
                      <span key={n} className="star star--track" aria-hidden="true">
                        <span className="log__star-fill" style={{ clipPath: "inset(0 " + fill + "% 0 0)" }} />
                      </span>
                    );
                  })}
                </span>
                <span className="log-card__date">21 Sep 2026</span>
              </div>
              <p className="log-card__review">
                {LOG_REVIEW.split(" ").map((w, i) => (
                  <span key={i} className="log__word">
                    {w}{" "}
                  </span>
                ))}
              </p>
              <div className="log-card__footer">
                <span>2h</span>
                <span className="log__likes">
                  <svg viewBox="3 4 18 18" fill="currentColor" aria-hidden="true">
                    <path d="M12 20.3 4.3 12.6A4.7 4.7 0 0 1 11 6l1 1 1-1a4.7 4.7 0 0 1 6.7 6.6z" />
                  </svg>
                  24 likes
                </span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

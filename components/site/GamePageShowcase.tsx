"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Avatar, Poster, RatingBars, Stars } from "@/components/ui";
import { GAME_PAGE, artUrl } from "@/lib/showcase";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function GamePageShowcase() {
  const root = useRef<HTMLElement>(null);
  const { game, average, ratings, histogram, friends, reviews } = GAME_PAGE;

  useGSAP(
    function () {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", function () {
        gsap.fromTo(
          ".gp__backdrop img",
          { yPercent: -12, scale: 1.12 },
          { yPercent: 8, scale: 1, ease: "none", scrollTrigger: { trigger: ".gp", start: "top bottom", end: "bottom top", scrub: true } },
        );
        const tl = gsap.timeline({ scrollTrigger: { trigger: ".gp", start: "top 70%" } });
        tl.from(".gp__poster", { y: 60, rotate: -4, opacity: 0, duration: 1, ease: "expo.out" })
          .from(".gp__head > *", { y: 24, opacity: 0, stagger: 0.07, duration: 0.7, ease: "power3.out" }, 0.15)
          .from(".gp .rating-bars__bar", { scaleY: 0, transformOrigin: "bottom", stagger: 0.04, duration: 0.6, ease: "power3.out" }, 0.4)
          .from(".gp__friend", { y: 16, opacity: 0, stagger: 0.06, duration: 0.5 }, 0.55)
          .from(".gp__review", { y: 24, opacity: 0, stagger: 0.12, duration: 0.7, ease: "power3.out" }, 0.7);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="section gp-section" id="game-pages" aria-labelledby="gp-title">
      <div className="container section__head">
        <h2 id="gp-title" className="display-2">
          Every game has a page.
        </h2>
        <p className="lead">
          What everyone rated it, what your friends thought, and every review worth reading, in one place.
        </p>
      </div>

      <div className="container">
        <div className="gp">
          <div className="gp__backdrop" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={artUrl(game.art!)} alt="" loading="lazy" />
          </div>
          <div className="gp__body">
            <Poster game={game} className="gp__poster" />
            <div className="gp__head">
              <h3 className="gp__title">{game.title}</h3>
              <p className="gp__sub">
                {game.year} <span aria-hidden="true">/</span> {game.studio}
              </p>
              <div className="gp__score">
                <span className="gp__avg">{average.toFixed(1)}</span>
                <span className="gp__score-detail">
                  <Stars rating={Math.round(average * 2) / 2} size={14} />
                  <span>{ratings.toLocaleString("en-US")} ratings</span>
                </span>
                <RatingBars counts={histogram} className="gp__bars" />
              </div>
            </div>

            <div className="gp__friends">
              <h4>Friends who played it</h4>
              <ul>
                {friends.map((f) => (
                  <li key={f.who.handle} className="gp__friend">
                    <Avatar who={f.who} size={34} />
                    <Stars rating={f.rating} size={11} />
                  </li>
                ))}
              </ul>
            </div>

            <div className="gp__reviews">
              {reviews.map((r) => (
                <blockquote key={r.who.handle} className="gp__review">
                  <header>
                    <Avatar who={r.who} size={26} />
                    <span className="gp__review-name">{r.who.name}</span>
                    <Stars rating={r.rating} size={12} />
                  </header>
                  <p>{r.text}</p>
                </blockquote>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

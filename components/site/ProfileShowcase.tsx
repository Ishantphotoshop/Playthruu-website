"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Avatar, Poster, RatingBars, Stamp, Stars } from "@/components/ui";
import { PROFILE } from "@/lib/showcase";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function ProfileShowcase() {
  const root = useRef<HTMLElement>(null);
  const { who, bio, stats, top3, histogram, diary } = PROFILE;

  useGSAP(
    function () {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", function () {
        const tl = gsap.timeline({ scrollTrigger: { trigger: ".profile", start: "top 72%" } });
        tl.from(".profile__top3 .poster", {
          y: 80,
          rotate: (i: number) => [-9, 0, 9][i],
          opacity: 0,
          stagger: 0.1,
          duration: 1,
          ease: "expo.out",
        })
          .from(".profile .rating-bars__bar", { scaleY: 0, transformOrigin: "bottom", stagger: 0.04, duration: 0.6 }, 0.3)
          .from(".profile__diary li", { x: 30, opacity: 0, stagger: 0.08, duration: 0.6, ease: "power3.out" }, 0.4);

        // Numbers count up from zero as the card arrives.
        gsap.utils.toArray<HTMLElement>(".profile__stat-value").forEach(function (el) {
          const target = Number(el.dataset.value);
          const obj = { v: 0 };
          tl.to(obj, { v: target, duration: 1.2, ease: "power2.out", onUpdate: () => (el.textContent = String(Math.round(obj.v))) }, 0.2);
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="section" id="profile" aria-labelledby="profile-title">
      <div className="container profile-layout">
        <div className="section__head section__head--side">
          <h2 id="profile-title" className="display-2">
            Your taste, on one page.
          </h2>
          <p className="lead">
            Your top three, your ratings, and a diary of everything you&rsquo;ve played. Share it, or keep it for
            yourself.
          </p>
        </div>

        <article className="profile" aria-label={"Example profile of " + who.name}>
          <header className="profile__head">
            <Avatar who={who} size={64} />
            <div>
              <h3 className="profile__name">{who.name}</h3>
              <p className="profile__handle">@{who.handle}</p>
            </div>
          </header>
          <p className="profile__bio">{bio}</p>
          <dl className="profile__stats">
            {stats.map((s) => (
              <div key={s.label}>
                <dt>{s.label}</dt>
                <dd className="profile__stat-value" data-value={s.value}>
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>

          <h4 className="profile__label">Top three</h4>
          <div className="profile__top3">
            {top3.map((g) => (
              <Poster key={g.cover} game={g} />
            ))}
          </div>

          <div className="profile__split">
            <div>
              <h4 className="profile__label">Ratings</h4>
              <RatingBars counts={histogram} className="profile__bars" />
            </div>
            <div>
              <h4 className="profile__label">Diary</h4>
              <ul className="profile__diary">
                {diary.map((d) => (
                  <li key={d.date}>
                    <span className="profile__date">{d.date}</span>
                    <Poster game={d.game} size="cover_big" className="profile__thumb" />
                    <span className="profile__entry">
                      <span className="profile__game">{d.game.title}</span>
                      {d.rating ? <Stars rating={d.rating} size={11} /> : <Stamp status={d.status} />}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

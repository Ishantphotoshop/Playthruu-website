"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Poster, Stamp, Stars } from "@/components/ui";
import WaitlistForm from "@/components/WaitlistForm";
import { SHELF } from "@/lib/showcase";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Scroll speed of each shelf column, so the wall shears as you scroll.
const DRIFT = [-18, -34, -10, -28, -14];

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    function () {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", function () {
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
        tl.from(".hero__line > span", { yPercent: 115, duration: 1.1, stagger: 0.09 })
          .from(".shelf__col", { yPercent: 40, opacity: 0, duration: 1.6, stagger: 0.08, ease: "expo.out" }, 0.05)
          .from(".hero__lede, .hero__form, .hero__launch", { y: 18, opacity: 0, duration: 0.8, stagger: 0.08 }, 0.45)
          // The app's stamps land on the covers like ink on a page.
          .from(
            ".shelf .stamp",
            { scale: 2.6, rotate: -16, opacity: 0, duration: 0.5, stagger: 0.14, ease: "back.out(2.2)" },
            0.9,
          )
          .from(
            ".shelf .stars",
            { clipPath: "inset(0 100% 0 0)", duration: 0.7, stagger: 0.1, ease: "power2.out" },
            1.1,
          );

        gsap.utils.toArray<HTMLElement>(".shelf__col").forEach(function (col, i) {
          gsap.to(col, {
            yPercent: DRIFT[i % DRIFT.length],
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 0.6 },
          });
        });
        gsap.to(".hero__content", {
          yPercent: -18,
          opacity: 0.2,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="hero" id="top">
      <div className="hero__wall" aria-hidden="true">
        <div className="shelf">
          {SHELF.map(function (col, c) {
            // Each column repeats once so it stays full while it drifts.
            return (
              <div className="shelf__col" key={c}>
                {[...col, ...col].map(function (item, i) {
                  return (
                    <div className="shelf__item" key={i}>
                      <Poster game={item.game} priority={i < 2} />
                      {item.status && <Stamp status={item.status} className="shelf__stamp" />}
                      {item.rating && (
                        <span className="shelf__rating">
                          <Stars rating={item.rating} size={13} />
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      <div className="container hero__content">
        <h1 className="hero__title">
          <span className="hero__line">
            <span>Every game</span>
          </span>
          <span className="hero__line">
            <span>you ever</span>
          </span>
          <span className="hero__line">
            <span>played.</span>
          </span>
        </h1>
        <p className="hero__lede">
          One diary for everything you play. Log it, rate it, write about it, and see what your friends are
          playing.
        </p>
        <div className="hero__form">
          <WaitlistForm />
        </div>
        <p className="hero__launch">Opens 20 October. The waitlist gets in first.</p>
      </div>
    </section>
  );
}

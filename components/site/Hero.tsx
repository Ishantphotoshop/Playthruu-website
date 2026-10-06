"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { Poster, Stamp, Stars } from "@/components/ui";
import WaitlistForm from "@/components/WaitlistForm";
import { FEATURED, shelfFor, type Featured } from "@/lib/showcase";
import { useLivingWall, type WallTuning } from "./useLivingWall";

// Alternating directions so the wall looks busy without any one thing
// racing: the numbers are px/s at rest, about one full loop a minute.
const TUNING: WallTuning = {
  idle: [-13, 19, -10, 16, -12],
  follow: [0.16, 0.34, 0.1, 0.28, 0.13],
  seeds: [0.2, 0.68, 0.38, 0.85, 0.55],
  pad: 0.35,
  parallax: 0.12,
};

// Rendered slot width (px) per breakpoint, so the browser downloads the
// 264px cover on standard screens and the 528px one only where it's needed.
const SIZES = "(max-width: 599px) 126px, 190px";

// Each column is the same few posters stacked `sets` times. Three is
// enough for any normal screen; the effect below adds more on very tall
// ones. More stacks never move what's already on screen.
const MIN_SETS = 3;
const MAX_SETS = 6;

export default function Hero({ featured = FEATURED }: { featured?: Featured }) {
  const root = useRef<HTMLElement>(null);
  const columns = useMemo(() => shelfFor(featured), [featured]);
  const [sets, setSets] = useState(MIN_SETS);

  const wall = useLivingWall(root, TUNING);

  // A stack was added: rewrite the column positions now, after the DOM has
  // the new stack and before the browser paints.
  useLayoutEffect(() => wall.current.rewrite(), [sets, wall]);

  useEffect(function () {
    const hero = root.current;
    if (!hero) return;
    // A column must hold the lead-in, one loop, and the visible height, so
    // no gap can open at the bottom at any phase.
    const grow = () => {
      let shortest = Infinity;
      hero.querySelectorAll<HTMLElement>(".shelf__set:first-child").forEach(function (el) {
        if (el.offsetHeight > 0) shortest = Math.min(shortest, el.offsetHeight);
      });
      if (!Number.isFinite(shortest)) return;
      const need = Math.ceil(1 + TUNING.pad + (hero.clientHeight * 1.12 + 320) / shortest);
      setSets((s) => Math.min(MAX_SETS, Math.max(s, need)));
    };
    grow();
    const ro = new ResizeObserver(grow);
    ro.observe(hero);
    return () => ro.disconnect();
  }, []);

  return (
    <section ref={root} className="hero" id="top">
      <div className="hero__wall" aria-hidden="true">
        <div className="shelf">
          {columns.map(function (col, c) {
            return (
              <div className="shelf__col" key={c} style={{ "--i": c } as CSSProperties}>
                <div
                  className="shelf__track"
                  style={{ transform: "translate3d(0," + (-((TUNING.pad + TUNING.seeds[c]) / MIN_SETS) * 100).toFixed(4) + "%,0)" }}
                >
                  {Array.from({ length: sets }, function (_, s) {
                    return (
                      <div className="shelf__set" key={s}>
                        {col.map(function (item, r) {
                          return (
                            <div
                              className="shelf__item"
                              key={r}
                              data-featured={item.featured ? "" : undefined}
                              style={{ "--d": c * 0.12 + r * 0.06 } as CSSProperties}
                            >
                              <Poster game={item.game} sizes={SIZES} />
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
            );
          })}
        </div>
      </div>
      <div className="hero__scrim" aria-hidden="true" />

      <div className="container hero__content">
        <h1 className="hero__title">
          {["Every game", "you ever", "played."].map(function (line, n) {
            return (
              <span className="hero__line" key={line}>
                <span style={{ "--n": n } as CSSProperties}>{line}</span>
              </span>
            );
          })}
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

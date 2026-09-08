"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { StarRow } from "@/components/icons";

// Cover art from IGDB (images.igdb.com), t_cover_big_2x (528x748). A curated
// subset (not the full log) — a circular gallery reads best with 7-9 items;
// more than that and each slice is too thin to register as its own card.
const entries = [
  {
    game: "Elden Ring",
    cover: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co4jni.jpg",
    status: "Now playing",
    rating: 4.5,
    reviewer: "Maya R.",
  },
  {
    game: "Hades",
    cover: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/cob9kr.jpg",
    status: "Replayed",
    rating: 5,
    reviewer: "Jordan L.",
  },
  {
    game: "Stardew Valley",
    cover: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/coa93h.jpg",
    status: "Now playing",
    rating: 4.5,
    reviewer: "Sam W.",
  },
  {
    game: "Balatro",
    cover: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co9f4g.jpg",
    status: "Now playing",
    rating: 5,
    reviewer: "Aisha R.",
  },
  {
    game: "Baldur's Gate 3",
    cover: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co670h.jpg",
    status: "Now playing",
    rating: 5,
    reviewer: "Liam O.",
  },
  {
    game: "Celeste",
    cover: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/cob9dh.jpg",
    status: "Finished",
    rating: 5,
    reviewer: "Nina P.",
  },
  {
    game: "Disco Elysium",
    cover: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co2ve1.jpg",
    status: "Finished",
    rating: 4.5,
    reviewer: "Chris D.",
  },
  {
    game: "Outer Wilds",
    cover: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co65ac.jpg",
    status: "Finished",
    rating: 5,
    reviewer: "Leo V.",
  },
] as const;

const DEG_PER_SEC = 5.5;

export default function ReviewGallery() {
  const [angle, setAngle] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const runningRef = useRef(false);
  const pausedRef = useRef(false);

  useEffect(function () {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) return;
    const el = stageRef.current;
    if (!el) return;

    let raf = 0;
    let last = 0;

    function tick(now: number) {
      if (!runningRef.current) return;
      if (!pausedRef.current && last) {
        const dt = (now - last) / 1000;
        setAngle(function (a) {
          return (a + DEG_PER_SEC * dt) % 360;
        });
      }
      last = now;
      raf = requestAnimationFrame(tick);
    }

    // Only spend cycles animating a carousel the visitor can actually see.
    const observer = new IntersectionObserver(
      function (obsEntries) {
        const visible = obsEntries[0].isIntersecting;
        if (visible && !runningRef.current) {
          runningRef.current = true;
          last = 0;
          raf = requestAnimationFrame(tick);
        } else if (!visible && runningRef.current) {
          runningRef.current = false;
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);

    function pause() {
      pausedRef.current = true;
    }
    function resume() {
      pausedRef.current = false;
    }
    el.addEventListener("pointerenter", pause);
    el.addEventListener("pointerleave", resume);
    el.addEventListener("focusin", pause);
    el.addEventListener("focusout", resume);

    return function () {
      runningRef.current = false;
      cancelAnimationFrame(raf);
      observer.disconnect();
      el.removeEventListener("pointerenter", pause);
      el.removeEventListener("pointerleave", resume);
      el.removeEventListener("focusin", pause);
      el.removeEventListener("focusout", resume);
    };
  }, []);

  const anglePerItem = 360 / entries.length;
  const radius = 200;

  return (
    <div className="hero-art">
      <div
        ref={stageRef}
        className="review-gallery"
        role="region"
        aria-roledescription="carousel"
        aria-label="A rotating preview of games logged on PlayThruu"
      >
        {entries.map(function (entry, i) {
          const itemAngle = i * anglePerItem;
          const relative = (((itemAngle + angle) % 360) + 360) % 360;
          const normalized = relative > 180 ? 360 - relative : relative;
          const isFront = normalized < anglePerItem / 2;

          return (
            <div
              key={entry.game}
              className="review-gallery__item"
              aria-hidden={isFront ? undefined : true}
              style={{
                transform: `rotateY(${itemAngle + angle}deg) translateZ(${radius}px)`,
                opacity: Math.max(0.3, 1 - normalized / 130),
              }}
            >
              <Image
                src={entry.cover}
                alt=""
                width={528}
                height={748}
                sizes="160px"
                priority={i === 0}
              />
              <div className="review-gallery__scrim" />
              <div className="review-gallery__caption">
                <StarRow rating={entry.rating} size={11} />
                <span className="review-gallery__title">{entry.game}</span>
                <span className="review-gallery__meta">
                  {entry.status} &middot; {entry.reviewer}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

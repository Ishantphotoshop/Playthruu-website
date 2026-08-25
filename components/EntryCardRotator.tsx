"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { StarRow } from "@/components/icons";

// Cover art from IGDB (images.igdb.com), t_cover_big_2x (528x748).
const entries = [
  {
    game: "Elden Ring",
    cover: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co4jni.jpg",
    status: "Now playing",
    date: "Aug 24",
    rating: 4.5,
    review: "The kind of game that rearranges your whole week around it.",
    reviewer: "Maya R.",
    logged: 184,
    thisYear: 27,
    friends: 12,
  },
  {
    game: "Hades",
    cover: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/cob9kr.jpg",
    status: "Replayed",
    date: "May 3",
    rating: 5,
    review: "Died 71 times and never once wanted to stop.",
    reviewer: "Jordan L.",
    logged: 530,
    thisYear: 41,
    friends: 27,
  },
  {
    game: "Stardew Valley",
    cover: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/coa93h.jpg",
    status: "Now playing",
    date: "Aug 18",
    rating: 4.5,
    review: "Started a ‘quick farm run’ three years ago. Still not done.",
    reviewer: "Sam W.",
    logged: 891,
    thisYear: 63,
    friends: 45,
  },
  {
    game: "Red Dead Redemption 2",
    cover: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co1q1f.jpg",
    status: "Finished",
    date: "Jul 30",
    rating: 5,
    review: "Took me four months. Cried twice. Would do it again.",
    reviewer: "Tom K.",
    logged: 412,
    thisYear: 18,
    friends: 34,
  },
  {
    game: "Celeste",
    cover: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/cob9dh.jpg",
    status: "Finished",
    date: "Apr 9",
    rating: 5,
    review: "A platformer that's actually about being kind to yourself. Wrecked me.",
    reviewer: "Nina P.",
    logged: 347,
    thisYear: 29,
    friends: 15,
  },
  {
    game: "God of War Ragnarok",
    cover: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/coba3d.jpg",
    status: "Finished",
    date: "Jun 12",
    rating: 4.5,
    review: "Every fight feels like a cutscene and I mean that as a compliment.",
    reviewer: "Priya S.",
    logged: 265,
    thisYear: 22,
    friends: 19,
  },
  {
    game: "Disco Elysium",
    cover: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co2ve1.jpg",
    status: "Finished",
    date: "Mar 22",
    rating: 4.5,
    review: "Read more dialogue here than in most books I own.",
    reviewer: "Chris D.",
    logged: 198,
    thisYear: 11,
    friends: 9,
  },
  {
    game: "Hollow Knight",
    cover: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/cobfzp.jpg",
    status: "Finished",
    date: "Feb 14",
    rating: 4.5,
    review: "Got lost in Deepnest for two hours and somehow don't regret it.",
    reviewer: "Alex M.",
    logged: 276,
    thisYear: 16,
    friends: 21,
  },
] as const;

const ROTATE_MS = 5000;

export default function EntryCardRotator() {
  const [index, setIndex] = useState(0);

  useEffect(function () {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;
    const id = setInterval(function () {
      setIndex(function (i) {
        return (i + 1) % entries.length;
      });
    }, ROTATE_MS);
    return function () {
      clearInterval(id);
    };
  }, []);

  const entry = entries[index];

  return (
    <div className="hero-art" aria-label="A preview of a PlayThruu diary entry">
      <div className="orbit" />
      <div className="entry-card" key={index}>
        <div className="entry-card__head">
          <span>Diary Entry</span>
          <span>{entry.date}</span>
        </div>
        <div className="entry-card__poster">
          <Image
            src={entry.cover}
            alt=""
            width={528}
            height={748}
            sizes="296px"
            priority
          />
          <div className="entry-card__poster-label">
            <small>{entry.status}</small>
            {entry.game}
          </div>
        </div>
        <div className="entry-card__rating">
          <StarRow rating={entry.rating} />
          <b>{entry.rating}</b>
        </div>
        <p className="entry-card__review">&ldquo;{entry.review}&rdquo;</p>
        <p className="entry-card__reviewer">&mdash; {entry.reviewer}</p>
        <div className="entry-card__meta">
          <span>
            <strong>{entry.logged}</strong> logged
          </span>
          <span>
            <strong>{entry.thisYear}</strong> this year
          </span>
        </div>
      </div>
      <div className="floating-note note-one">
        <StarRow rating={5} size={14} />
      </div>
      <div className="floating-note note-two">
        <strong>{entry.friends}</strong> friends played this
      </div>
    </div>
  );
}

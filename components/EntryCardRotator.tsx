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
  {
    game: "Spider-Man 2",
    cover: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/cobg1k.jpg",
    status: "Finished",
    date: "Jan 15",
    rating: 4.5,
    review: "Swung past my bedtime every single night this week.",
    reviewer: "Ethan B.",
    logged: 301,
    thisYear: 24,
    friends: 22,
  },
  {
    game: "Balatro",
    cover: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co9f4g.jpg",
    status: "Now playing",
    date: "Aug 15",
    rating: 5,
    review: "Told myself one more hand. That was six hours ago.",
    reviewer: "Aisha R.",
    logged: 723,
    thisYear: 87,
    friends: 38,
  },
  {
    game: "Grand Theft Auto VI",
    cover: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/cocaa5.jpg",
    status: "Now playing",
    date: "Aug 20",
    rating: 5,
    review: "Pre-ordered a game for the first time in a decade.",
    reviewer: "Zoe H.",
    logged: 89,
    thisYear: 89,
    friends: 51,
  },
  {
    game: "Outer Wilds",
    cover: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co65ac.jpg",
    status: "Finished",
    date: "Jun 2",
    rating: 5,
    review: "Can't tell you why it's good without ruining it. Just play it.",
    reviewer: "Leo V.",
    logged: 156,
    thisYear: 8,
    friends: 11,
  },
  {
    game: "The Last of Us Part II",
    cover: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co5ziw.jpg",
    status: "Finished",
    date: "Nov 3",
    rating: 5,
    review: "Made me hate a character then feel awful about it.",
    reviewer: "Marcus T.",
    logged: 402,
    thisYear: 14,
    friends: 30,
  },
  {
    game: "Cuphead",
    cover: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co62ao.jpg",
    status: "Finished",
    date: "Mar 30",
    rating: 4.5,
    review: "Rage-quit four times. Came back every time.",
    reviewer: "Hannah C.",
    logged: 289,
    thisYear: 15,
    friends: 20,
  },
  {
    game: "The Legend of Zelda: Tears of the Kingdom",
    cover: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co5vmg.jpg",
    status: "Finished",
    date: "Jul 8",
    rating: 5,
    review: "Built a flying machine instead of doing the main quest. No regrets.",
    reviewer: "Ravi K.",
    logged: 512,
    thisYear: 33,
    friends: 28,
  },
  {
    game: "Baldur's Gate 3",
    cover: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co670h.jpg",
    status: "Now playing",
    date: "Aug 22",
    rating: 5,
    review: "Romanced a vampire, then spent 40 hours arguing with him.",
    reviewer: "Liam O.",
    logged: 178,
    thisYear: 55,
    friends: 40,
  },
  {
    game: "Cyberpunk 2077",
    cover: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/coaih8.jpg",
    status: "Finished",
    date: "May 19",
    rating: 4.5,
    review: "Night City ruined every other open world for me.",
    reviewer: "Grace F.",
    logged: 244,
    thisYear: 12,
    friends: 17,
  },
  {
    game: "The Witcher 3: Wild Hunt",
    cover: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/coaarl.jpg",
    status: "Replayed",
    date: "Feb 27",
    rating: 5,
    review: "Started a side quest, ended up crying about a fisherman's dead wife.",
    reviewer: "Devon P.",
    logged: 601,
    thisYear: 20,
    friends: 44,
  },
  {
    game: "Horizon Forbidden West",
    cover: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co2gvu.jpg",
    status: "Finished",
    date: "Oct 5",
    rating: 4.5,
    review: "Fought a robot dinosaur and immediately texted my group chat about it.",
    reviewer: "Kayla M.",
    logged: 213,
    thisYear: 9,
    friends: 13,
  },
  {
    game: "Marvel's Spider-Man",
    cover: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co1r77.jpg",
    status: "Finished",
    date: "Sep 11",
    rating: 4.5,
    review: "The one that made me buy a PS4 just to play it.",
    reviewer: "Noah S.",
    logged: 356,
    thisYear: 6,
    friends: 19,
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

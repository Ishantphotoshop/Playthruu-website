"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

// Cover art from IGDB (images.igdb.com), t_cover_big_2x (528x748).
// 24 AAA : 16 indie (6:4 ratio).
const covers = [
  // AAA (24)
  { src: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co4jni.jpg", alt: "Elden Ring" },
  { src: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co1q1f.jpg", alt: "Red Dead Redemption 2" },
  { src: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/cobg1k.jpg", alt: "Spider-Man 2" },
  { src: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/coclf1.jpg", alt: "Persona 5 Royal" },
  { src: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co9coo.jpg", alt: "Ghost of Yotei" },
  { src: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/coba3d.jpg", alt: "God of War Ragnarok" },
  { src: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co5ziw.jpg", alt: "The Last of Us Part II" },
  { src: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/cocaa5.jpg", alt: "Grand Theft Auto VI" },
  { src: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co5vmg.jpg", alt: "The Legend of Zelda: Tears of the Kingdom" },
  { src: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co670h.jpg", alt: "Baldur's Gate 3" },
  { src: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/coaih8.jpg", alt: "Cyberpunk 2077" },
  { src: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co8fu7.jpg", alt: "Minecraft" },
  { src: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co1rs4.jpg", alt: "Portal 2" },
  { src: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co6bo0.jpg", alt: "Resident Evil 4" },
  { src: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/cobksf.jpg", alt: "Death Stranding" },
  { src: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/cob22v.jpg", alt: "It Takes Two" },
  { src: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co3wls.jpg", alt: "Animal Crossing: New Horizons" },
  { src: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co3p5n.jpg", alt: "Doom Eternal" },
  { src: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/coaarl.jpg", alt: "The Witcher 3: Wild Hunt" },
  { src: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co2gvu.jpg", alt: "Horizon Forbidden West" },
  { src: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/cobcwt.jpg", alt: "Final Fantasy VII Remake" },
  { src: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co2ed3.jpg", alt: "Assassin's Creed Valhalla" },
  { src: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co1r77.jpg", alt: "Marvel's Spider-Man" },
  { src: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co2dto.jpg", alt: "Halo Infinite" },
  // Indie (16)
  { src: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/cobebu.jpg", alt: "Hollow Knight: Silksong" },
  { src: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co62ao.jpg", alt: "Cuphead" },
  { src: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/cob9kr.jpg", alt: "Hades" },
  { src: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/coa93h.jpg", alt: "Stardew Valley" },
  { src: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/cob9dh.jpg", alt: "Celeste" },
  { src: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co2ve1.jpg", alt: "Disco Elysium" },
  { src: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/cobfzp.jpg", alt: "Hollow Knight" },
  { src: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co9f4g.jpg", alt: "Balatro" },
  { src: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co65ac.jpg", alt: "Outer Wilds" },
  { src: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/coaamg.jpg", alt: "Terraria" },
  { src: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/cocdlv.jpg", alt: "Dave the Diver" },
  { src: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co4bzv.jpg", alt: "Vampire Survivors" },
  { src: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co2fca.jpg", alt: "Inside" },
  { src: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co1vqc.jpg", alt: "Untitled Goose Game" },
  { src: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co1iyf.jpg", alt: "Slay the Spire" },
  { src: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co27j9.jpg", alt: "Return of the Obra Dinn" },
];

function shuffled<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function PosterWall() {
  // Render the fixed order on first paint (so SSR and hydration match),
  // then shuffle once the client takes over — a different order every visit.
  const [order, setOrder] = useState(covers);

  useEffect(function () {
    // Random order can only be computed client-side (Math.random() would
    // desync from the server-rendered HTML otherwise), so this genuinely
    // has to happen post-hydration rather than during render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOrder(shuffled(covers));
  }, []);

  return (
    <div className="poster-wall" aria-hidden="true">
      <div className="poster-wall-track">
        {[0, 1].map(function (rep) {
          return (
            <div className="poster-wall-set" key={rep}>
              {order.map(function (cover) {
                return (
                  <div className="poster-thumb" key={cover.alt + rep}>
                    <Image
                      src={cover.src}
                      alt=""
                      width={528}
                      height={748}
                      sizes="92px"
                    />
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

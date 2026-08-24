import Image from "next/image";
import eldenRing from "@/assets/covers/elden-ring.jpg";
import redDeadRedemption2 from "@/assets/covers/red-dead-redemption-2.jpg";
import spiderMan2 from "@/assets/covers/spider-man-2.jpg";
import hollowKnightSilksong from "@/assets/covers/hollow-knight-silksong.jpg";
import persona5Royal from "@/assets/covers/persona-5-royal.jpg";
import ghostOfYotei from "@/assets/covers/ghost-of-yotei.jpg";
import godOfWar4 from "@/assets/covers/god-of-war-4.jpg";
import cuphead from "@/assets/covers/cuphead.jpg";
import theLastOfUsPart2 from "@/assets/covers/the-last-of-us-part-2.jpg";
import gtaVi from "@/assets/covers/gta-vi.jpg";

const covers = [
  { src: eldenRing, alt: "Elden Ring" },
  { src: redDeadRedemption2, alt: "Red Dead Redemption 2" },
  { src: spiderMan2, alt: "Spider-Man 2" },
  { src: hollowKnightSilksong, alt: "Hollow Knight: Silksong" },
  { src: persona5Royal, alt: "Persona 5 Royal" },
  { src: ghostOfYotei, alt: "Ghost of Yotei" },
  { src: godOfWar4, alt: "God of War Ragnarok" },
  { src: cuphead, alt: "Cuphead" },
  { src: theLastOfUsPart2, alt: "The Last of Us Part II" },
  { src: gtaVi, alt: "Grand Theft Auto VI" },
];

export default function PosterWall() {
  return (
    <div className="poster-wall" aria-hidden="true">
      <div className="poster-wall-track">
        {[0, 1].map(function (rep) {
          return (
            <div className="poster-wall-set" key={rep}>
              {covers.map(function (cover) {
                return (
                  <div className="poster-thumb" key={cover.alt + rep}>
                    <Image src={cover.src} alt="" placeholder="blur" sizes="92px" />
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

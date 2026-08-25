import Image from "next/image";

// Cover art from IGDB (images.igdb.com), t_cover_big_2x (528x748).
const covers = [
  {
    src: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co4jni.jpg",
    alt: "Elden Ring",
  },
  {
    src: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co1q1f.jpg",
    alt: "Red Dead Redemption 2",
  },
  {
    src: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/cobg1k.jpg",
    alt: "Spider-Man 2",
  },
  {
    src: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/cobebu.jpg",
    alt: "Hollow Knight: Silksong",
  },
  {
    src: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/coclf1.jpg",
    alt: "Persona 5 Royal",
  },
  {
    src: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co9coo.jpg",
    alt: "Ghost of Yotei",
  },
  {
    src: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/coba3d.jpg",
    alt: "God of War Ragnarok",
  },
  {
    src: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co62ao.jpg",
    alt: "Cuphead",
  },
  {
    src: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co5ziw.jpg",
    alt: "The Last of Us Part II",
  },
  {
    src: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/cocaa5.jpg",
    alt: "Grand Theft Auto VI",
  },
  {
    src: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co5vmg.jpg",
    alt: "The Legend of Zelda: Tears of the Kingdom",
  },
  {
    src: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co670h.jpg",
    alt: "Baldur's Gate 3",
  },
  {
    src: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/coaih8.jpg",
    alt: "Cyberpunk 2077",
  },
  {
    src: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co8fu7.jpg",
    alt: "Minecraft",
  },
  {
    src: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co1rs4.jpg",
    alt: "Portal 2",
  },
  {
    src: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co6bo0.jpg",
    alt: "Resident Evil 4",
  },
  {
    src: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/cobksf.jpg",
    alt: "Death Stranding",
  },
  {
    src: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/cob22v.jpg",
    alt: "It Takes Two",
  },
  {
    src: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co3wls.jpg",
    alt: "Animal Crossing: New Horizons",
  },
  {
    src: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co3p5n.jpg",
    alt: "Doom Eternal",
  },
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

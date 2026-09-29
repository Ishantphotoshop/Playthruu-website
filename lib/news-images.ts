// Game art for news stories, from IGDB — the same licensed source the app
// and this site already use for covers (credited in the footer and privacy
// policy). Looked up through the app's igdb-proxy Supabase function, which
// holds the Twitch credentials, so this needs nothing but the anon key.
//
// Only an exact title match is used. A wrong game's art on a story is
// worse than no art, so anything ambiguous falls back to the generated
// PlayThruu card.

const IMG = "https://images.igdb.com/igdb/image/upload/t_screenshot_big/";

type IgdbGame = {
  name: string;
  first_release_date?: number;
  total_rating_count?: number;
  artworks?: Art[];
  screenshots?: Art[];
};
type Art = { image_id: string; width?: number; height?: number; artwork_type?: number };

// IGDB artwork_type ids, best first: key art without logo, key art with
// logo, generic artwork, concept art. Logos, icons, covers and
// infographics are never used — they look broken as a landscape thumbnail.
const ART_PREFERENCE = [2, 3, 1, 4];
const landscape = (a: Art) => !a.width || !a.height || (a.width / a.height >= 1.25 && a.width >= 800);

function pickArt(g: IgdbGame): Art | undefined {
  for (const type of ART_PREFERENCE) {
    const hit = g.artworks?.find((a) => a.artwork_type === type && landscape(a));
    if (hit) return hit;
  }
  return g.screenshots?.[0];
}

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[‘’'’]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

// `game` may end in a release year — "Castlevania (1986)" — to pick the
// right one of several games sharing a title (originals, remakes, reboots).
export async function findGameArt(game: string | null | undefined) {
  if (!game || !game.trim()) return null;
  const yearHint = game.match(/\s*\((\d{4})\)\s*$/);
  const title = yearHint ? game.slice(0, yearHint.index).trim() : game.trim();
  const year = yearHint ? Number(yearHint[1]) : null;
  try {
    const res = await fetch(process.env.NEXT_PUBLIC_SUPABASE_URL + "/functions/v1/igdb-proxy", {
      method: "POST",
      headers: {
        authorization: "Bearer " + process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        endpoint: "games",
        query:
          'search "' + title.replace(/"/g, "") + '"; fields name,first_release_date,total_rating_count,artworks.image_id,artworks.width,artworks.height,artworks.artwork_type,screenshots.image_id; limit 25;',
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const results = (await res.json()) as IgdbGame[];
    if (!Array.isArray(results)) return null;

    const wanted = norm(title);
    const releaseYear = (g: IgdbGame) =>
      g.first_release_date ? new Date(g.first_release_date * 1000).getUTCFullYear() : null;
    const [match, runnerUp] = results
      .filter((g) => norm(g.name) === wanted && (year === null || releaseYear(g) === year))
      .sort((a, b) => (b.total_rating_count ?? 0) - (a.total_rating_count ?? 0));
    if (!match) return null;
    // Two different games sharing the title (e.g. 1986 and 1999
    // "Castlevania"): only trust the top one if it's clearly the famous one.
    if (runnerUp && (match.total_rating_count ?? 0) < 3 * Math.max(runnerUp.total_rating_count ?? 0, 1)) return null;
    // Never fall through to another game's art if the right one has none.
    const art = pickArt(match);
    if (!art) return null;

    return {
      image_url: IMG + art.image_id + ".jpg",
      image_credit: match.name + " — game art via IGDB",
    };
  } catch {
    return null;
  }
}

// Stories that aren't about one game (platform features, industry news):
// the official source's own header image — the og:image the publisher put
// on its newsroom post for exactly this kind of sharing. Only tier-1
// (official) sources are ever used, never a news outlet's photo.
export async function findOfficialImage(sources: { name: string; url?: string; tier: number }[]) {
  for (const s of sources) {
    if (s.tier !== 1 || !s.url) continue;
    try {
      const res = await fetch(s.url, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; PlayThruuNewsBot/1.0; +https://playthruu.com/news)" },
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) continue;
      const html = (await res.text()).slice(0, 200_000);
      const meta =
        html.match(/<meta[^>]+(?:property|name)=["'](?:og:image|twitter:image)(?::secure_url)?["'][^>]+content=["']([^"']+)["']/i) ??
        html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["'](?:og:image|twitter:image)["']/i);
      if (!meta) continue;
      const url = new URL(meta[1].replace(/&amp;/g, "&"), s.url);
      if (url.protocol !== "https:") continue;
      return { image_url: url.toString(), image_credit: "Image: " + s.name.replace(/\s*\(via [^)]*\)\s*$/, "").split(/ — |: /)[0] };
    } catch {
      continue;
    }
  }
  return null;
}

// What a story shows: its game's IGDB art, else the official source's
// image, else nothing (the site/app then draw the PlayThruu card).
export async function findStoryImage(a: {
  game?: string | null;
  sources: { name: string; url?: string; tier: number }[];
}) {
  return (await findGameArt(a.game)) ?? (await findOfficialImage(a.sources));
}

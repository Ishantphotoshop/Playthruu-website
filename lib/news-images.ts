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

// Publications whose photos PlayThruu must never reuse. An official page
// (publisher, platform holder, developer, league) is fine; a news
// outlet's article image is not, whatever the Brain claims.
const NEWS_OUTLETS = [
  "ign.com", "gamespot.com", "eurogamer.net", "pcgamer.com", "kotaku.com",
  "videogameschronicle.com", "gematsu.com", "polygon.com", "theverge.com",
  "gamesindustry.biz", "nintendolife.com", "gameinformer.com", "pushsquare.com",
  "purexbox.com", "dexerto.com", "gamerant.com", "thegamer.com", "vice.com",
  "windowscentral.com", "destructoid.com", "rockpapershotgun.com", "vgc.com",
  "insider-gaming.com", "gamesradar.com", "techradar.com", "screenrant.com",
  "cbr.com", "forbes.com", "bloomberg.com", "reuters.com", "inven.co.kr",
  "invenglobal.com", "4gamer.net", "famitsu.com", "siliconera.com",
];
export function isNewsOutlet(url: string) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    return NEWS_OUTLETS.some((d) => host === d || host.endsWith("." + d));
  } catch {
    return true;
  }
}

// The og:image / twitter:image an official page publishes for sharing.
async function pageImage(pageUrl: string) {
  if (isNewsOutlet(pageUrl)) return null;
  try {
    const res = await fetch(pageUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; PlayThruuNewsBot/1.0; +https://playthruu.com/news)" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const html = (await res.text()).slice(0, 300_000);
    const meta =
      html.match(/<meta[^>]+(?:property|name)=["'](?:og:image|twitter:image)(?::secure_url|:src)?["'][^>]+content=["']([^"']+)["']/i) ??
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["'](?:og:image|twitter:image)(?::src)?["']/i);
    if (!meta) return null;
    const url = new URL(meta[1].replace(/&amp;/g, "&"), pageUrl);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

// Stories that aren't about one game (platform features, hardware,
// industry news): the header image of their official (tier-1) source.
export async function findOfficialImage(sources: { name: string; url?: string; tier: number }[]) {
  for (const s of sources) {
    if (s.tier !== 1 || !s.url) continue;
    const image = await pageImage(s.url);
    if (image) {
      return { image_url: image, image_credit: "Image: " + s.name.replace(/\s*\(via [^)]*\)\s*$/, "").split(/ — |: /)[0] };
    }
  }
  return null;
}

// What a story shows, in order: its game's IGDB art; the image on its
// official source; the image of an official page the Brain names for the
// subject (image_source_url — e.g. playstation.com's PS5 Pro page for a
// hardware story). A thumbnail is required, so null here means the
// story is rejected until one of those is supplied.
export async function findStoryImage(
  a: { game?: string | null; sources: { name: string; url?: string; tier: number }[] },
  imageSourceUrl?: unknown,
) {
  const fromGame = await findGameArt(a.game);
  if (fromGame) return fromGame;
  const fromSource = await findOfficialImage(a.sources);
  if (fromSource) return fromSource;
  if (typeof imageSourceUrl === "string" && /^https:\/\//.test(imageSourceUrl)) {
    const image = await pageImage(imageSourceUrl);
    if (image) return { image_url: image, image_credit: "Image: " + new URL(imageSourceUrl).hostname.replace(/^www\./, "") };
  }
  return null;
}

export const THUMBNAIL_REQUIRED =
  "thumbnail required: no image could be found. Set `game` to the exact official title (add \"(YEAR)\" if titles clash), or pass `image_source_url` = an official page for the subject (publisher/platform/developer/league site, never a news outlet) that has a share image — e.g. https://www.playstation.com/en-us/ps5/ps5-pro/ for a PS5 Pro story.";

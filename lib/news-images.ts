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
  artworks?: { image_id: string }[];
  screenshots?: { image_id: string }[];
};

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
          'search "' + title.replace(/"/g, "") + '"; fields name,first_release_date,total_rating_count,artworks.image_id,screenshots.image_id; limit 25;',
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
    if (!match.artworks?.length && !match.screenshots?.length) return null;

    const imageId = (match.artworks?.[0] ?? match.screenshots?.[0])!.image_id;
    return {
      image_url: IMG + imageId + ".jpg",
      image_credit: match.name + " — game art via IGDB",
    };
  } catch {
    return null;
  }
}

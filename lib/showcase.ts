// Everything the homepage shows about the product: real games (IGDB cover
// and key-art ids — the same licensed source the app uses) and made-up
// example people. No real user's name or writing appears here.

export type Status = "playing" | "played" | "backlog" | "dropped";

export type Game = {
  title: string;
  cover: string; // IGDB cover image_id
  art?: string; // IGDB landscape key-art image_id
  year?: number;
  studio?: string;
};

const IGDB = "https://images.igdb.com/igdb/image/upload/";
export const coverUrl = (id: string, size: "cover_big" | "cover_big_2x" | "720p" = "cover_big_2x") =>
  IGDB + "t_" + size + "/" + id + ".jpg";
export const artUrl = (id: string, size: "1080p" | "screenshot_big" | "720p" = "1080p") =>
  IGDB + "t_" + size + "/" + id + ".jpg";

export const GAMES = {
  wolverine: { title: "Marvel's Wolverine", cover: "cob5mk", art: "ar5z88", year: 2026, studio: "Insomniac Games" },
  yotei: { title: "Ghost of Yōtei", cover: "co9coo", art: "ar3o0e", year: 2025, studio: "Sucker Punch" },
  eldenRing: { title: "Elden Ring", cover: "co4jni", art: "ar1481" },
  rdr2: { title: "Red Dead Redemption 2", cover: "co1q1f" },
  spiderMan2: { title: "Marvel's Spider-Man 2", cover: "cobg1k", art: "ar4uyy" },
  tlou2: { title: "The Last of Us Part II", cover: "co5ziw", art: "ar6gf8" },
  gowr: { title: "God of War Ragnarök", cover: "coba3d" },
  gta6: { title: "Grand Theft Auto VI", cover: "cocaa5" },
  zelda: { title: "Tears of the Kingdom", cover: "co5vmg" },
  bg3: { title: "Baldur's Gate 3", cover: "co670h" },
  cyberpunk: { title: "Cyberpunk 2077", cover: "coaih8" },
  persona5: { title: "Persona 5 Royal", cover: "coclf1" },
  re4: { title: "Resident Evil 4", cover: "co6bo0" },
  deathStranding: { title: "Death Stranding", cover: "cobksf" },
  witcher3: { title: "The Witcher 3: Wild Hunt", cover: "coaarl" },
  horizon: { title: "Horizon Forbidden West", cover: "co2gvu" },
  ff7: { title: "Final Fantasy VII Remake", cover: "cobcwt" },
  hades: { title: "Hades", cover: "cob9kr" },
  hades2: { title: "Hades II", cover: "coaknx", art: "ar44rv" },
  silksong: { title: "Hollow Knight: Silksong", cover: "cobebu" },
  celeste: { title: "Celeste", cover: "cob9dh" },
  discoElysium: { title: "Disco Elysium", cover: "co2ve1" },
  stardew: { title: "Stardew Valley", cover: "coa93h" },
  ghostOfTsushima: { title: "Ghost of Tsushima", cover: "co2crj" },
  itTakesTwo: { title: "It Takes Two", cover: "cob22v" },
  portal2: { title: "Portal 2", cover: "co1rs4" },
  cuphead: { title: "Cuphead", cover: "co62ao" },
  ds2: { title: "Death Stranding 2", cover: "co9ipx" },
} satisfies Record<string, Game>;

export type Person = { name: string; handle: string; hue: number };

export const PEOPLE = {
  maya: { name: "Maya", handle: "maya", hue: 150 },
  leo: { name: "Leo", handle: "leo.plays", hue: 200 },
  jordan: { name: "Jordan", handle: "jordanl", hue: 30 },
  sam: { name: "Sam", handle: "samwise", hue: 280 },
  ria: { name: "Ria", handle: "ria", hue: 340 },
  kai: { name: "Kai", handle: "kai", hue: 90 },
  noor: { name: "Noor", handle: "noor", hue: 10 },
  theo: { name: "Theo", handle: "theo_", hue: 240 },
} satisfies Record<string, Person>;

// The hero's shelf: five columns of someone's diary. A few posters carry
// the app's stamp and star row, the way they do in a real feed.
export type ShelfItem = { game: Game; status?: Status; rating?: number };
const G = GAMES;
export const SHELF: ShelfItem[][] = [
  [{ game: G.eldenRing, status: "played", rating: 5 }, { game: G.stardew }, { game: G.re4, rating: 4 }, { game: G.hades }],
  [{ game: G.tlou2 }, { game: G.wolverine, status: "playing" }, { game: G.celeste, rating: 4.5 }, { game: G.cyberpunk }],
  [{ game: G.gta6, status: "backlog" }, { game: G.bg3, rating: 5 }, { game: G.portal2 }, { game: G.ff7, status: "dropped" }],
  [{ game: G.spiderMan2 }, { game: G.silksong, status: "playing" }, { game: G.rdr2, rating: 4.5 }, { game: G.persona5 }],
  [{ game: G.zelda, rating: 5 }, { game: G.gowr }, { game: G.yotei, status: "played", rating: 4 }, { game: G.discoElysium }],
];

export const FRIEND_ACTIVITY: { game: Game; who: Person; rating?: number; review?: boolean }[] = [
  { game: G.yotei, who: PEOPLE.maya, rating: 4.5, review: true },
  { game: G.hades2, who: PEOPLE.leo, rating: 5 },
  { game: G.ds2, who: PEOPLE.jordan, rating: 4, review: true },
  { game: G.silksong, who: PEOPLE.sam, rating: 4.5 },
  { game: G.re4, who: PEOPLE.ria, rating: 3.5, review: true },
  { game: G.bg3, who: PEOPLE.kai, rating: 5 },
  { game: G.celeste, who: PEOPLE.noor, rating: 4 },
  { game: G.witcher3, who: PEOPLE.theo, rating: 4.5, review: true },
];

export const NOW_PLAYING: { game: Game; who: Person }[] = [
  { game: G.wolverine, who: PEOPLE.ria },
  { game: G.gta6, who: PEOPLE.theo },
  { game: G.persona5, who: PEOPLE.noor },
  { game: G.stardew, who: PEOPLE.sam },
  { game: G.eldenRing, who: PEOPLE.kai },
  { game: G.itTakesTwo, who: PEOPLE.maya },
  { game: G.horizon, who: PEOPLE.leo },
  { game: G.cuphead, who: PEOPLE.jordan },
];

export const LOG_REVIEW =
  "Insomniac finally let Logan be Logan. The combat never lets up, and the last act is the best thing they've made.";

// Ghost of Yōtei's game page. Illustrative community numbers.
export const GAME_PAGE = {
  game: G.yotei,
  average: 4.3,
  ratings: 18420,
  histogram: [1, 1, 2, 3, 5, 9, 16, 24, 21, 18], // half-star buckets, ½ → 5
  friends: [
    { who: PEOPLE.maya, rating: 4.5 },
    { who: PEOPLE.leo, rating: 4 },
    { who: PEOPLE.jordan, rating: 5 },
    { who: PEOPLE.sam, rating: 3.5 },
  ],
  reviews: [
    { who: PEOPLE.maya, rating: 4.5, text: "Atsu's story hit harder than Jin's ever did. Every duel feels earned." },
    { who: PEOPLE.jordan, rating: 5, text: "Photo mode alone ate six hours of my weekend. No regrets." },
  ],
};

export const PROFILE = {
  who: PEOPLE.maya,
  bio: "RPGs, soulslikes, and anything with a good photo mode.",
  stats: [
    { value: 412, label: "games" },
    { value: 96, label: "reviews" },
    { value: 18, label: "lists" },
  ],
  top3: [G.eldenRing, G.discoElysium, G.tlou2],
  histogram: [0, 1, 2, 4, 6, 11, 19, 27, 18, 12],
  diary: [
    { date: "28 Sep", game: G.yotei, status: "played" as Status, rating: 4.5 },
    { date: "21 Sep", game: G.wolverine, status: "played" as Status, rating: 5 },
    { date: "14 Sep", game: G.hades2, status: "playing" as Status },
    { date: "02 Sep", game: G.ff7, status: "dropped" as Status, rating: 2.5 },
  ],
};

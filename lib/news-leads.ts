// Leads for the News Brain: platform newsrooms plus the major outlets,
// including the five whose RSS the app's News tab used to show directly.
// These are *leads only* — the Brain uses them to find stories worth
// covering, then verifies each one and writes its own article. Headlines and blurbs here are for triage and must never
// be copied into a PlayThruu article.

// tier 1 = the platform holder's own newsroom (enough to confirm a story
// on its own); tier 2 = established outlets (leads to verify).
const FEEDS = [
  { source: "PlayStation Blog", tier: 1, url: "https://blog.playstation.com/feed/" },
  { source: "Xbox Wire", tier: 1, url: "https://news.xbox.com/en-us/feed/" },
  { source: "Steam News", tier: 1, url: "https://store.steampowered.com/feeds/news/" },
  { source: "IGN", tier: 2, url: "https://feeds.ign.com/ign/games-all" },
  { source: "GameSpot", tier: 2, url: "https://www.gamespot.com/feeds/news/" },
  { source: "Eurogamer", tier: 2, url: "https://www.eurogamer.net/feed" },
  { source: "PC Gamer", tier: 2, url: "https://www.pcgamer.com/rss/" },
  { source: "Kotaku", tier: 2, url: "https://kotaku.com/rss" },
  { source: "VGC", tier: 2, url: "https://www.videogameschronicle.com/feed/" },
  { source: "Gematsu", tier: 2, url: "https://www.gematsu.com/feed" },
  { source: "Polygon", tier: 2, url: "https://www.polygon.com/rss/index.xml" },
  { source: "The Verge", tier: 2, url: "https://www.theverge.com/rss/games/index.xml" },
  { source: "GamesIndustry.biz", tier: 2, url: "https://www.gamesindustry.biz/feed" },
  { source: "Nintendo Life", tier: 2, url: "https://www.nintendolife.com/feeds/latest" },
  { source: "Game Informer", tier: 2, url: "https://www.gameinformer.com/news.xml" },
];

export type Lead = {
  source: string;
  tier: number;
  title: string;
  link: string;
  published_at: string | null;
  blurb: string;
};

const ENTITIES: Record<string, string> = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ",
};

function clean(raw: string) {
  return raw
    .replace(/^<!\[CDATA\[|\]\]>$/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&(#\d+|#x[0-9a-f]+|[a-z]+);/gi, (m, code: string) => {
      if (code[0] === "#") {
        const n = code[1] === "x" || code[1] === "X" ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
        return Number.isNaN(n) ? m : String.fromCodePoint(n);
      }
      return ENTITIES[code.toLowerCase()] ?? m;
    })
    .replace(/\s+/g, " ")
    .trim();
}

function tag(xml: string, name: string) {
  const m = xml.match(new RegExp("<" + name + "(?:\\s[^>]*)?>([\\s\\S]*?)</" + name + ">", "i"));
  return m ? clean(m[1]) : "";
}

function parseFeed(source: string, tier: number, xml: string): Lead[] {
  const items = xml.match(/<item[\s>][\s\S]*?<\/item>|<entry[\s>][\s\S]*?<\/entry>/gi) ?? [];
  return items.map(function (item) {
    // Atom links are an attribute, RSS links are element text.
    const atomLink = item.match(/<link[^>]+href=["']([^"']+)["']/i);
    const date = tag(item, "pubDate") || tag(item, "published") || tag(item, "updated");
    const parsed = date ? new Date(date) : null;
    return {
      source,
      tier,
      title: tag(item, "title"),
      link: tag(item, "link") || (atomLink ? atomLink[1] : ""),
      published_at: parsed && !Number.isNaN(parsed.getTime()) ? parsed.toISOString() : null,
      blurb: (tag(item, "description") || tag(item, "summary")).slice(0, 240),
    };
  });
}

export async function fetchLeads(sinceHours: number) {
  const since = Date.now() - sinceHours * 36e5;
  const results = await Promise.allSettled(
    FEEDS.map(async function ({ source, tier, url }) {
      const res = await fetch(url, {
        headers: { "User-Agent": "PlayThruuNewsBrain/1.0 (+https://playthruu.com/news)" },
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) throw new Error(source + " " + res.status);
      return parseFeed(source, tier, await res.text());
    }),
  );

  const failed: string[] = [];
  const leads: Lead[] = [];
  results.forEach(function (r, i) {
    if (r.status === "fulfilled") leads.push(...r.value);
    else failed.push(FEEDS[i].source);
  });

  return {
    failed_feeds: failed,
    leads: leads
      .filter((l) => l.title && l.link && (!l.published_at || Date.parse(l.published_at) >= since))
      .sort((a, b) => (b.published_at ?? "").localeCompare(a.published_at ?? "")),
  };
}

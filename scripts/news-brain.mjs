#!/usr/bin/env node
// CLI the News Brain uses to talk to the site's /api/news/brain endpoints.
//
//   node scripts/news-brain.mjs list                  # index of all articles (dedup check)
//   node scripts/news-brain.mjs get <slug>            # one article, full
//   node scripts/news-brain.mjs create <file.json>    # new story
//   node scripts/news-brain.mjs update <slug> <file.json>
//   node scripts/news-brain.mjs checked <slug>        # looked, nothing new
//
// Env: NEWS_BRAIN_TOKEN (required), NEWS_API_BASE (default https://playthruu.com)

import { readFileSync } from "node:fs";

const base = (process.env.NEWS_API_BASE || "https://playthruu.com").replace(/\/$/, "");
const token = process.env.NEWS_BRAIN_TOKEN;
if (!token) {
  console.error("NEWS_BRAIN_TOKEN is not set");
  process.exit(2);
}

const [cmd, a, b] = process.argv.slice(2);
const url = base + "/api/news/brain/articles" + (a && cmd !== "create" ? "/" + encodeURIComponent(a) : "");
const readJson = (p) => JSON.parse(readFileSync(p, "utf8"));

const requests = {
  list: () => ["GET", base + "/api/news/brain/articles"],
  get: () => ["GET", url],
  create: () => ["POST", base + "/api/news/brain/articles", readJson(a)],
  update: () => ["PATCH", url, readJson(b)],
  checked: () => ["PATCH", url, { checked: true }],
};

if (!requests[cmd]) {
  console.error("usage: list | get <slug> | create <file> | update <slug> <file> | checked <slug>");
  process.exit(2);
}

const [method, target, body] = requests[cmd]();
const res = await fetch(target, {
  method,
  headers: {
    authorization: "Bearer " + token,
    ...(body ? { "content-type": "application/json" } : {}),
  },
  body: body ? JSON.stringify(body) : undefined,
});
const text = await res.text();
console.log(res.status + " " + res.statusText);
try {
  console.log(JSON.stringify(JSON.parse(text), null, 2));
} catch {
  console.log(text);
}
process.exit(res.ok ? 0 : 1);

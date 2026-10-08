#!/usr/bin/env node
// Notify IndexNow engines (Bing/Copilot, Naver, Yandex, Seznam, Yep) of every URL in the
// live sitemap. Run after a deploy: `node scripts/indexnow.cjs` (or pass URLs to submit only those).
// The key file is public/<key>.txt and must already be live on https://jeanyoon.ch.
const fs = require("node:fs");
const path = require("node:path");

const HOST = "jeanyoon.ch";
const key = fs.readdirSync(path.join(__dirname, "../public")).find((f) => /^[0-9a-f]{32}\.txt$/.test(f))?.slice(0, -4);
if (!key) throw new Error("IndexNow key file missing from public/");

(async () => {
  const keyLive = await fetch(`https://${HOST}/${key}.txt`).then((r) => r.ok && r.text());
  if (keyLive?.trim() !== key) throw new Error("Key file is not live yet — deploy first.");
  let urls = process.argv.slice(2);
  if (!urls.length) {
    const xml = await fetch(`https://${HOST}/sitemap.xml`).then((r) => r.text());
    urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]).filter((u) => new URL(u).host === HOST);
    urls.push(`https://${HOST}/oi/feed.xml`, `https://${HOST}/llms.txt`);
  }
  urls = [...new Set(urls)];
  const body = JSON.stringify({ host: HOST, key, keyLocation: `https://${HOST}/${key}.txt`, urlList: urls });
  for (const endpoint of ["https://api.indexnow.org/indexnow", "https://searchadvisor.naver.com/indexnow"]) {
    const res = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json; charset=utf-8" }, body });
    console.log(`${endpoint}: HTTP ${res.status} (${urls.length} URLs)`);
  }
})().catch((error) => { console.error(error.message); process.exit(1); });

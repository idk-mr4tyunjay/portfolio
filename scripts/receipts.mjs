/*
  Build-time receipts — SPEC.md §7. Runs in `prebuild`.
  Checks every URL the data files link to, fetches the latest public commit
  date, and writes src/data/receipts.json. Never fails the build: a URL that
  does not answer is recorded as not live, with the last time it was seen.
*/

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const OUT = join(ROOT, "src/data/receipts.json");
const GITHUB_USER = "idk-mr4tyunjay";
const TIMEOUT_MS = 8000;

const previous = existsSync(OUT) ? JSON.parse(readFileSync(OUT, "utf8")) : { links: {} };

function urlsFrom(file) {
  const src = readFileSync(join(ROOT, file), "utf8");
  return [...src.matchAll(/https?:\/\/[^\s"'`)]+/g)].map((m) => m[0]);
}

const urls = [...new Set([...urlsFrom("src/data/projects.ts"), ...urlsFrom("src/data/experience.ts")])]
  // Social profiles and stores block bots; they are links, not claims.
  .filter((u) => !/linkedin\.com|x\.com|apps\.apple\.com|play\.google\.com|producthunt\.com/.test(u));

async function check(url) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    let res = await fetch(url, { method: "HEAD", redirect: "follow", signal: ctrl.signal });
    if (res.status === 405 || res.status === 403) {
      res = await fetch(url, { method: "GET", redirect: "follow", signal: ctrl.signal });
    }
    return { ok: res.ok, status: res.status };
  } catch {
    return { ok: false, status: 0 };
  } finally {
    clearTimeout(timer);
  }
}

async function latestCommit() {
  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USER}/events/public?per_page=50`, {
      headers: { Accept: "application/vnd.github+json", "User-Agent": "mruthunjay.xyz-receipts" },
    });
    if (!res.ok) return previous.commitAt ?? null;
    const events = await res.json();
    const push = events.find((e) => e.type === "PushEvent");
    return push ? push.created_at.slice(0, 10) : (previous.commitAt ?? null);
  } catch {
    return previous.commitAt ?? null;
  }
}

const today = new Date().toISOString().slice(0, 10);
const results = await Promise.all(urls.map(async (url) => [url, await check(url)]));

const links = {};
for (const [url, r] of results) {
  const prev = previous.links?.[url];
  links[url] = {
    ok: r.ok,
    status: r.status,
    checkedAt: today,
    lastSeen: r.ok ? today : (prev?.lastSeen ?? null),
  };
}

const receipts = { builtAt: today, commitAt: await latestCommit(), links };
writeFileSync(OUT, JSON.stringify(receipts, null, 2) + "\n");

const live = Object.values(links).filter((l) => l.ok).length;
console.log(`receipts: ${live}/${urls.length} links live, last commit ${receipts.commitAt ?? "unknown"}`);

import receipts from "@/data/receipts.json";
import type { Receipts } from "@/types";

/*
  Build-time receipts — SPEC.md §7. receipts.json is written by
  scripts/receipts.mjs in `prebuild`; nothing here fetches at runtime.
*/

export const RECEIPTS = receipts as Receipts;

/** Blue-dot check: did this URL answer at build time? */
export function isLive(url?: string): boolean {
  return Boolean(url && RECEIPTS.links[url]?.ok);
}

/** Every checked URL, and how many of them answered. */
export function liveCount(): { live: number; total: number } {
  const all = Object.values(RECEIPTS.links);
  return { live: all.filter((l) => l.ok).length, total: all.length };
}

/** "15 sep 2026" from an ISO date. */
export function shortDate(iso: string | null): string {
  if (!iso) return "unknown";
  const [y, m, d] = iso.split("-").map(Number);
  const month = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"][m - 1];
  return `${d} ${month} ${y}`;
}

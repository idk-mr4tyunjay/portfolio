"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { NoteMeta } from "@/types";
import { shortDate } from "@/lib/receipts";

/*
  Notes index — SPEC.md §4.5 applied to the full list. A tag filter
  (single-select, "all" by default) narrows the list; the search box filters
  within that by title, summary or tag. Dated, newest first.
*/

export function NotesIndex({ notes }: { notes: NoteMeta[] }) {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState("all");

  const allTags = useMemo(() => ["all", ...new Set(notes.flatMap((n) => n.tags))].sort((a, b) => (a === "all" ? -1 : b === "all" ? 1 : a.localeCompare(b))), [notes]);

  const q = query.trim().toLowerCase();
  const filtered = notes.filter((note) => {
    if (activeTag !== "all" && !note.tags.includes(activeTag)) return false;
    if (!q) return true;
    return note.title.toLowerCase().includes(q) || note.summary.toLowerCase().includes(q) || note.tags.some((t) => t.toLowerCase().includes(q));
  });

  return (
    <section aria-label="Notes" className="gutter relative pt-28 pb-16 sm:pt-36">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <h1 className="t-title m-0">What broke</h1>
        <p className="t-meta m-0">
          {notes.length} notes · dated, newest first
        </p>
      </div>

      <div className="mt-10 grid gap-5 border-t border-[var(--color-hairline)] pt-5 sm:grid-cols-[minmax(0,1fr)_320px] sm:gap-10">
        <div role="tablist" aria-label="Filter notes by topic" className="flex flex-wrap gap-x-5 gap-y-1">
          {allTags.map((tag) => (
            <button key={tag} type="button" role="tab" aria-selected={tag === activeTag} onClick={() => setActiveTag(tag)} className="filter-btn cursor-pointer" data-cursor="open">
              {tag}
            </button>
          ))}
        </div>
        <input
          id="notes-search"
          type="search"
          aria-label="Search notes"
          placeholder="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full border-0 border-b border-[var(--color-hairline)] bg-transparent py-1.5 text-[15px] outline-none focus-visible:border-[var(--color-fg)]"
        />
      </div>

      <ol className="m-0 mt-10 list-none p-0">
        {filtered.length === 0 && <li className="t-meta py-10">Nothing filed under that yet.</li>}
        {filtered.map((note) => (
          <li key={note.slug} className="border-t border-[var(--color-hairline)]">
            <Link href={`/notes/${note.slug}`} className="row grid-cols-1 gap-2 py-6 sm:grid-cols-[120px_minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-baseline sm:gap-8" data-cursor="open">
              <time dateTime={note.date} className="t-meta text-[var(--color-fg)]">
                {shortDate(note.date)}
              </time>
              <span className="row-name t-row-sm block max-w-[24ch]">{note.title}</span>
              <span className="max-w-[44ch] text-[15px] leading-[1.45] text-[var(--color-fg-muted)]">{note.summary}</span>
              <span className="t-meta sm:text-right">{note.tags.join(", ")}</span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}

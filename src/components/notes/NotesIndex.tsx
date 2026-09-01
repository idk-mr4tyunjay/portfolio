"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { NoteMeta } from "@/types";

/*
  Notes index. A tag-pill filter (single-select, "all" by default) narrows
  the list; the search box further filters within that by title/summary/tag.
  No dates are shown — the reader doesn't need them, sort order already
  handles recency.
*/

export function NotesIndex({ notes }: { notes: NoteMeta[] }) {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState("all");

  const allTags = useMemo(
    () => ["all", ...new Set(notes.flatMap((note) => note.tags))].sort((a, b) => (a === "all" ? -1 : b === "all" ? 1 : a.localeCompare(b))),
    [notes],
  );

  const q = query.trim().toLowerCase();
  const filtered = notes.filter((note) => {
    if (activeTag !== "all" && !note.tags.includes(activeTag)) return false;
    if (!q) return true;
    return (
      note.title.toLowerCase().includes(q) ||
      note.summary.toLowerCase().includes(q) ||
      note.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  });

  return (
    <section aria-label="Notes" className="relative px-5 pt-24 pb-16 sm:px-[30px]">
      <div className="flex flex-wrap justify-between gap-7">
        <p className="m-0 max-w-[30ch] text-[17px] leading-relaxed text-pretty" style={{ color: "var(--color-fg-secondary)" }}>
          Things that broke, and what I learned before they broke again.
        </p>
        <p
          className="m-0 text-right text-[10.5px] leading-[2] tracking-[0.18em] uppercase"
          style={{ fontFamily: "var(--font-mono)", color: "var(--color-fg-muted)" }}
        >
          {String(notes.length).padStart(2, "0")} notes so far
          <br />
          updated as I break things
        </p>
      </div>

      <div className="mt-5 overflow-hidden pb-[0.06em]">
        <h1 className="m-0 font-bold" style={{ fontSize: "clamp(56px,12.5vw,196px)", lineHeight: 0.8, letterSpacing: "-0.05em" }}>
          {"Notes".split("").map((letter, i) => (
            <span
              key={i}
              className="inline-block"
              style={{ animation: `letter-up 1s cubic-bezier(.16,1,.3,1) ${(0.05 * (i + 1)).toFixed(2)}s both` }}
            >
              {letter}
            </span>
          ))}
          <span
            className="ml-1 inline-block"
            style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, animation: "letter-up 1s cubic-bezier(.16,1,.3,1) .32s both" }}
          >
            .
          </span>
        </h1>
      </div>

      <div className="relative mt-3.5 pt-4">
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-px origin-left"
          style={{ background: "var(--color-hairline)", animation: "sweep-in 1.1s cubic-bezier(.16,1,.3,1) .5s both" }}
        />
        <div role="tablist" aria-label="Filter notes by topic" className="flex flex-wrap gap-2">
          {allTags.map((tag) => {
            const active = tag === activeTag;
            return (
              <button
                key={tag}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveTag(tag)}
                className="chip chip-btn cursor-pointer"
                style={active ? { color: "var(--color-bg)", background: "var(--color-fg)", borderColor: "var(--color-fg)" } : undefined}
              >
                {tag}
              </button>
            );
          })}
        </div>

        <input
          type="search"
          aria-label="Search notes"
          placeholder="search title, summary, tags…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="mt-5 w-full max-w-[420px] bg-transparent py-2.5 text-[15px] outline-none"
          style={{ fontFamily: "var(--font-mono)", color: "var(--color-fg)", borderBottom: "1px solid var(--color-hairline)" }}
        />
      </div>

      <div className="mt-6" style={{ borderTop: "1px solid var(--color-hairline)" }}>
        {filtered.length === 0 && (
          <p className="m-0 py-14 text-[22px]" style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", color: "var(--color-fg-secondary)" }}>
            Nothing filed under that topic yet.
          </p>
        )}
        {filtered.map((note, index) => (
          <Link
            key={note.slug}
            href={`/notes/${note.slug}`}
            className="note-index-row grid grid-cols-[36px_1fr_auto] items-baseline gap-4 py-6 sm:grid-cols-[52px_minmax(0,1.7fr)_minmax(0,1.3fr)_150px_26px] sm:gap-6"
            style={{ borderBottom: "1px solid var(--color-hairline)" }}
          >
            <span className="text-[34px] leading-[0.9] font-bold" style={{ color: "transparent", WebkitTextStroke: "1px var(--color-hairline)" }}>
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="text-pretty" style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(21px,2.4vw,30px)", lineHeight: 1.12, letterSpacing: "-0.01em" }}>
              {note.title}
            </span>
            <span className="col-span-2 hidden text-[14px] leading-relaxed text-pretty sm:col-span-1 sm:block" style={{ color: "var(--color-fg-secondary)" }}>
              {note.summary}
            </span>
            <span className="hidden flex-wrap gap-1.5 sm:flex">
              {note.tags.map((tag) => (
                <span key={tag} className="text-[9.5px] tracking-[0.12em] uppercase" style={{ fontFamily: "var(--font-mono)", color: "var(--color-fg-muted)" }}>
                  {tag}
                </span>
              ))}
            </span>
            <span className="justify-self-end text-[13px] opacity-65 sm:justify-self-auto" style={{ fontFamily: "var(--font-mono)" }}>
              →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

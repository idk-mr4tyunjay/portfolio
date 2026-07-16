"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { NoteMeta } from "@/types";

/*
  Instant search. The full note index arrives serialized from the
  server; filtering is a plain array scan (hundreds of notes = still instant).
  Matches across title, summary, and tags; tag chips narrow further.
*/

export function NotesIndex({ notes }: { notes: NoteMeta[] }) {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const allTags = useMemo(
    () => [...new Set(notes.flatMap((note) => note.tags))].sort(),
    [notes],
  );

  const q = query.trim().toLowerCase();
  const filtered = notes.filter((note) => {
    if (activeTag && !note.tags.includes(activeTag)) return false;
    if (!q) return true;
    return (
      note.title.toLowerCase().includes(q) ||
      note.summary.toLowerCase().includes(q) ||
      note.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  });

  return (
    <section aria-label="Notes" className="pt-16 pb-20">
      <h1
        className="fade-up m-0"
        style={{ fontSize: "clamp(32px, 5vw, 44px)", fontWeight: 500, letterSpacing: "-0.02em" }}
      >
        notes
      </h1>
      <p
        className="fade-up mt-2 mb-8 text-[13px]"
        style={{
          fontFamily: "var(--font-mono)",
          color: "var(--color-fg-muted)",
          animationDelay: "0.05s",
        }}
      >
        things that broke, and what I learned before they broke again, {notes.length} so far
      </p>

      <input
        type="search"
        aria-label="Search notes"
        placeholder="search title, summary, tags…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="fade-up w-full bg-transparent py-3 text-[16px] outline-none"
        style={{
          fontFamily: "var(--font-mono)",
          color: "var(--color-fg)",
          borderBottom: "1px solid var(--color-hairline)",
          animationDelay: "0.1s",
        }}
      />

      {allTags.length > 0 && (
        <div className="fade-up mt-4 flex flex-wrap gap-1.5" style={{ animationDelay: "0.15s" }}>
          {allTags.map((tag) => {
            const active = tag === activeTag;
            return (
              <button
                key={tag}
                type="button"
                onClick={() => setActiveTag(active ? null : tag)}
                aria-pressed={active}
                className="chip chip-btn cursor-pointer"
                style={
                  active
                    ? {
                        color: "var(--color-bg)",
                        background: "var(--color-accent)",
                        borderColor: "var(--color-accent)",
                      }
                    : undefined
                }
              >
                {tag}
              </button>
            );
          })}
        </div>
      )}

      <ul className="mt-8" style={{ borderTop: "1px solid var(--color-hairline)" }}>
        {filtered.length === 0 && (
          <li
            className="py-8 text-[13px]"
            style={{ fontFamily: "var(--font-mono)", color: "var(--color-fg-muted)" }}
          >
            nothing matches. fewer letters, clear the tag, or maybe I just haven&apos;t broken that one yet
          </li>
        )}
        {filtered.map((note) => (
          <li
            key={note.slug}
            style={{ borderBottom: "1px solid var(--color-hairline)" }}
          >
            <Link href={`/notes/${note.slug}`} className="work-row block">
              <span className="flex items-baseline gap-4">
                <span className="work-name flex-1 text-[16px] font-medium">
                  {note.title}
                </span>
                <span
                  className="text-xs"
                  style={{ fontFamily: "var(--font-mono)", color: "var(--color-fg-muted)" }}
                >
                  {note.date}
                </span>
              </span>
              <span
                className="mt-1 block text-[13.5px] leading-relaxed"
                style={{ color: "var(--color-fg-body)" }}
              >
                {note.summary}
              </span>
              {note.tags.length > 0 && (
                <span className="mt-3 flex flex-wrap gap-1.5">
                  {note.tags.map((tag) => (
                    <span key={tag} className="chip">
                      {tag}
                    </span>
                  ))}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

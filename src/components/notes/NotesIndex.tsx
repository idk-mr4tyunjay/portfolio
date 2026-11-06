"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { NoteMeta } from "@/types";
import styles from "./Notes.module.css";

type NoteWithReadingTime = NoteMeta & { read: string };

export function NotesIndex({ notes }: { notes: NoteWithReadingTime[] }) {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState("all");
  const allTags = useMemo(
    () => ["all", ...Array.from(new Set(notes.flatMap((note) => note.tags))).sort()],
    [notes],
  );
  const search = query.trim().toLowerCase();
  const filtered = notes.filter((note) => {
    if (activeTag !== "all" && !note.tags.includes(activeTag)) return false;
    return !search || `${note.title} ${note.summary} ${note.tags.join(" ")}`.toLowerCase().includes(search);
  });

  function clearFilters() {
    setQuery("");
    setActiveTag("all");
  }

  return (
    <section aria-labelledby="notes-title" className={styles.archive}>
      <header>
        <Link href="/" className={styles.backLink}><span aria-hidden="true">←</span> Back to the portfolio</Link>
        <div className={styles.archiveIntro}>
          <h1 id="notes-title">Working notes.</h1>
          <p>Things I&apos;ve learned while building for the web.<br />Written down before I forget them.</p>
        </div>
        <div className={styles.archiveCaption}>
          <span>A small, growing collection</span>
          <span>{String(notes.length).padStart(2, "0")} notes in the notebook</span>
        </div>
      </header>

      <div className={styles.archiveBody}>
        <aside className={styles.filters} aria-label="Find a note">
          <label htmlFor="note-search" className={styles.filterLabel}>Find something</label>
          <div className={styles.searchField}>
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" width="18" height="18">
              <circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="m15.5 15.5 4.5 4.5" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <input id="note-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search notes" />
          </div>
          <div className={styles.topicFilter}>
            <p className={styles.filterLabel}>Browse by topic</p>
            <div role="group" aria-label="Filter notes by topic" className={styles.tags}>
              {allTags.map((tag) => (
                <button key={tag} type="button" aria-pressed={activeTag === tag} onClick={() => setActiveTag(tag)}>
                  {tag === "all" ? "All notes" : tag}
                  {tag === "all" && <span>{notes.length}</span>}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div>
          <p className={styles.resultCount} role="status" aria-live="polite">
            {filtered.length === notes.length ? "The latest entries" : `${filtered.length} ${filtered.length === 1 ? "note" : "notes"} found`}
          </p>
          {filtered.length === 0 ? (
            <div className={styles.empty}>
              <h2>No notes found.</h2>
              <p>Try a different search or browse all topics.</p>
              <button type="button" onClick={clearFilters}>Clear filters <span aria-hidden="true">↗</span></button>
            </div>
          ) : (
            <div>
              {filtered.map((note) => (
                <Link key={note.slug} href={`/notes/${note.slug}`} className={styles.archiveNote}>
                  <div className={styles.noteMeta}>
                    <span>{note.tags.join(" / ")}</span>
                    <span>{note.read} read</span>
                  </div>
                  <h2>{note.title}</h2>
                  <p>{note.summary}</p>
                  <span className={styles.readLink}>Read note <span aria-hidden="true">↗</span></span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

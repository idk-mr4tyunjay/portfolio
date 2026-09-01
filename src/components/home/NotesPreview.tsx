import Link from "next/link";
import { getAllNotesWithReadingTime } from "@/lib/notes";
import { SectionHeader } from "./SectionHeader";

/*
  Recent notes, numbered-row style. Real content from content/notes/*.md via
  getAllNotesWithReadingTime() — the mockup's row layout with real data.
*/

export function NotesPreview() {
  const notes = getAllNotesWithReadingTime().slice(0, 3);
  if (notes.length === 0) return null;

  return (
    <section id="notes" aria-label="Notes" className="relative px-5 pt-20 sm:px-[30px]">
      <SectionHeader id="notes" number="04" label="notes" tagline="things I worked out the hard way" />

      {notes.map((note, index) => (
        <Link
          key={note.slug}
          href={`/notes/${note.slug}`}
          className="note-index-row grid grid-cols-[36px_1fr_auto] items-baseline gap-4 py-5 sm:grid-cols-[52px_minmax(0,1fr)_140px_60px_60px] sm:gap-5"
          style={{ borderTop: "1px solid var(--color-hairline)" }}
        >
          <span
            className="text-[34px] leading-[0.9] font-bold"
            style={{ color: "transparent", WebkitTextStroke: "1px var(--color-hairline)" }}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <span
            className="text-pretty"
            style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(22px,2.7vw,34px)", lineHeight: 1.12, letterSpacing: "-0.01em" }}
          >
            {note.title}
          </span>
          <span
            className="hidden text-[10px] tracking-[0.14em] uppercase sm:inline"
            style={{ fontFamily: "var(--font-mono)", color: "var(--color-fg-muted)" }}
          >
            {note.tags[0] ?? "note"}
          </span>
          <span
            className="text-right text-[10px] tracking-[0.14em] uppercase"
            style={{ fontFamily: "var(--font-mono)", color: "var(--color-fg-muted)" }}
          >
            {note.read}
          </span>
          <span
            className="hidden items-baseline justify-end gap-1.5 text-[9.5px] font-medium tracking-[0.16em] uppercase opacity-65 sm:flex"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            <span>read</span>
            <span className="text-[13px]">→</span>
          </span>
        </Link>
      ))}

      <div
        className="flex flex-wrap items-baseline justify-between gap-4 py-4"
        style={{ borderTop: "1px solid var(--color-hairline)" }}
      >
        <span className="text-[10px] tracking-[0.16em] uppercase" style={{ fontFamily: "var(--font-mono)", color: "var(--color-fg-muted)" }}>
          notes are written as I break things
        </span>
        <Link href="/notes" className="quiet-link text-[10.5px] tracking-[0.2em] uppercase" style={{ fontFamily: "var(--font-mono)" }}>
          all notes →
        </Link>
      </div>
    </section>
  );
}

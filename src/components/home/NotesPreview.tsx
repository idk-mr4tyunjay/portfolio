import Link from "next/link";
import { getAllNotes } from "@/lib/notes";
import { SectionLabel } from "./SectionLabel";

export function NotesPreview() {
  const notes = getAllNotes().slice(0, 3);
  if (notes.length === 0) return null;

  return (
    <section aria-label="Recent notes" className="pb-20">
      <SectionLabel delay="0.3s">recent notes</SectionLabel>
      <ul>
        {notes.map((note, index) => (
          <li
            key={note.slug}
            className="fade-up"
            style={{ animationDelay: `${0.35 + index * 0.06}s` }}
          >
            <Link href={`/notes/${note.slug}`} className="work-row note-row block">
              <span className="flex items-baseline gap-4">
                <span className="work-name flex-1 text-[15px] font-medium">
                  {note.title}
                </span>
                <span
                  className="text-xs"
                  style={{ fontFamily: "var(--font-mono)", color: "var(--color-fg-muted)" }}
                >
                  {note.date}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="fade-up mt-4 text-[13px]" style={{ animationDelay: "0.5s" }}>
        <Link href="/notes" className="quiet-link arrow-link">
          all notes <span className="arrow">→</span>
        </Link>
      </p>
    </section>
  );
}

import Link from "next/link";
import { getAllNotes } from "@/lib/notes";
import { shortDate } from "@/lib/receipts";
import { Warli } from "./Warli";

/*
  Notes, what broke — SPEC.md §4.5. A dated list, newest first, with the
  tangle drawn behind it (Roots.tsx) and the Warli figure under the tangle.
*/

export function NotesPreview() {
  const notes = getAllNotes().slice(0, 5);
  if (notes.length === 0) return null;

  return (
    <section id="notes" aria-label="Notes" className="gutter relative pt-24 pb-16 sm:pt-32 sm:pb-24">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4 sm:mb-12">
        <h2 className="t-title m-0">What broke</h2>
        <Link href="/notes" className="link text-[15px]" data-cursor="open">
          all notes
        </Link>
      </div>

      <ol className="m-0 list-none p-0">
        {notes.map((note) => (
          <li key={note.slug} className="border-t border-[var(--color-hairline)]">
            <Link
              href={`/notes/${note.slug}`}
              className="row grid-cols-1 gap-2 py-5 sm:grid-cols-[120px_minmax(0,1fr)_auto] sm:items-baseline sm:gap-8"
              data-cursor="open"
            >
              <time dateTime={note.date} className="t-meta text-[var(--color-fg)]">
                {shortDate(note.date)}
              </time>
              <span className="row-name t-row-sm block max-w-[26ch]">{note.title}</span>
              <span className="t-meta sm:text-right">{note.tags.join(", ")}</span>
            </Link>
          </li>
        ))}
      </ol>

      <div className="mt-16 grid justify-end border-t border-[var(--color-hairline)] pt-6 sm:mt-24">
        <Warli />
      </div>
    </section>
  );
}

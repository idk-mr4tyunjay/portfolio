import Link from "next/link";
import { getAllNotesWithReadingTime } from "@/lib/notes";
import styles from "./LowerSections.module.css";

export function NotesPreview() {
  const notes = getAllNotesWithReadingTime().slice(0, 3);
  if (notes.length === 0) return null;

  return (
    <section id="notes" aria-labelledby="notes-heading" className={styles.notes}>
      <div className={`${styles.inner} ${styles.notesLayout}`}>
        <div className={styles.notesIntro}>
          <p className={styles.eyebrow}>From the notebook</p>
          <h2 id="notes-heading" className={styles.notesHeading}>Things worth<br />writing down.</h2>
          <p>Small discoveries, stubborn bugs, and the bits I want to remember.</p>
          <Link href="/notes" className={styles.textLink}>
            All notes <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <div>
          {notes.map((note) => (
            <Link key={note.slug} href={`/notes/${note.slug}`} className={styles.noteLink}>
              <div className={styles.noteMeta}>
                <span>{note.tags[0] ?? "note"}</span>
                <span>{note.read} read</span>
              </div>
              <h3>{note.title}</h3>
              <p>{note.summary}</p>
              <span aria-hidden="true" className={styles.noteArrow}>↗</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

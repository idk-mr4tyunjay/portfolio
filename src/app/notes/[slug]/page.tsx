import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Nav } from "@/components/home/Nav";
import { Footer } from "@/components/home/Footer";
import { JsonLd } from "@/components/JsonLd";
import { getAllNotes, getAllNotesWithReadingTime, getNote } from "@/lib/notes";
import styles from "@/components/notes/Notes.module.css";
import { OG_IMAGE } from "@/lib/seo";
import { SITE } from "@/data/site";

export function generateStaticParams() {
  return getAllNotes().map((note) => ({ slug: note.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const note = getNote((await params).slug);
  if (!note) return {};
  const url = `/notes/${note.meta.slug}`;
  const description = note.meta.summary || undefined;
  return {
    title: note.meta.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: note.meta.title,
      description,
      type: "article",
      url,
      siteName: SITE.name,
      locale: "en_US",
      publishedTime: note.meta.date,
      tags: note.meta.tags,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: note.meta.title,
      description,
      images: [OG_IMAGE],
    },
  };
}

export default async function NotePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const note = getNote((await params).slug);
  if (!note) notFound();
  const notes = getAllNotesWithReadingTime();
  const noteIndex = notes.findIndex((item) => item.slug === note.meta.slug);
  const nextNote = notes.length > 1 ? notes[(noteIndex + 1) % notes.length] : null;
  const date = new Intl.DateTimeFormat("en-GB", {
    day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
  }).format(new Date(`${note.meta.date}T00:00:00Z`));

  return (
    <div id="top">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: note.meta.title,
          description: note.meta.summary || undefined,
          datePublished: note.meta.date,
          url: `${SITE.url}/notes/${note.meta.slug}`,
          keywords: note.meta.tags.join(", ") || undefined,
          author: {
            "@type": "Person",
            name: SITE.name,
            url: SITE.url,
          },
        }}
      />
      <Nav />
      <main id="main-content" className={styles.reader}>
        <article>
          <header className={styles.articleHeader}>
            <Link href="/notes" className={styles.backLink}><span aria-hidden="true">←</span> All notes</Link>
            <div className={styles.articleMeta}>
              <time dateTime={note.meta.date}>{date}</time>
              <span>{notes[noteIndex]?.read ?? "A short"} read</span>
            </div>
            <h1>{note.meta.title}</h1>
            {note.meta.summary && <p className={styles.articleSummary}>{note.meta.summary}</p>}
          </header>
          <div className={styles.readingLayout}>
            <aside className={styles.articleAside} aria-label="About this note">
              <span className={styles.authorMark} aria-hidden="true">m.</span>
              <p>{SITE.name}</p>
              <span>Developer &amp; curious person</span>
              <div className={styles.articleTags}>
                {note.meta.tags.map((tag) => <span key={tag}>{tag}</span>)}
              </div>
            </aside>
            <div>
              <div className={styles.prose} dangerouslySetInnerHTML={{ __html: note.html }} />
              <div className={styles.articleEnd}>
                <span aria-hidden="true">✳</span>
                <p>Found something I missed?<br /><a href={`mailto:${SITE.email}?subject=${encodeURIComponent(note.meta.title)}`}>I&apos;d love to hear it.</a></p>
              </div>
              {nextNote && (
                <Link href={`/notes/${nextNote.slug}`} className={styles.nextNote}>
                  <span>Another page in the notebook</span>
                  <h2>{nextNote.title}</h2>
                  <span aria-hidden="true" className={styles.nextArrow}>↗</span>
                </Link>
              )}
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}

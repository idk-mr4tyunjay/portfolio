import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Nav } from "@/components/home/Nav";
import { Footer } from "@/components/home/Footer";
import { getAllNotes, getNote } from "@/lib/notes";

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
  return {
    title: `${note.meta.title} — Mruthunjay`,
    description: note.meta.summary,
  };
}

export default async function NotePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const note = getNote((await params).slug);
  if (!note) notFound();

  return (
    <div className="mx-auto max-w-[720px] px-6">
      <Nav />
      <main>
        <article className="pt-16 pb-20">
          <Link
            href="/notes"
            className="quiet-link text-[13px]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            ← notes
          </Link>
          <h1
            className="mt-6 mb-3"
            style={{
              fontSize: "clamp(28px, 4.5vw, 40px)",
              fontWeight: 500,
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
            }}
          >
            {note.meta.title}
          </h1>
          <p
            className="mb-10 text-xs"
            style={{ fontFamily: "var(--font-mono)", color: "var(--color-fg-muted)" }}
          >
            {note.meta.date}
            {note.meta.tags.length > 0 && <> · {note.meta.tags.join(" · ")}</>}
          </p>
          <div
            className="note-prose"
            dangerouslySetInnerHTML={{ __html: note.html }}
          />
        </article>
      </main>
      <Footer />
    </div>
  );
}

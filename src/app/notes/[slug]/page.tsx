import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Nav } from "@/components/home/Nav";
import { Footer } from "@/components/home/Footer";
import { JsonLd } from "@/components/JsonLd";
import { getAllNotes, getNote } from "@/lib/notes";
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

  return (
    <>
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
      <main>
        <article className="mx-auto max-w-[720px] px-5 pt-24 pb-20 sm:px-6">
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
              fontWeight: 600,
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
            }}
          >
            {note.meta.title}
          </h1>
          {note.meta.tags.length > 0 && (
            <p
              className="mb-10 text-xs"
              style={{ fontFamily: "var(--font-mono)", color: "var(--color-fg-muted)" }}
            >
              {note.meta.tags.join(" · ")}
            </p>
          )}
          <div
            className="note-prose"
            dangerouslySetInnerHTML={{ __html: note.html }}
          />
        </article>
      </main>
      <Footer />
    </>
  );
}

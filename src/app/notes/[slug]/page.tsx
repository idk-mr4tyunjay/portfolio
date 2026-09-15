import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Nav } from "@/components/home/Nav";
import { Footer } from "@/components/home/Footer";
import { JsonLd } from "@/components/JsonLd";
import { getAllNotes, getNote } from "@/lib/notes";
import { OG_IMAGE } from "@/lib/seo";
import { SITE } from "@/data/site";
import { shortDate } from "@/lib/receipts";

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
        <article className="gutter max-w-[880px] pt-28 pb-20 sm:pt-36">
          <Link href="/notes" className="link text-[15px]" data-cursor="open">
            all notes
          </Link>
          <h1 className="t-row mt-8 mb-4 max-w-[18ch] text-balance">{note.meta.title}</h1>
          <p className="t-meta mb-12 flex flex-wrap gap-x-4">
            <time dateTime={note.meta.date}>{shortDate(note.meta.date)}</time>
            {note.meta.tags.length > 0 && <span>{note.meta.tags.join(", ")}</span>}
          </p>
          <div className="note-prose" dangerouslySetInnerHTML={{ __html: note.html }} />
        </article>
      </main>
      <Footer />
    </>
  );
}

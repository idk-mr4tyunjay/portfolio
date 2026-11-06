import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Nav } from "@/components/home/Nav";
import { Footer } from "@/components/home/Footer";
import { JsonLd } from "@/components/JsonLd";
import { ProjectDetail } from "@/components/work/ProjectDetail";
import { WORK_ENTRIES, getWorkEntry } from "@/data/work";
import { SITE } from "@/data/site";
import { OG_IMAGE } from "@/lib/seo";

type PageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return WORK_ENTRIES.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const entry = getWorkEntry((await params).slug);
  if (!entry) notFound();

  return {
    title: entry.name,
    description: entry.summary,
    alternates: { canonical: `/work/${entry.slug}` },
    openGraph: {
      title: entry.name,
      description: entry.summary,
      url: `${SITE.url}/work/${entry.slug}`,
      type: "article",
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: entry.name,
      description: entry.summary,
      images: [OG_IMAGE],
    },
  };
}

export default async function WorkPage({ params }: PageProps) {
  const entry = getWorkEntry((await params).slug);
  if (!entry) notFound();
  const next = WORK_ENTRIES[(WORK_ENTRIES.indexOf(entry) + 1) % WORK_ENTRIES.length];

  return (
    <div id="top">
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        name: entry.name,
        description: entry.summary,
        url: `${SITE.url}/work/${entry.slug}`,
        author: { "@type": "Person", name: SITE.name, url: SITE.url },
      }} />
      <Nav />
      <main id="main-content">
        <ProjectDetail entry={entry} next={next} />
      </main>
      <Footer />
    </div>
  );
}

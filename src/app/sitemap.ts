import type { MetadataRoute } from "next";
import { SITE } from "@/data/site";
import { getAllNotes } from "@/lib/notes";

/*
  Sitemap — generated at build. Static routes + every note.
  Served at /sitemap.xml and referenced from robots.ts.
*/

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const notes: MetadataRoute.Sitemap = getAllNotes().map((note) => ({
    url: `${SITE.url}/notes/${note.slug}`,
    lastModified: note.date ? new Date(note.date) : now,
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [
    {
      url: SITE.url,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE.url}/notes`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...notes,
  ];
}

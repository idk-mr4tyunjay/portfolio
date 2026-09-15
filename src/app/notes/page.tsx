import type { Metadata } from "next";
import { Nav } from "@/components/home/Nav";
import { Footer } from "@/components/home/Footer";
import { NotesIndex } from "@/components/notes/NotesIndex";
import { SITE } from "@/data/site";
import { getAllNotes } from "@/lib/notes";
import { OG_IMAGE } from "@/lib/seo";

const DESCRIPTION = "Dated notes on what broke and what I learned.";

export const metadata: Metadata = {
  title: "notes",
  description: DESCRIPTION,
  alternates: { canonical: "/notes" },
  openGraph: {
    title: "notes",
    description: DESCRIPTION,
    url: "/notes",
    type: "website",
    siteName: SITE.name,
    locale: "en_US",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "notes",
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
};

export default function NotesPage() {
  return (
    <>
      <Nav />
      <main>
        <NotesIndex notes={getAllNotes()} />
        <section aria-label="Contact" className="gutter pt-10 pb-12">
          <div className="grid gap-6 border-t border-[var(--color-hairline)] pt-6 sm:grid-cols-[minmax(0,1fr)_auto]">
            <a href={`mailto:${SITE.email}`} className="t-row-sm link justify-self-start" data-cursor="open">
              {SITE.email}
            </a>
            <ul className="m-0 flex list-none flex-wrap gap-x-6 gap-y-2 p-0 text-[15px]">
              <li>
                <a href={SITE.github} target="_blank" rel="noreferrer" className="link" data-cursor="open">
                  github
                </a>
              </li>
              <li>
                <a href={SITE.linkedin} target="_blank" rel="noreferrer" className="link" data-cursor="open">
                  linkedin
                </a>
              </li>
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

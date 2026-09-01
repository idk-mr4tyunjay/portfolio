import type { Metadata } from "next";
import { Nav } from "@/components/home/Nav";
import { Footer } from "@/components/home/Footer";
import { NotesIndex } from "@/components/notes/NotesIndex";
import { SITE } from "@/data/site";
import { getAllNotes } from "@/lib/notes";
import { OG_IMAGE } from "@/lib/seo";

const DESCRIPTION = "Things I learned, written down.";

export const metadata: Metadata = {
  title: "notes",
  description: DESCRIPTION,
  alternates: { canonical: "/notes" },
  openGraph: {
    title: "notes",
    description: DESCRIPTION,
    url: "/notes",
    type: "website",
    siteName: "Mruthunjay",
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
        <section aria-label="Contact" className="relative overflow-hidden px-5 pt-6 pb-9 sm:px-[30px]">
          <span className="text-[10.5px] tracking-[0.2em] uppercase" style={{ fontFamily: "var(--font-mono)", color: "var(--color-fg-muted)" }}>
            contact
          </span>
          <h2 className="mt-6 font-bold" style={{ fontSize: "clamp(46px,11vw,180px)", lineHeight: 0.8, letterSpacing: "-0.055em" }}>
            Have something
            <br />
            <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400 }}>to build?</span>
          </h2>
          <div
            className="mt-11 grid gap-7 pt-5"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", borderTop: "1px solid var(--color-hairline)" }}
          >
            <p className="m-0 max-w-[34ch] text-[16px] leading-relaxed text-pretty" style={{ color: "var(--color-fg-secondary)" }}>
              Or you&apos;re just here to inspect-element the CSS. Either way, hi.
            </p>
            <div className="flex flex-col items-start gap-2 text-[11px] tracking-[0.16em] uppercase" style={{ fontFamily: "var(--font-mono)" }}>
              <a href={SITE.linkedin} target="_blank" rel="noreferrer" className="quiet-link">
                linkedin ↗
              </a>
              <a href={SITE.github} target="_blank" rel="noreferrer" className="quiet-link">
                github ↗
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

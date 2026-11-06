import type { Metadata } from "next";
import { Nav } from "@/components/home/Nav";
import { Footer } from "@/components/home/Footer";
import { NotesIndex } from "@/components/notes/NotesIndex";
import { Contact } from "@/components/home/Contact";
import { getAllNotesWithReadingTime } from "@/lib/notes";
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
    <div id="top">
      <Nav />
      <main id="main-content">
        <NotesIndex notes={getAllNotesWithReadingTime()} />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

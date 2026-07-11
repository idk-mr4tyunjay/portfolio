import type { Metadata } from "next";
import { Nav } from "@/components/home/Nav";
import { Footer } from "@/components/home/Footer";
import { NotesIndex } from "@/components/notes/NotesIndex";
import { getAllNotes } from "@/lib/notes";

export const metadata: Metadata = {
  title: "notes — Mruthunjay",
  description: "Things I learned, written down.",
};

export default function NotesPage() {
  return (
    <div className="mx-auto max-w-[820px] px-6">
      <Nav />
      <main>
        <NotesIndex notes={getAllNotes()} />
      </main>
      <Footer />
    </div>
  );
}

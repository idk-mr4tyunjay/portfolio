import { Nav } from "@/components/home/Nav";
import { Hero } from "@/components/home/Hero";
import { Now } from "@/components/home/Now";
import { WorkList } from "@/components/home/WorkList";
import { NotesPreview } from "@/components/home/NotesPreview";
import { Footer } from "@/components/home/Footer";

export default function Home() {
  return (
    <div className="mx-auto max-w-[820px] px-6">
      <Nav />
      <main>
        <Hero />
        <Now />
        <WorkList />
        <NotesPreview />
      </main>
      <Footer />
    </div>
  );
}

import { Nav } from "@/components/home/Nav";
import { Hero } from "@/components/home/Hero";
import { WorkList } from "@/components/home/WorkList";
import { Footer } from "@/components/home/Footer";

export default function Home() {
  return (
    <div className="mx-auto max-w-[820px] px-6">
      <Nav />
      <main>
        <Hero />
        <WorkList />
      </main>
      <Footer />
    </div>
  );
}

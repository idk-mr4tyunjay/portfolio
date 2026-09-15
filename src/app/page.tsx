import { Nav } from "@/components/home/Nav";
import { Hero } from "@/components/home/Hero";
import { Trunk } from "@/components/home/Trunk";
import { WorkRows } from "@/components/home/WorkRows";
import { About } from "@/components/home/About";
import { Roots } from "@/components/home/Roots";
import { SideRows } from "@/components/home/SideRows";
import { NotesPreview } from "@/components/home/NotesPreview";
import { Contact } from "@/components/home/Contact";
import { Footer } from "@/components/home/Footer";
import { JsonLd } from "@/components/JsonLd";
import { SITE } from "@/data/site";

/*
  Home — SPEC.md §4. Canopy (work) above, calm (about) between, roots (side
  projects falling into notes) below, then everything resolves to one dot.
*/

export default function Home() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Person",
              name: SITE.name,
              url: SITE.url,
              jobTitle: SITE.role,
              email: `mailto:${SITE.email}`,
              sameAs: [SITE.github, SITE.linkedin, SITE.producthunt],
            },
            {
              "@type": "WebSite",
              name: SITE.name,
              url: SITE.url,
            },
          ],
        }}
      />
      <Nav />
      <main className="relative">
        <Trunk />
        <Hero />
        <WorkRows />
        <About />
        <Roots>
          <SideRows />
          <NotesPreview />
        </Roots>
        <Contact />
      </main>
      <Footer />
    </>
  );
}

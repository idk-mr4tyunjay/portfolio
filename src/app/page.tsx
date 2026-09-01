import { Nav } from "@/components/home/Nav";
import { Hero } from "@/components/home/Hero";
import { WorkIndex } from "@/components/home/WorkIndex";
import { SideProjects } from "@/components/home/SideProjects";
import { About } from "@/components/home/About";
import { NotesPreview } from "@/components/home/NotesPreview";
import { Contact } from "@/components/home/Contact";
import { Footer } from "@/components/home/Footer";
import { JsonLd } from "@/components/JsonLd";
import { SITE } from "@/data/site";

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
      <main>
        <Hero />
        <WorkIndex />
        <SideProjects />
        <About />
        <NotesPreview />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

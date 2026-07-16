import { Nav } from "@/components/home/Nav";
import { Hero } from "@/components/home/Hero";
import { Now } from "@/components/home/Now";
import { About } from "@/components/home/About";
import { WorkExperience } from "@/components/home/WorkExperience";
import { SideProjects } from "@/components/home/SideProjects";
import { NotesPreview } from "@/components/home/NotesPreview";
import { Footer } from "@/components/home/Footer";
import { JsonLd } from "@/components/JsonLd";
import { SITE } from "@/data/site";

export default function Home() {
  return (
    <div className="mx-auto max-w-[820px] px-6">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Person",
              name: SITE.name,
              url: SITE.url,
              jobTitle: SITE.role,
              sameAs: [SITE.github, SITE.linkedin],
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
        <Now />
        <About />
        <WorkExperience />
        <SideProjects />
        <NotesPreview />
      </main>
      <Footer />
    </div>
  );
}

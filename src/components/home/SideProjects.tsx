import { PROJECTS } from "@/data/projects";
import { EntryList } from "./EntryList";

export function SideProjects() {
  return (
    <EntryList
      id="projects"
      label={`side projects (${PROJECTS.length})`}
      entries={PROJECTS.map((p) => ({
        title: p.name,
        meta: p.year,
        description: p.description,
        url: p.url,
        tags: p.tech,
        links: p.links,
      }))}
    />
  );
}

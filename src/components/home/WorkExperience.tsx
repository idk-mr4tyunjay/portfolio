import { EXPERIENCE } from "@/data/experience";
import { EntryList } from "./EntryList";

export function WorkExperience() {
  return (
    <EntryList
      id="work"
      label="work experience"
      entries={EXPERIENCE.map((e) => ({
        title: `${e.role} · ${e.company}`,
        meta: e.period,
        description: e.description,
        url: e.url,
        tags: e.tech,
        links: e.links,
      }))}
    />
  );
}

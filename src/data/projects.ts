import type { Project } from "@/types";

/*
  Scene 06: Missions — exactly 3 projects.
  Planet colors mapped 1:1 to 04-SCENE-SPECIFICATIONS.md §SCENE 06 (Planet 1/2/3).
*/

export const PROJECTS: readonly Project[] = [
  {
    id: "project_1",
    name: "Project One",
    description: "Primary project description — replace before launch.",
    whatItDoes: "What it does, why it matters.",
    techStack: ["TypeScript", "React"],
    keyLesson: "What you learned building this.",
    link: "https://example.com",
    linkText: "View Project",
    planetColor: "var(--color-plasma-cyan)",
  },
  {
    id: "project_2",
    name: "Project Two",
    description: "Secondary project description.",
    whatItDoes: "What it does.",
    techStack: ["TypeScript", "Node.js"],
    keyLesson: "Key takeaway.",
    link: "https://example.com",
    linkText: "View Project",
    planetColor: "var(--color-engine-orange)",
  },
  {
    id: "project_3",
    name: "Project Three",
    description: "Tertiary project description.",
    whatItDoes: "What it does.",
    techStack: ["TypeScript", "Three.js"],
    keyLesson: "Key takeaway.",
    link: "https://example.com",
    linkText: "View Project",
    planetColor: "var(--color-gold-accent)",
  },
] as const;

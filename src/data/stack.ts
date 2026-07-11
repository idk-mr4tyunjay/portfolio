/*
  Stack section — SPEC.md §5. Grouped, honest, no proficiency bars.
  TODO: edit to your actual day-to-day tools.
*/

export interface StackGroup {
  group: string;
  items: string[];
}

export const STACK: StackGroup[] = [
  {
    group: "languages",
    items: ["TypeScript", "JavaScript", "SQL"],
  },
  {
    group: "frontend",
    items: ["React", "Next.js", "Tailwind CSS"],
  },
  {
    group: "backend",
    items: ["Node.js", "Postgres", "REST APIs"],
  },
  {
    group: "tools",
    items: ["Git", "Docker", "Vercel"],
  },
];

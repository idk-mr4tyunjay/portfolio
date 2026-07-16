/*
  Stack section — SPEC.md §5. Grouped, honest, no proficiency bars.
*/

export interface StackGroup {
  group: string;
  items: string[];
}

export const STACK: StackGroup[] = [
  {
    group: "languages",
    items: ["TypeScript", "JavaScript", "Solidity"],
  },
  {
    group: "frontend",
    items: ["React", "Next.js", "Tailwind CSS", "Three.js"],
  },
  {
    group: "backend",
    items: ["Node.js", "MongoDB", "GraphQL"],
  },
  {
    group: "tools",
    items: ["Git", "Docker", "Redis"],
  },
];

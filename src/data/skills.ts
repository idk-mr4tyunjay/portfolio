import type { Skill } from "@/types";

/*
  Scene 05: Arsenal skills.
  5–8 skills recommended per 03-CONTENT-REQUIREMENTS.md §05.
  Each example references a Project id from src/data/projects.ts.
*/

export const SKILLS: readonly Skill[] = [
  {
    id: "skill_typescript",
    name: "TypeScript",
    description: "Type-safe JavaScript at scale.",
    difficulty: "advanced",
    examples: [],
  },
  {
    id: "skill_react",
    name: "React",
    description: "Component-driven UI for the web.",
    difficulty: "advanced",
    examples: [],
  },
  {
    id: "skill_threejs",
    name: "Three.js",
    description: "Real-time 3D in the browser.",
    difficulty: "intermediate",
    examples: [],
  },
  {
    id: "skill_node",
    name: "Node.js",
    description: "Backend services and APIs.",
    difficulty: "advanced",
    examples: [],
  },
  {
    id: "skill_web3",
    name: "Web3",
    description: "Smart contracts and on-chain integrations.",
    difficulty: "intermediate",
    examples: [],
  },
  {
    id: "skill_design",
    name: "Design Systems",
    description: "Tokens, primitives, and consistent UI at scale.",
    difficulty: "intermediate",
    examples: [],
  },
] as const;

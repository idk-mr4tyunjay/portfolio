/*
  Stack section. Grouped, honest, no proficiency bars.
  `icon` is a Simple Icons slug → key into TECH_ICONS (tech-icons.ts).
*/

export interface StackItem {
  name: string;
  icon: string;
}

export interface StackGroup {
  group: string;
  items: StackItem[];
}

export const STACK: StackGroup[] = [
  {
    group: "languages",
    items: [
      { name: "TypeScript", icon: "typescript" },
      { name: "JavaScript", icon: "javascript" },
      { name: "Solidity", icon: "solidity" },
    ],
  },
  {
    group: "frontend",
    items: [
      { name: "React", icon: "react" },
      { name: "Next.js", icon: "nextdotjs" },
      { name: "Tailwind CSS", icon: "tailwindcss" },
      { name: "Redux", icon: "redux" },
    ],
  },
  {
    group: "backend",
    items: [
      { name: "Node.js", icon: "nodedotjs" },
      { name: "MongoDB", icon: "mongodb" },
      { name: "PostgreSQL", icon: "postgresql" },
      { name: "GraphQL", icon: "graphql" },
    ],
  },
  {
    group: "tools",
    items: [
      { name: "Git", icon: "git" },
      { name: "Docker", icon: "docker" },
      { name: "Redis", icon: "redis" },
      { name: "GitHub Actions", icon: "githubactions" },
      { name: "Prometheus", icon: "prometheus" },
      { name: "Grafana", icon: "grafana" },
    ],
  },
];

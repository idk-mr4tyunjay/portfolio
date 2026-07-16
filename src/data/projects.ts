import type { Project } from "@/types";

/*
  Side projects — SPEC.md §5. Newest first.
  VPS Setup and Growix are placeholders until the repos are public.
*/

export const PROJECTS: Project[] = [
  {
    name: "VPS Setup",
    description: "A repeatable setup for provisioning and hardening a fresh VPS.",
    year: "2026",
    // url: add once the repo is public
    tech: ["bash", "docker"],
  },
  {
    name: "Growix",
    description: "Currently private, going public soon.",
    year: "2025",
    // url + tech to come when it goes public
  },
  {
    name: "Multi-Window",
    description: "State synced across multiple browser windows via Three.js. Nobody needed this. I built it anyway.",
    year: "2024",
    url: "https://multi-window-xd.vercel.app/",
    tech: ["three.js"],
  },
];

import type { Project } from "@/types";
import { SITE } from "./site";

/*
  Side projects. Newest first.
  Private repos point their GitHub link at the profile until they go public.
*/

export const PROJECTS: Project[] = [
  {
    name: "Growix",
    description: "A personal growth PWA for habits, plans and learning, self-hosted on a VPS.",
    year: "2026",
    url: "https://growix.devtown.lol",
    tech: ["next.js", "postgres", "docker"],
    links: [{ type: "github", url: "https://github.com/idk-mr4tyunjay/growix" }],
    image: {
      placeholder: "growix.devtown.lol · dashboard",
      src: "/images/projects/project-growix.webp",
    },
  },
  {
    name: "VPS Setup",
    description: "Scripts to provision and harden a fresh VPS, from first login to running apps.",
    year: "2026",
    url: "https://vps.devtown.lol",
    tech: ["bash", "docker"],
    links: [{ type: "github", url: "https://github.com/idk-mr4tyunjay/vps-setup" }],
    image: {
      placeholder: "vps.devtown.lol · the runbook",
      src: "/images/projects/project-vps-setup.webp",
    },
  },
  {
    name: "Multi-Window",
    description: "State synced across multiple browser windows via Three.js. Nobody needed this. I built it anyway.",
    year: "2024",
    url: "https://multi-window-xd.vercel.app/",
    tech: ["three.js"],
    links: [{ type: "github", url: SITE.github }],
    image: {
      placeholder: "multi-window · three windows in sync",
      src: "/images/projects/project-multi-window.webp",
    },
  },
];

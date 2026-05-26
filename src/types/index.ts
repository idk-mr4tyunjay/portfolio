/*
  Canonical types for One Small Step v2.
  Source: SPEC.md §12 (Data Interfaces).
*/

export type Scene = "hero" | "portal" | "pixel" | "projects" | "landing";

export type PerfTier = "high" | "medium" | "low";

export interface Skill {
  id: string;
  name: string;
  /** Key into the skill-icons.png atlas */
  iconKey: string;
  /** FK → Milestone.id */
  milestoneId: string;
}

export interface Milestone {
  id: string;
  /** Display label (e.g. "Learning", "Building") */
  label: string;
  /** Scene-local progress 0–1 within Scene 03's band (NOT global) */
  scrollStart: number;
  scrollEnd: number;
  /** Key into the monuments.png atlas */
  monumentKey: string;
  /** Skill ids in display order */
  skills: string[];
}

export interface Project {
  id: string;
  name: string;
  /** 2–3 sentences */
  description: string;
  techStack: string[];
  /** Single sentence */
  keyLesson: string;
  /** Optional path under /public/sprites/ */
  thumbnail?: string;
  /** External project URL */
  url?: string;
}

export interface DialogueLine {
  id: string;
  /** Key into npcs.png atlas */
  npcKey: string;
  /** Global scroll 0–1 (NOT scene-local) */
  triggerScroll: number;
  /** How long the bubble stays visible, in scroll units */
  durationScroll: number;
  text: string;
}

export interface ContactSubmission {
  name: string;
  email: string;
  message: string;
}

/*
  Canonical types for the One Small Step experience.
  Mirror 03-CONTENT-REQUIREMENTS.md §09 (Data Structures).
*/

export type Scene =
  | "hero"
  | "portal1"
  | "pixel"
  | "portal2"
  | "arsenal"
  | "missions"
  | "landing";

export type SkillDifficulty = "beginner" | "intermediate" | "advanced";

export interface ProjectExample {
  projectId: string;
  projectName: string;
  description: string;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  examples: ProjectExample[];
  difficulty?: SkillDifficulty;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  whatItDoes: string;
  techStack: string[];
  keyLesson: string;
  link: string;
  linkText: string;
  /** CSS color string — see 04-SCENE-SPECIFICATIONS.md §06 for the 3 planet palettes */
  planetColor: string;
}

export type DialogueSpeaker = "player" | "npc";

export interface DialogueLine {
  speaker: DialogueSpeaker;
  text: string;
  /** Scene-local progress, 0 → 1 */
  triggerAt: number;
  /** ms to keep the line visible */
  duration: number;
}

export interface Milestone {
  id: string;
  label: string;
  /** Scene-local progress, 0 → 1 (within Scene 03's band) */
  triggerAt: number;
  npcLine?: string;
}

export interface ContactSubmission {
  name: string;
  email: string;
  message: string;
}

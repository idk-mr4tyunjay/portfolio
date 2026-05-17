import type { DialogueLine, Milestone } from "@/types";

/*
  Scene 03: Pixel World — NPC voice + milestones.
  Copy is from 03-CONTENT-REQUIREMENTS.md §03 (NPC Dialogue).
  Tone: cryptic, poetic, reflective — never instructive.
  triggerAt values are scene-local (0–1 within Scene 03's band).
*/

export const PIXEL_DIALOGUE: readonly DialogueLine[] = [
  {
    speaker: "player",
    text: "Where am I?",
    triggerAt: 0.05,
    duration: 2500,
  },
  {
    speaker: "npc",
    text: "A place where stories are written in code…",
    triggerAt: 0.12,
    duration: 3500,
  },
  {
    speaker: "npc",
    text: "Each step forward is a choice. Each moment, a memory.",
    triggerAt: 0.22,
    duration: 3500,
  },
  {
    speaker: "npc",
    text: "You've come far. But there is more to see…",
    triggerAt: 0.95,
    duration: 4000,
  },
] as const;

export const PIXEL_MILESTONES: readonly Milestone[] = [
  {
    id: "milestone_learning",
    label: "Learning",
    triggerAt: 0.25,
    npcLine: "In the beginning, you were curious.",
  },
  {
    id: "milestone_building",
    label: "Building",
    triggerAt: 0.4,
    npcLine: "You learned to create.",
  },
  {
    id: "milestone_shipping",
    label: "Shipping",
    triggerAt: 0.55,
    npcLine: "You learned to release.",
  },
  {
    id: "milestone_scaling",
    label: "Scaling",
    triggerAt: 0.7,
    npcLine: "Your creations grew.",
  },
  {
    id: "milestone_leading",
    label: "Leading",
    triggerAt: 0.85,
    npcLine: "You learned to guide others.",
  },
] as const;

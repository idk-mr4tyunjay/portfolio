import type { Scene, Milestone } from "@/types";

/*
  Single source of truth for scene scroll positions + milestone placement.
  Source: SPEC.md §2 (Five-Scene Arc) and §6 (Pixel Journey milestones).

  Total document height is "1.0× viewport" per SPEC.md §3 — interpreted as
  "scroll progress range is 0–1 (no v1 overflow past 100%)". Actual scrollable
  distance is set by TOTAL_SCROLL_HEIGHT_VH below; tune for pacing without
  changing the scene-band percentages.
*/

export interface SceneBand {
  scene: Scene;
  /** Inclusive start, fraction of total document scroll */
  start: number;
  /** Exclusive end */
  end: number;
}

/** Body height in vh — controls scroll pacing, not the band math */
export const TOTAL_SCROLL_HEIGHT_VH = 400;

export const SCENE_BANDS: readonly SceneBand[] = [
  { scene: "hero", start: 0.0, end: 0.18 },
  { scene: "portal", start: 0.18, end: 0.25 },
  { scene: "pixel", start: 0.25, end: 0.62 },
  { scene: "projects", start: 0.62, end: 0.86 },
  { scene: "landing", start: 0.86, end: 1.0 },
] as const;

export function getBand(scene: Scene): SceneBand {
  const band = SCENE_BANDS.find((b) => b.scene === scene);
  if (!band) throw new Error(`No band defined for scene: ${scene}`);
  return band;
}

/** Global 0–1 progress → scene-local 0–1 progress (clamped) */
export function sceneProgress(globalProgress: number, scene: Scene): number {
  const { start, end } = getBand(scene);
  if (globalProgress <= start) return 0;
  if (globalProgress >= end) return 1;
  return (globalProgress - start) / (end - start);
}

/** Active scene for a given global progress */
export function activeSceneAt(globalProgress: number): Scene {
  for (const band of SCENE_BANDS) {
    if (globalProgress < band.end) return band.scene;
  }
  return "landing";
}

/*
  Scene 03 milestones — SPEC.md §6.
  scrollStart / scrollEnd are SCENE-LOCAL (0–1 within the pixel band),
  not global. Skills referenced here must exist in src/data/skills.ts.
*/
export const MILESTONES: readonly Milestone[] = [
  {
    id: "milestone_learning",
    label: "Learning",
    scrollStart: 0.0,
    scrollEnd: 0.2,
    monumentKey: "learning",
    skills: ["skill_javascript", "skill_html_css"],
  },
  {
    id: "milestone_building",
    label: "Building",
    scrollStart: 0.2,
    scrollEnd: 0.4,
    monumentKey: "building",
    skills: ["skill_react", "skill_typescript"],
  },
  {
    id: "milestone_shipping",
    label: "Shipping",
    scrollStart: 0.4,
    scrollEnd: 0.6,
    monumentKey: "shipping",
    skills: ["skill_node", "skill_postgres"],
  },
  {
    id: "milestone_scaling",
    label: "Scaling",
    scrollStart: 0.6,
    scrollEnd: 0.8,
    monumentKey: "scaling",
    skills: ["skill_threejs", "skill_aws"],
  },
  {
    id: "milestone_leading",
    label: "Leading",
    scrollStart: 0.8,
    scrollEnd: 1.0,
    monumentKey: "leading",
    skills: ["skill_architecture", "skill_mentoring"],
  },
] as const;

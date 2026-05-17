import type { Scene } from "@/types";

/*
  The single source of truth for scene scroll positions.
  Numbers here drive page height, scroll math, and every scene's local progress.
  Update these and the whole experience re-paces.

  Mapping derived from 01-STORY-NARRATIVE-BIBLE.md §Scroll Progression
  and 04-SCENE-SPECIFICATIONS.md (per-scene scroll positions).
*/

export interface SceneBand {
  scene: Scene;
  /** Inclusive start, expressed as fraction of total document scroll */
  start: number;
  /** Exclusive end */
  end: number;
}

export const TOTAL_SCROLL_HEIGHT_VH = 460;

export const SCENE_BANDS: readonly SceneBand[] = [
  { scene: "hero", start: 0.0, end: 0.2 },
  { scene: "portal1", start: 0.2, end: 0.28 },
  { scene: "pixel", start: 0.28, end: 0.63 },
  { scene: "portal2", start: 0.63, end: 0.71 },
  { scene: "arsenal", start: 0.71, end: 0.96 },
  { scene: "missions", start: 0.96, end: 1.16 / 1.46 },
  { scene: "landing", start: 1.16 / 1.46, end: 1.0 },
] as const;

export function getBand(scene: Scene): SceneBand {
  const band = SCENE_BANDS.find((b) => b.scene === scene);
  if (!band) throw new Error(`No band defined for scene: ${scene}`);
  return band;
}

/** Convert a global 0–1 scroll progress to scene-local 0–1 progress (clamped) */
export function sceneProgress(globalProgress: number, scene: Scene): number {
  const { start, end } = getBand(scene);
  if (globalProgress <= start) return 0;
  if (globalProgress >= end) return 1;
  return (globalProgress - start) / (end - start);
}

/** Active scene at a given global progress */
export function activeSceneAt(globalProgress: number): Scene {
  for (const band of SCENE_BANDS) {
    if (globalProgress < band.end) return band.scene;
  }
  return "landing";
}

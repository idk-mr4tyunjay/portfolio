"use client";

import { useScrollStore } from "@/store/scroll";
import { sceneProgress } from "@/data/timeline";
import type { Scene } from "@/types";

/**
 * Scene-local progress 0 → 1.
 * Reads global scroll from the zustand store — does not subscribe to RAF directly.
 */
export function useSceneProgress(scene: Scene): number {
  const global = useScrollStore((s) => s.progress);
  return sceneProgress(global, scene);
}

/**
 * True when the given scene is the currently active band.
 */
export function useIsSceneActive(scene: Scene): boolean {
  return useScrollStore((s) => s.activeScene === scene);
}

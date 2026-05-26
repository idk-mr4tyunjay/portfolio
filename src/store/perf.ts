import { create } from "zustand";
import type { PerfTier } from "@/types";

/*
  Performance tier — SPEC.md §13.
  Classified once at app mount via a 2-second benchmark in the Hero scene.
  Every scene reads `tier` and branches feature density (particles, shaders, bloom).

  `tier = null` means the benchmark hasn't finished yet; render at a conservative
  "medium" preset until classification lands. Spec also allows mid-experience
  re-classification if FPS collapses — call setTier again from a perf monitor.
*/

interface PerfState {
  tier: PerfTier | null;
  benchInProgress: boolean;
  /** Rolling average FPS during/after the benchmark */
  averageFps: number;
  setTier: (tier: PerfTier, averageFps: number) => void;
  startBench: () => void;
}

export const usePerfStore = create<PerfState>((set) => ({
  tier: null,
  benchInProgress: false,
  averageFps: 0,
  setTier: (tier, averageFps) =>
    set({ tier, averageFps, benchInProgress: false }),
  startBench: () => set({ benchInProgress: true }),
}));

/** Maps avg FPS → tier per SPEC.md §13 thresholds */
export function classifyTier(avgFps: number): PerfTier {
  if (avgFps >= 55) return "high";
  if (avgFps >= 35) return "medium";
  return "low";
}

/** Until the bench finishes, return a conservative middle preset */
export function effectiveTier(tier: PerfTier | null): PerfTier {
  return tier ?? "medium";
}

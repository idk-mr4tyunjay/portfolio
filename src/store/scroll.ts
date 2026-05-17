import { create } from "zustand";
import type { Scene } from "@/types";

/*
  Global scroll progress + active scene.
  Updated once per RAF tick from the Lenis loop in useLenis().
  Read by every scene to compute its local progress via timeline.ts.
*/

interface ScrollState {
  /** 0 → 1, normalized to total scrollable height */
  progress: number;
  activeScene: Scene;
  reducedMotion: boolean;
  setProgress: (progress: number, activeScene: Scene) => void;
  setReducedMotion: (reduced: boolean) => void;
}

export const useScrollStore = create<ScrollState>((set) => ({
  progress: 0,
  activeScene: "hero",
  reducedMotion: false,
  setProgress: (progress, activeScene) => set({ progress, activeScene }),
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
}));

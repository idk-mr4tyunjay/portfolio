"use client";

import { useEffect } from "react";
import { usePerfStore, classifyTier } from "@/store/perf";

/*
  Two-second FPS benchmark inside the Hero scene at full fidelity — SPEC.md §13.
  Runs once at app mount. Result is written to usePerfStore and read by every
  scene to branch feature density.
*/

const BENCH_DURATION_MS = 2000;

export function usePerfBench(enabled: boolean = true) {
  useEffect(() => {
    if (!enabled) return;

    const store = usePerfStore.getState();
    if (store.tier !== null || store.benchInProgress) return;

    store.startBench();

    let frameCount = 0;
    const startTime = performance.now();
    let rafId = 0;

    const tick = () => {
      frameCount += 1;
      const elapsed = performance.now() - startTime;

      if (elapsed >= BENCH_DURATION_MS) {
        const avgFps = (frameCount / elapsed) * 1000;
        usePerfStore.getState().setTier(classifyTier(avgFps), avgFps);
        return;
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [enabled]);
}

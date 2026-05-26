"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { useScrollStore } from "@/store/scroll";
import { activeSceneAt } from "@/data/timeline";

/*
  Owns the Lenis smooth-scroll instance + the single RAF loop that
  feeds normalized scroll progress into the zustand store.

  Reduced-motion: skip Lenis entirely. Write raw window.scrollY to the
  store on the native scroll event — no inertia, no smoothing. SPEC.md §14.

  Mount once in Experience. Other components read progress from useScrollStore,
  they do NOT spin up their own RAF.
*/

const lenisEasing = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t));

export function useLenis() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    useScrollStore.getState().setReducedMotion(prefersReducedMotion);

    const writeProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      useScrollStore
        .getState()
        .setProgress(progress, activeSceneAt(progress));
    };

    if (prefersReducedMotion) {
      writeProgress();
      window.addEventListener("scroll", writeProgress, { passive: true });
      return () => window.removeEventListener("scroll", writeProgress);
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: lenisEasing,
      smoothWheel: true,
      syncTouch: false,
    });
    lenisRef.current = lenis;

    let rafId = 0;
    const tick = (time: number) => {
      lenis.raf(time);
      writeProgress();
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return lenisRef;
}

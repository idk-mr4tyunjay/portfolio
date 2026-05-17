"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { useScrollStore } from "@/store/scroll";
import { activeSceneAt } from "@/data/timeline";

/*
  Owns the Lenis smooth-scroll instance and the single RAF loop that
  feeds normalized scroll progress into the zustand store.

  Mount once in app/page.tsx (or the orchestrator). Other components
  read progress from useScrollStore, they do NOT spin up their own RAF.
*/
export function useLenis() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    useScrollStore.getState().setReducedMotion(prefersReducedMotion);

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: !prefersReducedMotion,
      syncTouch: false,
    });

    lenisRef.current = lenis;

    let rafId = 0;
    const tick = (time: number) => {
      lenis.raf(time);

      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      useScrollStore
        .getState()
        .setProgress(progress, activeSceneAt(progress));

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

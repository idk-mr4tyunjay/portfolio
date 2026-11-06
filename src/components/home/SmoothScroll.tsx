"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/*
  Mounts inertia scrolling for the whole page. Renders nothing — the rAF
  loop drives window scroll directly, and `window.__lenis` (lib/scroll.ts)
  is exposed so anchor navigation (Nav, CommandPalette) can route through
  it instead of a competing native smooth-scroll.
*/
export function SmoothScroll() {
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lenis: Lenis | undefined;
    let raf = 0;
    const stop = () => {
      cancelAnimationFrame(raf);
      lenis?.destroy();
      lenis = undefined;
      delete window.__lenis;
    };
    const update = () => {
      stop();
      if (preference.matches) return;
      lenis = new Lenis({ duration: 1.1, easing: (t) => 1 - Math.pow(1 - t, 3) });
      window.__lenis = lenis;
      const loop = (time: number) => {
        lenis?.raf(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    };
    update();
    preference.addEventListener("change", update);
    return () => {
      preference.removeEventListener("change", update);
      stop();
    };
  }, []);

  return null;
}

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
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 3),
    });
    window.__lenis = lenis;

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  return null;
}

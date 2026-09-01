import type Lenis from "lenis";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/*
  Smooth-scrolls to an in-page anchor, routing through the shared Lenis
  instance (SmoothScroll.tsx) when it's mounted so anchor jumps match the
  page's inertia scrolling instead of snapping instantly.
*/
export function smoothScrollTo(id: string): boolean {
  const target = document.getElementById(id);
  if (!target) return false;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (window.__lenis && !reduced) {
    window.__lenis.scrollTo(target, { offset: 0 });
  } else {
    target.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  }
  return true;
}

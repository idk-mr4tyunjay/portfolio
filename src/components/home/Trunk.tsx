"use client";

import { useEffect, useRef } from "react";

/*
  The trunk — SPEC.md §4.1. A 1px line in the left gutter from the name's
  full stop down to the contact dot. Its drawn length follows scroll
  position, so it is also the scroll cue. Endpoints are measured from the
  DOM ([data-trunk-start], [data-trunk-end]) and re-measured on resize and
  whenever a case study opens (main's height changes).
*/

export function Trunk() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const main = el.parentElement;
    if (!main) return;

    let top = 0;
    let total = 0;
    let raf = 0;

    const measure = () => {
      const start = document.querySelector("[data-trunk-start]") ?? document.querySelector(".name-dot");
      const end = document.querySelector("[data-trunk-end]");
      const mainTop = main.getBoundingClientRect().top + window.scrollY;
      if (start) {
        const b = start.getBoundingClientRect();
        top = b.bottom + window.scrollY - mainTop;
      }
      if (end) {
        const b = end.getBoundingClientRect();
        total = Math.max(0, b.top + window.scrollY - mainTop - top);
      }
      el.style.top = `${top}px`;
      paint();
    };

    const paint = () => {
      raf = 0;
      const mainTop = main.getBoundingClientRect().top + window.scrollY;
      // Draw ahead of the reader: to 70% of the viewport below the current scroll position.
      const reach = window.scrollY + window.innerHeight * 0.7 - mainTop - top;
      const drawn = Math.max(0, Math.min(total, reach));
      el.style.height = `${drawn}px`;
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };

    measure();
    // Until the arrival finishes the name is hidden; the trunk starts with it.
    if (document.documentElement.hasAttribute("data-arrive")) {
      el.style.opacity = "0";
      window.addEventListener(
        "mj:arrived",
        () => {
          el.style.transition = "opacity 0.4s ease";
          el.style.opacity = "1";
        },
        { once: true },
      );
    }

    const ro = new ResizeObserver(measure);
    ro.observe(main);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return <div ref={ref} className="trunk" aria-hidden />;
}

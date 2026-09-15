"use client";

import { useEffect, useRef } from "react";

/*
  A branch — SPEC.md §4.2. The row rule, grown from the trunk over 600ms the
  first time the row crosses 60% of the viewport. `shake` is a counter: each
  change plays the 300ms shake once. Weather.tsx reads [data-branch] rects
  as landing surfaces for leaves, so this element must stay in the DOM.
*/

export function Branch({ open = false, shake = 0 }: { open?: boolean; shake?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.dataset.drawn = "true";
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          el.dataset.drawn = "true";
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -40% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || !shake) return;
    el.dataset.shake = "true";
    const id = setTimeout(() => delete el.dataset.shake, 320);
    return () => clearTimeout(id);
  }, [shake]);

  return <span ref={ref} className="branch" data-branch data-drawn="false" data-open={open} aria-hidden />;
}

"use client";

import { useEffect, useState } from "react";

/*
  Scroll-spy: returns whichever of `ids` is the topmost section that has
  crossed 42% down the viewport — matches the header's nav-dot highlight
  and each section label's accent color to whatever the reader is on.
*/
export function useActiveSection(ids: readonly string[]): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      const vh = window.innerHeight || 1;
      let current: string | null = null;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= vh * 0.42) current = id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join(",")]);

  return active;
}

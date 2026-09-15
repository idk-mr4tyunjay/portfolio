"use client";

import { useEffect, useRef, useState } from "react";

/*
  Status marquee — SPEC.md §4.1. A CSS animation carries it at 40px/s; scroll
  velocity pushes the playback rate up and it eases back. Two copies of the
  track make the loop seamless. The time is IST, refreshed each minute.
*/

function ist() {
  return new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit" }).format(new Date());
}

export function Marquee({ items }: { items: readonly string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [time, setTime] = useState("--:--");

  useEffect(() => {
    setTime(ist());
    const id = setInterval(() => setTime(ist()), 60_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const tracks = Array.from(el.querySelectorAll<HTMLElement>(".marquee-track"));
    // Duration scales with content so speed stays ~40px/s regardless of width.
    const width = tracks[0]?.offsetWidth || 1200;
    tracks.forEach((t) => (t.style.animationDuration = `${width / 40}s`));

    let lastY = window.scrollY;
    let lastT = performance.now();
    let rate = 1;
    let raf = 0;
    const settle = () => {
      raf = 0;
      rate += (1 - rate) * 0.08;
      tracks.forEach((t) => t.getAnimations().forEach((a) => (a.playbackRate = rate)));
      if (Math.abs(rate - 1) > 0.01) raf = requestAnimationFrame(settle);
    };
    const onScroll = () => {
      const now = performance.now();
      const dt = Math.max(now - lastT, 1);
      const v = Math.abs(window.scrollY - lastY) / dt; // px per ms
      lastY = window.scrollY;
      lastT = now;
      rate = Math.min(1 + v * 3, 6);
      if (!raf) raf = requestAnimationFrame(settle);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const content = [`${time} IST`, ...items];

  return (
    <div ref={ref} className="marquee t-meta" aria-label={content.join(", ")}>
      {[0, 1].map((copy) => (
        <div key={copy} className="marquee-track" aria-hidden={copy === 1}>
          {content.map((item, i) => (
            <span key={i} className="inline-flex items-center gap-[2.5em]">
              <span>{item}</span>
              <span className="dot-sm opacity-40" aria-hidden />
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

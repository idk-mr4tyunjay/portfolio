"use client";

import { useEffect, useMemo, useRef } from "react";

/*
  Aerial roots and the tangle — SPEC.md §4.3, §4.5. One SVG behind the side
  projects and the notes. Six roots fall from the side-project branches,
  land where the notes begin, and knot into ~40 paths. Every path carries
  pathLength=1 so drawing is a dashoffset from scroll progress, no
  measuring. Sway is CSS (per root group); gusts arrive as --gust, set by
  Weather.tsx from scroll velocity.
*/

const ROOT_COUNT = 6;
const TANGLE_COUNT = 28;
const LAND_Y = 600; // where the roots reach the ground, in viewBox units of 1000

// Deterministic so server and client render the same paths.
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function buildPaths() {
  const rand = rng(20260915);
  const roots: string[] = [];
  const ends: number[] = [];
  for (let i = 0; i < ROOT_COUNT; i++) {
    let x = 110 + (i * 780) / (ROOT_COUNT - 1) + (rand() - 0.5) * 60;
    let y = 40 + rand() * 40;
    let d = `M${x.toFixed(1)} ${y.toFixed(1)}`;
    while (y < LAND_Y) {
      const ny = Math.min(LAND_Y, y + 90 + rand() * 60);
      const nx = x + (rand() - 0.5) * 70;
      const c1x = x + (rand() - 0.5) * 50;
      const c2x = nx + (rand() - 0.5) * 50;
      d += ` C${c1x.toFixed(1)} ${(y + (ny - y) * 0.35).toFixed(1)} ${c2x.toFixed(1)} ${(y + (ny - y) * 0.7).toFixed(1)} ${nx.toFixed(1)} ${ny.toFixed(1)}`;
      x = nx;
      y = ny;
    }
    roots.push(d);
    ends.push(x);
  }

  const tangle: string[] = [];
  for (let j = 0; j < TANGLE_COUNT; j++) {
    let x = ends[j % ROOT_COUNT] + (rand() - 0.5) * 40;
    let y = LAND_Y + rand() * 30;
    let d = `M${x.toFixed(1)} ${y.toFixed(1)}`;
    const segments = 3 + Math.floor(rand() * 3);
    for (let s = 0; s < segments; s++) {
      const nx = Math.max(40, Math.min(960, x + (rand() - 0.5) * 260));
      const ny = Math.max(LAND_Y, Math.min(940, y + (rand() - 0.2) * 110));
      const c1x = x + (rand() - 0.5) * 160;
      const c1y = y + (rand() - 0.5) * 110;
      const c2x = nx + (rand() - 0.5) * 160;
      const c2y = ny + (rand() - 0.5) * 110;
      d += ` C${c1x.toFixed(1)} ${Math.max(LAND_Y - 20, c1y).toFixed(1)} ${c2x.toFixed(1)} ${Math.max(LAND_Y - 20, c2y).toFixed(1)} ${nx.toFixed(1)} ${ny.toFixed(1)}`;
      x = nx;
      y = ny;
    }
    tangle.push(d);
  }
  return { roots, tangle };
}

export function Roots({ children }: { children: React.ReactNode }) {
  const wrap = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const { roots, tangle } = useMemo(buildPaths, []);

  useEffect(() => {
    const el = wrap.current;
    const s = svg.current;
    if (!el || !s) return;
    const rootPaths = Array.from(s.querySelectorAll<SVGPathElement>("[data-root]"));
    const tanglePaths = Array.from(s.querySelectorAll<SVGPathElement>("[data-tangle]"));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const clamp = (v: number) => Math.max(0, Math.min(1, v));

    let raf = 0;
    const paint = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      // 0 when the wrapper's top reaches the viewport bottom, 1 when its bottom does.
      const p = reduced ? 1 : clamp((window.innerHeight - r.top) / (r.height + window.innerHeight * 0.1));
      rootPaths.forEach((path, i) => {
        const start = 0.08 + i * 0.02;
        path.style.strokeDashoffset = String(1 - clamp((p - start) / 0.5));
      });
      tanglePaths.forEach((path, j) => {
        const start = 0.5 + (j / TANGLE_COUNT) * 0.3;
        path.style.strokeDashoffset = String(1 - clamp((p - start) / 0.22));
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };
    paint();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={wrap} className="relative">
      <svg ref={svg} className="roots-svg" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden>
        {roots.map((d, i) => (
          <g key={i} className="roots-sway">
            <path d={d} pathLength={1} data-root />
          </g>
        ))}
        <g opacity={0.45}>
          {tangle.map((d, j) => (
            <path key={j} d={d} pathLength={1} data-tangle />
          ))}
        </g>
      </svg>
      <div className="relative z-10">{children}</div>
    </div>
  );
}

"use client";

import { useScrollStore } from "@/store/scroll";

/*
  DOM overlay for Scene 01 title ("One Small Step").
  Fades out as portal 1 begins.
*/
export function HeroOverlay() {
  const progress = useScrollStore((s) => s.progress);
  const opacity = Math.max(0, 1 - progress / 0.18);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-1/3 z-10 text-center transition-opacity duration-300"
      style={{ opacity }}
    >
      <h1
        className="text-[2rem] tracking-[0.15em] md:text-5xl"
        style={{
          fontFamily: "var(--font-orbitron)",
          fontWeight: 900,
          color: "var(--color-star-white)",
        }}
      >
        ONE SMALL STEP
      </h1>
      <p
        className="mt-3 text-base md:text-lg"
        style={{
          fontFamily: "var(--font-inter)",
          color: "var(--color-plasma-cyan)",
          opacity: Math.max(0, 1 - progress / 0.05),
        }}
      >
        scroll to begin
      </p>
    </div>
  );
}

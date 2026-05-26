"use client";

import dynamic from "next/dynamic";
import { Leva, useControls } from "leva";
import { useLenis } from "@/hooks/useLenis";
import { useSceneProgress } from "@/hooks/useSceneProgress";
import { useScrollStore } from "@/store/scroll";
import { TOTAL_SCROLL_HEIGHT_VH } from "@/data/timeline";
import { lerp } from "@/lib/math";

const Stage = dynamic(
  () => import("@/components/three/Stage").then((m) => m.Stage),
  { ssr: false },
);

// ease-out-cubic — SPEC.md §9
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

const IS_DEV = process.env.NODE_ENV === "development";

export function Experience() {
  useLenis();
  const heroProgress = useSceneProgress("hero");
  const reducedMotion = useScrollStore((s) => s.reducedMotion);

  /*
    Frame insets at hero progress = 0 (interpolate to 0 by progress = 1).
    Exposed to Leva so we can dial them in live; once finalized we bake the
    chosen values back as constants and remove the controls.
  */
  const frame = useControls("Frame", {
    topVh: { value: 20, min: 0, max: 60, step: 1 },
    sideVw: { value: 5, min: 0, max: 30, step: 1 },
    bottomVh: { value: 5, min: 0, max: 30, step: 1 },
    radiusPx: { value: 18, min: 0, max: 60, step: 1 },
  });

  const t = reducedMotion ? 1 : easeOutCubic(heroProgress);

  const top = lerp(frame.topVh, 0, t);
  const side = lerp(frame.sideVw, 0, t);
  const bottom = lerp(frame.bottomVh, 0, t);
  const radius = lerp(frame.radiusPx, 0, t);

  return (
    <>
      {/* Floating debug panel — hidden in production builds */}
      <Leva hidden={!IS_DEV} collapsed />

      <HeroHeadline />

      <div
        className="fixed inset-0"
        style={{
          clipPath: `inset(${top}vh ${side}vw ${bottom}vh ${side}vw round ${radius}px)`,
          zIndex: 10,
        }}
      >
        <Stage />
      </div>

      <div
        aria-hidden
        style={{ height: `${TOTAL_SCROLL_HEIGHT_VH}vh` }}
      />
    </>
  );
}

function HeroHeadline() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-0 px-6 pt-8 md:px-12 md:pt-10">
      <p
        className="mb-3 text-xs uppercase tracking-[0.3em] opacity-70"
        style={{
          fontFamily: "var(--font-mono)",
          color: "var(--color-deep-space)",
        }}
      >
        One small step
      </p>
      <h1
        className="max-w-[22ch] text-3xl leading-[1.1] md:text-5xl md:leading-[1.05]"
        style={{
          fontFamily: "var(--font-orbitron)",
          fontWeight: 700,
          color: "var(--color-deep-space)",
        }}
      >
        A developer&rsquo;s journey, scrolled through five worlds.
      </h1>
    </header>
  );
}

"use client";

import dynamic from "next/dynamic";
import { useLenis } from "@/hooks/useLenis";
import { HeroOverlay } from "@/components/ui/HeroOverlay";
import { LandingOverlay } from "@/components/ui/LandingOverlay";
import { DebugScrollHUD } from "@/components/ui/DebugScrollHUD";
import { TOTAL_SCROLL_HEIGHT_VH } from "@/data/timeline";

/*
  The 3D stage is dynamically imported with ssr:false. Three.js touches
  `window` / WebGL synchronously on module init, so it cannot run during
  Next.js server rendering.
*/
const Stage = dynamic(
  () => import("@/components/three/Stage").then((m) => m.Stage),
  { ssr: false },
);

const DEBUG = process.env.NEXT_PUBLIC_DEBUG_SCROLL === "1";

/*
  Top-level orchestrator. Body height drives scroll progress; the Stage is
  fixed full-viewport behind the DOM overlays. Scene swaps happen inside
  the Stage based on the active scroll band.
*/
export function Experience() {
  useLenis();

  return (
    <>
      <Stage />
      <HeroOverlay />
      <LandingOverlay />
      <DebugScrollHUD show={DEBUG} />

      {/* Scroll spacer — the only thing that gives the document its height */}
      <div
        aria-hidden
        style={{ height: `${TOTAL_SCROLL_HEIGHT_VH}vh` }}
      />
    </>
  );
}

"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { useScrollStore } from "@/store/scroll";
import { Effects } from "./Effects";
import { SceneSwitcher } from "./SceneSwitcher";

/*
  Single shared R3F canvas. Pinned full-viewport, behind all DOM overlays.
  Scene contents swap based on active scroll band — there's no per-scene Canvas.

  Why one canvas: lets us cross-fade between scenes via shared render targets
  (Portal 1 / Portal 2 read the previous scene's output through a postprocess pass).
*/
export function Stage() {
  const reducedMotion = useScrollStore((s) => s.reducedMotion);

  return (
    <div className="fixed-stage z-0 pointer-events-none">
      <Canvas
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        camera={{ position: [0, 0, 5], fov: 60 }}
        className="!pointer-events-auto"
      >
        <Suspense fallback={null}>
          <SceneSwitcher />
          {!reducedMotion && <Effects />}
        </Suspense>
      </Canvas>
    </div>
  );
}

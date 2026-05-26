"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { useScrollStore } from "@/store/scroll";
import { Effects } from "./Effects";
import { SceneSwitcher } from "./SceneSwitcher";

/*
  Shared R3F canvas. Always renders at the full size of its parent.
  Framing/clipping (Hero viewport-to-fullscreen expansion etc.) is owned
  by the parent — see Experience.tsx — so this stays scene-agnostic.

  Camera defaults: FOV 50, position (0, 0, 3) per SPEC.md §4. Scenes
  override z (and any other camera params) as needed via useThree.
*/
export function Stage() {
  const reducedMotion = useScrollStore((s) => s.reducedMotion);

  return (
    <Canvas
      dpr={[1, 2]}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      }}
      camera={{ position: [0, 0, 3], fov: 50 }}
    >
      <Suspense fallback={null}>
        <SceneSwitcher />
        {!reducedMotion && <Effects />}
      </Suspense>
    </Canvas>
  );
}

"use client";

import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useScrollStore } from "@/store/scroll";
import { usePerfStore, effectiveTier } from "@/store/perf";

/*
  Post-processing. SPEC.md §4 + §13.
  For Scene 01: Bloom strength 0.8, threshold 0.85, radius 0.4 — high tier only.
  Medium tier currently piggybacks the same settings; will refine if needed.
  Low tier and reduced-motion render no post-processing.

  When other scenes land, add per-scene branching here.
*/
export function Effects() {
  const tier = effectiveTier(usePerfStore((s) => s.tier));
  const reducedMotion = useScrollStore((s) => s.reducedMotion);

  if (tier === "low" || reducedMotion) return null;

  return (
    <EffectComposer enableNormalPass={false}>
      <Bloom
        intensity={tier === "high" ? 0.8 : 0.4}
        luminanceThreshold={0.85}
        luminanceSmoothing={0.2}
        radius={0.4}
        mipmapBlur
      />
    </EffectComposer>
  );
}

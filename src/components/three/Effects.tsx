"use client";

import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useScrollStore } from "@/store/scroll";

/*
  Bloom strength/threshold/radius vary per scene per 04-SCENE-SPECIFICATIONS.md.
  For now a conservative shared pass — per-scene overrides come later when
  each scene's render content is real (not a placeholder color panel).
*/

const SCENE_BLOOM = {
  hero: { strength: 1.2, threshold: 0.5, radius: 0.4 },
  portal1: { strength: 1.2, threshold: 0.5, radius: 0.4 },
  pixel: { strength: 0.6, threshold: 0.6, radius: 0.3 },
  portal2: { strength: 1.0, threshold: 0.4, radius: 0.5 },
  arsenal: { strength: 1.5, threshold: 0.3, radius: 0.6 },
  missions: { strength: 1.2, threshold: 0.4, radius: 0.5 },
  landing: { strength: 1.3, threshold: 0.4, radius: 0.6 },
} as const;

export function Effects() {
  const active = useScrollStore((s) => s.activeScene);
  const cfg = SCENE_BLOOM[active];

  return (
    <EffectComposer enableNormalPass={false}>
      <Bloom
        intensity={cfg.strength}
        luminanceThreshold={cfg.threshold}
        luminanceSmoothing={0.2}
        radius={cfg.radius}
        mipmapBlur
      />
    </EffectComposer>
  );
}

"use client";

import { useSceneProgress } from "@/hooks/useSceneProgress";
import { PIXEL_MILESTONES } from "@/data/dialogue";

/*
  SCENE 03 — Pixel World: The Journey Begins
  Spec: 04-SCENE-SPECIFICATIONS.md §SCENE 03
  Scroll band: 28–63%

  Placeholder: blocky pixel-palette landscape + milestone markers at
  scroll-locked positions.
  TODO: sprite-based astronaut walking animation, parallax tile layers,
        pixelate post-process shader, NPC dialogue overlay (DOM, not R3F).
*/
export function PixelScene() {
  const progress = useSceneProgress("pixel");
  const walkX = (progress - 0.5) * 12; // -6 → 6 across the band

  return (
    <>
      <ambientLight intensity={0.9} />
      {/* Pixel sky */}
      <mesh position={[0, 0, -10]}>
        <planeGeometry args={[40, 24]} />
        <meshBasicMaterial color="#1A1A2E" />
      </mesh>
      {/* Pixel ground */}
      <mesh position={[0, -3, -5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[40, 20]} />
        <meshBasicMaterial color="#2D5A1B" />
      </mesh>
      {/* Astronaut sprite placeholder */}
      <mesh position={[walkX, -1.5, 0]}>
        <boxGeometry args={[0.5, 1, 0.5]} />
        <meshBasicMaterial color="#FF6B6B" />
      </mesh>
      {/* Milestone markers */}
      {PIXEL_MILESTONES.map((m, i) => {
        const x = (m.triggerAt - 0.5) * 12;
        const active = Math.abs(progress - m.triggerAt) < 0.05;
        return (
          <mesh key={m.id} position={[x, active ? 1 : 0, 0]}>
            <boxGeometry args={[0.3, 0.6, 0.3]} />
            <meshBasicMaterial color={active ? "#FFE66D" : "#0D0D0D"} />
          </mesh>
        );
      })}
    </>
  );
}

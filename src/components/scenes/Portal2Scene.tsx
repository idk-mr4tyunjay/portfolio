"use client";

import { useSceneProgress } from "@/hooks/useSceneProgress";
import { lerp } from "@/lib/math";

/*
  SCENE 04 — Portal 2: Entering the Digital Realm
  Spec: 04-SCENE-SPECIFICATIONS.md §SCENE 04
  Scroll band: 63–71%

  Placeholder: snap to terminal black/green.
  TODO: implement Portal 2 glitch shader (scan lines + CRT distortion +
        random glitch blocks + color shift to #00FF41) as a fullscreen quad.
*/
export function Portal2Scene() {
  const progress = useSceneProgress("portal2");
  const g = lerp(0.1, 1.0, progress) * 0.6;

  return (
    <>
      <ambientLight intensity={1} />
      <mesh>
        <boxGeometry args={[100, 100, 100]} />
        <meshBasicMaterial color={[0, g, 0]} side={2} />
      </mesh>
    </>
  );
}

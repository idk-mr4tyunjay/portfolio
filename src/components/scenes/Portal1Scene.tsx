"use client";

import { useSceneProgress } from "@/hooks/useSceneProgress";
import { lerp } from "@/lib/math";

/*
  SCENE 02 — Portal 1: Descent into Wonder
  Spec: 04-SCENE-SPECIFICATIONS.md §SCENE 02
  Scroll band: 20–28%

  Placeholder: simple color-shift cube.
  TODO: implement the Portal 1 pixelation shader (shimmer + center-outward
        pixelation + color shift to pixel palette) as a fullscreen quad.
        Source GLSL in 04-SCENE-SPECIFICATIONS.md §Shader Specification.
*/
export function Portal1Scene() {
  const progress = useSceneProgress("portal1");

  const r = lerp(0.0, 0.1, progress);
  const g = lerp(0.05, 0.36, progress);
  const b = lerp(0.1, 0.11, progress);

  return (
    <>
      <ambientLight intensity={1} />
      <mesh>
        <boxGeometry args={[100, 100, 100]} />
        <meshBasicMaterial color={[r, g, b]} side={2} />
      </mesh>
    </>
  );
}

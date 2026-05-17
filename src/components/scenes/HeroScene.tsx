"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";
import { useSceneProgress } from "@/hooks/useSceneProgress";
import { lerp } from "@/lib/math";

/*
  SCENE 01 — Hero: The Awakening
  Spec: 04-SCENE-SPECIFICATIONS.md §SCENE 01
  Scroll band: 0–20%

  Placeholder: starfield + camera pull-back driven by scene progress.
  TODO: replace placeholder geometry with /public/models/astronaut.glb
        and add /public/models/spaceship.glb reveal at ~30% local progress.
        Wire the visor reflection shader (visorReflection.frag).
*/
export function HeroScene() {
  const groupRef = useRef<THREE.Group>(null);
  const progress = useSceneProgress("hero");

  useFrame(({ camera }) => {
    // Camera pull-back per 04-SCENE-SPECIFICATIONS.md §Camera Movement
    camera.position.z = lerp(5, 8, progress);
    camera.position.y = lerp(0, -2, progress);
    camera.lookAt(0, lerp(0, -2, progress), lerp(0, -5, progress));

    if (groupRef.current) {
      groupRef.current.rotation.y = progress * 0.1;
    }
  });

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={1.0}
        color="#8899FF"
      />
      <Stars
        radius={100}
        depth={50}
        count={1500}
        factor={4}
        saturation={0}
        fade
        speed={0.5}
      />
      <group ref={groupRef}>
        {/* Astronaut placeholder */}
        <mesh position={[0, 0, 0]}>
          <icosahedronGeometry args={[0.6, 1]} />
          <meshStandardMaterial
            color="#E8F4FF"
            metalness={0.4}
            roughness={0.2}
            emissive="#00D4FF"
            emissiveIntensity={0.2}
          />
        </mesh>
        {/* Spaceship placeholder, revealed as progress increases */}
        <mesh position={[0, -2, lerp(-10, -5, Math.max(0, progress - 0.3))]}>
          <torusGeometry args={[2.5, 0.4, 8, 24]} />
          <meshStandardMaterial
            color="#FF6B2B"
            emissive="#FF6B2B"
            emissiveIntensity={0.4}
            transparent
            opacity={Math.max(0, progress - 0.3) * 2}
          />
        </mesh>
      </group>
    </>
  );
}

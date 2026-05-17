"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { SKILLS } from "@/data/skills";

/*
  SCENE 05 — Arsenal: Floating in the Digital Void
  Spec: 04-SCENE-SPECIFICATIONS.md §SCENE 05
  Scroll band: 71–96%

  Placeholder: skill names floating in a black void with terminal-green text.
  TODO: hover/click interactions → skill popup (DOM overlay), drifting
        particle system, raycast picking, slow continuous rotation per skill,
        per-skill emissive boost on hover.
*/
export function ArsenalScene() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, dt) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += dt * 0.05;
    }
  });

  const skillPositions = SKILLS.map((_, i) => {
    const angle = (i / SKILLS.length) * Math.PI * 2;
    const radius = 4;
    return [
      Math.cos(angle) * radius,
      Math.sin(angle * 1.7) * 1.5,
      Math.sin(angle) * radius - 2,
    ] as const;
  });

  return (
    <>
      <color attach="background" args={["#0D0D0D"]} />
      <ambientLight intensity={0.3} />
      <group ref={groupRef}>
        {SKILLS.map((skill, i) => (
          <Text
            key={skill.id}
            position={skillPositions[i] as unknown as [number, number, number]}
            fontSize={0.6}
            color="#00FF41"
            anchorX="center"
            anchorY="middle"
          >
            {skill.name}
          </Text>
        ))}
      </group>
    </>
  );
}

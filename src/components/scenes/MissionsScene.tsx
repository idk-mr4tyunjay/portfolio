"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Stars, Text } from "@react-three/drei";
import * as THREE from "three";
import { PROJECTS } from "@/data/projects";

/*
  SCENE 06 — Missions: The Projects in Orbit
  Spec: 04-SCENE-SPECIFICATIONS.md §SCENE 06
  Scroll band: 96–~116% (extends past 100%)

  Placeholder: 3 colored spheres in triangle formation with rotation.
  TODO: hover/click → project card overlay (DOM), spotlights per planet,
        Plan A triangle positions: (-12,0,0) / (12,0,0) / (0,8,-8).
*/
export function MissionsScene() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, dt) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child) => {
        child.rotation.y += dt * 0.2;
      });
    }
  });

  const positions: ReadonlyArray<[number, number, number]> = [
    [-4, 0, 0],
    [4, 0, 0],
    [0, 2.5, -3],
  ];

  return (
    <>
      <color attach="background" args={["#020B1A"]} />
      <ambientLight intensity={0.4} />
      <Stars radius={80} depth={40} count={800} factor={3} fade />
      <group ref={groupRef}>
        {PROJECTS.map((project, i) => (
          <group key={project.id} position={positions[i]}>
            <mesh>
              <sphereGeometry args={[1.4, 32, 32]} />
              <meshStandardMaterial
                color={
                  i === 0 ? "#00D4FF" : i === 1 ? "#FF6B2B" : "#FFB800"
                }
                emissive={
                  i === 0 ? "#00D4FF" : i === 1 ? "#FF6B2B" : "#FFB800"
                }
                emissiveIntensity={0.4}
                roughness={0.4}
              />
            </mesh>
            <Text
              position={[0, -2, 0]}
              fontSize={0.35}
              color="#E8F4FF"
              anchorX="center"
            >
              {project.name}
            </Text>
          </group>
        ))}
      </group>
    </>
  );
}

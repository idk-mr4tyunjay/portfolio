"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/*
  SCENE 07 — Landing: The Moment of Rest
  Spec: 04-SCENE-SPECIFICATIONS.md §SCENE 07
  Scroll band: ~116–146%

  Placeholder: golden-hour gradient ground + sky.
  TODO: grass wind shader, /public/models/{astronaut,dog,tree}.glb,
        water plane with reflection, post-submit fade sequence + star reveal,
        DOM contact form (overlay, see src/components/ui/ContactForm.tsx).
*/
export function LandingScene() {
  const skyRef = useRef<THREE.Mesh>(null);

  useFrame((_, dt) => {
    // Subtle sky rotation for life
    if (skyRef.current) {
      skyRef.current.rotation.y += dt * 0.005;
    }
  });

  return (
    <>
      <color attach="background" args={["#FF9A3C"]} />
      <ambientLight intensity={0.8} color="#FFE8C0" />
      <directionalLight
        position={[20, 30, 20]}
        intensity={1.5}
        color="#FFC080"
        castShadow
      />

      {/* Sky dome (warm gradient placeholder) */}
      <mesh ref={skyRef}>
        <sphereGeometry args={[50, 32, 16]} />
        <meshBasicMaterial color="#FF9A3C" side={THREE.BackSide} />
      </mesh>

      {/* Ground */}
      <mesh position={[0, -1.5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[80, 80, 64, 64]} />
        <meshStandardMaterial color="#4A7C59" />
      </mesh>

      {/* Astronaut placeholder */}
      <mesh position={[0, -0.5, 0]} castShadow>
        <capsuleGeometry args={[0.4, 0.8, 4, 8]} />
        <meshStandardMaterial color="#FFF8F0" />
      </mesh>

      {/* Dog placeholder */}
      <mesh position={[1.2, -0.9, 0.2]} castShadow>
        <boxGeometry args={[0.4, 0.4, 0.7]} />
        <meshStandardMaterial color="#6B4423" />
      </mesh>

      {/* Tree placeholder */}
      <group position={[5, -1.5, -8]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.2, 0.3, 3]} />
          <meshStandardMaterial color="#6B4423" />
        </mesh>
        <mesh position={[0, 2.5, 0]} castShadow>
          <icosahedronGeometry args={[1.5, 1]} />
          <meshStandardMaterial color="#4A7C59" />
        </mesh>
      </group>
    </>
  );
}

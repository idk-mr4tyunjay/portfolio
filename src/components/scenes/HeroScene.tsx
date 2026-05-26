"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF, useAnimations, Environment } from "@react-three/drei";
import { useControls } from "leva";
import * as THREE from "three";
import { clone as cloneSkeleton } from "three/examples/jsm/utils/SkeletonUtils.js";
import { useScrollStore } from "@/store/scroll";
import { usePerfStore, effectiveTier } from "@/store/perf";
import { sceneProgress } from "@/data/timeline";

// ease-out-cubic — SPEC.md §9
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/*
  SCENE 01 — Hero. SPEC.md §4.
    [1.5] Pure-black background + starfield
    [2  ] Astronaut GLB + floating animation + LIVE TUNING via Leva
    [3  ] Camera z-lerp on Hero scroll, animation default → wave
    [4  ] Visor displays a live-rendered 3D Earth via render-target          ← here

  Camera + astronaut transforms are exposed via Leva controls so we can
  dial in the perfect framing in the browser, read the values off the
  panel, then bake them into constants for the next step.
*/
export function HeroScene() {
  const { camera } = useThree();

  const cam = useControls("Camera", {
    position: {
      // Earth-centric framing — camera 3 units back from origin, looking
      // straight at the Earth.  Earth (scale ≈ 1.5) fills the letterboxed
      // viewport.  As scroll progresses, camera dollies back to make room
      // for the astronaut appearing next to Earth.
      value: { x: 0, y: 0, z: 3 },
      step: 0.05,
      label: "start pos",
    },
    lookAt: {
      value: { x: 0, y: 0, z: 0 },
      step: 0.05,
    },
    endZ: {
      value: 8,
      min: 1,
      max: 15,
      step: 0.1,
      label: "end Z (scroll=1)",
    },
    fov: {
      value: 35,
      min: 20,
      max: 130,
      step: 1,
      label: "FOV (°)",
    },
    near: {
      value: 0.01,
      min: 0.001,
      max: 2.0,
      step: 0.005,
      label: "near clip",
    },
  });

  // FOV / near only re-apply when their Leva controls change (updateProjectionMatrix is expensive).
  useEffect(() => {
    if (!(camera instanceof THREE.PerspectiveCamera)) return;
    camera.fov = cam.fov;
    camera.near = cam.near;
    camera.updateProjectionMatrix();
  }, [camera, cam.fov, cam.near]);

  /*
    Camera motion is z-only: lerp from cam.position.z (scroll = 0) to cam.endZ
    (scroll = 1 within Hero band) using easeOutCubic.
    x, y, and lookAt are static — pulled live from the Leva controls so tweaking
    them is reactive but they don't animate with scroll.
    Reading scroll progress imperatively from the store so this frame loop
    doesn't trigger React re-renders.
  */
  useFrame(() => {
    if (!(camera instanceof THREE.PerspectiveCamera)) return;
    const global = useScrollStore.getState().progress;
    const local = sceneProgress(global, "hero");
    const t = easeOutCubic(local);

    camera.position.x = cam.position.x;
    camera.position.y = cam.position.y;
    camera.position.z = THREE.MathUtils.lerp(cam.position.z, cam.endZ, t);
    camera.lookAt(cam.lookAt.x, cam.lookAt.y, cam.lookAt.z);
  });

  return (
    <>
      <color attach="background" args={["#000000"]} />

      {/*
        Lighting setup:
        - Environment provides image-based reflections so the suit's
          PBR materials read real environment colors instead of flat shading.
        - Ambient + dim cool directional matches the spec; the env handles
          the rest.
        - A warm rim light from behind separates the astronaut from space.
      */}
      <Environment preset="night" />
      <ambientLight intensity={0.25} color="#223355" />
      <directionalLight
        position={[2, 1, 3]}
        intensity={0.6}
        color="#a8c5ff"
      />
      <directionalLight
        position={[-3, 1.5, -2]}
        intensity={0.4}
        color="#ffb070"
      />

      <Starfield />

      {/*
        Astronaut is hidden for now — we'll bring it back next to Earth
        once the Earth's framing is dialled in.  Keeping the Astronaut
        function below intact so we can re-mount it without re-writing.
      */}
      {/* <Suspense fallback={null}><Astronaut /></Suspense> */}

      <Suspense fallback={null}>
        <Earth />
      </Suspense>
    </>
  );
}

/* --------------------------------------------------------------------- */
/* Starfield — SPEC.md §4 + §13                                          */
/* --------------------------------------------------------------------- */

const STAR_COUNT_BY_TIER = { high: 1500, medium: 800, low: 400 } as const;

function Starfield() {
  const tier = effectiveTier(usePerfStore((s) => s.tier));
  const count = STAR_COUNT_BY_TIER[tier];
  const reducedMotion = useScrollStore((s) => s.reducedMotion);
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 50 + Math.random() * 50;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);

  useFrame((_, dt) => {
    if (reducedMotion || !pointsRef.current) return;
    pointsRef.current.rotation.y += dt * 0.005;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#f4f6ff"
        size={0.6}
        sizeAttenuation
        transparent
        opacity={0.85}
        depthWrite={false}
      />
    </points>
  );
}

/* --------------------------------------------------------------------- */
/* Astronaut — optimized GLB with live transform controls                */
/* --------------------------------------------------------------------- */

/*
  The visor-split GLB: walking_astronaut_visor_optimized.glb was produced by
  separating the visor faces out of Object_106 in Blender, then re-optimized
  with gltf-transform (meshopt + WebP). It contains a node named "Visor" with
  its own primitive — we find it by name and replace its material with a
  real reflective PBR material whose envMap is fed from a CubeCamera.
*/
const MODEL_PATH = "/models/walking_astronaut_visor_optimized.glb";

useGLTF.preload(MODEL_PATH, false, true);

function Astronaut() {
  const group = useRef<THREE.Group>(null);
  const gltf = useGLTF(MODEL_PATH, false, true);

  /*
    Clone the GLB scene so we get a fresh, never-parented tree. Without this,
    React Strict Mode's double-mount cycle pollutes the original gltf.scene's
    matrixWorld values, and head.getWorldPosition() returns the *previous*
    mount's world coords instead of the bind-pose scene-local position.
    SkeletonUtils.clone handles SkinnedMesh + Skeleton rebinding correctly.
  */
  const clonedScene = useMemo(
    () => cloneSkeleton(gltf.scene),
    [gltf.scene],
  );
  const { actions } = useAnimations(gltf.animations, group);

  const ast = useControls("Astronaut", {
    position: {
      value: { x: 0, y: 0, z: 0 },
      step: 0.05,
    },
    rotationDeg: {
      value: { x: 0, y: 0, z: 0 },
      step: 5,
      label: "rotation (°)",
    },
    targetHeight: {
      value: 2.5,
      min: 0.3,
      max: 10,
      step: 0.1,
      label: "height (units)",
    },
    anchorMode: {
      value: "head",
      options: ["head", "bbox center"],
      label: "anchor",
    },
    animation: {
      value: "wave",
      options: ["floating", "idle", "wave", "moon_walk", "none"],
      label: "animation",
    },
  });


  const { fitScale, anchor } = useMemo(() => {
    // Operate on the clone (it has no parent → matrixWorld is clean).
    clonedScene.updateMatrixWorld(true);

    const box = new THREE.Box3().setFromObject(clonedScene);
    const size = new THREE.Vector3();
    box.getSize(size);
    const fit = ast.targetHeight / size.y;

    /*
      Three.js's GLTFLoader strips dots from names ("head.42_45" → "head42_45"),
      so we match "head" followed by anything that's not another letter — covers
      "head", "head42_45", "head_bone", but not "headphones" / "header".
    */
    let head: THREE.Object3D | null = null;
    clonedScene.traverse((obj) => {
      if (head) return;
      if (/^head(?![a-z])/i.test(obj.name)) head = obj;
    });

    const anchorVec = new THREE.Vector3();
    if (ast.anchorMode === "head" && head) {
      (head as THREE.Object3D).getWorldPosition(anchorVec);
    } else {
      box.getCenter(anchorVec);
    }

    return { fitScale: fit, anchor: anchorVec };
  }, [clonedScene, ast.targetHeight, ast.anchorMode]);

  useEffect(() => {
    if (ast.animation === "none") return;
    const clip = actions[ast.animation];
    if (!clip) {
      console.warn(
        `Astronaut: "${ast.animation}" clip not found. Available:`,
        Object.keys(actions),
      );
      return;
    }
    clip.reset().setLoop(THREE.LoopRepeat, Infinity).play();
    return () => {
      clip.stop();
    };
  }, [actions, ast.animation]);

  const rotation: [number, number, number] = [
    THREE.MathUtils.degToRad(ast.rotationDeg.x),
    THREE.MathUtils.degToRad(ast.rotationDeg.y),
    THREE.MathUtils.degToRad(ast.rotationDeg.z),
  ];

  return (
    <group
      position={[ast.position.x, ast.position.y, ast.position.z]}
      rotation={rotation}
    >
      <group scale={fitScale}>
        <group
          ref={group}
          position={[-anchor.x, -anchor.y, -anchor.z]}
        >
          <primitive object={clonedScene} />
        </group>
      </group>
    </group>
  );
}

/* --------------------------------------------------------------------- */
/* Earth — Renders the real Earth GLB visible in the main scene.        */
/*                                                                       */
/*  The original earth.glb (64MB) packs three concentric spheres:        */
/*    - phong1 (innermost): day texture + city-lights emissive           */
/*    - lambert6 (middle): cloud PNG with alpha channel                  */
/*    - lambert7 (outermost): blue atmosphere shell with transmission    */
/*                                                                       */
/*  Day/night terminator comes from PBR shading: a dedicated directional */
/*  light illuminates one hemisphere (day texture visible), the dark     */
/*  hemisphere reveals the emissive city-lights map.                     */
/* --------------------------------------------------------------------- */

// Uncompressed Earth GLB — 8192×4096 textures (day surface, city-lights
// emissive, clouds).  The compressed version downsamples textures to
// roughly 1024×512 WebP which makes Earth look blurry at close framing.
// Heavy (61 MB) but the visual detail is the whole point of this scene.
const EARTH_PATH = "/models/earth.glb";

useGLTF.preload(EARTH_PATH, false, true);

function Earth() {
  const earthGltf = useGLTF(EARTH_PATH, false, true);

  // Replace the GLB's materials with our three-layer PBR setup.
  const earthClone = useMemo(() => {
    const cloned = cloneSkeleton(earthGltf.scene);

    // Configure each texture for maximum sharpness at the oblique angles
    // we view Earth's curve at.  Anisotropic filtering is the single
    // biggest win for "Earth seen from above" framing — without it the
    // far side of the texture turns to mush even with an 8K source.
    const sharpenTexture = (tex?: THREE.Texture | null) => {
      if (!tex) return;
      tex.anisotropy = 16; // three.js clamps to GPU max (commonly 16)
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.generateMipmaps = true;
      tex.needsUpdate = true;
    };

    cloned.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      const orig = mesh.material as THREE.MeshStandardMaterial;
      const hasMap = !!orig.map;
      const hasEmissive = !!orig.emissiveMap;

      sharpenTexture(orig.map);
      sharpenTexture(orig.emissiveMap);

      if (hasMap && hasEmissive) {
        // Day surface + city lights (emissive map visible on the night side).
        mesh.material = new THREE.MeshStandardMaterial({
          map: orig.map,
          emissiveMap: orig.emissiveMap,
          emissive: new THREE.Color(0xffffff),
          emissiveIntensity: 1.2,
          metalness: 0.0,
          roughness: 0.95,
          side: THREE.FrontSide,
          envMapIntensity: 0,
        });
        mesh.material.userData.earthLayer = "surface";
        mesh.renderOrder = 0;
      } else if (hasMap && !hasEmissive) {
        // Cloud layer — additive blend so bright cloud pixels brighten the
        // surface below; dark (non-cloud) pixels contribute nothing.  The
        // cloud texture's brightness doubles as alpha.
        mesh.material = new THREE.MeshBasicMaterial({
          map: orig.map,
          alphaMap: orig.map,
          color: 0xffffff,
          side: THREE.FrontSide,
          transparent: true,
          opacity: 1.0,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          toneMapped: false,
        });
        mesh.material.userData.earthLayer = "clouds";
        mesh.renderOrder = 1;
      } else {
        // Atmosphere shell (transmission > 0) and any other unclassified
        // meshes — hide.  The custom Fresnel shader caused black-flicker
        // frames so we drop the atmosphere entirely; the day-surface +
        // cloud layers carry the look on their own.
        mesh.visible = false;
      }
    });
    return cloned;
  }, [earthGltf.scene]);

  // Normalise the GLB to 1-unit diameter and grab its bbox-center offset.
  const { earthAutoScale, earthCenterOffset } = useMemo(() => {
    earthClone.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(earthClone);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);
    const maxDim = Math.max(size.x, size.y, size.z);
    return {
      earthAutoScale: maxDim > 0 ? 1 / maxDim : 1,
      earthCenterOffset: center,
    };
  }, [earthClone]);

  const e = useControls("Earth", {
    position: {
      // Earth pushed even further down so only the upper limb / horizon
      // arc is visible.  With scale=5 (radius 2.5) and y=-2.6, Earth's
      // top edge sits at y=−0.1 — i.e. JUST below the camera's horizontal
      // axis.  The horizon line appears at about 55–60% from the top.
      value: { x: 0, y: -2.6, z: 0 },
      step: 0.05,
    },
    scale: {
      // Big Earth → close enough that the curvature reads as a clear
      // horizon arc (like a satellite in low orbit, not a distant disc).
      value: 5,
      min: 0.5,
      max: 12,
      step: 0.1,
      label: "diameter (units)",
    },
    spinSpeed: { value: 0.015, min: 0, max: 0.5, step: 0.005 },
    tiltDeg: {
      value: 23.5,
      min: -90,
      max: 90,
      step: 0.5,
      label: "axial tilt (°)",
    },
    yawDeg: {
      // Pacific Ocean + scattered clouds face (no city-light heavy
      // continents). Tweak via Leva for whatever face you want at scroll=0.
      value: 180,
      min: -180,
      max: 360,
      step: 1,
      label: "initial yaw (°)",
    },
    cityLights: {
      // Low default — at scroll=0 we want a clearly-daylit hemisphere,
      // not a night-side city-lights look.
      value: 0.3,
      min: 0,
      max: 5,
      step: 0.05,
      label: "city lights",
    },
    cloudOpacity: { value: 1.0, min: 0, max: 1, step: 0.01 },
    sunPos: {
      // Sun positioned directly between camera and Earth — fully lights
      // the visible hemisphere ("noon" on the face that points at us).
      value: { x: 0, y: 0, z: 5 },
      step: 0.1,
      label: "sun direction",
    },
    sunIntensity: { value: 5, min: 0, max: 10, step: 0.05, label: "sun" },
  });

  const groupRef = useRef<THREE.Group>(null);
  const spinRef = useRef<THREE.Group>(null);
  const sunRef = useRef<THREE.DirectionalLight>(null);

  useFrame((_, dt) => {
    if (spinRef.current) {
      spinRef.current.rotation.y += dt * e.spinSpeed;
    }
    if (sunRef.current) {
      sunRef.current.position.set(e.sunPos.x, e.sunPos.y, e.sunPos.z);
      sunRef.current.intensity = e.sunIntensity;
    }
    if (groupRef.current) {
      groupRef.current.traverse((o) => {
        const m = (o as THREE.Mesh).material as
          | (THREE.Material & { userData: { earthLayer?: string } })
          | undefined;
        if (!m) return;
        const layer = m.userData.earthLayer;
        if (layer === "surface") {
          (m as THREE.MeshStandardMaterial).emissiveIntensity = e.cityLights;
        } else if (layer === "clouds") {
          (m as THREE.MeshBasicMaterial).opacity = e.cloudOpacity;
        }
      });
    }
  });

  // Group tree:
  //   <root: position + yaw>          — places Earth in the scene
  //     <sun light>                   — dedicated directional sun
  //     <tilt>                        — fixed axial tilt
  //       <spin scale>                — Y rotation each frame
  //         <bbox-center offset>      — brings GLB geometry to origin
  //           <earth GLB>
  return (
    <group
      ref={groupRef}
      position={[e.position.x, e.position.y, e.position.z]}
      rotation={[0, THREE.MathUtils.degToRad(e.yawDeg), 0]}
    >
      <directionalLight
        ref={sunRef}
        position={[e.sunPos.x, e.sunPos.y, e.sunPos.z]}
        intensity={e.sunIntensity}
        color="#ffffff"
      />
      <group rotation={[THREE.MathUtils.degToRad(e.tiltDeg), 0, 0]}>
        <group ref={spinRef} scale={earthAutoScale * e.scale}>
          <group
            position={[
              -earthCenterOffset.x,
              -earthCenterOffset.y,
              -earthCenterOffset.z,
            ]}
          >
            <primitive object={earthClone} />
          </group>
        </group>
      </group>
    </group>
  );
}

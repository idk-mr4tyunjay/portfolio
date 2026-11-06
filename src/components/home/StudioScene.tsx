"use client";

import { useEffect, useRef } from "react";
import {
  BackSide,
  Color,
  DoubleSide,
  Group,
  Mesh,
  MeshBasicMaterial,
  NoToneMapping,
  PerspectiveCamera,
  Quaternion,
  Scene,
  ShaderMaterial,
  SRGBColorSpace,
  Texture,
  TextureLoader,
  Vector2,
  Vector3,
  WebGLRenderer,
  type Material,
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";

export type ScreenCorners = [number, number][];

type StudioSceneProps = {
  progress: number;
  onReady?: () => void;
  onScreenChange?: (corners: ScreenCorners) => void;
  onError?: () => void;
  className?: string;
};

type CameraSample = {
  position: [number, number, number];
  quaternion: [number, number, number, number];
  horizontalFov: number;
};

type Palette = {
  light: [number, number, number];
  shadow: [number, number, number];
  threshold: number;
  toon: boolean;
};

type SceneData = {
  referenceAspect: number;
  camera: CameraSample[];
  lightDirection: [number, number, number];
  screenCorners: [number, number, number][];
  materials: Record<string, Palette>;
};

const vertexShader = /* glsl */ `
  varying vec3 vWorldNormal;
  void main() {
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 lightColor;
  uniform vec3 shadowColor;
  uniform vec3 lightDirection;
  uniform float threshold;
  varying vec3 vWorldNormal;
  void main() {
    float light = dot(normalize(vWorldNormal), lightDirection);
    float edge = max(fwidth(light), 0.002);
    float band = smoothstep(threshold - edge, threshold + edge, light);
    gl_FragColor = vec4(mix(shadowColor, lightColor, band), 1.0);
    #include <colorspace_fragment>
  }
`;

function createOutline(viewport: Vector2) {
  return new ShaderMaterial({
    uniforms: {
      viewport: { value: viewport },
      ink: { value: new Color("#35243B") },
    },
    side: BackSide,
    depthWrite: false,
    vertexShader: /* glsl */ `
      uniform vec2 viewport;
      void main() {
        vec4 clip = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        vec3 viewNormal = normalize(normalMatrix * normal);
        vec2 direction = (projectionMatrix * vec4(viewNormal, 0.0)).xy;
        float lengthSquared = dot(direction, direction);
        if (lengthSquared > 0.00001) {
          clip.xy += normalize(direction) * 1.2 / viewport * clip.w;
        }
        clip.z += 0.00003 * clip.w;
        gl_Position = clip;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 ink;
      void main() {
        gl_FragColor = vec4(ink, 1.0);
        #include <colorspace_fragment>
      }
    `,
  });
}

function disposeModel(model: Group) {
  const materials = new Set<Material>();
  model.traverse((object) => {
    if (!(object instanceof Mesh)) return;
    object.geometry.dispose();
    const list = Array.isArray(object.material) ? object.material : [object.material];
    list.forEach((material) => materials.add(material));
  });
  materials.forEach((material) => material.dispose());
}

/** The scene only draws when progress or its viewport changes. */
export default function StudioScene({
  progress,
  onReady,
  onScreenChange,
  onError,
  className,
}: StudioSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(progress);
  const callbacksRef = useRef({ onReady, onScreenChange, onError });
  const invalidateRef = useRef<(() => void) | null>(null);
  const lastCornersRef = useRef<ScreenCorners | null>(null);

  useEffect(() => {
    callbacksRef.current = { onReady, onScreenChange, onError };
    // onReady can cause the parent's screen element to mount after our draw.
    // Re-send cached geometry after that React commit without another GPU pass.
    if (lastCornersRef.current) onScreenChange?.(lastCornersRef.current);
  }, [onReady, onScreenChange, onError]);

  useEffect(() => {
    progressRef.current = progress;
    invalidateRef.current?.();
  }, [progress]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({ alpha: false, antialias: true, powerPreference: "low-power" });
    } catch {
      callbacksRef.current.onError?.();
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.outputColorSpace = SRGBColorSpace;
    renderer.toneMapping = NoToneMapping;
    renderer.setClearColor("#F1F0EA");
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.setAttribute("aria-hidden", "true");
    container.appendChild(renderer.domElement);

    const scene = new Scene();
    const camera = new PerspectiveCamera(40, 1, 0.01, 50);
    const viewport = new Vector2(1, 1);
    const outlineMaterial = createOutline(viewport);
    const nextPosition = new Vector3();
    const nextQuaternion = new Quaternion();
    const projected = new Vector3();
    const screenWorld: Vector3[] = [];
    const replacementMaterials = new Map<string, Material>();
    const controller = new AbortController();
    let model: Group | undefined;
    let screenTexture: Texture | undefined;
    let data: SceneData | undefined;
    let frame = 0;
    let disposed = false;
    let contextLost = false;

    function draw() {
      frame = 0;
      if (disposed || contextLost || !data || !model) return;
      const width = container!.clientWidth;
      const height = container!.clientHeight;
      if (width === 0 || height === 0) return;
      if (viewport.x !== width || viewport.y !== height) {
        viewport.set(width, height);
        renderer.setSize(width, height, false);
      }
      const progress = Math.max(0, Math.min(1, progressRef.current));
      const cursor = progress * (data.camera.length - 1);
      const index = Math.floor(cursor);
      const start = data.camera[index];
      const end = data.camera[Math.min(index + 1, data.camera.length - 1)];
      const blend = cursor - index;
      camera.position.fromArray(start.position).lerp(nextPosition.fromArray(end.position), blend);
      camera.quaternion.fromArray(start.quaternion).slerp(nextQuaternion.fromArray(end.quaternion), blend);
      camera.aspect = width / height;
      const horizontalFov = start.horizontalFov + (end.horizontalFov - start.horizontalFov) * blend;
      // A portrait opening uses the same low camera with a closer, higher crop.
      // Ease back into the authored framing as the camera reaches the monitor.
      const narrow = Math.max(0, Math.min(1, (700 - width) / 280));
      const settleProgress = Math.max(0, Math.min(1, (progress - 0.55) / 0.35));
      const settle = 1 - settleProgress * settleProgress * (3 - 2 * settleProgress);
      const framing = 1 - (1 - Math.min(1, camera.aspect / 1.1)) * narrow * settle;
      camera.fov = (2 * Math.atan(Math.tan(horizontalFov / 2) * framing / camera.aspect) * 180) / Math.PI;
      if (narrow > 0 && settle > 0) {
        camera.setViewOffset(width, height, 0, height * 0.18 * narrow * settle, width, height);
      } else {
        camera.clearViewOffset();
      }
      camera.updateProjectionMatrix();
      camera.updateMatrixWorld();
      renderer.render(scene, camera);

      const corners: ScreenCorners = [];
      for (const point of screenWorld) {
        projected.copy(point).applyMatrix4(camera.matrixWorldInverse);
        if (projected.z >= -camera.near) {
          lastCornersRef.current = [];
          callbacksRef.current.onScreenChange?.([]);
          return;
        }
        projected.copy(point).project(camera);
        corners.push([(projected.x + 1) / 2, (1 - projected.y) / 2]);
      }
      lastCornersRef.current = corners;
      callbacksRef.current.onScreenChange?.(corners);
    }

    function invalidate() {
      if (!frame && !disposed && !contextLost) frame = requestAnimationFrame(draw);
    }
    invalidateRef.current = invalidate;

    const resizeObserver = new ResizeObserver(invalidate);
    resizeObserver.observe(container);
    const onContextLost = (event: Event) => {
      event.preventDefault();
      contextLost = true;
      callbacksRef.current.onError?.();
    };
    const onContextRestored = () => {
      contextLost = false;
      invalidate();
      callbacksRef.current.onReady?.();
    };
    renderer.domElement.addEventListener("webglcontextlost", onContextLost);
    renderer.domElement.addEventListener("webglcontextrestored", onContextRestored);

    async function load() {
      try {
        const [metadataResponse, glbResponse] = await Promise.all([
          fetch("/studio/scene.json", { signal: controller.signal }),
          fetch("/studio/scene.glb", { signal: controller.signal }),
        ]);
        if (!metadataResponse.ok || !glbResponse.ok) throw new Error("Studio asset unavailable");
        const [metadata, buffer] = await Promise.all([
          metadataResponse.json() as Promise<SceneData>,
          glbResponse.arrayBuffer(),
        ]);
        if (disposed) return;
        const gltf = await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).parseAsync(buffer, "/studio/");
        if (disposed) {
          disposeModel(gltf.scene);
          return;
        }
        model = gltf.scene;
        data = metadata;
        screenWorld.push(...metadata.screenCorners.map((point) => new Vector3(...point)));
        screenTexture = await new TextureLoader().loadAsync("/studio/screen.png");
        if (disposed) {
          screenTexture.dispose();
          disposeModel(model);
          return;
        }
        screenTexture.colorSpace = SRGBColorSpace;
        screenTexture.flipY = false;
        screenTexture.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
        const outlines: Mesh[] = [];
        model.traverse((object) => {
          if (!(object instanceof Mesh)) return;
          const role = object.userData.studioRole as string;
          const materialName = object.userData.studioMaterial as string;
          const palette = metadata.materials[materialName];
          const original = Array.isArray(object.material) ? object.material : [object.material];
          original.forEach((material) => material.dispose());
          const key = role + materialName;
          let material = replacementMaterials.get(key);
          if (!material) {
            if (role === "screen") {
              material = new MeshBasicMaterial({ map: screenTexture, side: DoubleSide });
            } else if (palette?.toon && role === "toon") {
              material = new ShaderMaterial({
                uniforms: {
                  lightColor: { value: new Color(...palette.light) },
                  shadowColor: { value: new Color(...palette.shadow) },
                  lightDirection: { value: new Vector3(...metadata.lightDirection).normalize() },
                  threshold: { value: palette.threshold },
                },
                vertexShader,
                fragmentShader,
                side: DoubleSide,
              });
            } else {
              material = new MeshBasicMaterial({
                color: palette ? new Color(...palette.light) : new Color("#35243B"),
                side: DoubleSide,
              });
            }
            replacementMaterials.set(key, material);
          }
          object.material = material;
          if (role === "toon") {
            const outline = new Mesh(object.geometry, outlineMaterial);
            outline.position.copy(object.position);
            outline.quaternion.copy(object.quaternion);
            outline.scale.copy(object.scale);
            outline.renderOrder = -1;
            outlines.push(outline);
          }
        });
        model.add(...outlines);
        scene.add(model);
        draw();
        callbacksRef.current.onReady?.();
      } catch (error) {
        if (!disposed && !(error instanceof DOMException && error.name === "AbortError")) {
          callbacksRef.current.onError?.();
        }
      }
    }
    void load();

    return () => {
      disposed = true;
      controller.abort();
      cancelAnimationFrame(frame);
      invalidateRef.current = null;
      lastCornersRef.current = null;
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener("webglcontextlost", onContextLost);
      renderer.domElement.removeEventListener("webglcontextrestored", onContextRestored);
      if (model) disposeModel(model);
      screenTexture?.dispose();
      outlineMaterial.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={containerRef} className={className} style={{ width: "100%", height: "100%" }} aria-hidden="true" />;
}

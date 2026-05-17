# Shaders

GLSL source files live here. The Next.js webpack config registers `.glsl`, `.vs`, `.fs`, `.vert`, `.frag` as `asset/source`, so they import as strings:

```ts
import portalDescentFS from "@/shaders/portalDescent.frag";
```

## Planned shaders (see 04-SCENE-SPECIFICATIONS.md for full source)

- `portalDescent.frag` — Scene 02: shimmer + center-outward pixelation + color shift
- `portalGlitch.frag`  — Scene 04: scan lines + CRT distortion + color shift to terminal green
- `pixelate.frag`      — Scene 03: post-process pixelation of entire scene
- `ascii.frag`         — Scene 05 (optional): ASCII rendering
- `visorReflection.frag` — Scene 01: env-map + fresnel for astronaut visor
- `terrain.vert`       — Scene 07: height-map displacement
- `grassWind.vert`     — Scene 07: sine-wave grass animation

Every shader must declare a reduced-motion fallback path in the consuming component — see CLAUDE.md.

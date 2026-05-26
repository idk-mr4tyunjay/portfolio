# One Small Step — v2 Spec

**Status:** FINAL & LOCKED
**Version:** 2.0
**Updated:** 2026-05-17
**Supersedes:** `01-STORY-NARRATIVE-BIBLE.md`, `02-VISUAL-DESIGN-SYSTEM.md`, `03-CONTENT-REQUIREMENTS.md`, `04-SCENE-SPECIFICATIONS.md` (deleted)

> v2 trims the v1 7-scene cinematic to a 5-scene blend of 3D and 2D. Single portal, no Arsenal, no solar system. Projects are HTML cards over a fading 3D background. The visor-reflection moment is preserved, the journey through the pixel world is preserved, and the landing-with-dog payoff is preserved. Everything else was cut for feasibility.

---

## 1. The Product

A scroll-driven personal portfolio that tells a developer's journey as one continuous descent. The user scrolls once, top to bottom, and walks through five scenes: floating in deep space, pixelating into a memory of how they got here, walking past life milestones, surfacing into a project review, and finally landing on a quiet grass field at golden hour with their dog and a contact form.

No nav, no chapters, no clicks-to-progress (except for the optional "view project →" link on each card, which opens a new tab). Total document height is exactly 1.0× viewport (Lenis-smoothed). Every animation maps from `scroll / (document.body.scrollHeight - window.innerHeight)` ∈ [0, 1].

---

## 2. The Five-Scene Arc

| # | Scene | Scroll % | Aesthetic | Role |
|---|---|---|---|---|
| 01 | Hero (Awakening) | 0–18% | 3D deep space | Astronaut floats; visor reflection; starfield reveal |
| 02 | Portal | 18–25% | Pixelation shader | Single transition: space → pixel |
| 03 | Pixel Journey | 25–62% | 2D parallax, 8-bit | 5 milestones, skills as pickups, 3 NPC lines |
| 04 | Projects | 62–86% | HTML cards over fading 3D | 3–5 project cards, scroll-pinned |
| 05 | Landing | 86–100% | 3D grass, golden hour | Astronaut + dog; terminal-styled contact form |

---

## 3. Scroll Architecture

- Total document height: 1.0× viewport (the v1 1.46× overflow is removed).
- Global scroll progress: `g = clamp(scrollY / (body.scrollHeight - innerHeight), 0, 1)`.
- Per-scene progress is a linear remap from the scene's % range to [0, 1].
- Lenis handles inertial smoothing; subscribe in `useLenis` and write the smoothed value into the Zustand `scroll` store.
- Every component subscribes to the store and computes its own scene progress; no per-component scroll listeners.
- Reduced-motion mode skips inertia: writes raw `scrollY` straight to the store.

---

## 4. Scene 01 — Hero

### Goal
First impression. Astronaut floating in deep space, helmet reflecting a starfield. As the user scrolls, camera pulls back, revealing the vastness of space.

### Composition
- **Astronaut model:** `/public/models/astronaut.glb`, position `(0, 0, 0)`, scale 1.0. Helmet visor must be a **separate submesh** for the visor shader.
- **Starfield:** 1,500 stars at high tier (see §13 tiers), distributed on a sphere of radius 100. `THREE.Points` with custom size attenuation.
- **No spaceship.** (Cut from v1.)
- **Camera:** Perspective, FOV 50, start `(0, 0, 3)`, lerp to `(0, 0, 8)` as `progress` goes 0→1. Always looks at origin.
- **Lighting:** One key directional `(2, 1, 3)` intensity 0.8, one ambient `0x223355` intensity 0.4.

### Scroll mapping
```
sceneProgress = clamp(g / 0.18, 0, 1)
camera.position.z = lerp(3, 8, easeOutCubic(sceneProgress))
astronaut.rotation.y = sin(uTime * 0.1) * 0.05   // slow drift, always
```

### Visor reflection
Procedural shader applied to the visor submesh; see §10.2. No cubemap, no envMap, no asset load.

### Post-processing
- Bloom: strength 0.8, threshold 0.85, radius 0.4 (high tier only; see §13)

### Audio
None. Scene starts silent so the portal whoosh in Scene 02 lands.

### Testing checklist
- [ ] Astronaut visible on first paint (model loaded before scene mount)
- [ ] Visor reflection visible and varies with view direction
- [ ] Starfield doesn't strobe on slow scroll
- [ ] 60 FPS desktop, ≥30 FPS on a Pixel 6
- [ ] Reduced-motion: camera snaps to mid-position, no drift

---

## 5. Scene 02 — Portal

### Goal
Single transition. Pixelation expands from screen center outward; color desaturates toward the pixel-world palette. Audio cue accompanies.

### Implementation
Full-screen post-processing pass. The previous frame is rendered to a render target, then this shader samples it.

### Shader: `portalPixelate`
```glsl
uniform sampler2D tDiffuse;
uniform float uProgress;       // 0.0 to 1.0
uniform vec2 uResolution;
varying vec2 vUv;

void main() {
  float pixelSize = mix(1.0, 32.0, uProgress);
  vec2 pixelated = floor(vUv * uResolution / pixelSize) * pixelSize / uResolution;

  // Center-outward mask: pixelation reaches the edges last
  float dist = distance(vUv, vec2(0.5));
  float edge = uProgress * 0.6;
  float mask = smoothstep(edge, edge + 0.1, dist);
  vec2 finalUv = mix(pixelated, vUv, 1.0 - mask);

  vec4 color = texture2D(tDiffuse, finalUv);

  // Warm tint + saturation drop toward pixel palette
  float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
  color.rgb = mix(color.rgb, vec3(gray), uProgress * 0.25);
  color.rgb *= mix(vec3(1.0), vec3(1.05, 0.97, 0.88), uProgress);

  gl_FragColor = color;
}
```

### Scroll mapping
```
sceneProgress = clamp((g - 0.18) / (0.25 - 0.18), 0, 1)
uProgress = easeInOutExpo(sceneProgress)
```

### Audio
- `/public/audio/portal-whoosh.mp3`, looped over 18%–25%, volume 0.4, target file size <80KB.

### Reduced-motion fallback
At `g >= 0.215` (midpoint), hard cut: unmount Scene 01, mount Scene 03, skip the shader pass entirely.

### Performance fallback (low tier)
Replace shader with a 0.3s opacity crossfade between Scene 01 and Scene 03 background colors. No post-processing pass.

---

## 6. Scene 03 — Pixel Journey

### Goal
The emotional spine of the portfolio. Astronaut walks left-to-right (visual: world scrolls right-to-left) past 5 life milestones. At each milestone, 2–3 skill icons appear and "collect" as the astronaut passes. 3 NPCs offer brief, written-on-the-side commentary.

### Composition
- **Camera:** Orthographic, zoom 100, fixed at `(0, 0, 10)` looking at origin.
- **Astronaut sprite:** 8-frame walk cycle, anchored at screen center, plays at 8 FPS regardless of scroll speed (decoupled timer).
- **Parallax (3 layers at high tier, 2 at medium/low):**
  - Layer 1 background (distant mountains/clouds): scrolls 0.3× scroll speed
  - Layer 2 midground (terrain + milestone monuments): scrolls 1.0×
  - Layer 3 foreground (grass blades / dust): scrolls 1.2×
- **Background color:** `--pixel-sky` (#8fb8e8) at top, gradient to `--pixel-ground` (#9a6b3c) below horizon.

### Milestones (5, evenly spaced)
| # | Label | Scene-local % | Skills (count) |
|---|---|---|---|
| 1 | Learning | 0–20% | 2–3 |
| 2 | Building | 20–40% | 2–3 |
| 3 | Shipping | 40–60% | 2–3 |
| 4 | Scaling | 60–80% | 2–3 |
| 5 | Leading | 80–100% | 2–3 |

Each milestone renders:
- A pixel-art monument sprite in the midground.
- A label in Orbitron 18px above it; fades in over a 10% scroll window centered on the milestone.
- 2–3 skill icons positioned around the monument with Monaco 11px labels.

### Skill pickup animation
As the astronaut sprite crosses a skill icon's x-position (within ±3% of scroll), the icon plays:
1. Scale 1.0 → 1.25 → 1.0 over 0.4s
2. Brief glow (terminal green at 0.6 opacity) that fades in 0.6s
3. Label tooltip slides in below, holds 2s, fades

After collection, the icon stays drawn but at 0.6 opacity (visually marking "collected").

### NPC dialogue
3 NPCs between milestones. Speech bubble (white, pixel-art outlined) appears for a 6% scroll window. Caveat 16px text inside.

Example placements (default — editable in `src/data/dialogue.ts`):
- NPC 1, scroll 35%: "Most never get past this point."
- NPC 2, scroll 45%: "Shipping is the hard part."
- NPC 3, scroll 55%: "Don't lose the wonder."

### Audio
- `/public/audio/pixel-bgm.mp3`, looped chiptune ambient, volume 0.25, target <120KB.

### Sprites
| File | Size budget | Notes |
|---|---|---|
| `astronaut-walk.png` | <80KB | 8 frames, 128×128 each, packed horizontally |
| `monuments.png` | <60KB | 5 monument sprites in one atlas |
| `skill-icons.png` | <80KB | Up to 15 icons in one atlas |
| `npcs.png` | <40KB | 3 NPC sprites |
| `parallax-bg.png` | <60KB | 2048×512, tiled horizontally |
| `parallax-mid.png` | <80KB | 2048×512 |
| `parallax-fg.png` | <50KB | 2048×512, transparent |

### Reduced-motion fallback
- Astronaut sprite shows frame 0 only (no walk cycle).
- Parallax layers static (no scroll-driven offset).
- Skill icons appear in their final "collected" state from scene start.
- NPC bubbles appear all at once, stacked vertically in the corner.

### Testing checklist
- [ ] All 5 milestones reach correct on-screen position at their target scroll %
- [ ] Skill pickups trigger within ±3% scroll regardless of scroll velocity
- [ ] Walk cycle plays at 8 FPS, doesn't desync on rapid scroll
- [ ] Parallax layers feel cohesive on a 120Hz display
- [ ] NPC bubbles don't overlap with milestone labels

---

## 7. Scene 04 — Projects

### Goal
Project showcase. The 2D moment in the 3D/2D blend: HTML cards in a DOM overlay, scroll-pinned, over a fading 3D space background that callbacks Scene 01.

### Composition
- **Three.js background:** Scene 03's pixel world is unmounted at `g = 0.62`. Scene 01's starfield is remounted but darker (`--projects-bg`). 200 drifting particles, subtle (no bloom in this scene at low tier).
- **DOM overlay:** A `<section>` fixed-positioned on top of the Three.js canvas, holding all cards. `pointer-events` enabled only on the visible card.

### Project cards
Number: 3–5 (configurable in `src/data/projects.ts`).

Card visual:
- Width: 600px desktop, 92vw mobile (max 480px).
- Background: `--projects-card` (rgba(13, 19, 39, 0.85)).
- Border: 1px solid `--projects-border` (rgba(124, 246, 255, 0.3)).
- Border-radius: 12px.
- Padding: 32px desktop, 20px mobile.
- Box-shadow: `0 8px 32px rgba(0, 0, 0, 0.4)`.

Card content (top to bottom):
1. Thumbnail (optional, 96×96 webp, top-right corner)
2. Project name (Orbitron 700, 24px, `--color-star-white`)
3. Description (Inter 400, 16px, 2–3 sentences)
4. Tech stack chips (Monaco 12px, pill-shaped, 4px gap, `--color-plasma-cyan` border)
5. Key lesson (Caveat 400 italic, 18px, prefixed with `"`)
6. "view project →" link (Inter 500, 14px, `--color-plasma-cyan`, bottom-right, opens new tab)

### Scroll mapping
```
sceneProgress = clamp((g - 0.62) / (0.86 - 0.62), 0, 1)
```
For N cards, each card occupies `1/N` of sceneProgress. Within each card's slot:
- 0.0–0.2: slide in from `translateX(60px)`, opacity 0 → 1
- 0.2–0.8: held centered, opacity 1
- 0.8–1.0: slide out to `translateX(-60px)`, opacity 1 → 0

Only one card visible at a time. The "current" card has `pointer-events: auto`; others have `pointer-events: none`.

### Reduced-motion fallback
Cards rendered as a static vertical list. Natural document scroll moves through them. No slide animation.

### Performance notes
- The 3D canvas keeps rendering but at a reduced particle count and no post-processing.
- On low tier, the 3D canvas pauses (render loop suspended), with a static gradient background instead.

### Testing checklist
- [ ] Exactly one card visible at any scroll position within scene
- [ ] Cards' "view project" link opens in new tab, doesn't break scroll
- [ ] Cards reflow on mobile (480px max width)
- [ ] Tab navigation moves between cards' focus traps in order

---

## 8. Scene 05 — Landing

### Goal
The emotional payoff. 3D grass field at golden hour. Astronaut sitting cross-legged, helmet off (resting beside them), looking out at the horizon. Dog sitting beside them. Terminal-styled contact form appears as an overlay.

### Composition
- **Camera:** Perspective, FOV 45, fixed at `(0, 1.2, 3.5)`, looking at `(0, 0.4, 0)`. No scroll-driven movement after Scene 05 starts.
- **Astronaut:** Reuses `astronaut.glb` from Scene 01, but in a sitting pose. Implementation: ship a second pose GLB or use a vertex morph target. Position `(0, 0, 0)`.
- **Dog:** `/public/models/dog.glb`, low-poly, static sitting pose (no rig). Position `(0.6, 0, 0.1)`, scale 0.4. Target file size <80KB.
- **Helmet (separated):** Astronaut's removed helmet rests on the grass at `(-0.4, 0.05, 0.3)`.
- **Grass:** Flat plane 20×20 units at y=0, with `grass.webp` texture (1024×1024, tiling 4×4). No terrain displacement, no per-vertex wind shader. Subtle normal map for tilt.
- **Sky:** Gradient skybox via a large sphere with a custom shader:
  - Top: `--landing-sky-top` (#1a2a4a)
  - Middle: `--landing-sky-mid` (#ff6a3d)
  - Bottom: `--landing-sky-bot` (#ffd57a)
- **Lighting:**
  - Directional from horizon at `(0, 0.2, 5)`, color `#ff9a55`, intensity 1.1
  - Ambient `#5577aa`, intensity 0.5
- **Particles:** 50 dust motes (high tier) / 25 (medium) / 0 (low). Slow random drift, lifetimes 8–12s, small white sprites with additive blending.

### Contact form overlay
Position: right side of viewport, centered vertically. Width 420px desktop, 92vw mobile (anchored bottom on mobile to avoid covering scene).

Styling — terminal aesthetic with warmth:
- Background: `rgba(3, 8, 31, 0.78)` (deep space at 78% opacity)
- Border: 1px solid `--terminal-green` at 0.4 opacity
- Border-radius: 6px
- Padding: 28px
- Labels: Monaco 12px, `--terminal-green`, uppercase, letter-spacing 0.08em
- Inputs: Inter 400, 15px, `--color-star-white`, transparent background, 1px solid `--terminal-green` at 0.3 opacity bottom-border only
- Focus state: bottom-border opacity 1.0, glow `0 0 8px var(--color-plasma-cyan)`
- Submit button: Monaco 13px uppercase "SEND SIGNAL ▮", `--terminal-green` text on transparent, with a 1px border. The `▮` blinks at 2Hz.

Fields:
- Name (text, required, max 80 chars)
- Email (email, required, validated by zod)
- Message (textarea, required, max 280 chars, character counter bottom-right)

### Form backend
- Next.js route: `POST /api/send-signal`
- Validates with zod schema
- Sends via Resend SDK to `process.env.RECIPIENT_EMAIL`
- In-memory rate limit: 1 submission per IP per 60s (`Map<ip, timestamp>`)
- Returns `{ ok: true }` on success, `{ ok: false, error }` otherwise
- Required env vars: `RESEND_API_KEY`, `RECIPIENT_EMAIL`

### Submit flow
1. User submits form.
2. Submit button disables, shows "TRANSMITTING ▮▮▮" with marquee dots.
3. On success: form contents fade out (0.4s), replaced by:
   > "Signal sent. Looking forward to talking."
   in Caveat 22px, `--color-star-white`.
4. After 5s, the success message fades, and the entire form overlay slides out to the right.
5. The 3D scene is now full-screen: astronaut + dog silhouetted against the golden sky. Page is at scroll 100%; user can leave.

### Audio
- `/public/audio/landing-ambient.mp3` — gentle wind + distant birds, looped, volume 0.3, target <150KB. Starts at scene mount with a 2s fade-in.
- `/public/audio/submit-chime.mp3` — single soft chime on successful submit, volume 0.5, target <20KB.

### Reduced-motion fallback
- No camera drift, no particle drift.
- Skybox gradient still rendered (static, no animation).
- Form blinking cursor disabled (static `▮`).
- Form submission flow plays without slide animations; success message replaces form instantly.

### Testing checklist
- [ ] Astronaut + dog visible on scene mount
- [ ] Form is keyboard-accessible end-to-end (Tab through fields, Enter submits)
- [ ] Form submits successfully to a real Resend account in dev
- [ ] Validation errors show inline below each field (Inter 12px, `--color-warning-amber`)
- [ ] Rate limit responds with a clear error message
- [ ] Audio loads without blocking scene paint
- [ ] After submit, scroll doesn't jump

---

## 9. Visual Design System

### Palette
```css
:root {
  /* Shared */
  --color-deep-space: #03081f;
  --color-star-white: #f4f6ff;
  --color-plasma-cyan: #7cf6ff;
  --color-warning-amber: #ffb14a;
  --terminal-green: #00ff41;

  /* Scene 01 — Hero (deep space) */
  --hero-bg: #03081f;
  --hero-accent: #5b8cff;
  --hero-glow: #a8c5ff;

  /* Scene 03 — Pixel Journey */
  --pixel-sky: #8fb8e8;
  --pixel-grass: #6fb359;
  --pixel-ground: #9a6b3c;
  --pixel-monument: #fff2c4;
  --pixel-shadow: #2c1f1a;

  /* Scene 04 — Projects */
  --projects-bg: #0d1327;
  --projects-card: rgba(13, 19, 39, 0.85);
  --projects-border: rgba(124, 246, 255, 0.3);

  /* Scene 05 — Landing (golden hour) */
  --landing-sky-top: #1a2a4a;
  --landing-sky-mid: #ff6a3d;
  --landing-sky-bot: #ffd57a;
  --landing-grass: #5d8f4e;
}
```

### Typography
| Use | Font | Weight | Size range |
|---|---|---|---|
| Display (scene labels, hero title) | Orbitron | 700 | 28–72px |
| Body (descriptions, dialogue) | Inter | 400, 500 | 14–18px |
| Handwritten accents (NPC, key lessons) | Caveat | 400 | 16–22px |
| Monospace (form labels, terminal) | Monaco/SF Mono | 400 | 11–14px |

Load via `next/font/google`. Subset to Latin. Self-host Monaco fallback via `font-display: swap`.

### Spacing scale (px)
`4, 8, 12, 16, 24, 32, 48, 64, 96, 128`

### Easing curves
- `ease-out-cubic`: `cubic-bezier(0.33, 1, 0.68, 1)` — most fades and lerps
- `ease-in-out-expo`: `cubic-bezier(0.87, 0, 0.13, 1)` — portal transition
- `linear` — particle drift, raw scroll lerps

### Breakpoints
- Mobile: ≤640px
- Tablet: 641–1024px
- Desktop: ≥1025px

---

## 10. Shaders

Only two custom shaders in v2. Both must compile on Safari 16+, Firefox 115+, Chrome 110+. Test on iOS Safari first; if it doesn't compile there, it ships nowhere.

### 10.1 portalPixelate
See §5 above. Single post-processing pass, full-screen. Center-outward pixelation + saturation drop + warm tint.

### 10.2 visorReflection

Applied to the helmet visor submesh in Scene 01. Replaces v1's envMap-based reflection — no cubemap, no asset load.

```glsl
// Vertex shader passes vNormal (world-space) and vViewDir (world-space)

uniform float uTime;
varying vec3 vNormal;
varying vec3 vViewDir;

float hash21(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  vec3 N = normalize(vNormal);
  vec3 V = normalize(vViewDir);
  vec3 R = reflect(-V, N);

  // Fresnel — strong at glancing angles
  float fresnel = pow(1.0 - max(dot(N, V), 0.0), 2.5);

  // Deep blue base
  vec3 base = vec3(0.01, 0.02, 0.08);

  // Procedural stars from reflection direction
  vec2 starUv = R.xy * 8.0 + R.z * 4.0;
  float star = step(0.997, hash21(floor(starUv * 80.0)));
  // Slight time-driven twinkle
  star *= 0.6 + 0.4 * sin(uTime * 2.0 + hash21(floor(starUv * 80.0)) * 6.28);

  // Faint horizon glow (subtle band away from poles)
  float horizon = 1.0 - smoothstep(0.0, 0.4, abs(R.y));
  base += vec3(0.06, 0.10, 0.22) * horizon * 0.4;

  vec3 finalColor = base + vec3(star) * 0.9;
  finalColor *= fresnel * 1.3;

  gl_FragColor = vec4(finalColor, fresnel);
}
```

Cost: ~12 ops per fragment. Safe on mobile. **The astronaut GLB must have the visor as a named submesh** ("Visor" or "Helmet_Glass") so we can target it specifically.

---

## 11. Asset List

```
/public/
  models/
    astronaut.glb            <400KB   Draco compressed; visor MUST be separate submesh
    astronaut-sitting.glb    <300KB   Sitting pose for Scene 05 (or use morph targets in main GLB)
    dog.glb                  <80KB    Low-poly, static sitting pose, no rig
  sprites/
    astronaut-walk.png       <80KB    8-frame walk, 128×128 each, 1024×128 sheet
    monuments.png            <60KB    5 milestone monuments in atlas
    skill-icons.png          <80KB    Up to 15 icons in atlas (32×32 each)
    npcs.png                 <40KB    3 NPC sprites
    parallax-bg.png          <60KB    2048×512, distant clouds/mountains
    parallax-mid.png         <80KB    2048×512, terrain
    parallax-fg.png          <50KB    2048×512, transparent foreground
    thumb-{id}.webp          <40KB    Per-project thumbnail (optional, max 5)
  textures/
    grass.webp               <100KB   1024×1024, tileable
  audio/
    portal-whoosh.mp3        <80KB    Scene 02 transition
    pixel-bgm.mp3            <120KB   Scene 03 ambient, looped
    landing-ambient.mp3      <150KB   Scene 05 wind+birds, looped
    submit-chime.mp3         <20KB    Form submit success
```

**Target total compressed: <1.5MB** (excluding JS bundle and the up-to-5 project thumbnails).
**JS bundle (Three.js, R3F, drei, GSAP, Lenis, Zustand, RHF, zod):** ~400–500KB gzipped.

Loading: show a minimal loading screen (Orbitron "Initializing transmission..." over `--hero-bg`) until astronaut.glb + first-scene sprites are ready. Subsequent assets stream in during scroll.

---

## 12. Data Interfaces

All runtime content lives in `/src/data/`. These interfaces match what's already scaffolded in `src/types/index.ts` — keep them in sync.

```ts
// /src/data/skills.ts
export interface Skill {
  id: string;
  name: string;
  iconKey: string;           // key into skill-icons.png atlas
  milestoneId: string;       // FK → Milestone.id
}

// /src/data/timeline.ts
export interface Milestone {
  id: string;
  label: string;             // "Learning", "Building", etc.
  scrollStart: number;       // 0–1 within Scene 03 (not global)
  scrollEnd: number;
  monumentKey: string;       // key into monuments.png atlas
  skills: string[];          // Skill ids in display order
}

// /src/data/projects.ts
export interface Project {
  id: string;
  name: string;
  description: string;       // 2–3 sentences
  techStack: string[];
  keyLesson: string;         // single sentence
  thumbnail?: string;        // path under /public/sprites/
  url?: string;              // external project URL
}

// /src/data/dialogue.ts
export interface DialogueLine {
  id: string;
  npcKey: string;            // key into npcs.png atlas
  triggerScroll: number;     // global 0–1 (not scene-local)
  durationScroll: number;    // how long the bubble stays visible
  text: string;
}
```

---

## 13. Performance + Mobile Fallback

### Targets
- Desktop (1080p+): 60 FPS sustained, all post-processing on
- Mid-tier mobile (iPhone 12 / Pixel 6 / Galaxy S21): 45 FPS sustained
- Low-tier mobile (iPhone SE 2020 / Galaxy A52): 30 FPS sustained

### Tier detection
On app mount, run a 2-second benchmark inside the Hero scene at full fidelity. Measure rolling average FPS. Classify:
- avg ≥ 55 → **high**
- 35 ≤ avg < 55 → **medium**
- avg < 35 → **low**

Store tier in `useScrollStore` (or a sibling `usePerfStore`). All scenes read tier and branch.

### Tier table

| Feature | high | medium | low |
|---|---|---|---|
| Starfield particles | 1,500 | 800 | 400 |
| Visor reflection shader | full | full | flat dark color |
| Bloom | strength 0.8 | strength 0.4 | off |
| Portal pixelate | full-res shader | half-res render target | 0.3s opacity crossfade |
| Pixel parallax layers | 3 | 2 | 2 |
| Project bg particles | 200 | 100 | static gradient |
| Landing dust motes | 50 | 25 | 0 |
| Landing skybox shader | full | full | static texture |

### Hard rules
- **Never** drop below 24 FPS on any tier. If you do, you must downgrade further mid-scene (rare, but the perf store supports re-classifying).
- Use `requestIdleCallback` for non-critical async loads (audio after scene mount, not before).

---

## 14. Reduced Motion + A11y

### prefers-reduced-motion: reduce
- Scroll-driven scene transitions become **hard cuts** at the midpoint of the transition zone.
- Portal shader is skipped entirely (Scene 01 → Scene 03 swap at `g = 0.215`).
- Visor reflection is **static** — `uTime` frozen at 0 at mount.
- All particle drift halted (drift velocity = 0).
- Astronaut walk cycle freezes on frame 0.
- Card slide-in disabled — cards appear in their final state.
- Form blinking `▮` is static.
- All audio plays at 50% volume.

### Keyboard navigation
- Tab order: any pre-scene CTA → milestone announcements → project cards (each card a focus stop with the "view project" link) → form fields → submit.
- Each milestone announces its label via `aria-live="polite"` when entered.
- Project cards are focusable; **Enter on a focused card opens its URL in a new tab** (this is the one place keyboard "advances" — it's a destination, not progression).
- Form is fully keyboard-accessible; Enter on a non-textarea field submits.

### Screen reader
- The Three.js canvas is `aria-hidden="true"`.
- A sibling `<section class="sr-only">` contains an equivalent narration:
  - Per-scene prose block describing what's happening.
  - All skills as a `<ul>`.
  - All projects as `<article>`s with the same content as the cards.
  - The form is the same form (not duplicated) — fully labeled, with `aria-describedby` for inline errors.

### Color contrast
- All foreground text on its scene background meets **WCAG AA**: 4.5:1 for body, 3:1 for ≥18px or bold ≥14px.
- Test points: form labels on dark bg, Caveat lesson text on card bg, milestone label on pixel sky.

### Focus indicators
2px solid `--color-plasma-cyan` with 2px offset on all focusable elements. Never remove the default outline without replacing it.

---

## 15. Content That Must Be Filled

These are the only TODOs blocking launch. Everything else in this spec is locked. Mark each entry in `src/data/*.ts` with `// TODO: USER`.

### Skills (10–15 items, 2–3 per milestone)
For each: `id`, `name`, `iconKey`, `milestoneId`.

### Projects (3–5 items)
For each: `id`, `name`, 2–3 sentence `description`, `techStack[]`, single-sentence `keyLesson`. Optional: `thumbnail`, `url`.

### NPC dialogue (3 lines)
Defaults are in §6 above. Edit in `src/data/dialogue.ts` if a different voice fits better.

### Environment
In `.env.local`:
```
RESEND_API_KEY=re_...
RECIPIENT_EMAIL=you@example.com
```

### 3D model sourcing
- **Astronaut:** Sketchfab CC-BY or Poly Haven CC0 base, then customize. The visor must be a separate named submesh.
- **Dog:** Sketchfab CC-BY low-poly sitting pose. ~80KB target after Draco compression.
- **Sitting astronaut pose:** Either a second GLB or vertex morph targets. Decide during implementation.

---

## 16. Build Pipeline

- Framework: Next.js 15 (app router, already scaffolded)
- React 19, R3F 9, drei 10, postprocessing 6
- Bundler: Turbopack (already in `package.json`)
- Type checking: `npm run typecheck`
- Lint: `npm run lint`
- Local dev: `npm run dev`
- Production build: `npm run build`

### Pre-launch checklist
- [ ] All 5 scenes ship with all assets under budget
- [ ] Lighthouse: Performance ≥85, Accessibility 100, Best Practices ≥90
- [ ] Tested on real iPhone (Safari), Android (Chrome), desktop Firefox + Safari + Chrome
- [ ] Form submits in production with a real Resend key
- [ ] OG meta tags + static `og:image` (1200×630 PNG of the hero scene, pre-rendered)
- [ ] Deployed to Vercel (or chosen target); analytics decision made before deploy

---

## 17. What Was Cut From v1 (and Why)

For anyone reviewing this against the old spec:

| Cut | Reason |
|---|---|
| Spaceship reveal in Scene 01 | Asset cost (300KB) and ~40 lines of choreography for a 2s moment. Visor reflection carries "we are in space" alone. |
| Portal 2 (Glitch shader) | Most expensive shader of the five; cutting it lets Scene 03 transition naturally into Scene 04. |
| Arsenal scene (terminal/ASCII) | Skills moved into the pixel journey as pickups. "Floating skill objects" was the most "look at me" scene with the least narrative weight. |
| Solar system / project planets | Replaced by HTML cards. Saves 3 sphere geoms, orbital math, label positioning, raycaster picking. |
| Terrain displacement shader | Scene 05 grass is a flat textured plane. Saves 16K vertex calculations per frame. |
| Grass wind shader | Stylized stillness fits "golden hour rest" better than animated wind. |
| EnvMap-based visor reflection | Procedural shader replaces it. Saves a 500KB–1MB cubemap. |
| Tree model (Scene 05) | Not narratively essential; horizon line carries the same composition. |
| 1.46× document scroll overflow | Total height is 1.0× viewport. Simpler math, no surprise scrollbar behavior. |

The trim is permanent. Re-adding these later would require renegotiating the asset budget and the mobile FPS targets.

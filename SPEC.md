# Portfolio — v4 Spec

Source of truth for mruthunjay.xyz. Code comments reference sections here (`// SPEC.md §5`).
Supersedes v3 (cream editorial, wordmark hero). Nothing from v3's visual system carries over
except the data files, the notes pipeline, the command palette and the spring integrator.

## §1 Philosophy: receipts, not claims

The work is invisible plumbing: payments that settle in seconds, contracts on a mainnet,
hardened servers. The site's one job is to make that visible without dressing it up.

Everything on the page is a receipt. It shipped, here is the link, here is the screenshot,
here is the date. Nothing is described, everything is shown. Brutalism here is honesty,
not a style: a bare list is an index of evidence, the image that appears when you point at
a row is the proof.

Rules that fall out of it:

- **Copy.** Nouns, verbs, numbers, dates. No adjectives, no jokes, no taglines. First person.
- **Type.** One face, two sizes: huge and normal. No serif, no italic, no uppercase labels.
- **Colour.** White, black, blue. Blue means exactly one thing: live right now.
- **Images.** Real screenshots, full colour, never tinted or framed. The only manipulation is the reveal.
- **Motion.** Motion reveals evidence or carries the tree. Nothing moves to decorate.
- **Structure.** Rows, not cards. Sections separate by scale, not by boxes.

The site proves its own claims: at build time it checks every project URL and prints the
result (§7). Nobody's portfolio verifies itself.

## §2 The visual system: a dot and a line

Every reference on the page collapses into two marks drawn in one stroke weight. That is
what lets a tree, a painting and a meme sit inside a black and white page without becoming
an illustration.

- **The dot is a bindu** (after S.H. Raza): one point that holds everything and nothing.
  It is the loader, the cursor, the status light and the full stop after the name.
- **The line is a banyan.** Calm canopy above, chaotic aerial roots below. Products are the
  canopy; servers, 2am fixes and notes about what broke are the roots.
- **The leaves are the only thing that moves on its own.** Small stroked almonds, same line
  weight. They detach, fall, drift with wind, and come to rest on the branch below.
- **The figure is Warli.** One stick figure in the same line, sitting with a cup while three
  small flames dance. Caption: "this is fine." Placed under the notes about breakage.

Stroke: 1px at 1x, 1.5px at 2x DPR, `currentColor`. Dark mode is a colour swap, nothing redrawn.

## §3 Design system

### Palette

| token | light | dark | use |
| --- | --- | --- | --- |
| `--color-bg` | `#f1f1ef` | `#0a0a0a` | page |
| `--color-fg` | `#0a0a0a` | `#f1f1ef` | type, every line, every dot |
| `--color-fg-muted` | `rgba(10,10,10,.55)` | `rgba(241,241,239,.55)` | secondary text |
| `--color-hairline` | `rgba(10,10,10,.18)` | `rgba(241,241,239,.2)` | rules not drawn by the tree |
| `--color-live` | `#0026ff` | `#3d5bff` | live status only |

No accent beyond `--color-live`. No grain, no gradients, no shadows, no radius.

### Type

One family: **Bricolage Grotesque** (`next/font/google`, variable weight + optical size).

| role | size | weight | tracking |
| --- | --- | --- | --- |
| name | `clamp(48px, 18.6vw, 340px)` | 800 | -0.05em |
| email, section titles | `clamp(40px, 8vw, 128px)` | 700 | -0.04em |
| work rows | `clamp(28px, 4.5vw, 72px)` | 600 | -0.03em |
| body | 16px / 1.5 | 400 | 0 |
| meta (years, stack, dates) | 13px / 1.4 | 500 | 0 |

Tabular numerals everywhere. Body copy at most 60ch.

### Layout

12 columns, 20px gutter, max 1440px. The trunk owns the left gutter (col 1 edge). Rows span
all 12 columns. No boxes; sections are separated by a change in type scale and one branch.

### Motion constants

Spring integrator (existing, `src/lib/scroll.ts` / Hero): `stiffness 170, damping 26, mass 1`
for the floating image; `stiffness 120, damping 20` for the cursor dot. Line draws use
`stroke-dashoffset` driven by scroll or intersection ratio, never by a timer, except the
one-time arrival (§4.0) and branch draw-in (600ms, `cubic-bezier(.2,.7,.2,1)`).

Wind: a single scalar `w(t)` in [-1, 1] = slow noise (period ~9s) + scroll velocity /
2000, clamped. Leaves read it; roots read it; nothing else does.

## §4 The page, top to bottom

Order: hero, work (canopy), about (calm), side projects and notes (roots, one SVG behind
both), contact (the dot). About sits between canopy and roots so the roots fall straight
from the side-project branches into the notes without a gap.

All structural lines live in SVG. All airborne things live on one fixed, pointer-events:none
`<canvas>` (the weather layer) that also draws the cursor dot. One rAF loop drives springs,
leaves and wind, and stops when nothing is airborne and every spring has settled.

### 4.0 Arrival (once per session)

1. Page paints `--color-bg`. One 12px dot at viewport centre. Nothing else. 400ms.
2. Dot springs down to the name's baseline (~350ms), stretches into a 1px hairline the width
   of the name (~250ms).
3. Name clips open upward from the hairline (`clip-path: inset`), ~450ms.
4. The dot is now the full stop after the name. Blue if §7 passed, black if not.
5. Hairline detaches and continues downward as the trunk. Total ≈ 1.4s. Never shown again
   that session; on a repeat visit the page is at rest with the trunk already drawn.

### 4.1 Hero

Name at 18.6vw with the dot. One sentence in body size:
"I build payment apps and the servers under them. Everything below is live."
Below it a single-line marquee: current IST time, "open to work", last commit date (§7).
Marquee speed = 40px/s + |scroll velocity| × 0.3. From the dot, the trunk descends off screen.
The trunk's drawn length = scroll position; it is the scroll cue.

### 4.2 Work

Three rows: Payflip, Surge, BharatBZ. Name at row size, year and stack in meta on the right,
a blue dot before any link that §7 confirmed live.

- **Branch.** Each row rule is a branch: a 1px path from the trunk to the right edge, drawn
  over 600ms when the row crosses 40% viewport. Once.
- **Hover.** The screenshot (WebP, 16:9, ~480px wide) springs in at the cursor and follows it,
  skewed by pointer velocity (max 6°), clipped open from the side the pointer entered.
  Pointer leaves, it clips shut. The branch shakes (±2px, 300ms) and one leaf detaches.
- **Click.** Row expands in place (height spring, 500ms). Brief, what I did, product list,
  links, screenshots stacked full width. The branch thickens to 2px for the open row.
  One open at a time. Deep-linkable (`#payflip`).

### 4.3 Side projects

Same rows at half size: Growix, VPS Setup, Multi-Window. Same hover, no expansion, link goes
out. From these branches, 5 to 7 aerial roots start: 1px wavy paths falling toward §4.5,
drawn by scroll, swaying with wind (rotate about their anchor, ±1.2° × `w(t)`).

### 4.4 About and stack

Two short paragraphs, the stack as a plain comma list in meta size. No icons. This is the
only section with no line work; it sits in the gap between canopy and roots.

### 4.5 Notes: what broke

Dated list, newest first, linking to `/notes/[slug]`. Behind it the roots land and tangle:
~28 1px paths crossing and knotting, drawn by scroll progress through the section. Chaos in
line weight only. Under the tangle, the Warli figure with the cup and three flames.
Flames flicker (SVG path morph, 3 frames, 180ms) only while hovered or focused.
One note in `content/notes` explains the dot ("Why there's a dot on this site").

### 4.6 Contact and receipt

The tangle resolves into one line, the line into one dot as the section enters view.
The email at title size is the second largest thing on the page, copy-on-click.
Then the build receipt in meta size: "built 15 sep 2026 · 7 of 7 links live · last commit
14 sep" with the dot before it. GitHub, LinkedIn, Product Hunt as plain links.
Optional: one photo of the author, uncropped, no filter, left of the email.

### 4.7 Nav and cursor

Nav: name, Work, Notes, Contact, theme. Active section shown by a dot that springs between
items. Cursor: 8px dot with spring lag; grows to 40px hollow ring with "view" over work rows,
"copy" over the email; hidden on coarse pointers.

## §5 Leaves and wind

Leaves are the one thing that moves without the visitor. They are kept scarce so they stay
noticed.

- **Shape.** Stroked almond, 10 to 14px long, 1px, `currentColor`, drawn on the weather canvas.
- **Population.** At most 4 airborne at once desktop, 2 mobile. Up to 12 resting on branches.
- **Release.** One leaf when a row is hovered. Otherwise one at random every 6 to 10s from a
  branch currently in view. None while the tab is hidden.
- **Physics.** Fall 24 to 40px/s. Horizontal drift = `w(t)` × 30px/s plus a per-leaf sway
  (sine, period 1.6 to 2.4s, ±12px). Tumble ±35° following the sway. Lands on the first branch
  below (snap to the path's y at that x) and rests there; resting leaves nudge ±1px with wind.
  Leaves leaving the viewport are recycled.
- **Wind.** Defined in §3. Gusts come only from scroll velocity, so the visitor causes them.

## §6 Motion budget: the balance

Animated, and why:

| where | what | trigger | duration |
| --- | --- | --- | --- |
| arrival | dot → line → name | first visit | 1.4s once |
| trunk | draw | scroll position | continuous, no easing |
| branches | draw in | row enters view | 600ms once |
| work row hover | image follow + clip, branch shake, leaf | pointer | spring |
| case open | height + clip | click | 500ms spring |
| marquee | scroll speed-linked | always | continuous |
| roots | sway | wind | ±1.2°, continuous |
| tangle | draw | scroll through §4.5 | continuous |
| Warli flames | flicker | hover / focus | while hovered |
| contact | lines → dot | section enters | 800ms once |
| leaves | fall, drift, land | hover / interval | see §5 |
| nav dot, cursor | spring | always | spring |

Not animated, on purpose: text, section entrances (no fade-ups), notes list items,
theme change beyond a 200ms colour transition, backgrounds. No parallax, no scroll-jacking,
no loaders beyond the arrival dot.

Reduced motion: arrival skipped, every line fully drawn, no leaves, no wind,
marquee static, image reveal is an instant show/hide. Coarse pointer: no cursor, tap on a
row shows the shot inline above the row, leaves at half population.

## §7 Build-time receipts

`scripts/receipts.ts` runs in `prebuild`:

- HEAD each URL in `projects.ts`, `experience.ts` links. Record status and timestamp.
- Fetch latest public commit date from GitHub for the author.
- Write `src/data/receipts.json`. Components read it; nothing is fetched at runtime.
- A URL that fails gets a black dot and "last seen <date>" instead of blue. Build never fails
  on a bad link.

## §8 Data

Unchanged interfaces in `src/types`. `site.ts` copy rewritten to §1 rules. `experience.ts`
and `projects.ts` gain nothing; `receipts.json` is joined by URL. Content stays in data files,
components stay content-free.

## §9 Performance and accessibility

- Weather canvas: one loop, stops when idle; leaves are ≤ 16 draw calls per frame.
- SVG line work: ≤ 60 paths total on the page; `stroke-dashoffset` only, no path morphing
  except the three-frame flames.
- Images: WebP, `loading="lazy"`, only mounted while hovered or a case is open.
- LCP is the name (text). No web font blocks paint: `display: swap`, fallback metrics set.
- Every line and dot is `aria-hidden`. Rows are `<button>`/`<a>`. Focus ring is a 2px
  `--color-fg` outline, offset 4px. Keyboard focus on a row shows the shot in a fixed slot.
- Colour contrast ≥ 7:1 for text, blue dot never the only carrier of meaning (text says "live").

## §10 Build order

1. Tokens, font, copy (`globals.css`, `fonts.ts`, `site.ts`). Remove grain, loader, serif.
2. Receipts script + `receipts.json`.
3. Hero: name, dot, arrival, marquee, trunk.
4. Work rows: branch draw, hover image, expansion. Side project rows.
5. Weather canvas: cursor, wind, leaves.
6. Roots, tangle, Warli figure, contact resolve.
7. Notes pages restyled to the same system.
8. Testing checklist: typecheck, lint, both themes, reduced motion, coarse pointer, keyboard,
   Lighthouse ≥ 95 performance on the home page.

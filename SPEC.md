# Portfolio — v3 Spec

**Status:** ACTIVE
**Version:** 3.0
**Updated:** 2026-07-10
**Supersedes:** v2 ("One Small Step" five-scene cinematic — retired in full)

> v3 replaces the scroll-driven cinematic with a minimal, dark, content-first
> single page. One signature interaction (the hero's cursor-reflow text),
> everything else quiet and instantly readable. Native scrolling. No scenes,
> no scroll bands, no 3D pipeline.

---

## 1. The Product

A one-page developer portfolio: nav, hero, work list, contact footer.
The hero paragraph is rendered to canvas via `@chenglou/pretext` and reflows
in real time around the visitor's cursor. Everything below the hero is plain,
fast, semantic HTML. A notes/writing section will be added later (§8).

Design stance: simple but engineered. Impressiveness comes from execution
quality — the reflow interaction, tuned hover states, sub-second loads — not
from decoration. Nothing may take control away from the user (no scroll
hijacking, no forced animations, native everything).

## 2. Page Structure

```
<Nav>      mj · work · contact                     (in flow, not fixed)
<Hero>     status line → reflow paragraph (canvas + DOM mirror)
<Work>     3–5 rows: name · one-liner · year · ↗
<Footer>   say hi → email · github
```

Single column, `max-width: 820px`, centered. Content lives in
`src/data/projects.ts` (§5). Total page ≈ 2–2.5 viewport heights.

## 3. Design System

### Palette (CSS variables in `globals.css @theme` — never inline hex)

| Token | Value | Use |
|---|---|---|
| `--color-bg` | `#0a0a0b` | page background |
| `--color-fg` | `#f2f2f4` | primary text |
| `--color-fg-secondary` | `#8a8a90` | supporting text |
| `--color-fg-muted` | `#6b6b70` | labels, meta |
| `--color-hairline` | `#1e1e20` | row separators, borders |
| `--color-accent` | `#7cf6ff` | links, arrows, focus ring |
| `--color-ok` | `#4ade80` | availability dot |

### Typography

- **Inter** (400/500) — everything.
- **JetBrains Mono** (400/500) — logo, labels, meta, status line.
- Hero paragraph: 500 weight, `clamp(22px, 3.4vw, 32px)`, line-height 1.45,
  letter-spacing −0.3px. Both fonts exposed as `next/font` CSS variables
  (`src/lib/fonts.ts`).

### Motion

- Springs, not eases, for anything physical (hero obstacle position/radius).
  Integrator: `v = v*damping + (target−x)*stiffness` per frame;
  damping 0.78–0.85, stiffness 0.12–0.18.
- CSS transitions only for hovers (≤300ms).
- `prefers-reduced-motion`: hero renders as static text; hovers keep
  opacity/color changes only.

## 4. Hero — Cursor Reflow (the signature)

### Behavior

The intro paragraph is laid out and drawn on a `<canvas>`. The cursor
projects a circular obstacle; text lines reflow around it every frame, as if
the cursor pushes the words aside. Leaving the hero shrinks the obstacle to
zero and the paragraph heals.

### Implementation

1. **Prepare once.** After `document.fonts.load(...)` resolves, call
   `prepareWithSegments(text, font, ...)`. The prepared state is
   width-independent — cache it; never re-prepare on resize or pointer move.
2. **Per frame** (rAF, only while springs are unsettled):
   - Spring obstacle `(ox, oy)` toward pointer, radius `R` toward
     70px (pointer inside hero) or 0 (outside).
   - For each text row, intersect the circle with the row band → chord
     `[ox−c, ox+c]` → up to two segments: `[0, holeLeft]`, `[holeRight, W]`.
     Drop segments narrower than 60px.
   - Walk the text through segments with `layoutNextLineRange(prepared,
     cursor, segWidth)` → `materializeLineRange` → `ctx.fillText` at the
     segment x-offset. Feed each range's `end` cursor into the next call.
   - Stop the loop when springs settle (velocity + delta under epsilon).
3. **Canvas hygiene:** scale by `devicePixelRatio`; `ResizeObserver`
   re-layouts on width change (layout is arithmetic — cheap).
4. **Height:** reserve natural text height + 2 line-heights so displaced
   words never clip.

### Fallbacks (all render the same real `<p>`)

- A semantic `<p>` mirror of the paragraph is ALWAYS in the DOM (visually
  hidden while canvas is active) — screen readers, SEO, and Ctrl-F work.
- Coarse pointer (touch) or `prefers-reduced-motion` or `prepare()` failure
  → canvas never mounts; the `<p>` is simply visible. No JS required to read
  the page.

### Testing checklist

- [ ] Reflow follows cursor smoothly (no visible jitter at 60fps)
- [ ] Paragraph heals when cursor leaves
- [ ] Touch device: plain text, no canvas
- [ ] Reduced-motion: plain text, no canvas
- [ ] Ctrl-F finds hero text; screen reader reads it
- [ ] Resize: no re-prepare, layout stays correct

## 5. Data

```ts
export interface Project {
  name: string;
  /** One honest sentence. */
  description: string;
  year: string;
  /** External URL — row renders ↗ when present */
  url?: string;
  tech?: string[];
}
```

`src/data/projects.ts` exports `PROJECTS: Project[]` (3–5 entries, newest
first). Contact links live in `src/data/site.ts` (email, github).

## 6. Accessibility

- Everything readable without JS or pointer (§4 fallbacks).
- Focus-visible ring in `--color-accent` on all interactive elements.
- Landmarks: `<nav>`, `<main>`, `<footer>`; single `<h1>` in the hero.
- Color contrast: fg/bg 15.8:1, fg-secondary/bg 5.6:1 — both AA+.

## 7. Performance

- Budget: < 100KB JS beyond the Next.js baseline; zero images/models.
- pretext layout runs in ~0.1ms — the frame budget is effectively paint-only.
- No rAF loop at idle (springs settle → loop stops).
- Fonts: `next/font` (self-hosted, `display: swap`).
- Lighthouse ≥ 95 across the board on a mid-tier laptop.

## 8. Future (separate issues)

- **Project case-study pages** (`/work/[slug]`).
- Contact form (Resend) only if plain mailto proves insufficient.

## 9. Notes

The repo is the CMS: `content/notes/*.md` with frontmatter
(`title`, `date` quoted ISO, `tags`, `summary`). Pipeline is server-only
(`src/lib/notes.ts` — gray-matter + marked), everything statically
generated: zero client-side markdown cost.

- **`/notes`** — index with instant search. The full note index is
  serialized to a small client component (`NotesIndex`); filtering is a
  plain array scan over title/summary/tags plus tag-chip narrowing.
  Fine to hundreds of notes; revisit only past that.
- **`/notes/[slug]`** — statically generated article
  (`generateStaticParams`), `.note-prose` styles in `globals.css`,
  per-page metadata from frontmatter.
- Home shows the three most recent (`NotesPreview`); nav and the ⌘K
  palette link to `/notes`.
- The ⌘K palette mounts in the root layout (available on every page);
  its section actions fall back to `/#section` off the home page.

---
title: "Measuring text without the DOM"
date: "2026-07-11"
tags: [pretext, canvas, performance]
summary: "Why this site's hero can re-layout a paragraph on every frame, and the letter-spacing bug that clipped my text."
---

The hero on this site re-wraps a whole paragraph around your cursor at 60fps. The trick is [pretext](https://github.com/chenglou/pretext): it measures text **once** with canvas `measureText`, then every layout after that is pure arithmetic over cached widths: no DOM reads, no reflow, ~0.1ms per layout. Cheap enough to run inside `requestAnimationFrame`.

Three things I learned wiring it up:

## 1. Read font metrics from the element, not from constants

The canvas font string must match the CSS exactly or your measurements lie. `next/font` generates hashed family names (`__Inter_e8ce0c`), so hard-coding `"Inter"` silently measures a fallback. The fix: keep a real `<p>` mirror of the text in the DOM and build the font string from its computed style.

```ts
const cs = getComputedStyle(mirror);
const font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
await document.fonts.load(font, text);
const prepared = prepareWithSegments(text, font, {
  letterSpacing: parseFloat(cs.letterSpacing) || 0,
});
```

The mirror doubles as the accessibility/SEO/Ctrl-F fallback. Screen readers never see the canvas.

## 2. Whatever you tell the measurer, tell the painter

I passed `letterSpacing: -0.3` to pretext but forgot to set it on the canvas context when painting. Every painted line came out ~15px wider than the measured line and clipped at the canvas edge. One line fixes it:

```ts
ctx.letterSpacing = `${spacing}px`;
```

Measurement and paint are two separate systems. Any property that affects advance width (spacing, weight, size) has to be identical in both, or the error compounds with every glyph.

## 3. Prepare once, layout forever

`prepare()` is the expensive step. It's width-independent, so cache it: resizes just re-run the arithmetic layout. The only thing that invalidates the cache is the font string changing, which happens with `clamp()`-based font sizes, so compare the computed font on resize and re-prepare only then.

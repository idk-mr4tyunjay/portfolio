"use client";

import { useEffect, useRef } from "react";

/**
 * Atmosphere dot field — SPEC.md §3. A fixed, full-viewport canvas draws the
 * background grid. Marks near the pointer bloom from a dot into a small "+" and
 * brighten; everything else rests as a faint dot. A mark is just a "+" whose
 * arms grow — so the morph is one primitive, not two.
 *
 * The appearance is a pure function of pointer distance, so the canvas only
 * redraws while the pointer moves (rAF-coalesced) and goes idle when it stops —
 * zero idle work, like the hero. Coarse pointer / reduced motion → a static
 * dot grid, no listeners.
 */
export function DotField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const GAP = 40; // grid spacing (matches the old CSS dot grid)
    const RADIUS =60; // pointer influence radius — only the mark(s) under the cursor react
    const REST = 0.13; // resting opacity
    const ACTIVE = 0.5; // opacity of the mark under the pointer
    const REST_HALF = 0.75; // half-size of a resting mark (reads as a dot)
    const MAX_ARM = 3; // half-length of a fully bloomed "+"

    const interactive =
      matchMedia("(pointer: fine)").matches &&
      !matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    let px = -9999; // pointer, parked offscreen until it moves
    let py = -9999;
    let raf = 0;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 1;
      ctx.lineCap = "round";
      ctx.fillStyle = `rgba(244, 246, 255, ${REST})`;
      const r2 = RADIUS * RADIUS;

      for (let y = GAP / 2; y < h; y += GAP) {
        for (let x = GAP / 2; x < w; x += GAP) {
          const dx = x - px;
          const dy = y - py;
          const d2 = dx * dx + dy * dy;
          if (d2 > r2) {
            ctx.fillRect(x - REST_HALF, y - REST_HALF, REST_HALF * 2, REST_HALF * 2);
            continue;
          }
          const t = 1 - Math.sqrt(d2) / RADIUS; // 0..1, 1 at the pointer
          const e = t * t * (3 - 2 * t); // smoothstep
          const arm = REST_HALF + e * (MAX_ARM - REST_HALF);
          ctx.strokeStyle = `rgba(244, 246, 255, ${REST + e * (ACTIVE - REST)})`;
          ctx.beginPath();
          ctx.moveTo(x - arm, y);
          ctx.lineTo(x + arm, y);
          ctx.moveTo(x, y - arm);
          ctx.lineTo(x, y + arm);
          ctx.stroke();
        }
      }
    };

    const schedule = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        draw();
      });
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(); // immediate — the static grid shouldn't wait on a pointer
    };

    resize();
    window.addEventListener("resize", resize);

    let onMove: ((e: PointerEvent) => void) | undefined;
    let onLeave: (() => void) | undefined;
    if (interactive) {
      onMove = (e) => {
        px = e.clientX;
        py = e.clientY;
        schedule();
      };
      onLeave = () => {
        px = -9999;
        py = -9999;
        schedule();
      };
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerleave", onLeave);
    }

    return () => {
      window.removeEventListener("resize", resize);
      if (onMove) window.removeEventListener("pointermove", onMove);
      if (onLeave) window.removeEventListener("pointerleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}

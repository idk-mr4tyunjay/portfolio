"use client";

import { useEffect, useRef, useState } from "react";
import {
  prepareWithSegments,
  layout,
  layoutNextLine,
  type LayoutCursor,
  type PreparedTextWithSegments,
} from "@chenglou/pretext";
import { SITE } from "@/data/site";

const INTRO =
  "I care about how software feels. I build fast, honest things for the web, and I write down everything that breaks along the way.";

/*
  Cursor-reflow hero — SPEC.md §4.
  The paragraph is prepared once with pretext, then re-laid-out every frame
  around a spring-driven circular obstacle under the cursor. Layout is pure
  arithmetic (~0.1ms), so the rAF budget is paint-only.

  The <p> mirror below the canvas is the source of truth for font metrics
  (canvas font string is read from its computed style, so canvas and CSS can
  never disagree) and stays in the DOM for screen readers / Ctrl-F / no-JS.
*/

// Spring constants — SPEC.md §3
const STIFFNESS = 0.16;
const DAMPING = 0.8;
const OBSTACLE_RADIUS = 70;
const MIN_SEGMENT = 60;
const SETTLE_EPSILON = 0.08;

// Entrance: each row rises/fades in with a stagger on first paint
const ENTRANCE_STAGGER_MS = 70;
const ENTRANCE_DURATION_MS = 450;
const ENTRANCE_RISE_PX = 14;

const CURSOR_START: LayoutCursor = { segmentIndex: 0, graphemeIndex: 0 };

export function Hero() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mirrorRef = useRef<HTMLParagraphElement>(null);
  const [canvasActive, setCanvasActive] = useState(false);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const mirror = mirrorRef.current;
    if (!finePointer || reducedMotion || !wrap || !canvas || !mirror) return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      try {
        const metrics = readMetrics(mirror);
        await document.fonts.load(metrics.font, INTRO);
        if (cancelled) return;
        const prepared = prepareWithSegments(INTRO, metrics.font, {
          letterSpacing: metrics.letterSpacing,
        });
        cleanup = startReflow(wrap, canvas, mirror, prepared, metrics);
        setCanvasActive(true);
      } catch {
        // prepare() unsupported (no Intl.Segmenter etc.) — static <p> stays
      }
    })();

    return () => {
      cancelled = true;
      cleanup?.();
      setCanvasActive(false);
    };
  }, []);

  return (
    <section
      aria-label="Intro"
      className="flex min-h-[72vh] flex-col justify-center pt-16 pb-14"
    >
      <p
        className="fade-up mb-6 text-[12.5px]"
        style={{ fontFamily: "var(--font-mono)", color: "var(--color-fg-secondary)" }}
      >
        <span
          aria-hidden
          className="mr-2 inline-block h-[7px] w-[7px] rounded-full"
          style={{ background: "var(--color-ok)" }}
        />
        available for work
      </p>

      <h1
        className="fade-up m-0"
        style={{
          fontSize: "clamp(44px, 8vw, 76px)",
          fontWeight: 500,
          letterSpacing: "-0.03em",
          lineHeight: 1.05,
          animationDelay: "0.05s",
        }}
      >
        {SITE.name}
      </h1>
      <p
        className="fade-up mt-3 mb-10 text-[13px]"
        style={{
          fontFamily: "var(--font-mono)",
          color: "var(--color-fg-muted)",
          animationDelay: "0.1s",
        }}
      >
        {SITE.role} · web
      </p>

      <div ref={wrapRef} className="relative">
        <canvas
          ref={canvasRef}
          aria-hidden
          className="absolute inset-0"
          style={{ display: canvasActive ? "block" : "none" }}
        />
        <p
          ref={mirrorRef}
          className={canvasActive ? "sr-only" : undefined}
          style={{
            fontWeight: 500,
            fontSize: "clamp(22px, 3.4vw, 32px)",
            lineHeight: 1.45,
            letterSpacing: "-0.3px",
            color: "var(--color-fg)",
            margin: 0,
          }}
        >
          {INTRO}
        </p>
      </div>

      <p
        aria-hidden
        className="fade-up mt-16 text-[11px]"
        style={{
          fontFamily: "var(--font-mono)",
          color: "var(--color-fg-muted)",
          animationDelay: "0.6s",
        }}
      >
        scroll ↓
      </p>
    </section>
  );
}

interface FontMetrics {
  font: string;
  lineHeight: number;
  letterSpacing: number;
  color: string;
  accent: string;
}

function readMetrics(el: HTMLElement): FontMetrics {
  const cs = getComputedStyle(el);
  const spacing = parseFloat(cs.letterSpacing);
  return {
    font: `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`,
    lineHeight: parseFloat(cs.lineHeight),
    letterSpacing: Number.isNaN(spacing) ? 0 : spacing,
    color: cs.color,
    accent: getComputedStyle(document.documentElement)
      .getPropertyValue("--color-accent")
      .trim(),
  };
}

/** #rrggbb → rgba(...) — canvas gradients can't take CSS variables */
function withAlpha(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function startReflow(
  wrap: HTMLDivElement,
  canvas: HTMLCanvasElement,
  mirror: HTMLParagraphElement,
  initialPrepared: PreparedTextWithSegments,
  initialMetrics: FontMetrics,
): () => void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};

  let prepared = initialPrepared;
  let metrics = initialMetrics;
  let width = 0;
  let height = 0;

  // Obstacle springs: position (ox, oy) and radius (r) chase their targets.
  let ox = 0,
    oy = 0,
    r = 0;
  let vx = 0,
    vy = 0,
    vr = 0;
  let tx = 0,
    ty = 0,
    tr = 0;

  let rafId = 0;
  let running = false;
  const entranceStart = performance.now();
  let entranceDone = false;

  const resize = () => {
    width = wrap.clientWidth;
    if (width <= 0) return;
    // Font size is clamp()-based — if it changed, the cached widths are stale.
    const next = readMetrics(mirror);
    if (next.font !== metrics.font) {
      metrics = next;
      prepared = prepareWithSegments(INTRO, metrics.font, {
        letterSpacing: metrics.letterSpacing,
      });
    } else {
      metrics = next;
    }
    // Kill the obstacle — pointer coords are stale after a reflow of the box
    r = 0;
    tr = 0;
    vx = vy = vr = 0;
    // Reserve natural height + 2 rows so displaced words never clip — SPEC.md §4
    const natural = layout(prepared, width, metrics.lineHeight);
    height = natural.height + 2 * metrics.lineHeight;
    wrap.style.height = `${height}px`;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  };

  const draw = () => {
    ctx.clearRect(0, 0, width, height);

    // The obstacle is visible — a soft glow the text flows around,
    // so visitors discover the signature instead of tripping on it.
    if (r > 4 && metrics.accent.startsWith("#")) {
      const glow = ctx.createRadialGradient(ox, oy, 0, ox, oy, r);
      glow.addColorStop(0, withAlpha(metrics.accent, 0.13));
      glow.addColorStop(0.7, withAlpha(metrics.accent, 0.05));
      glow.addColorStop(1, withAlpha(metrics.accent, 0));
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(ox, oy, r, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.font = metrics.font;
    // Paint must match pretext's measurement — it was given this letterSpacing
    const spacingCtx = ctx as CanvasRenderingContext2D & {
      letterSpacing?: string;
    };
    if ("letterSpacing" in spacingCtx) {
      spacingCtx.letterSpacing = `${metrics.letterSpacing}px`;
    }
    ctx.fillStyle = metrics.color;
    ctx.textBaseline = "middle";

    const lh = metrics.lineHeight;
    const maxRows = Math.ceil(height / lh);
    let cursor = CURSOR_START;
    const elapsed = performance.now() - entranceStart;
    entranceDone =
      elapsed > maxRows * ENTRANCE_STAGGER_MS + ENTRANCE_DURATION_MS;

    for (let row = 0; row < maxRows; row++) {
      const rowTop = row * lh;
      const rowMid = rowTop + lh / 2;

      // ease-out-cubic entrance per row; collapses to 1 once done
      let rise = 0;
      if (!entranceDone) {
        const t = Math.min(
          1,
          Math.max(0, (elapsed - row * ENTRANCE_STAGGER_MS) / ENTRANCE_DURATION_MS),
        );
        const eased = 1 - Math.pow(1 - t, 3);
        ctx.globalAlpha = eased;
        rise = (1 - eased) * ENTRANCE_RISE_PX;
      } else {
        ctx.globalAlpha = 1;
      }

      // Circle ∩ row band → hole [holeL, holeR] carved out of this row
      let segments: Array<[number, number]>;
      const dy = Math.max(0, Math.abs(oy - rowMid) - lh / 2);
      if (r > 4 && dy < r) {
        const chord = Math.sqrt(r * r - dy * dy);
        const holeL = ox - chord;
        const holeR = ox + chord;
        segments = [];
        if (holeL > MIN_SEGMENT) segments.push([0, holeL]);
        if (width - holeR > MIN_SEGMENT) segments.push([holeR, width]);
      } else {
        segments = [[0, width]];
      }

      for (const [x0, x1] of segments) {
        const line = layoutNextLine(prepared, cursor, x1 - x0);
        if (!line) return; // text exhausted
        if (
          line.end.segmentIndex === cursor.segmentIndex &&
          line.end.graphemeIndex === cursor.graphemeIndex
        )
          return; // safety: no progress
        ctx.fillText(line.text, x0, rowMid + rise);
        cursor = line.end;
      }
    }
  };

  const tick = () => {
    vx = vx * DAMPING + (tx - ox) * STIFFNESS;
    vy = vy * DAMPING + (ty - oy) * STIFFNESS;
    vr = vr * DAMPING + (tr - r) * STIFFNESS;
    ox += vx;
    oy += vy;
    r = Math.max(0, r + vr);
    draw();

    const energy =
      Math.abs(vx) +
      Math.abs(vy) +
      Math.abs(vr) +
      Math.abs(tx - ox) +
      Math.abs(ty - oy) +
      Math.abs(tr - r);
    if (energy < SETTLE_EPSILON && entranceDone) {
      running = false;
      return;
    }
    rafId = requestAnimationFrame(tick);
  };

  const wake = () => {
    if (running) return;
    running = true;
    rafId = requestAnimationFrame(tick);
  };

  const onPointerMove = (e: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    tx = e.clientX - rect.left;
    ty = e.clientY - rect.top;
    if (tr === 0) {
      // Entering: grow in place instead of dragging across from (0,0)
      ox = tx;
      oy = ty;
    }
    tr = OBSTACLE_RADIUS;
    wake();
  };

  const onPointerLeave = () => {
    tr = 0;
    wake();
  };

  wrap.addEventListener("pointermove", onPointerMove);
  wrap.addEventListener("pointerleave", onPointerLeave);
  const ro = new ResizeObserver(resize);
  ro.observe(wrap);
  resize();
  wake();

  return () => {
    wrap.removeEventListener("pointermove", onPointerMove);
    wrap.removeEventListener("pointerleave", onPointerLeave);
    ro.disconnect();
    cancelAnimationFrame(rafId);
    wrap.style.height = "";
  };
}

"use client";

import { useEffect, useRef } from "react";
import { addTick, wake } from "@/lib/loop";
import { SPRING, Spring } from "@/lib/spring";
import { finePointer, reducedMotion, LEAF_EVENT, type LeafDetail } from "@/lib/motion";

/*
  The weather layer — SPEC.md §4, §5. One fixed canvas over the page that
  draws the cursor dot and the leaves. Wind is a single scalar: slow noise
  plus scroll velocity, also published as --gust for the roots' CSS skew.
  Leaves are page-space so they scroll with the tree; they land on any drawn
  branch ([data-branch][data-drawn="true"]) whose x-range they cross.
  The shared rAF loop stops when nothing is airborne and the cursor rests.
*/

interface Leaf {
  x: number; // page space
  y: number;
  baseX: number;
  len: number;
  vy: number;
  amp: number;
  period: number;
  phase: number;
  rot: number;
  state: "air" | "rest";
  branch: HTMLElement | null;
  born: number;
}

interface BranchRect {
  el: HTMLElement;
  x1: number;
  x2: number;
  y: number; // page space
}

const MAX_REST = 12;
const CURSOR_LABELS: Record<string, string> = { open: "open", close: "close", copy: "copy", copied: "copied" };

export function Weather() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || reducedMotion()) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const fine = finePointer();
    const maxAir = fine ? 4 : 2;
    const html = document.documentElement;
    if (fine) html.dataset.cursor = "custom";

    // ---- theme colour and font ----
    let color = "#0a0a0a";
    let font = "500 12px sans-serif";
    const readTheme = () => {
      const cs = getComputedStyle(html);
      color = cs.getPropertyValue("--color-fg").trim() || color;
      const family = getComputedStyle(document.body).fontFamily;
      font = `500 12px ${family}`;
    };
    readTheme();
    const themeObserver = new MutationObserver(readTheme);
    themeObserver.observe(html, { attributes: true, attributeFilter: ["data-theme", "class"] });

    // ---- size ----
    let w = 0;
    let h = 0;
    let dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      branchesStale = true;
      wake();
    };

    // ---- branches (landing surfaces) ----
    let branches: BranchRect[] = [];
    let branchesStale = true;
    let branchesAt = 0;
    const refreshBranches = (now: number) => {
      if (!branchesStale && now - branchesAt < 1) return;
      branchesStale = false;
      branchesAt = now;
      const sy = window.scrollY;
      branches = Array.from(document.querySelectorAll<HTMLElement>('[data-branch][data-drawn="true"]')).map((el) => {
        const r = el.getBoundingClientRect();
        return { el, x1: r.left, x2: r.right, y: r.bottom + sy };
      });
    };
    const branchObserver = new MutationObserver(() => {
      branchesStale = true;
    });
    branchObserver.observe(document.body, { attributes: true, subtree: true, attributeFilter: ["data-drawn", "data-open"] });

    // ---- wind ----
    let gust = 0;
    let lastScrollY = window.scrollY;
    let lastScrollT = performance.now();
    const onScroll = () => {
      const now = performance.now();
      const dt = Math.max(now - lastScrollT, 1);
      const v = (window.scrollY - lastScrollY) / dt; // px per ms, signed
      lastScrollY = window.scrollY;
      lastScrollT = now;
      gust = Math.max(-1, Math.min(1, gust + v * 0.35));
      branchesStale = true;
      wake();
    };
    const wind = (t: number) => {
      const noise = 0.6 * Math.sin((t * Math.PI * 2) / 9) + 0.4 * Math.sin((t * Math.PI * 2) / 13.7 + 1);
      return Math.max(-1, Math.min(1, noise * 0.6 + gust));
    };

    // ---- leaves ----
    const leaves: Leaf[] = [];
    const airborne = () => leaves.filter((l) => l.state === "air").length;
    const spawn = (x: number, y: number, t: number) => {
      if (airborne() >= maxAir) return;
      leaves.push({
        x,
        y: y + 1,
        baseX: x,
        len: 10 + Math.random() * 4,
        vy: 24 + Math.random() * 16,
        amp: 8 + Math.random() * 6,
        period: 1.6 + Math.random() * 0.8,
        phase: Math.random() * Math.PI * 2,
        rot: 0,
        state: "air",
        branch: null,
        born: t,
      });
      wake();
    };
    const onLeaf = (e: Event) => {
      const { x, y } = (e as CustomEvent<LeafDetail>).detail;
      spawn(x, y, performance.now() / 1000);
    };
    window.addEventListener(LEAF_EVENT, onLeaf);

    // A leaf lets go on its own every 6 to 10s, from a drawn branch that is on screen.
    let timer = 0;
    const schedule = () => {
      timer = window.setTimeout(() => {
        if (!document.hidden) {
          refreshBranches(performance.now() / 1000);
          const sy = window.scrollY;
          const visible = branches.filter((b) => b.y - sy > 40 && b.y - sy < h - 40);
          if (visible.length) {
            const b = visible[Math.floor(Math.random() * visible.length)];
            spawn(b.x1 + 40 + Math.random() * Math.max(40, b.x2 - b.x1 - 80), b.y, performance.now() / 1000);
          }
        }
        schedule();
      }, 6000 + Math.random() * 4000);
    };
    schedule();

    // ---- cursor ----
    const cx = new Spring(w / 2, SPRING.cursor);
    const cy = new Spring(h / 2, SPRING.cursor);
    const cr = new Spring(4, SPRING.soft);
    let label = "";
    let pointerIn = false;
    let pressed = false;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
      if (!pointerIn) {
        cx.snap(e.clientX);
        cy.snap(e.clientY);
      }
      pointerIn = true;
      cx.target = e.clientX;
      cy.target = e.clientY;
      const hit = (e.target as Element | null)?.closest?.("[data-cursor]") as HTMLElement | null;
      const kind = hit?.dataset.cursor ?? "";
      label = CURSOR_LABELS[kind] ?? "";
      cr.target = label ? 22 : pressed ? 3 : 4;
      wake();
    };
    const onDown = () => {
      pressed = true;
      cr.target = label ? 18 : 3;
      wake();
    };
    const onUp = () => {
      pressed = false;
      cr.target = label ? 22 : 4;
      wake();
    };
    const onLeave = () => {
      pointerIn = false;
      wake();
    };
    if (fine) {
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerdown", onDown);
      window.addEventListener("pointerup", onUp);
      document.addEventListener("pointerleave", onLeave);
      document.addEventListener("mouseleave", onLeave);
    }

    // ---- draw ----
    const drawLeaf = (l: Leaf, sy: number) => {
      const half = l.len / 2;
      const width = l.len * 0.36;
      ctx.save();
      ctx.translate(l.x, l.y - sy);
      ctx.rotate(l.rot);
      ctx.beginPath();
      ctx.moveTo(-half, 0);
      ctx.quadraticCurveTo(0, -width, half, 0);
      ctx.quadraticCurveTo(0, width, -half, 0);
      ctx.moveTo(-half * 0.7, 0);
      ctx.lineTo(half * 0.55, 0);
      ctx.stroke();
      ctx.restore();
    };

    const tick = (dt: number, t: number) => {
      const sy = window.scrollY;
      const wnd = wind(t);
      gust *= Math.pow(0.05, dt); // decays to ~0 in about a second
      html.style.setProperty("--gust", (gust * 1.5).toFixed(3));

      let busy = Math.abs(gust) > 0.01;
      refreshBranches(t);

      // Leaves
      for (let i = leaves.length - 1; i >= 0; i--) {
        const l = leaves[i];
        if (l.state === "air") {
          busy = true;
          const prevY = l.y;
          l.baseX += wnd * 30 * dt;
          const sway = Math.sin((t * Math.PI * 2) / l.period + l.phase);
          l.x = l.baseX + sway * l.amp;
          l.y += l.vy * dt;
          l.rot = sway * 0.6 + wnd * 0.18;
          // Land on the first drawn branch crossed this frame.
          for (const b of branches) {
            if (b.y > prevY + 2 && b.y <= l.y && l.x >= b.x1 && l.x <= b.x2) {
              l.state = "rest";
              l.branch = b.el;
              l.y = b.y - 1;
              l.rot = (Math.random() - 0.5) * 0.5;
              break;
            }
          }
          if (l.y - sy > h + 120 || l.y > document.documentElement.scrollHeight) leaves.splice(i, 1);
        } else if (l.branch) {
          // Resting leaves ride their branch (it may move when a case opens) and nudge with the wind.
          const b = branches.find((br) => br.el === l.branch);
          if (b) l.y = b.y - 1;
          l.x = l.baseX + Math.sin((t * Math.PI * 2) / l.period + l.phase) * 0.6 * Math.abs(wnd);
        }
      }
      // Cap resting leaves; the oldest go first.
      const resting = leaves.filter((l) => l.state === "rest").sort((a, b) => a.born - b.born);
      while (resting.length > MAX_REST) {
        const old = resting.shift()!;
        leaves.splice(leaves.indexOf(old), 1);
      }

      // Cursor
      let cursorMoving = false;
      if (fine) {
        cursorMoving = [cx.step(dt), cy.step(dt), cr.step(dt)].some(Boolean);
        busy = busy || cursorMoving;
      }

      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 1;
      for (const l of leaves) drawLeaf(l, sy);

      if (fine && pointerIn) {
        const r = cr.value;
        ctx.beginPath();
        ctx.arc(cx.value, cy.value, r, 0, Math.PI * 2);
        if (r > 8) {
          ctx.stroke();
          if (label) {
            ctx.font = font;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(label, cx.value, cy.value + 0.5);
          }
        } else {
          ctx.fill();
        }
      }
      return busy;
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });
    const removeTick = addTick(tick);

    return () => {
      removeTick();
      clearTimeout(timer);
      themeObserver.disconnect();
      branchObserver.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener(LEAF_EVENT, onLeaf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("mouseleave", onLeave);
      delete html.dataset.cursor;
      html.style.removeProperty("--gust");
    };
  }, []);

  return <canvas ref={ref} className="pointer-events-none fixed inset-0 z-[45]" aria-hidden />;
}

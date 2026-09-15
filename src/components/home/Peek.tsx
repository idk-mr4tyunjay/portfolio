"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { addTick, wake } from "@/lib/loop";
import { SPRING, Spring } from "@/lib/spring";
import { finePointer, reducedMotion } from "@/lib/motion";

/*
  The floating screenshot — SPEC.md §4.2. Springs after the pointer, skews
  with its velocity, and clips open from the side the pointer came in on.
  One instance per row group; `usePeek(sources)` hands rows the handlers.
  Every candidate image is mounted up front (eager, low priority) so the
  first hover shows a picture, not a loading gap.
*/

interface PeekState {
  src: string;
  alt: string;
}

export function usePeek(sources: readonly string[]) {
  const [img, setImg] = useState<PeekState | null>(null);
  const el = useRef<HTMLDivElement>(null);
  const x = useRef(new Spring(0, SPRING.follow));
  const y = useRef(new Spring(0, SPRING.follow));
  const skew = useRef(new Spring(0, SPRING.soft));
  const visible = useRef(false);
  const last = useRef({ x: 0, t: 0 });
  const enabled = useRef(false);

  useEffect(() => {
    enabled.current = finePointer() && !reducedMotion();
    if (!enabled.current) return;
    return addTick((dt) => {
      const node = el.current;
      if (!node) return false;
      const moving = [x.current.step(dt), y.current.step(dt), skew.current.step(dt)].some(Boolean);
      // Ease the skew back to zero when the pointer rests.
      skew.current.target *= 0.9;
      node.style.transform = `translate(${x.current.value}px, ${y.current.value}px) skewX(${skew.current.value}deg)`;
      return visible.current && moving;
    });
  }, []);

  const place = (e: React.PointerEvent) => {
    const node = el.current;
    if (!node) return;
    const w = node.offsetWidth;
    const h = node.offsetHeight;
    const px = Math.min(e.clientX + 28, window.innerWidth - w - 12);
    const py = Math.min(Math.max(e.clientY - h / 2, 12), window.innerHeight - h - 12);
    x.current.target = px;
    y.current.target = py;
    const now = performance.now();
    const dt = Math.max(now - last.current.t, 1);
    const v = (e.clientX - last.current.x) / dt; // px per ms
    skew.current.target = Math.max(-6, Math.min(6, -v * 6));
    last.current = { x: e.clientX, t: now };
  };

  const show = useCallback((e: React.PointerEvent, next: PeekState) => {
    if (!enabled.current) return;
    const node = el.current;
    if (!node) return;
    setImg(next);
    // Start at the pointer so it does not fly in from wherever it was last.
    const w = node.offsetWidth || 400;
    const h = node.offsetHeight || 225;
    x.current.snap(Math.min(e.clientX + 28, window.innerWidth - w - 12));
    y.current.snap(Math.min(Math.max(e.clientY - h / 2, 12), window.innerHeight - h - 12));
    last.current = { x: e.clientX, t: performance.now() };
    const fromLeft = e.movementX >= 0;
    node.getAnimations().forEach((a) => a.cancel());
    node.animate([{ clipPath: fromLeft ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)" }, { clipPath: "inset(0 0 0 0)" }], {
      duration: 420,
      easing: "cubic-bezier(0.2, 0.7, 0.2, 1)",
      fill: "forwards",
    });
    visible.current = true;
    node.dataset.visible = "true";
    wake();
  }, []);

  const move = useCallback((e: React.PointerEvent) => {
    if (!enabled.current || !visible.current) return;
    place(e);
    wake();
  }, []);

  const hide = useCallback((e?: React.PointerEvent) => {
    const node = el.current;
    if (!node || !visible.current) return;
    visible.current = false;
    const toLeft = e ? e.movementX < 0 : true;
    node.getAnimations().forEach((a) => a.cancel());
    const anim = node.animate([{ clipPath: "inset(0 0 0 0)" }, { clipPath: toLeft ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)" }], {
      duration: 300,
      easing: "cubic-bezier(0.4, 0, 0.2, 1)",
      fill: "forwards",
    });
    anim.finished
      .then(() => {
        if (!visible.current) node.dataset.visible = "false";
      })
      .catch(() => undefined);
  }, []);

  const peek = <Peek ref={el} sources={sources} active={img?.src ?? null} />;
  return { peek, show, move, hide };
}

function Peek({ ref, sources, active }: { ref: React.RefObject<HTMLDivElement | null>; sources: readonly string[]; active: string | null }) {
  return (
    <div ref={ref} className="peek" data-visible="false" aria-hidden>
      {sources.map((src) => (
        <Image key={src} src={src} alt="" fill sizes="480px" loading="eager" fetchPriority="low" style={{ opacity: src === active ? 1 : 0 }} />
      ))}
    </div>
  );
}

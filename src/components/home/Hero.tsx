"use client";

import { useEffect, useRef } from "react";
import { SITE } from "@/data/site";
import { RECEIPTS, liveCount, shortDate } from "@/lib/receipts";
import { Marquee } from "./Marquee";

/*
  Hero — SPEC.md §4.0, §4.1. The name at 20vw with the dot as its full stop.
  On a first visit this session (layout.tsx sets html[data-arrive] before
  paint) the arrival plays: one dot at the centre, it drops to the baseline,
  stretches into a hairline, and the name clips open from it. Everything is
  a Web Animation on two elements; the DOM underneath never changes.
*/

const { live, total } = liveCount();
const allLive = live === total;

export function Hero() {
  const nameRef = useRef<HTMLHeadingElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const seedRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    const seed = seedRef.current;
    const name = nameRef.current;
    const dot = dotRef.current;
    if (!html.hasAttribute("data-arrive") || !seed || !name || !dot) return;

    let cancelled = false;
    const finish = () => {
      if (cancelled) return;
      html.removeAttribute("data-arrive");
      seed.style.display = "none";
      name.style.clipPath = "";
      window.dispatchEvent(new Event("mj:arrived"));
    };

    const run = async () => {
      const dotBox = dot.getBoundingClientRect();
      const nameBox = name.getBoundingClientRect();
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const size = dotBox.width || 12;
      const ease = "cubic-bezier(0.2, 0.7, 0.2, 1)";

      seed.style.display = "block";
      seed.style.width = `${size}px`;
      seed.style.height = `${size}px`;
      seed.style.background = getComputedStyle(dot).backgroundColor;

      // 1. Hold at the centre.
      seed.style.transform = `translate(${cx - size / 2}px, ${cy - size / 2}px)`;
      await new Promise((r) => setTimeout(r, 400));
      if (cancelled) return;

      // 2. Drop to where the full stop lives.
      await seed.animate(
        [{ transform: `translate(${cx - size / 2}px, ${cy - size / 2}px)` }, { transform: `translate(${dotBox.left}px, ${dotBox.top}px)` }],
        { duration: 380, easing: "cubic-bezier(0.3, 0, 0.1, 1)", fill: "forwards" },
      ).finished;
      if (cancelled) return;

      // 3. Flatten to a dash on the baseline, then stretch into a hairline the width of the name.
      const baseline = dotBox.bottom;
      await seed.animate(
        [
          { transform: `translate(${dotBox.left}px, ${dotBox.top}px)`, width: `${size}px`, height: `${size}px`, borderRadius: "50%" },
          { transform: `translate(${dotBox.left}px, ${baseline - 1}px)`, width: `${size}px`, height: "1px", borderRadius: "0", offset: 0.4 },
          { transform: `translate(${nameBox.left}px, ${baseline - 1}px)`, width: `${nameBox.width}px`, height: "1px", borderRadius: "0" },
        ],
        { duration: 340, easing: ease, fill: "forwards" },
      ).finished;
      if (cancelled) return;

      // 4. The name clips open upward from the line; the line shrinks back to the dot.
      name.style.visibility = "visible";
      name.style.clipPath = "inset(100% 0 0 0)";
      const open = name.animate([{ clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(-10% 0 -10% 0)" }], {
        duration: 460,
        easing: ease,
        fill: "forwards",
      });
      const close = seed.animate(
        [
          { transform: `translate(${nameBox.left}px, ${baseline - 1}px)`, width: `${nameBox.width}px`, height: "1px", borderRadius: "0" },
          { transform: `translate(${dotBox.left}px, ${baseline - 1}px)`, width: `${size}px`, height: "1px", borderRadius: "0", offset: 0.6 },
          { transform: `translate(${dotBox.left}px, ${dotBox.top}px)`, width: `${size}px`, height: `${size}px`, borderRadius: "50%" },
        ],
        { duration: 460, easing: ease, fill: "forwards" },
      );
      await Promise.all([open.finished, close.finished]);
      finish();
    };

    run().catch(finish);
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="top" aria-label="Intro" className="gutter relative pt-[22vh] pb-10 sm:pt-[24vh]">
      <span ref={seedRef} aria-hidden className="pointer-events-none fixed top-0 left-0 z-50 hidden rounded-full" />

      <h1 ref={nameRef} className="t-name arrive-hidden m-0 -ml-[0.04em] whitespace-nowrap">
        {SITE.name}
        <span ref={dotRef} className="name-dot" data-live={allLive} aria-hidden />
        <span className="sr-only">{allLive ? ". Every link on this page answered at build time." : "."}</span>
      </h1>

      <div className="mt-8 grid gap-6 sm:mt-12 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <p className="m-0 max-w-[32ch] text-[clamp(18px,1.6vw,22px)] leading-[1.4]">{SITE.intro}</p>
        <div className="t-meta grid content-end gap-1 sm:justify-items-end sm:text-right">
          <span>{SITE.now}</span>
          <span>
            {live} of {total} links live · last commit {shortDate(RECEIPTS.commitAt)}
          </span>
        </div>
      </div>

      <div className="mt-10 border-y border-[var(--color-hairline)] py-2 sm:mt-14">
        <Marquee items={[...SITE.status, `built ${shortDate(RECEIPTS.builtAt)}`]} />
      </div>
    </section>
  );
}

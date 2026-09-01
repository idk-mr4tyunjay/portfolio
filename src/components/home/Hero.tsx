"use client";

import { useEffect, useRef } from "react";
import { SITE } from "@/data/site";

/*
  Hero. Intro loader (once per session, first visit only), a giant wordmark
  with a magnetic pointer-hover on each letter, and scroll-linked parallax +
  a top progress bar. All DOM writes are imperative (refs + rAF) — this is
  the one non-trivial, high-frequency-update component on the page.
*/

export function Hero() {
  const introRef = useRef<HTMLDivElement>(null);
  const introCountRef = useRef<HTMLSpanElement>(null);
  const introBarRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLHeadingElement>(null);
  const cueRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const letters = wordmarkRef.current
      ? Array.from(wordmarkRef.current.querySelectorAll<HTMLElement>("[data-letter]"))
      : [];

    // Intro loader — layout.tsx's blocking script already decided (and marked
    // the session) before paint, so the overlay is never a beat behind.
    const overlay = introRef.current;
    if (overlay) {
      const wanted = document.documentElement.hasAttribute("data-show-intro");
      if (!wanted) {
        overlay.style.display = "none";
      } else {
        letters.forEach((l) => {
          l.style.animationPlayState = "paused";
        });
        const dur = 900;
        const t0 = performance.now();
        const step = (now: number) => {
          const k = Math.min(1, (now - t0) / dur);
          const eased = 1 - Math.pow(1 - k, 3);
          const pct = Math.round(eased * 100);
          if (introCountRef.current) introCountRef.current.textContent = `${pct}%`;
          if (introBarRef.current) introBarRef.current.style.width = `${pct}%`;
          if (k < 1) {
            requestAnimationFrame(step);
            return;
          }
          letters.forEach((l) => {
            l.style.animationPlayState = "running";
          });
          overlay.style.transform = "translateY(-101%)";
          setTimeout(() => {
            overlay.style.display = "none";
            document.documentElement.removeAttribute("data-show-intro");
          }, 900);
        };
        requestAnimationFrame(step);
      }
    }

    // Scroll progress bar + hero/meta parallax.
    let raf = 0;
    const frame = () => {
      raf = 0;
      const y = window.scrollY;
      const vh = window.innerHeight || 1;
      if (progressRef.current) {
        const max = document.documentElement.scrollHeight - vh;
        progressRef.current.style.width = `${max > 0 ? Math.min(1, y / max) * 100 : 0}%`;
      }
      if (reduced) return;
      const p = Math.min(1, y / vh);
      if (heroRef.current) {
        heroRef.current.style.transform = `translate3d(0, ${(-y * 0.14).toFixed(1)}px, 0) scale(${(1 - p * 0.045).toFixed(4)})`;
        heroRef.current.style.opacity = String(Math.max(0, 1 - p * 1.15));
      }
      if (metaRef.current) {
        metaRef.current.style.transform = `translate3d(0, ${(-y * 0.42).toFixed(1)}px, 0)`;
        metaRef.current.style.opacity = String(Math.max(0, 1 - p * 1.8));
      }
      if (cueRef.current) cueRef.current.style.opacity = String(Math.max(0, 1 - p * 3));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    frame();

    // Magnetic letter hover.
    const onPointer = (e: PointerEvent) => {
      if (reduced || !wordmarkRef.current) return;
      for (const span of letters) {
        const r = span.getBoundingClientRect();
        const dx = Math.abs(e.clientX - (r.left + r.width / 2));
        const dy = Math.abs(e.clientY - (r.top + r.height / 2));
        const f = Math.max(0, 1 - dx / 340) * Math.max(0.35, 1 - dy / 900);
        span.style.transform = `translateY(${(-19 * f).toFixed(2)}px)`;
        span.style.color = f > 0.6 ? "var(--color-accent)" : "";
      }
    };
    const onLeave = () => {
      letters.forEach((s) => {
        s.style.transform = "";
        s.style.color = "";
      });
    };
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("pointerleave", onLeave);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div
        ref={introRef}
        aria-hidden
        className="intro-overlay pointer-events-none fixed inset-0 z-50 flex flex-col justify-end p-[30px] opacity-0"
        style={{ background: "var(--color-bg)", transition: "transform .85s cubic-bezier(.76,0,.24,1)" }}
      >
        <div className="flex items-end justify-between gap-6">
          <span
            className="text-[10.5px] tracking-[0.2em] uppercase"
            style={{ fontFamily: "var(--font-mono)", color: "var(--color-fg-muted)" }}
          >
            {SITE.name.toLowerCase()} · {SITE.role}
          </span>
          <span
            ref={introCountRef}
            className="font-bold [font-variant-numeric:tabular-nums]"
            style={{ fontSize: "clamp(52px,11vw,168px)", lineHeight: 0.78, letterSpacing: "-0.05em" }}
          >
            0%
          </span>
        </div>
        <div className="relative mt-5 h-px" style={{ background: "var(--color-hairline)" }}>
          <span ref={introBarRef} className="absolute inset-y-0 left-0 w-0" style={{ background: "var(--color-accent)" }} />
        </div>
      </div>

      <div
        ref={progressRef}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-30 h-0.5 w-0"
        style={{ background: "var(--color-accent)" }}
      />

      <section
        id="top"
        aria-label="Intro"
        className="relative z-10 flex min-h-screen flex-col justify-between overflow-hidden px-5 pt-24 pb-6 sm:px-[30px]"
      >
        <div
          ref={metaRef}
          className="fade-in flex flex-wrap justify-between gap-7"
          style={{ animationDelay: "0.5s", willChange: "transform" }}
        >
          <p className="m-0 max-w-[30ch] text-[17px] leading-relaxed text-pretty" style={{ color: "var(--color-fg-secondary)" }}>
            {SITE.intro}
          </p>
          <p
            className="m-0 text-right text-[10.5px] leading-[2] tracking-[0.18em] uppercase"
            style={{ fontFamily: "var(--font-mono)", color: "var(--color-fg-muted)" }}
          >
            {SITE.heroStats.map((line, i) => (
              <span key={line}>
                {line}
                {i < SITE.heroStats.length - 1 && <br />}
              </span>
            ))}
          </p>
        </div>

        <div ref={heroRef} style={{ willChange: "transform", transformOrigin: "0 100%" }}>
          {/* Mask for the letter-up entrance. pb is in em of the wordmark itself
              so the 0.78 line-height still leaves room for j/y descenders. */}
          <h1
            ref={wordmarkRef}
            className="m-0 cursor-default overflow-hidden pb-[0.18em] font-bold"
            style={{ fontSize: "clamp(56px,15.5vw,272px)", lineHeight: 0.78, letterSpacing: "-0.055em" }}
          >
            {SITE.name.split("").map((letter, i) => (
              <span key={i} className="inline-block" style={{ transition: "transform .6s cubic-bezier(.16,1,.3,1), color .4s ease" }}>
                <span
                  data-letter="true"
                  className="inline-block"
                  style={{ animation: `letter-up 1.05s cubic-bezier(.16,1,.3,1) ${(0.05 * (i + 1)).toFixed(2)}s both` }}
                >
                  {letter}
                </span>
              </span>
            ))}
          </h1>
          <div className="relative mt-4 pt-[18px]">
            <span
              aria-hidden
              className="absolute inset-x-0 top-0 h-px origin-left"
              style={{ background: "var(--color-hairline)", animation: "sweep-in 1.2s cubic-bezier(.16,1,.3,1) .58s both" }}
            />
            <div className="flex flex-wrap items-end justify-between gap-7">
              <div
                className="flex max-w-[30ch] flex-col gap-2"
                style={{ animation: "blur-in 1.1s cubic-bezier(.16,1,.3,1) .72s both" }}
              >
                <span
                  className="text-[10.5px] tracking-[0.28em] uppercase"
                  style={{ fontFamily: "var(--font-mono)", color: "var(--color-accent)" }}
                >
                  {SITE.role}
                </span>
                <p
                  className="m-0 text-pretty"
                  style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(27px,3.6vw,50px)", lineHeight: 1.02, letterSpacing: "-0.015em" }}
                >
                  {SITE.heroTagline.lead} <span style={{ fontStyle: "italic" }}>{SITE.heroTagline.italic}</span>
                </p>
              </div>
              <span
                ref={cueRef}
                aria-hidden
                className="fade-in text-[10.5px] tracking-[0.2em] uppercase"
                style={{ fontFamily: "var(--font-mono)", color: "var(--color-fg-muted)", animationDelay: "1.15s" }}
              >
                <span className="scroll-cue">scroll ↓</span>
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

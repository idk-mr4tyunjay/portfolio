"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import type { ScreenCorners } from "./StudioScene";
import { SITE } from "@/data/site";
import styles from "./Hero.module.css";

const StudioScene = dynamic(() => import("./StudioScene"), { ssr: false });
const clamp = (value: number) => Math.max(0, Math.min(1, value));

/** Project the same HTML work section onto the monitor's four world-space corners. */
function screenTransform(corners: ScreenCorners, width: number, height: number) {
  const [p0, p1, p2, p3] = corners.map(([x, y]) => [x * width, y * height]);
  const dx1 = p1[0] - p2[0], dx2 = p3[0] - p2[0];
  const dy1 = p1[1] - p2[1], dy2 = p3[1] - p2[1];
  const dx3 = p0[0] - p1[0] + p2[0] - p3[0];
  const dy3 = p0[1] - p1[1] + p2[1] - p3[1];
  const determinant = dx1 * dy2 - dx2 * dy1;
  if (Math.abs(determinant) < 0.001) return null;
  const g = (dx3 * dy2 - dx2 * dy3) / determinant;
  const h = (dx1 * dy3 - dx3 * dy1) / determinant;
  const matrix = [
    (p1[0] - p0[0] + g * p1[0]) / 1280, (p1[1] - p0[1] + g * p1[1]) / 1280, 0, g / 1280,
    (p3[0] - p0[0] + h * p3[0]) / 720, (p3[1] - p0[1] + h * p3[1]) / 720, 0, h / 720,
    0, 0, 1, 0, p0[0], p0[1], 0, 1,
  ];
  return matrix.every(Number.isFinite) ? `matrix3d(${matrix.join(",")})` : null;
}

export function Hero({ children, destination }: { children: ReactNode; destination: ReactNode }) {
  const journey = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const intro = useRef<HTMLDivElement>(null);
  const cue = useRef<HTMLDivElement>(null);
  const screen = useRef<HTMLDivElement>(null);
  const handoff = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const lastCorners = useRef<ScreenCorners>([]);
  const [motion, setMotion] = useState(false);
  const [preferenceKnown, setPreferenceKnown] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [camera, setCamera] = useState(0);
  const animated = motion && !failed;

  const placeHandoff = useCallback(() => {
    const surface = handoff.current;
    if (!surface) return;
    const amount = clamp((progress.current - 0.90) / 0.085);
    const eased = amount * amount * (3 - 2 * amount);
    const corners = lastCorners.current;
    const left = corners.length === 4 ? Math.max(0, Math.min(...corners.map(([x]) => x))) : 0;
    const right = corners.length === 4 ? Math.max(0, 1 - Math.max(...corners.map(([x]) => x))) : 0;
    const top = corners.length === 4 ? Math.max(0, Math.min(...corners.map(([, y]) => y))) : 0;
    const bottom = corners.length === 4 ? Math.max(0, 1 - Math.max(...corners.map(([, y]) => y))) : 0;
    surface.style.clipPath = `inset(${top * (1 - eased) * 100}% ${right * (1 - eased) * 100}% ${bottom * (1 - eased) * 100}% ${left * (1 - eased) * 100}%)`;
    surface.style.opacity = String(clamp(amount * 2));
  }, []);

  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setMotion(!preference.matches);
      setPreferenceKnown(true);
    };
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!preferenceKnown) return;
    const id = window.location.hash.slice(1);
    if (!["index", "selected", "about", "notes", "contact"].includes(id)) return;
    let cancelled = false;
    let raf = 0;
    // Native hash restoration can run before the animated hero reserves its
    // scroll distance. Resolve it again once the layout and fonts are ready.
    void document.fonts.ready.then(() => {
      if (cancelled) return;
      raf = requestAnimationFrame(() => {
        const target = document.getElementById(id);
        if (!target) return;
        if (window.__lenis) window.__lenis.scrollTo(target, { immediate: true, offset: 0 });
        else window.scrollTo({ top: window.scrollY + target.getBoundingClientRect().top, behavior: "instant" });
      });
    });
    return () => { cancelled = true; cancelAnimationFrame(raf); };
  }, [preferenceKnown]);

  useEffect(() => {
    const container = journey.current, viewport = stage.current, panel = frame.current;
    if (!container || !viewport || !panel) return;
    let raf = 0, immersed = false;
    function draw() {
      raf = 0;
      const bounds = container!.getBoundingClientRect();
      const width = viewport!.clientWidth, height = viewport!.clientHeight;
      const distance = Math.max(1, container!.offsetHeight - height);
      const p = animated ? clamp(-bounds.top / distance) : 0;
      progress.current = p;
      const grow = clamp(p / 0.23);
      const mobile = width < 700;
      const gutter = mobile ? 20 : Math.max(24, Math.min(80, width * 0.05));
      const top = mobile
        ? Math.max(Math.min(300, height * 0.40), (intro.current?.offsetTop ?? 112) + (intro.current?.offsetHeight ?? 160) + 32)
        : Math.min(340, Math.max(270, height * 0.36));
      const bottom = mobile ? 58 : 48;
      panel!.style.left = `${gutter * (1 - grow)}px`;
      panel!.style.top = `${top * (1 - grow)}px`;
      panel!.style.width = `${width - 2 * gutter * (1 - grow)}px`;
      panel!.style.height = `${height - (top + bottom) * (1 - grow)}px`;
      panel!.style.borderRadius = `${16 * (1 - grow)}px`;
      if (intro.current) {
        intro.current.style.opacity = String(1 - clamp(grow * 1.7));
        intro.current.style.transform = `translate3d(0,${-grow * 90}px,0)`;
        intro.current.inert = grow > 0.5;
      }
      if (cue.current) {
        cue.current.style.opacity = String(1 - clamp(grow * 2));
        cue.current.inert = grow > 0.5;
      }
      // At the end both copies occupy the exact same viewport coordinates.
      // Reveal the real section without a second scroll or a loading boundary.
      viewport!.style.visibility = p >= 1 ? "hidden" : "visible";
      viewport!.style.opacity = p >= 1 ? "0" : "1";
      viewport!.style.pointerEvents = p >= 1 ? "none" : "";
      viewport!.inert = p >= 1;
      container!.style.pointerEvents = p >= 1 ? "none" : "";
      placeHandoff();
      setCamera(clamp((p - 0.23) / 0.69));
      const nextImmersed = animated && p > 0.08 && p < 0.985;
      if (nextImmersed !== immersed) {
        immersed = nextImmersed;
        document.documentElement.dataset.studioImmersed = String(immersed);
        window.dispatchEvent(new CustomEvent("studio:immersion", { detail: immersed }));
      }
    }
    const schedule = () => { if (!raf) raf = requestAnimationFrame(draw); };
    const observer = new ResizeObserver(schedule);
    observer.observe(viewport);
    if (intro.current) observer.observe(intro.current);
    window.addEventListener("scroll", schedule, { passive: true });
    draw();
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      delete document.documentElement.dataset.studioImmersed;
      window.dispatchEvent(new CustomEvent("studio:immersion", { detail: false }));
    };
  }, [animated, placeHandoff]);

  const placeScreen = useCallback((corners: ScreenCorners) => {
    lastCorners.current = corners;
    placeHandoff();
    const plane = screen.current, panel = frame.current;
    if (!plane || !panel) return;
    if (corners.length !== 4) { plane.style.visibility = "hidden"; return; }
    const transform = screenTransform(corners, panel.clientWidth, panel.clientHeight);
    plane.style.visibility = transform ? "visible" : "hidden";
    if (transform) plane.style.transform = transform;
  }, [placeHandoff]);

  function skipToWork() {
    const target = document.getElementById("index");
    if (!target) return;
    if (window.__lenis) window.__lenis.scrollTo(target, { immediate: true });
    else window.scrollTo({ top: window.scrollY + target.getBoundingClientRect().top, behavior: "instant" });
    target.focus({ preventScroll: true });
  }

  return (
    <section ref={journey} id="top" className={`${styles.journey} ${animated ? styles.animated : ""}`} aria-labelledby="hero-heading">
      <div ref={stage} className={styles.stage}>
        <div ref={intro} className={styles.intro}>
          <h1 id="hero-heading">{SITE.heroHeadline.lead}<br />{SITE.heroHeadline.continuation}</h1>
          <div className={styles.introAside}>
            <p>Full-stack developer.<br />Products, tools, and the<br className={styles.desktopBreak} /> details that make them work.</p>
            <a href="#index" onClick={(event) => { event.preventDefault(); skipToWork(); }}>Explore the work <span aria-hidden="true">↗</span></a>
          </div>
        </div>
        <div ref={frame} className={styles.frame} aria-label="An illustrated developer at a minimal workstation">
          <Image src="/studio/poster.png" alt="An anonymous illustrated developer at a desk, with this portfolio on the monitor." fill priority sizes="100vw" className={styles.poster} style={{ opacity: ready && animated ? 0 : 1 }} />
          {animated && <StudioScene progress={camera} onReady={() => setReady(true)} onError={() => setFailed(true)} onScreenChange={placeScreen} className={styles.scene} />}
          {animated && ready && <div ref={screen} className={styles.monitorPlane} aria-hidden="true" inert>{children}</div>}
          {animated && <div ref={handoff} className={styles.handoff} aria-hidden="true" inert>{destination}</div>}
        </div>
        <div ref={cue} className={styles.cue}>
          <span>Independent mind. Hands-on builder.</span>
          <a href="#index" onClick={(event) => { event.preventDefault(); skipToWork(); }}>{animated ? "Scroll to step inside" : "Discover the work"}<span aria-hidden="true">↓</span></a>
        </div>
      </div>
    </section>
  );
}

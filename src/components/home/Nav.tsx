"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/*
  Sticky nav that hides on scroll down and returns on scroll up, so
  navigation stays reachable from deep in the page (phones especially).
  Transparent at the top; gains a full-bleed blurred backdrop (.nav-bar::before)
  only once content actually passes under it.
*/

const HIDE_AFTER = 160; // never hide near the top of the page
const JITTER = 4; // ignore sub-4px scroll noise

export function Nav() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 8);
        if (Math.abs(y - lastY) > JITTER) {
          setHidden(y > lastY && y > HIDE_AFTER);
          lastY = y;
        }
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      aria-label="Main"
      className={`nav-bar flex items-center justify-between gap-4${
        hidden ? " nav-hidden" : ""
      }${scrolled ? " nav-scrolled" : ""}`}
    >
      <Link
        href="/"
        className="flex items-center gap-2 py-2 text-[14px] font-medium"
        style={{ fontFamily: "var(--font-mono)", color: "var(--color-fg)" }}
      >
        <span
          aria-hidden
          className="inline-block size-2 rounded-full"
          style={{ background: "var(--color-accent)" }}
        />
        mj
      </Link>
      <div className="flex gap-4 text-[14px] sm:gap-6">
        <Link href="/#work" className="quiet-link nav-link py-2">
          work
        </Link>
        <Link href="/#projects" className="quiet-link nav-link py-2">
          projects
        </Link>
        <Link href="/notes" className="quiet-link nav-link py-2">
          notes
        </Link>
        <Link href="/#contact" className="quiet-link nav-link py-2">
          contact
        </Link>
      </div>
    </nav>
  );
}

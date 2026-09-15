"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useActiveSection } from "@/lib/useActiveSection";
import { smoothScrollTo } from "@/lib/scroll";
import { SECTION_IDS } from "@/lib/sections";
import { SITE } from "@/data/site";

/*
  Nav — SPEC.md §4.7. Name, four links, theme. One dot slides under the
  active section. Earns a surface once the page scrolls so rows never read
  through it.
*/

const LINKS = [
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "notes", label: "Notes", href: "/notes" },
  { id: "contact", label: "Contact" },
] as const;

export function Nav() {
  const active = useActiveSection(SECTION_IDS);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [scrolled, setScrolled] = useState(false);
  const listRef = useRef<HTMLElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "light");
    let raf = 0;
    const check = () => {
      raf = 0;
      setScrolled(window.scrollY > 16);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Slide the dot under the active link. "side" (side projects) counts as about's neighbour: no link, keep the last one.
  useEffect(() => {
    const dot = dotRef.current;
    const list = listRef.current;
    if (!dot || !list) return;
    const id = active === "side" ? "about" : active;
    const link = id ? list.querySelector<HTMLElement>(`[data-id="${id}"]`) : null;
    if (!link) {
      dot.dataset.visible = "false";
      return;
    }
    dot.dataset.visible = "true";
    dot.style.transform = `translateX(${link.offsetLeft + link.offsetWidth / 2 - 2.5}px)`;
  }, [active]);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("mj-theme", next);
    } catch {
      // storage disabled; the theme just won't persist
    }
  };

  const go = (id: string) => (e: React.MouseEvent) => {
    if (document.getElementById(id)) {
      e.preventDefault();
      smoothScrollTo(id);
    }
  };

  return (
    <header
      data-scrolled={scrolled}
      className={`nav-bar fixed inset-x-0 top-0 z-40 flex items-center justify-between gap-4 px-[var(--gutter)] py-4 text-[13px] font-medium ${scrolled ? "backdrop-blur-md" : ""}`}
    >
      <Link href="/" onClick={go("top")} className="nav-link" data-cursor="open" style={{ opacity: 1 }}>
        {SITE.name}
      </Link>
      <nav ref={listRef} aria-label="Main" className="relative flex gap-5 sm:gap-7">
        {LINKS.map((link) => (
          <Link
            key={link.id}
            href={"href" in link ? link.href : `/#${link.id}`}
            onClick={go(link.id)}
            className="nav-link"
            data-id={link.id}
            data-active={active === link.id || (link.id === "about" && active === "side")}
            data-cursor="open"
          >
            {link.label}
          </Link>
        ))}
        <span ref={dotRef} className="nav-dot" data-visible="false" aria-hidden />
      </nav>
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
        className="nav-link cursor-pointer border-0 bg-transparent p-0 font-[inherit]"
        data-cursor="open"
      >
        {theme === "dark" ? "Light" : "Dark"}
      </button>
    </header>
  );
}

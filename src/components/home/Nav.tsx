"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useActiveSection } from "@/lib/useActiveSection";
import { smoothScrollTo } from "@/lib/scroll";
import { SECTION_IDS } from "@/lib/sections";

/*
  Fixed header. mix-blend-mode: difference keeps the mark/links legible over
  any section background (light or dark) without a backdrop. Scroll-spy dots
  track whichever section is active; the theme toggle persists to
  localStorage (the blocking script in layout.tsx applies it before paint).
*/

const LINKS: { id: string; label: string }[] = [
  { id: "index", label: "index" },
  { id: "selected", label: "work" },
  { id: "notes", label: "notes" },
  { id: "contact", label: "contact" },
];

export function Nav() {
  const active = useActiveSection(SECTION_IDS);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [clock, setClock] = useState("--:--");

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "light");

    const tick = () =>
      setClock(
        new Intl.DateTimeFormat("en-GB", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date()),
      );
    tick();
    const id = setInterval(tick, 20000);
    return () => clearInterval(id);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("mj-theme", next);
    } catch {
      // storage disabled — theme just won't persist across reloads
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
      className="fixed inset-x-0 top-0 z-40 grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-3 py-4 text-[9px] tracking-[0.14em] uppercase sm:gap-5 sm:px-[30px] sm:text-[10.5px] sm:tracking-[0.18em]"
      style={{ fontFamily: "var(--font-mono)", mixBlendMode: "difference", color: "#fff" }}
    >
      <Link href="/" onClick={go("top")} className="justify-self-start whitespace-nowrap">
        mruthunjay
      </Link>
      <nav aria-label="Main" className="flex justify-self-center gap-2 sm:gap-5">
        {LINKS.map((link) => (
          <Link
            key={link.id}
            href={`/#${link.id}`}
            onClick={go(link.id)}
            className="header-link py-2"
            data-active={active === link.id}
          >
            <span aria-hidden className="header-link-dot" />
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="flex items-center gap-2.5 justify-self-end sm:gap-3.5">
        <span className="hidden opacity-60 [font-variant-numeric:tabular-nums] sm:inline">
          {clock} ist
        </span>
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          className="flex cursor-pointer items-center gap-1.5 border border-white/45 px-2 py-1.5 transition-colors hover:border-white sm:px-2.5"
          style={{ background: "none", color: "inherit", font: "inherit" }}
        >
          <span aria-hidden className="inline-block size-1.5 rounded-full" style={{ background: "currentColor" }} />
          <span className="hidden sm:inline">{theme === "dark" ? "light" : "dark"}</span>
        </button>
      </div>
    </header>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useActiveSection } from "@/lib/useActiveSection";
import { smoothScrollTo } from "@/lib/scroll";
import { SECTION_IDS } from "@/lib/sections";
import styles from "./Nav.module.css";

const links = [{ id: "index", label: "Work" }, { id: "about", label: "About" }, { id: "notes", label: "Notes" }, { id: "contact", label: "Contact" }];

export function Nav() {
  const pathname = usePathname();
  const active = useActiveSection(SECTION_IDS);
  const [scrolled, setScrolled] = useState(false);
  const [immersed, setImmersed] = useState(false);
  useEffect(() => {
    const scroll = () => setScrolled(window.scrollY > 20);
    const immersion = (event: Event) => setImmersed((event as CustomEvent<boolean>).detail);
    scroll();
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("studio:immersion", immersion);
    return () => { window.removeEventListener("scroll", scroll); window.removeEventListener("studio:immersion", immersion); };
  }, []);
  const go = (id: string) => (event: React.MouseEvent) => {
    if (pathname === "/" && document.getElementById(id)) { event.preventDefault(); smoothScrollTo(id); }
  };
  return (
    <header className={styles.header} data-scrolled={scrolled} data-immersed={immersed && pathname === "/"} inert={immersed && pathname === "/"}>
      <Link href="/" onClick={go("top")} className={styles.brand} aria-label="Mruthunjay, home">Mruthunjay<span aria-hidden="true">.</span></Link>
      <nav aria-label="Main navigation" className={styles.links}>
        {links.map(({ id, label }) => <Link key={id} href={`/#${id}`} onClick={go(id)} aria-current={pathname === "/" && active === id ? "location" : undefined}>{label}</Link>)}
      </nav>
      <button className={styles.search} type="button" aria-label="Search projects and pages" onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }))}><span>Search</span><kbd>⌘ K</kbd></button>
    </header>
  );
}

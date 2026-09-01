"use client";

import { useActiveSection } from "@/lib/useActiveSection";
import { SECTION_IDS } from "@/lib/sections";

/*
  Paired header row every section repeats: a sticky mono "NN — label" on the
  left (picks up the accent while its section is active, via scroll-spy) and
  an italic serif tagline on the right. `invert` switches to the panel color
  tokens for use inside the dark About panel.
*/
export function SectionHeader({
  id,
  number,
  label,
  tagline,
  invert = false,
}: {
  id: string;
  number: string;
  label: string;
  tagline: string;
  invert?: boolean;
}) {
  const active = useActiveSection(SECTION_IDS) === id;

  return (
    <div className="mb-8 flex items-baseline justify-between gap-5">
      <span
        className="section-label sticky top-[60px] text-[10.5px] tracking-[0.2em] uppercase transition-colors duration-[400ms]"
        data-active={active}
        style={{
          fontFamily: "var(--font-mono)",
          color: invert ? "var(--color-panel-fg-muted)" : "var(--color-fg-muted)",
        }}
      >
        {number} · {label}
      </span>
      <span
        className="text-[20px]"
        style={{
          fontFamily: "var(--font-serif)",
          fontStyle: "italic",
          color: invert ? "var(--color-panel-fg-body)" : "var(--color-fg-secondary)",
        }}
      >
        {tagline}
      </span>
    </div>
  );
}

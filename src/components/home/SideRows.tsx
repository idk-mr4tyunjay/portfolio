"use client";

import { useState } from "react";
import { PROJECTS } from "@/data/projects";
import { isLive } from "@/lib/receipts";
import { releaseLeaf } from "@/lib/motion";
import { Branch } from "./Branch";
import { usePeek } from "./Peek";

/*
  Side projects — SPEC.md §4.3. The same rows at half size; each is a link
  out. Hover behaves like work rows. The aerial roots (Roots.tsx) start from
  these branches.
*/

const SHOTS = PROJECTS.map((p) => p.image?.src).filter((s): s is string => Boolean(s));

export function SideRows() {
  const [shakes, setShakes] = useState<Record<string, number>>({});
  const { peek, show, move, hide } = usePeek(SHOTS);

  return (
    <section id="side" aria-label="Side projects" className="gutter relative pt-20 sm:pt-28">
      {peek}
      <h2 className="t-title m-0 mb-8 sm:mb-12">Side projects</h2>

      <div>
        {PROJECTS.map((p) => {
          const href = p.url ?? p.links?.[0]?.url ?? "#";
          const live = isLive(p.url);
          return (
            <div key={p.name} className="relative">
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                className="row grid-cols-1 items-end gap-2 py-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-8 sm:py-6"
                data-cursor="open"
                onPointerEnter={(e) => {
                  if (p.image?.src) show(e, { src: p.image.src, alt: p.name });
                  setShakes((s) => ({ ...s, [p.name]: (s[p.name] ?? 0) + 1 }));
                  const b = e.currentTarget.getBoundingClientRect();
                  releaseLeaf({ x: e.clientX, y: b.bottom + window.scrollY });
                }}
                onPointerMove={move}
                onPointerLeave={hide}
              >
                <span className="grid gap-1">
                  <span className="row-name t-row-sm inline-flex items-center gap-3">
                    <span className="dot-sm" data-live={live} aria-hidden />
                    {p.name}
                  </span>
                  <span className="max-w-[48ch] text-[15px] leading-[1.45] text-[var(--color-fg-muted)]">{p.description}</span>
                </span>
                <span className="t-meta flex gap-x-5 sm:flex-col sm:items-end sm:text-right">
                  <span className="text-[var(--color-fg)]">{p.year}</span>
                  <span>{p.tech?.join(", ")}</span>
                  <span className="sr-only">{live ? "live" : "not reachable at build time"}</span>
                </span>
              </a>
              <Branch shake={shakes[p.name] ?? 0} />
            </div>
          );
        })}
      </div>
    </section>
  );
}

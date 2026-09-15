"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { CASE_STUDIES } from "@/data/experience";
import { isLive } from "@/lib/receipts";
import { releaseLeaf } from "@/lib/motion";
import type { CaseStudy } from "@/types";
import { Branch } from "./Branch";
import { usePeek } from "./Peek";

/*
  Work — SPEC.md §4.2. Bare rows. Hover: the screenshot follows the pointer,
  the branch shakes, one leaf lets go. Click: the case study opens in place
  and the branch thickens. One open at a time, deep-linkable by #slug.
*/

const slug = (name: string) => name.toLowerCase().replace(/\s+/g, "-");
const shot = (cs: CaseStudy) => cs.images?.[0]?.src ?? cs.products?.[0]?.image?.src;
const SHOTS = CASE_STUDIES.map(shot).filter((s): s is string => Boolean(s));

export function WorkRows() {
  const [open, setOpen] = useState<string | null>(null);
  const [shakes, setShakes] = useState<Record<string, number>>({});
  const { peek, show, move, hide } = usePeek(SHOTS);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    const match = CASE_STUDIES.find((cs) => slug(cs.name) === hash);
    if (match) setOpen(match.name);
  }, []);

  const toggle = (cs: CaseStudy) => {
    const next = open === cs.name ? null : cs.name;
    setOpen(next);
    history.replaceState(null, "", next ? `#${slug(cs.name)}` : window.location.pathname);
    hide();
  };

  const enter = (e: React.PointerEvent<HTMLElement>, cs: CaseStudy) => {
    const src = shot(cs);
    if (src && open !== cs.name) show(e, { src, alt: cs.name });
    setShakes((s) => ({ ...s, [cs.name]: (s[cs.name] ?? 0) + 1 }));
    const item = e.currentTarget.parentElement;
    if (item) {
      const b = item.getBoundingClientRect();
      releaseLeaf({ x: e.clientX, y: b.bottom + window.scrollY });
    }
  };

  return (
    <section id="work" aria-label="Work" className="gutter relative pt-20 sm:pt-28">
      {peek}
      <h2 className="t-title m-0 mb-8 sm:mb-12">Work</h2>

      <div>
        {CASE_STUDIES.map((cs) => {
          const isOpen = open === cs.name;
          const id = `case-${slug(cs.name)}`;
          return (
            <div key={cs.name} id={slug(cs.name)} className="relative">
              <button
                type="button"
                className="row grid-cols-1 items-end gap-3 py-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-8 sm:py-8"
                aria-expanded={isOpen}
                aria-controls={id}
                data-cursor={isOpen ? "close" : "open"}
                onClick={() => toggle(cs)}
                onPointerEnter={(e) => enter(e, cs)}
                onPointerMove={move}
                onPointerLeave={hide}
              >
                <span className="row-name t-row block">{cs.name}</span>
                <span className="t-meta flex flex-wrap gap-x-5 gap-y-1 sm:flex-col sm:items-end sm:text-right">
                  <span className="text-[var(--color-fg)]">{cs.period}</span>
                  <span>{cs.tagsLine}</span>
                </span>
              </button>

              <div id={id} className="case-panel" data-open={isOpen} aria-hidden={!isOpen}>
                <div className="grid gap-10 pb-12 sm:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] sm:gap-14">
                  <div className="grid content-start gap-8">
                    <p className="m-0 max-w-[36ch] text-[clamp(19px,1.8vw,26px)] leading-[1.35]">{cs.brief}</p>

                    {cs.whatIDid && (
                      <ul className="m-0 grid list-none gap-3 p-0">
                        {cs.whatIDid.map((b) => (
                          <li key={b.text} className="max-w-[52ch] border-t border-[var(--color-hairline)] pt-3 text-[16px] leading-[1.5]">
                            {b.text}
                          </li>
                        ))}
                      </ul>
                    )}

                    {cs.products && (
                      <ul className="m-0 grid list-none gap-3 p-0">
                        {cs.products.map((p) => (
                          <li key={p.name} className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-1 border-t border-[var(--color-hairline)] pt-3">
                            <span className="text-[18px] font-semibold">{p.name}</span>
                            <span className="t-meta">{p.year}</span>
                            <span className="col-span-2 max-w-[52ch] text-[15px] leading-[1.5]">{p.description}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    <ul className="m-0 flex list-none flex-wrap gap-x-6 gap-y-2 p-0 text-[15px]">
                      {cs.links.map((link) => (
                        <li key={link.url}>
                          <a href={link.url} target="_blank" rel="noreferrer" className="link link-live" tabIndex={isOpen ? 0 : -1} data-cursor="open">
                            <span className="dot-sm" data-live={isLive(link.url)} aria-hidden />
                            {link.label.replace(" ↗", "")}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid content-start gap-6">
                    {(cs.products ? cs.products.map((p) => ({ src: p.image?.src, alt: `${p.name} screenshot`, label: p.name })) : (cs.images ?? []).map((i) => ({ src: i.src, alt: `${cs.name} screenshot`, label: cs.name })))
                      .filter((i) => i.src)
                      .map((i) => (
                        <figure key={i.src} className="m-0 grid gap-2">
                          <div className="relative aspect-video overflow-hidden border border-[var(--color-fg)]">
                            {isOpen && <Image src={i.src!} alt={i.alt} fill sizes="(min-width: 640px) 58vw, 100vw" className="object-cover object-top" />}
                          </div>
                          <figcaption className="t-meta">{i.label}</figcaption>
                        </figure>
                      ))}
                  </div>
                </div>
              </div>

              <Branch open={isOpen} shake={shakes[cs.name] ?? 0} />
            </div>
          );
        })}
      </div>
    </section>
  );
}

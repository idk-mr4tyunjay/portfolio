"use client";

import { useRef, useState } from "react";
import { CASE_STUDIES } from "@/data/experience";
import type { CaseStudy } from "@/types";
import { ImagePlaceholder } from "./ImagePlaceholder";
import { SectionHeader } from "./SectionHeader";

/*
  Work index — expandable case-study rows. One row is open at a time; a
  floating "preview" tile follows the pointer while a row is hovered (closed
  rows only), echoing the reveal the click is about to give you.
*/

const PANEL_ID = (name: string) => `case-panel-${name.toLowerCase()}`;

export function WorkIndex() {
  const [open, setOpen] = useState<string | null>(null);
  const [peek, setPeek] = useState<{ x: number; y: number; visible: boolean }>({
    x: 0,
    y: 0,
    visible: false,
  });
  const peekLabel = useRef("");
  const peekSrc = useRef<string | undefined>(undefined);

  const move = (e: React.MouseEvent, cs: CaseStudy) => {
    peekLabel.current = cs.name;
    peekSrc.current = cs.images?.[0]?.src ?? cs.products?.[0]?.image?.src;
    setPeek({ x: e.clientX + 150, y: e.clientY, visible: true });
  };
  const leave = () => setPeek((p) => ({ ...p, visible: false }));

  return (
    <section id="index" aria-label="Work index" className="relative px-5 pb-3 sm:px-[30px]">
      <SectionHeader
        id="index"
        number="01"
        label="where I've worked"
        tagline="click a row for the case study"
      />

      <div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-20 hidden w-[230px] transition-[opacity,transform] duration-300 sm:block"
        style={{
          left: peek.x,
          top: peek.y,
          opacity: peek.visible ? 1 : 0,
          transform: `translate(-50%, -50%) scale(${peek.visible ? 1 : 0.94})`,
        }}
      >
        <ImagePlaceholder caption={`${peekLabel.current} · screenshot`} src={peekSrc.current} />
      </div>

      <div style={{ borderTop: "1px solid var(--color-hairline)" }}>
        {CASE_STUDIES.map((cs) => {
          const isOpen = open === cs.name;
          return (
            <div key={cs.name} style={{ borderBottom: "1px solid var(--color-hairline)" }}>
              <div
                role="button"
                tabIndex={0}
                data-open={isOpen || undefined}
                aria-expanded={isOpen}
                aria-controls={PANEL_ID(cs.name)}
                onClick={() => {
                  setOpen(isOpen ? null : cs.name);
                  leave();
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setOpen(isOpen ? null : cs.name);
                  }
                }}
                onMouseEnter={(e) => !isOpen && move(e, cs)}
                onMouseMove={(e) => !isOpen && move(e, cs)}
                onMouseLeave={leave}
                className="case-row grid grid-cols-[36px_1fr] items-center gap-4 py-5 sm:grid-cols-[64px_minmax(0,1.5fr)_minmax(0,1.6fr)_132px] sm:gap-6"
              >
                <span className="text-[11px] font-medium opacity-65" style={{ fontFamily: "var(--font-mono)" }}>
                  {cs.num}
                </span>
                <span className="font-semibold" style={{ fontSize: "clamp(26px,3.8vw,52px)", lineHeight: 1, letterSpacing: "-0.035em" }}>
                  {cs.name}
                </span>
                <span className="col-span-2 flex flex-col gap-1.5 sm:col-span-1">
                  <span className="text-[10.5px] font-medium tracking-[0.16em] uppercase opacity-65" style={{ fontFamily: "var(--font-mono)" }}>
                    {cs.tagsLine}
                  </span>
                  {cs.products && (
                    <span className="flex flex-wrap gap-x-2 gap-y-1">
                      {cs.products.map((product) => (
                        <span
                          key={product.name}
                          className="text-[9.5px] tracking-[0.1em] uppercase"
                          style={{ fontFamily: "var(--font-mono)", color: "var(--color-accent)" }}
                        >
                          {product.name}
                        </span>
                      ))}
                    </span>
                  )}
                  <span className="max-w-[48ch] text-[14.5px] leading-relaxed text-pretty opacity-70">{cs.summary}</span>
                </span>
                <span className="col-span-2 flex flex-row items-center justify-between gap-2 sm:col-span-1 sm:flex-col sm:items-end">
                  <span className="text-[11px] font-medium opacity-65" style={{ fontFamily: "var(--font-mono)" }}>
                    {cs.period}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[9.5px] font-medium tracking-[0.16em] opacity-65" style={{ fontFamily: "var(--font-mono)" }}>
                    <span>case study</span>
                    <span
                      aria-hidden
                      className="case-plus inline-flex size-[22px] items-center justify-center border"
                      style={{ borderColor: "currentColor" }}
                    >
                      +
                    </span>
                  </span>
                </span>
              </div>

              <div
                id={PANEL_ID(cs.name)}
                className="case-panel"
                style={isOpen ? { maxHeight: 1400, opacity: 1 } : undefined}
              >
                <div className="grid gap-8 pt-1 pb-10 sm:grid-cols-2">
                  <div className="flex flex-col gap-5">
                    <div>
                      <span className="text-[9.5px] tracking-[0.24em] uppercase" style={{ fontFamily: "var(--font-mono)", color: "var(--color-accent)" }}>
                        the brief
                      </span>
                      <p
                        className="mt-2 max-w-[34ch] text-pretty"
                        style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(20px,2.2vw,28px)", lineHeight: 1.2 }}
                      >
                        {cs.brief}
                      </p>
                    </div>

                    {cs.whatIDid && (
                      <div className="flex flex-col gap-2.5">
                        <span className="text-[9.5px] tracking-[0.24em] uppercase" style={{ fontFamily: "var(--font-mono)", color: "var(--color-fg-muted)" }}>
                          what I did
                        </span>
                        {cs.whatIDid.map((bullet) => (
                          <span key={bullet.text} className="grid grid-cols-[18px_minmax(0,1fr)] gap-2.5 text-[15px] leading-relaxed" style={{ color: "var(--color-fg-body)" }}>
                            <span style={{ color: "var(--color-accent)" }}>—</span>
                            <span
                              style={
                                bullet.placeholder
                                  ? { borderBottom: "1px dashed var(--color-hairline)", paddingBottom: "3px" }
                                  : undefined
                              }
                            >
                              {bullet.text}
                            </span>
                          </span>
                        ))}
                      </div>
                    )}

                    {cs.products && (
                      <div className="flex flex-col gap-2.5">
                        <span className="text-[9.5px] tracking-[0.24em] uppercase" style={{ fontFamily: "var(--font-mono)", color: "var(--color-fg-muted)" }}>
                          three products
                        </span>
                        {cs.products.map((product, i) => (
                          <span
                            key={product.name}
                            className="grid grid-cols-[96px_minmax(0,1fr)_76px] items-baseline gap-3 pb-2.5"
                            style={i < cs.products!.length - 1 ? { borderBottom: "1px dotted var(--color-hairline)" } : undefined}
                          >
                            <span className="text-[16px] font-semibold">{product.name}</span>
                            <span className="text-[14px] leading-relaxed" style={{ color: "var(--color-fg-secondary)" }}>
                              {product.description}
                            </span>
                            <span className="text-right text-[10px]" style={{ fontFamily: "var(--font-mono)", color: "var(--color-fg-muted)" }}>
                              {product.year}
                            </span>
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 text-[10px] tracking-[0.14em] uppercase" style={{ fontFamily: "var(--font-mono)" }}>
                      {cs.chips.map((chip) => (
                        <span key={chip} className="chip">
                          {chip}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-4 text-[10.5px] tracking-[0.16em] uppercase" style={{ fontFamily: "var(--font-mono)" }}>
                      {cs.links.map((link) => (
                        <a key={link.url} href={link.url} target="_blank" rel="noreferrer" className="quiet-link">
                          {link.label}
                        </a>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-5">
                    {cs.products
                      ? cs.products.map((product) => (
                          <div key={product.name} className="flex flex-col gap-2">
                            <span
                              className="text-[9.5px] font-medium tracking-[0.16em] uppercase opacity-65"
                              style={{ fontFamily: "var(--font-mono)" }}
                            >
                              {product.name}
                            </span>
                            <ImagePlaceholder
                              caption={product.image?.placeholder ?? `${product.name} · screenshot`}
                              src={product.image?.src}
                            />
                          </div>
                        ))
                      : cs.images?.map((image) => (
                          <ImagePlaceholder key={image.id} caption={image.placeholder} src={image.src} />
                        ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

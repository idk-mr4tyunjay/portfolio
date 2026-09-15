"use client";

import { useEffect, useRef, useState } from "react";
import { SITE } from "@/data/site";
import { RECEIPTS, liveCount, shortDate } from "@/lib/receipts";

/*
  Contact and the receipt — SPEC.md §4.6. Lines gather back into one dot at
  the trunk as the section enters. The email is the second largest thing on
  the page and copies on click. Then the build receipt: when, how many links
  answered, last commit.
*/

const { live, total } = liveCount();

// Six lines from across the width gathering to the gutter, in a 1000×120 box.
const RESOLVE_PATHS = [80, 250, 420, 590, 760, 930].map(
  (x) => `M${x} 0 C${x} 60 ${Math.round(x * 0.45)} 100 4 118`,
);

export function Contact() {
  const resolve = useRef<SVGSVGElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const el = resolve.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.dataset.drawn = "true";
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          el.dataset.drawn = "true";
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -30% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(SITE.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      window.location.href = `mailto:${SITE.email}`;
    }
  };

  return (
    <section id="contact" aria-label="Contact" className="gutter relative pt-16 pb-10 sm:pt-24">
      <div className="relative h-[120px]">
        <svg ref={resolve} className="resolve absolute inset-0 h-full w-full overflow-visible" viewBox="0 0 1000 120" preserveAspectRatio="none" aria-hidden>
          {RESOLVE_PATHS.map((d) => (
            <path key={d} d={d} pathLength={1} />
          ))}
        </svg>
        <span
          className="dot-sm absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2"
          data-trunk-end
          aria-hidden
        />
      </div>

      <div className="mt-12 grid gap-10 sm:mt-16">
        <button
          type="button"
          onClick={copy}
          data-cursor={copied ? "copied" : "copy"}
          className="t-title row w-auto cursor-pointer justify-self-start break-all text-left"
          aria-live="polite"
          aria-label={copied ? "Email copied" : `Copy ${SITE.email}`}
        >
          <span className="row-name">{SITE.email}</span>
          <span className="t-meta mt-3 block">{copied ? "copied" : "click to copy"}</span>
        </button>

        <div className="grid gap-8 border-t border-[var(--color-hairline)] pt-6 sm:grid-cols-[minmax(0,1fr)_auto]">
          <ul className="m-0 flex list-none flex-wrap gap-x-6 gap-y-2 p-0 text-[15px]">
            <li>
              <a href={`mailto:${SITE.email}`} className="link" data-cursor="open">
                mail app
              </a>
            </li>
            <li>
              <a href={SITE.github} target="_blank" rel="noreferrer" className="link" data-cursor="open">
                github
              </a>
            </li>
            <li>
              <a href={SITE.linkedin} target="_blank" rel="noreferrer" className="link" data-cursor="open">
                linkedin
              </a>
            </li>
            <li>
              <a href={SITE.producthunt} target="_blank" rel="noreferrer" className="link" data-cursor="open">
                product hunt
              </a>
            </li>
          </ul>
          <p className="t-meta m-0 inline-flex items-center gap-3 sm:justify-self-end">
            <span className="dot-sm" data-live={live === total} aria-hidden />
            <span>
              built {shortDate(RECEIPTS.builtAt)} · {live} of {total} links live · last commit {shortDate(RECEIPTS.commitAt)}
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}

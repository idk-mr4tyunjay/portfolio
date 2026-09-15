import { SITE } from "@/data/site";
import { STACK } from "@/data/stack";

/*
  About — SPEC.md §4.4. Two paragraphs and the stack as a plain list. The
  one section with no line work: the calm between canopy and roots.
*/

export function About() {
  return (
    <section id="about" aria-label="About" className="gutter relative pt-24 sm:pt-32">
      <div className="grid gap-10 sm:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] sm:gap-14">
        <div className="grid content-start gap-5">
          {SITE.about.map((paragraph) => (
            <p key={paragraph} className="m-0 max-w-[52ch] text-[clamp(18px,1.7vw,24px)] leading-[1.4]">
              {paragraph}
            </p>
          ))}
        </div>
        <dl className="m-0 grid content-start gap-4 text-[15px] leading-[1.5]">
          {STACK.map((group) => (
            <div key={group.group} className="grid gap-1 border-t border-[var(--color-hairline)] pt-3 sm:grid-cols-[96px_minmax(0,1fr)] sm:gap-4">
              <dt className="t-meta">{group.group}</dt>
              <dd className="m-0">{group.items.map((i) => i.name).join(", ")}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

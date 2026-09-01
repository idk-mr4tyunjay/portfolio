import { SITE } from "@/data/site";

/*
  Contact. A giant background "05" behind the heading, then the intro line,
  the email as the primary call-to-action, and social links off to the side.
*/

export function Contact() {
  return (
    <section id="contact" aria-label="Contact" className="relative overflow-hidden px-5 pt-24 pb-9 sm:px-[30px]">
      <span
        aria-hidden
        className="pointer-events-none absolute top-9 right-4 leading-[0.8] font-bold select-none"
        style={{ fontSize: "min(30vw, 340px)", color: "transparent", WebkitTextStroke: "1px var(--color-hairline)" }}
      >
        05
      </span>
      <span className="relative text-[10.5px] tracking-[0.2em] uppercase" style={{ fontFamily: "var(--font-mono)", color: "var(--color-fg-muted)" }}>
        05 · contact
      </span>
      <h2 className="relative mt-6 font-bold" style={{ fontSize: "clamp(52px,13vw,224px)", lineHeight: 0.8, letterSpacing: "-0.055em" }}>
        Let&apos;s build
        <br />
        <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400 }}>something</span>
      </h2>

      <div
        className="relative mt-11 grid gap-7 pt-5"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", borderTop: "1px solid var(--color-hairline)" }}
      >
        <p className="m-0 max-w-[34ch] text-[16px] leading-relaxed text-pretty" style={{ color: "var(--color-fg-secondary)" }}>
          Got a problem that&apos;s more interesting than it is urgent? That&apos;s my favourite kind. Email is the
          fastest way in, and I read all of it.
        </p>
        <a
          href={`mailto:${SITE.email}`}
          className="quiet-link flex items-baseline gap-2.5 self-start font-semibold"
          style={{ fontSize: "clamp(22px,2.8vw,38px)", letterSpacing: "-0.03em", borderBottom: "1px solid var(--color-hairline)", paddingBottom: "8px" }}
        >
          {SITE.email} <span style={{ fontSize: "0.5em" }}>↗</span>
        </a>
        <div className="flex flex-col items-start gap-2 text-[11px] tracking-[0.16em] uppercase" style={{ fontFamily: "var(--font-mono)" }}>
          <a href={SITE.github} target="_blank" rel="noreferrer" className="quiet-link">
            github ↗
          </a>
          <a href={SITE.linkedin} target="_blank" rel="noreferrer" className="quiet-link">
            linkedin ↗
          </a>
          <a href={SITE.producthunt} target="_blank" rel="noreferrer" className="quiet-link">
            product hunt ↗
          </a>
          <span style={{ color: "var(--color-fg-muted)" }}>remote · ist ±5</span>
        </div>
      </div>
    </section>
  );
}

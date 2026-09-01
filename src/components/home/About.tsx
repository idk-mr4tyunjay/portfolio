import { SITE } from "@/data/site";
import { STACK } from "@/data/stack";
import { TECH_ICONS } from "@/data/tech-icons";
import { TechIcon } from "@/components/icons";
import { SectionHeader } from "./SectionHeader";

/*
  About. Inverted panel (light↔dark swap from the rest of the page) so it
  reads as a distinct beat between the project sections and notes.
*/

export function About() {
  return (
    <section
      id="about"
      aria-label="About"
      className="relative mt-20 px-5 pt-20 pb-12 sm:px-[30px]"
      style={{ background: "var(--color-panel)", color: "var(--color-panel-fg)" }}
    >
      <SectionHeader id="about" number="03" label="about" tagline="end to end" invert />

      <p
        className="m-0 mb-10 max-w-[24ch] font-bold"
        style={{ fontSize: "clamp(40px,7.6vw,132px)", lineHeight: 0.9, letterSpacing: "-0.05em" }}
      >
        Design it, build it,{" "}
        <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, color: "var(--color-panel-accent)" }}>
          own it.
        </span>
      </p>

      <div className="grid gap-10 pb-12" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
        <div className="flex flex-col gap-4">
          {SITE.about.map((paragraph) => (
            <p key={paragraph} className="m-0 max-w-[46ch] text-[19px] leading-relaxed text-pretty" style={{ color: "var(--color-panel-fg-body)" }}>
              {paragraph}
            </p>
          ))}
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex items-start gap-3 p-4" style={{ border: "1px solid var(--color-panel-hairline)" }}>
            <span aria-hidden className="pulse-dot mt-1.5 inline-block size-2 shrink-0 rounded-full" style={{ background: "var(--color-panel-accent)" }} />
            <span className="flex flex-col gap-1">
              <span className="text-[9.5px] tracking-[0.24em] uppercase" style={{ fontFamily: "var(--font-mono)", color: "var(--color-panel-fg-muted)" }}>
                right now
              </span>
              <span className="text-[15px] leading-snug">{SITE.now}</span>
            </span>
          </div>

          <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(132px, 1fr))" }}>
            {STACK.map((group) => (
              <div key={group.group} className="flex flex-col gap-2">
                <span
                  className="pb-2 text-[9.5px] tracking-[0.2em] uppercase"
                  style={{ fontFamily: "var(--font-mono)", color: "var(--color-panel-fg-muted)", borderBottom: "1px solid var(--color-panel-hairline)" }}
                >
                  {group.group}
                </span>
                {group.items.map((item) => (
                  <span key={item.name} className="flex items-center gap-2 text-[14.5px]" style={{ color: "var(--color-panel-fg-body)" }}>
                    <span className="inline-flex shrink-0">
                      <TechIcon path={TECH_ICONS[item.icon]} />
                    </span>
                    {item.name}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

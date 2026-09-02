import { PROJECTS } from "@/data/projects";
import { ImagePlaceholder } from "./ImagePlaceholder";

/*
  Off-the-clock side projects. Each card is a link; the caption strip (tech +
  live/github) slides up on hover via Tailwind's `group`, no JS needed.
*/

export function SideProjects() {
  return (
    <section id="selected" aria-label="Selected side projects" className="relative px-5 pt-20 sm:px-[30px]">
      <div className="mb-9 flex items-baseline justify-between gap-5">
        <h2 className="m-0 font-bold" style={{ fontSize: "clamp(40px,8.4vw,150px)", lineHeight: 0.82, letterSpacing: "-0.05em" }}>
          Built for
          <br />
          <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, letterSpacing: "-0.02em" }}>
            no one but me
          </span>
        </h2>
        <span
          className="whitespace-nowrap text-[10.5px] tracking-[0.2em] uppercase"
          style={{ fontFamily: "var(--font-mono)", color: "var(--color-fg-muted)" }}
        >
          02 · off the clock
        </span>
      </div>

      <div className="grid gap-8 pb-20" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))" }}>
        {PROJECTS.map((project, index) => {
          const status = project.url ? "live ↗" : "github ↗";
          return (
            <a
              key={project.name}
              href={project.url ?? project.links?.[0]?.url}
              target="_blank"
              rel="noreferrer"
              className="group flex flex-col gap-3.5"
            >
              <div className="relative overflow-hidden">
                <ImagePlaceholder
                  caption={project.image?.placeholder ?? `${project.name.toLowerCase()} · product shot`}
                  src={project.image?.src}
                  className="transition-colors group-hover:[border-color:var(--color-accent)]"
                />
                <span className="pointer-events-none absolute inset-x-0 top-0 flex justify-between p-3 text-[9.5px] tracking-[0.16em] uppercase" style={{ fontFamily: "var(--font-mono)", color: "var(--color-fg-muted)" }}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <span>{project.year}</span>
                </span>
                <span
                  className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 p-3 text-[9.5px] tracking-[0.16em] uppercase transition-transform duration-500 ease-out translate-y-full group-hover:translate-y-0"
                  style={{ fontFamily: "var(--font-mono)", background: "var(--color-panel)", color: "var(--color-panel-fg)" }}
                >
                  <span>{project.tech?.join(" · ")}</span>
                  <span>{status}</span>
                </span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="font-semibold transition-colors group-hover:[color:var(--color-accent)]" style={{ fontSize: "27px", letterSpacing: "-0.03em", lineHeight: 1 }}>
                  {project.name}
                </span>
                <span
                  className="ml-auto text-[13px] transition-transform duration-500 ease-out group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:[color:var(--color-accent)]"
                  style={{ fontFamily: "var(--font-mono)", color: "var(--color-fg-muted)" }}
                >
                  ↗
                </span>
              </div>
              <p className="m-0 max-w-[40ch] text-[15px] leading-relaxed text-pretty" style={{ color: "var(--color-fg-secondary)" }}>
                {project.description}
              </p>
            </a>
          );
        })}
      </div>
    </section>
  );
}

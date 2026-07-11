import { PROJECTS } from "@/data/projects";

export function WorkList() {
  return (
    <section id="work" aria-label="Work" className="pb-20">
      <p
        className="mb-1 text-xs"
        style={{ fontFamily: "var(--font-mono)", color: "var(--color-fg-muted)" }}
      >
        work
      </p>
      <ul>
        {PROJECTS.map((project) => {
          const row = (
            <span
              className="block py-4"
              style={{ borderTop: "1px solid var(--color-hairline)" }}
            >
              <span className="flex items-baseline gap-4">
                <span className="flex-1 text-[15px] font-medium">
                  {project.name}
                </span>
                <span
                  className="text-xs"
                  style={{
                    fontFamily: "var(--font-mono)",
                    color: "var(--color-fg-muted)",
                  }}
                >
                  {project.year}
                </span>
                {project.url && (
                  <span
                    aria-hidden
                    className="text-[13px] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    style={{ color: "var(--color-accent)" }}
                  >
                    ↗
                  </span>
                )}
              </span>
              <span
                className="mt-1 block text-[13px]"
                style={{ color: "var(--color-fg-secondary)" }}
              >
                {project.description}
              </span>
            </span>
          );

          return (
            <li key={project.name}>
              {project.url ? (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group block"
                >
                  {row}
                </a>
              ) : (
                row
              )}
            </li>
          );
        })}
      </ul>
      <div style={{ borderTop: "1px solid var(--color-hairline)" }} />
    </section>
  );
}

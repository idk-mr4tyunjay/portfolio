import { PROJECTS } from "@/data/projects";

export function WorkList() {
  return (
    <section id="work" aria-label="Work" className="pb-20">
      <p
        className="fade-up mb-3 text-xs"
        style={{
          fontFamily: "var(--font-mono)",
          color: "var(--color-fg-muted)",
          animationDelay: "0.25s",
        }}
      >
        work ({PROJECTS.length})
      </p>
      <ul style={{ borderTop: "1px solid var(--color-hairline)" }}>
        {PROJECTS.map((project, index) => {
          const row = (
            <span className="work-row block">
              <span className="flex items-baseline gap-4">
                <span
                  aria-hidden
                  className="text-xs"
                  style={{
                    fontFamily: "var(--font-mono)",
                    color: "var(--color-fg-muted)",
                  }}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="work-name flex-1 text-[17px] font-medium">
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
                    className="work-arrow text-[13px]"
                    style={{ color: "var(--color-accent)" }}
                  >
                    ↗
                  </span>
                )}
              </span>
              <span
                className="mt-1 block pl-9 text-[13.5px] leading-relaxed"
                style={{ color: "var(--color-fg-secondary)" }}
              >
                {project.description}
              </span>
              {project.tech && project.tech.length > 0 && (
                <span className="mt-3 flex flex-wrap gap-1.5 pl-9">
                  {project.tech.map((tech) => (
                    <span key={tech} className="chip">
                      {tech}
                    </span>
                  ))}
                </span>
              )}
            </span>
          );

          return (
            <li
              key={project.name}
              className="fade-up"
              style={{
                borderBottom: "1px solid var(--color-hairline)",
                animationDelay: `${0.3 + index * 0.06}s`,
              }}
            >
              {project.url ? (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block py-1"
                >
                  {row}
                </a>
              ) : (
                <span className="block py-1">{row}</span>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

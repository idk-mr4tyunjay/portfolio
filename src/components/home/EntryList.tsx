/*
  Reusable list section — SPEC.md §5. Shared by Work Experience and Side
  Projects; keeps the numbered-row layout in one place. Content-free: callers
  map their data (projects, experience) into ListEntry and pass it in.
*/

export interface ListEntry {
  title: string;
  /** Right-aligned mono meta: a year or a period. */
  meta: string;
  description: string;
  /** External URL — row renders ↗ and links when present. */
  url?: string;
  tags?: string[];
}

export function EntryList({
  id,
  label,
  entries,
}: {
  id: string;
  label: string;
  entries: ListEntry[];
}) {
  return (
    <section id={id} aria-label={label} className="pb-20">
      <p
        className="fade-up mb-3 text-xs"
        style={{
          fontFamily: "var(--font-mono)",
          color: "var(--color-fg-muted)",
          animationDelay: "0.25s",
        }}
      >
        {label}
      </p>
      <ul style={{ borderTop: "1px solid var(--color-hairline)" }}>
        {entries.map((entry, index) => {
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
                  {entry.title}
                </span>
                <span
                  className="text-xs"
                  style={{
                    fontFamily: "var(--font-mono)",
                    color: "var(--color-fg-muted)",
                  }}
                >
                  {entry.meta}
                </span>
                {entry.url && (
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
                {entry.description}
              </span>
              {entry.tags && entry.tags.length > 0 && (
                <span className="mt-3 flex flex-wrap gap-1.5 pl-9">
                  {entry.tags.map((tag) => (
                    <span key={tag} className="chip">
                      {tag}
                    </span>
                  ))}
                </span>
              )}
            </span>
          );

          return (
            <li
              key={entry.title}
              className="fade-up"
              style={{
                borderBottom: "1px solid var(--color-hairline)",
                animationDelay: `${0.3 + index * 0.06}s`,
              }}
            >
              {entry.url ? (
                <a
                  href={entry.url}
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

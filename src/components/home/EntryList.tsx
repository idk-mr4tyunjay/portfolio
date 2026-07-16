import type { EntryLink } from "@/types";
import { Icon } from "@/components/icons";
import { SectionLabel } from "./SectionLabel";

/*
  Reusable list section. Shared by Work Experience and Side
  Projects; keeps the numbered-row layout in one place. Content-free: callers
  map their data (projects, experience) into ListEntry and pass it in.
*/

export interface ListEntry {
  title: string;
  /** Right-aligned mono meta: a year or a period. */
  meta: string;
  description: string;
  /** Primary site — rendered as a globe icon link when present. */
  url?: string;
  tags?: string[];
  /** Extra platform links (X, Product Hunt) rendered as icons. */
  links?: EntryLink[];
}

const LINK_LABEL: Record<EntryLink["type"], string> = {
  github: "GitHub",
  x: "X",
  producthunt: "Product Hunt",
};

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
      <SectionLabel delay="0.25s">{label}</SectionLabel>
      <ul style={{ borderTop: "1px solid var(--color-hairline)" }}>
        {entries.map((entry, index) => {
          // Whole row links to the live site, or GitHub when nothing is live
          const primary =
            entry.url ??
            entry.links?.find((link) => link.type === "github")?.url;
          return (
          <li
            key={entry.title}
            className="fade-up"
            style={{
              borderBottom: "1px solid var(--color-hairline)",
              animationDelay: `${0.3 + index * 0.06}s`,
            }}
          >
            <div className="work-row relative block py-1">
              <div className="flex items-baseline gap-4">
                <span
                  aria-hidden
                  className="work-num text-xs"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 text-[17px] font-medium">
                  {primary ? (
                    <a
                      href={primary}
                      target="_blank"
                      rel="noreferrer"
                      className="work-name after:absolute after:inset-0"
                    >
                      {entry.title}
                    </a>
                  ) : (
                    <span className="work-name">{entry.title}</span>
                  )}
                </span>
                <span
                  className="text-xs whitespace-nowrap"
                  style={{
                    fontFamily: "var(--font-mono)",
                    color: "var(--color-fg-muted)",
                  }}
                >
                  {entry.meta}
                </span>
                {(entry.url || entry.links?.length) && (
                  <span className="relative flex items-center gap-2.5 self-center">
                    {entry.url && (
                      <a
                        href={entry.url}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${entry.title} website`}
                        className="entry-icon"
                        style={{ color: "var(--color-accent)" }}
                      >
                        <Icon type="web" />
                      </a>
                    )}
                    {entry.links?.map((link) => (
                      <a
                        key={link.url}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${entry.title} on ${LINK_LABEL[link.type]}`}
                        className="entry-icon"
                        style={{ color: "var(--color-accent)" }}
                      >
                        <Icon type={link.type} />
                      </a>
                    ))}
                  </span>
                )}
              </div>
              <p
                className="mt-1 text-[13.5px] leading-relaxed sm:pl-9"
                style={{ color: "var(--color-fg-body)" }}
              >
                {entry.description}
              </p>
              {entry.tags && entry.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5 sm:pl-9">
                  {entry.tags.map((tag) => (
                    <span key={tag} className="chip">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </li>
          );
        })}
      </ul>
    </section>
  );
}

import { SITE } from "@/data/site";

export function Footer() {
  return (
    <footer className="gutter t-meta flex flex-wrap justify-between gap-3 border-t border-[var(--color-hairline)] py-4">
      <span>© 2026 {SITE.name}</span>
      <a href={`${SITE.github}/portfolio`} target="_blank" rel="noreferrer" className="link" data-cursor="open">
        source
      </a>
    </footer>
  );
}

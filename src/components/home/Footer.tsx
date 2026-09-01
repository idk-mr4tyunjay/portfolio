import { SITE } from "@/data/site";

export function Footer() {
  return (
    <footer
      className="flex flex-wrap justify-between gap-3.5 px-5 py-4 text-[10px] tracking-[0.16em] uppercase sm:px-[30px]"
      style={{ borderTop: "1px solid var(--color-hairline)", fontFamily: "var(--font-mono)", color: "var(--color-fg-muted)" }}
    >
      <span>© 2026 {SITE.name.toLowerCase()}</span>
      <span>built, broken and rebuilt in public</span>
    </footer>
  );
}

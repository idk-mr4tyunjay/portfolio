import { SITE } from "@/data/site";

export function Footer() {
  return (
    <footer
      id="contact"
      className="pb-12 text-[12.5px]"
      style={{ fontFamily: "var(--font-mono)", color: "var(--color-fg-muted)" }}
    >
      say hi →{" "}
      <a href={`mailto:${SITE.email}`} style={{ color: "var(--color-accent)" }}>
        {SITE.email}
      </a>{" "}
      ·{" "}
      <a
        href={SITE.github}
        target="_blank"
        rel="noreferrer"
        style={{ color: "var(--color-accent)" }}
      >
        github
      </a>
    </footer>
  );
}

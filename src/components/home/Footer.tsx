import { SITE } from "@/data/site";

export function Footer() {
  return (
    <footer
      id="contact"
      className="fade-up pb-12 text-[12.5px]"
      style={{
        fontFamily: "var(--font-mono)",
        color: "var(--color-fg-muted)",
        animationDelay: "0.5s",
      }}
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
      </a>{" "}
      · <kbd style={{ color: "var(--color-fg-secondary)" }}>⌘K</kbd>
    </footer>
  );
}

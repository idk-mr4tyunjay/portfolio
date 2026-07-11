import { SITE } from "@/data/site";

export function Footer() {
  return (
    <footer id="contact" className="pb-14">
      <p
        className="fade-up mb-3 text-xs"
        style={{
          fontFamily: "var(--font-mono)",
          color: "var(--color-fg-muted)",
          animationDelay: "0.3s",
        }}
      >
        contact
      </p>
      <p
        className="fade-up mb-4 text-[22px] font-medium"
        style={{ letterSpacing: "-0.01em", animationDelay: "0.35s" }}
      >
        have something to build?
      </p>
      <p className="fade-up mb-8" style={{ animationDelay: "0.4s" }}>
        <a
          href={`mailto:${SITE.email}`}
          className="text-[15px]"
          style={{ fontFamily: "var(--font-mono)", color: "var(--color-accent)" }}
        >
          {SITE.email}
        </a>
      </p>
      <p
        className="fade-up flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px]"
        style={{ animationDelay: "0.45s" }}
      >
        <a
          href={SITE.github}
          target="_blank"
          rel="noreferrer"
          className="quiet-link"
        >
          github ↗
        </a>
        <a
          href={SITE.repo}
          target="_blank"
          rel="noreferrer"
          className="quiet-link"
        >
          source ↗
        </a>
      </p>
      <p
        className="fade-up mt-12 text-[11px]"
        style={{
          fontFamily: "var(--font-mono)",
          color: "var(--color-fg-muted)",
          animationDelay: "0.5s",
        }}
      >
        © 2026 {SITE.name.toLowerCase()} · next.js + pretext ·{" "}
        <kbd>⌘K</kbd> anywhere
      </p>
    </footer>
  );
}

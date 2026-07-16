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
        className="fade-up mb-2 text-[22px] font-medium"
        style={{ letterSpacing: "-0.01em", animationDelay: "0.35s" }}
      >
        have something to build?
      </p>
      <p
        className="fade-up mb-8 text-[14px]"
        style={{ color: "var(--color-fg-secondary)", animationDelay: "0.38s" }}
      >
        or just here to inspect-element the CSS? either way, hi.
      </p>
      <p
        className="fade-up mb-10 flex flex-wrap items-center gap-x-4 gap-y-2 text-[15px]"
        style={{ animationDelay: "0.4s" }}
      >
        <a
          href={SITE.linkedin}
          target="_blank"
          rel="noreferrer"
          className="quiet-link"
          style={{ color: "var(--color-accent)" }}
        >
          linkedin ↗
        </a>
        <a
          href={SITE.github}
          target="_blank"
          rel="noreferrer"
          className="quiet-link"
          style={{ color: "var(--color-accent)" }}
        >
          github ↗
        </a>
      </p>

      {/* The newsletter that does not exist — a very committed bit. */}
      <details className="fade-up mb-10" style={{ animationDelay: "0.45s" }}>
        <summary
          className="cursor-pointer text-[13px] select-none [&::-webkit-details-marker]:hidden"
          style={{
            fontFamily: "var(--font-mono)",
            color: "var(--color-accent)",
            listStyle: "none",
          }}
        >
          subscribe to the newsletter
        </summary>
        <p
          className="mt-2 max-w-[48ch] text-[13px] leading-relaxed"
          style={{ color: "var(--color-fg-secondary)" }}
        >
          there is no newsletter. I just wanted a button here. consider yourself
          subscribed. you&apos;ll hear from me exactly never.
        </p>
      </details>

      <p
        className="fade-up mt-8 text-[11px]"
        style={{
          fontFamily: "var(--font-mono)",
          color: "var(--color-fg-muted)",
          animationDelay: "0.55s",
        }}
      >
        © 2026 {SITE.name.toLowerCase()} ·
        <kbd>⌘K</kbd> anywhere · this line was legally required by me
      </p>
    </footer>
  );
}

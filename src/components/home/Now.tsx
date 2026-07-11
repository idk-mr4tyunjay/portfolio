import { SITE } from "@/data/site";

export function Now() {
  return (
    <section aria-label="Now" className="pb-20">
      <p
        className="fade-up mb-2 text-xs"
        style={{
          fontFamily: "var(--font-mono)",
          color: "var(--color-fg-muted)",
          animationDelay: "0.2s",
        }}
      >
        now
      </p>
      <p
        className="fade-up max-w-[52ch] text-[15px] leading-relaxed"
        style={{ color: "var(--color-fg-secondary)", animationDelay: "0.25s" }}
      >
        {SITE.now}
      </p>
    </section>
  );
}

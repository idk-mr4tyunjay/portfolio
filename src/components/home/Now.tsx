import { SITE } from "@/data/site";
import { SectionLabel } from "./SectionLabel";

export function Now() {
  return (
    <section aria-label="Now" className="pb-20">
      <SectionLabel delay="0.2s" className="mb-2">
        now
      </SectionLabel>
      <p
        className="fade-up max-w-[52ch] text-[15px] leading-relaxed"
        style={{ color: "var(--color-fg-body)", animationDelay: "0.25s" }}
      >
        {SITE.now}
      </p>
    </section>
  );
}

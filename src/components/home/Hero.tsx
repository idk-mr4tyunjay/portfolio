import { SITE } from "@/data/site";

const INTRO =
  "I build fast, honest things for the web, and write down what I find interesting and what breaks along the way.";

/*
  Hero.
  Name, role line, and a one-paragraph summary. The summary <p> stays in the
  DOM as the source of truth for the intro copy (screen readers / Ctrl-F / SEO).
*/

export function Hero() {
  return (
    <section
      aria-label="Intro"
      className="flex min-h-[72vh] flex-col justify-center pt-16 pb-14"
    >
      <h1
        className="fade-up m-0"
        style={{
          fontSize: "clamp(44px, 8vw, 76px)",
          fontWeight: 500,
          letterSpacing: "-0.03em",
          lineHeight: 1.05,
          animationDelay: "0.05s",
        }}
      >
        {SITE.name}
      </h1>
      <p
        className="fade-up mt-3 mb-10 text-[14px]"
        style={{
          fontFamily: "var(--font-mono)",
          color: "var(--color-fg-secondary)",
          animationDelay: "0.1s",
        }}
      >
        {SITE.role} · the “full” is doing a lot of work
      </p>

      <p
        className="fade-up"
        style={{
          fontWeight: 500,
          fontSize: "clamp(22px, 3.4vw, 32px)",
          lineHeight: 1.45,
          letterSpacing: "-0.3px",
          color: "var(--color-fg)",
          margin: 0,
          animationDelay: "0.15s",
        }}
      >
        {INTRO}
      </p>

      <p
        aria-hidden
        className="fade-up mt-16 text-[11px]"
        style={{
          fontFamily: "var(--font-mono)",
          color: "var(--color-fg-muted)",
          animationDelay: "0.6s",
        }}
      >
        <span className="scroll-cue">scroll ↓</span>
      </p>
    </section>
  );
}

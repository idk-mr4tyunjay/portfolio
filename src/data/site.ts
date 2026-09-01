/*
  Contact + identity.
*/

export const SITE = {
  name: "Mruthunjay",
  role: "full-stack developer",
  /** Canonical origin — no trailing slash. Drives metadata, sitemap, robots. */
  url: "https://mruthunjay.xyz",
  /** One-line tagline reused across metadata (title/description/OG). */
  tagline: "Full-stack developer building fast, honest things for the web.",
  github: "https://github.com/idk-mr4tyunjay",
  linkedin: "https://www.linkedin.com/in/mruthunj4y/",
  producthunt: "https://www.producthunt.com/@idk_mr4tyunjay",
  email: "hi@mruthunjay.xyz",
  /** Hero intro line, next to the wordmark. */
  intro: "I build fast, honest things for the web, and write down what I learn and what breaks along the way.",
  /** Hero stat lines (mono, right-aligned), one entry per line. */
  heroStats: ["est. 2023", "03 companies · 07 products", "open to work"],
  /** Hero role tagline, under the wordmark. `italic` renders in italic serif. */
  heroTagline: { lead: "Design, build, ship,", italic: "and the 2am debugging that follows." },
  /** One-liner for the "right now" callout — keep it current. */
  now: "Building Payflip, a React Native app for moving stablecoins. Open-source PRs in between.",
  /** About-section prose, one entry per paragraph. */
  about: [
    "I started building because I wanted things that didn't exist yet, and I stayed because the interesting part is never the part you planned for. Three years in, that hasn't changed.",
    "React and Node up front, Docker and cloud plumbing underneath, and the tangled problems that live in between. I'd rather understand the whole stack badly than one layer perfectly, since it means I can follow a bug wherever it actually lives instead of handing it off. Some of what I learn spills into open source; the rest ends up in my notes.",
  ],
} as const;

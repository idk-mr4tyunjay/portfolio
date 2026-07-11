/*
  Contact + identity — SPEC.md §5.
  TODO: set the real public email before deploying.
*/

export const SITE = {
  name: "Mruthunjay",
  role: "full-stack developer",
  email: "hello@example.com",
  github: "https://github.com/idk-mr4tyunjay",
  repo: "https://github.com/idk-mr4tyunjay/portfolio",
  /** One-liner for the "now" strip — keep it current. */
  now: "building this site in public — currently deep in text layout engines and Next.js internals.",
  /** Short prose for the about section. TODO: make this actually you. */
  about:
    "I like owning things end to end — design, build, ship, and the 2am debugging that follows. Most of my time goes into the web: making interfaces feel fast and honest, and understanding the machinery underneath them. The rest goes into notes, because the second time something breaks it should only cost me a search.",
} as const;

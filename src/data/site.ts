/*
  Identity, copy, contact. Copy follows SPEC.md §1: nouns, verbs, numbers,
  dates. First person. No adjectives.
*/

export const SITE = {
  name: "Mruthunjay",
  role: "full-stack developer",
  /** Canonical origin, no trailing slash. Drives metadata, sitemap, robots. */
  url: "https://mruthunjay.xyz",
  /** One line for metadata (title / description / OG). */
  tagline: "Full-stack developer. Payment apps and the servers under them.",
  github: "https://github.com/idk-mr4tyunjay",
  githubUser: "idk-mr4tyunjay",
  linkedin: "https://www.linkedin.com/in/mruthunj4y/",
  producthunt: "https://www.producthunt.com/@idk_mr4tyunjay",
  email: "mruthunjayparmar0@gmail.com",
  /** The one sentence under the name. */
  intro: "I build payment apps and the servers under them. Everything below is live.",
  /** Marquee items, joined with dots at render. Time and dates are added by the component. */
  status: ["open to work", "India · remote · IST"],
  /** Current work, one line. */
  now: "Payflip. React Native app for moving stablecoins across borders.",
  /** About, one entry per paragraph. */
  about: [
    "Three years, three companies, seven products. React Native and Next.js in front, Node and Postgres behind, Docker and a VPS underneath. Solidity when the product runs on a chain.",
    "I follow a bug to wherever it lives instead of handing it off. What I learn goes into the notes, dated, so I can find it again the next time it breaks.",
  ],
} as const;

import type { CaseStudy } from "@/types";

/*
  Work index. Newest first. Each entry is an expandable case study
  (WorkIndex.tsx) — brief, what I did (or, for a multi-product team, the
  product list), tags, and links.
*/

export const CASE_STUDIES: CaseStudy[] = [
  {
    num: "01",
    name: "Payflip",
    tagsLine: "engineer · react native · stablecoins",
    summary:
      "Real-time cross-border payments on stablecoin rails. Send to a name or an email; it settles instantly.",
    period: "2026 – now",
    brief:
      "Moving money across borders still takes days and a form full of account numbers. Payflip settles it in seconds, to a name or an email.",
    whatIDid: [
      { text: "Built the React Native app end to end: onboarding, wallet, send and receive." },
      {
        text: "Wired the stablecoin rails underneath so a transfer settles instantly instead of clearing overnight.",
      },
      { text: "Own the release pipeline: builds, crash reporting, and the 2am fixes." },
    ],
    chips: ["settles · instant", "rails · stablecoin"],
    links: [
      { label: "payflip.xyz ↗", url: "https://payflip.xyz" },
      { label: "github ↗", url: "https://github.com/payflip-labs" },
      { label: "x ↗", url: "https://x.com/payflipxyz" },
    ],
    images: [{ id: "case-payflip", placeholder: "payflip.xyz · app screenshot" }],
  },
  {
    num: "02",
    name: "Surge",
    tagsLine: "engineer · solidity · mcp · next.js",
    summary:
      "One team, three products: DeFi infrastructure for emerging chains, plus two developer tools that came out of our own pain.",
    period: "2025 – 2026",
    brief:
      "Ship DeFi infrastructure where the chains are new and the tooling isn't there yet, then fix the tools we wished existed while doing it.",
    products: [
      {
        name: "SurgeDeFi",
        description: "DeFi infra for emerging EVM chains, live on XRPL-EVM mainnet.",
        year: "2025",
      },
      {
        name: "ContextPool",
        description: "Persistent memory for AI coding agents over MCP. #3 on Product Hunt.",
        year: "apr 2026",
      },
      {
        name: "FixMyAI",
        description: "Your AI wrote the code. We make it work.",
        year: "may 2026",
      },
    ],
    chips: ["#3 product hunt", "xrpl-evm mainnet"],
    links: [
      { label: "contextpool ↗", url: "https://www.contextpool.io/" },
      { label: "surgedefi ↗", url: "https://app.surgedefi.com" },
      { label: "github ↗", url: "https://github.com/syv-labs" },
      { label: "product hunt ↗", url: "https://www.producthunt.com/@idk_mr4tyunjay" },
    ],
    images: [
      { id: "case-contextpool", placeholder: "contextpool.io · screenshot" },
      { id: "case-surge", placeholder: "surgedefi · screenshot (later)" },
    ],
  },
  {
    num: "03",
    name: "BharatBZ",
    tagsLine: "engineer · tokenisation · evm",
    summary:
      "Blockchain product work, including BREX, which turned illiquid real-world assets into fractional, tradable units.",
    period: "dates tbc",
    brief:
      "Real estate, gold and private equity are assets most people can't touch. BREX tokenised them, splitting one high-value asset into units small enough to actually buy.",
    whatIDid: [
      { text: "your scope here: contracts, frontend, integrations, whichever it was.", placeholder: true },
      { text: "the hardest problem you solved there, in one line.", placeholder: true },
    ],
    chips: ["brex · no longer live"],
    links: [
      { label: "github ↗", url: "https://github.com/bharatbz" },
      { label: "brex ↗", url: "https://www.linkedin.com/company/brexvc/" },
    ],
    images: [{ id: "case-brex", placeholder: "brex · screenshot or archive shot" }],
  },
];

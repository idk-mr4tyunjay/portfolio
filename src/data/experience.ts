import type { Experience } from "@/types";

/*
  Work experience. Newest first.
*/

export const EXPERIENCE: Experience[] = [
  {
    role: "Engineer",
    company: "Payflip",
    period: "2026 – present",
    description:
      "Building real-time cross-border payments on stablecoin rails, where sending money is as simple as a name or an email and it settles instantly.",
    url: "https://payflip.xyz",
    tech: ["stablecoins"],
    links: [
      { type: "github", url: "https://github.com/payflip-labs" },
      { type: "x", url: "https://x.com/payflipxyz" },
    ],
  },
  {
    role: "Engineer",
    company: "ContextPool",
    period: "2026",
    description:
      "Built persistent memory for AI coding agents over MCP, so tools like Cursor keep what they learned last session instead of relearning the codebase every time.",
    url: "https://www.contextpool.io/",
    tech: ["mcp", "cli"],
    links: [
      { type: "github", url: "https://github.com/syv-labs/contextpool" },
      { type: "producthunt", url: "https://www.producthunt.com/products/contextpool" },
    ],
  },
  {
    role: "Engineer",
    company: "SurgeDeFi",
    period: "2025",
    description:
      "Built DeFi infrastructure for emerging EVM chains, live on XRPL-EVM mainnet.",
    url: "https://app.surgedefi.com",
    tech: ["solidity", "evm"],
    links: [
      // Repo is private — org page is the closest public thing
      { type: "github", url: "https://github.com/syv-labs" },
      { type: "x", url: "https://x.com/Surgedefi_hq" },
    ],
  },
];

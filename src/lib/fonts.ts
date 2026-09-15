import { Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";

/*
  Typography — SPEC.md §3.
  - Bricolage Grotesque: the one face, from the 20vw name down to 13px meta.
  - JetBrains Mono: code blocks inside notes only. Never UI.
*/

export const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: "variable",
  axes: ["opsz"],
  variable: "--font-sans",
  display: "swap",
});

export const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-mono",
  display: "swap",
});

export const fontVariables = [bricolage.variable, mono.variable].join(" ");

import { Orbitron, Inter, Caveat, JetBrains_Mono } from "next/font/google";

/*
  Typography stack defined by 02-VISUAL-DESIGN-SYSTEM.md §02.
  - Orbitron: hero titles, section headers
  - Inter:    body, dialogue, form
  - Caveat:   handwritten — Scene 07 form + name reveal
  - JetBrains Mono: terminal/ASCII text (Scenes 04 & 05)
*/

export const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["700", "900"],
  variable: "--font-orbitron",
  display: "swap",
});

export const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter",
  display: "swap",
});

export const caveat = Caveat({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-caveat",
  display: "swap",
});

export const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const fontVariables = [
  orbitron.variable,
  inter.variable,
  caveat.variable,
  mono.variable,
].join(" ");

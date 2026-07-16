import { Inter, JetBrains_Mono } from "next/font/google";

/*
  Typography.
  - Inter: everything
  - JetBrains Mono: logo, labels, meta, status line
*/

export const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const fontVariables = [inter.variable, mono.variable].join(" ");

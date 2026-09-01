import { Archivo, Instrument_Serif, JetBrains_Mono } from "next/font/google";

/*
  Typography.
  - Archivo: everything (body, headings)
  - Instrument Serif: pull-quotes, italic accents
  - JetBrains Mono: logo, labels, meta, status line
*/

export const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-archivo",
  display: "swap",
});

export const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

export const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const fontVariables = [archivo.variable, instrumentSerif.variable, mono.variable].join(" ");

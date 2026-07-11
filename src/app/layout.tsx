import type { Metadata, Viewport } from "next";
import { fontVariables } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mruthunjay — full-stack developer",
  description:
    "Full-stack developer building fast, honest things for the web.",
  openGraph: {
    title: "Mruthunjay — full-stack developer",
    description:
      "Full-stack developer building fast, honest things for the web.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={fontVariables}>
      <body
        className="antialiased"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        {/* Above the body::before/::after atmosphere layers */}
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}

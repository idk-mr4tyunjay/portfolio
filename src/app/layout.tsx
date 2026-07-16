import type { Metadata, Viewport } from "next";
import { fontVariables } from "@/lib/fonts";
import { CommandPalette } from "@/components/home/CommandPalette";
import { DotField } from "@/components/home/DotField";
import { SITE } from "@/data/site";
import "./globals.css";

const TITLE = `${SITE.name} — ${SITE.role}`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: TITLE,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.tagline,
  applicationName: SITE.name,
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  publisher: SITE.name,
  keywords: [
    SITE.name,
    "full-stack developer",
    "web developer",
    "software engineer",
    "Next.js",
    "React",
    "TypeScript",
    "portfolio",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE.url,
    siteName: SITE.name,
    title: {
      default: TITLE,
      template: `%s — ${SITE.name}`,
    },
    description: SITE.tagline,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: {
      default: TITLE,
      template: `%s — ${SITE.name}`,
    },
    description: SITE.tagline,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
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
        {/* Behind content (z-10), above the ::before glow */}
        <DotField />
        {/* Above the body::before/::after atmosphere layers */}
        <div className="relative z-10">{children}</div>
        <CommandPalette />
      </body>
    </html>
  );
}

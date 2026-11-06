import type { Metadata, Viewport } from "next";
import { fontVariables } from "@/lib/fonts";
import { Analytics } from "@/components/Analytics";
import { CommandPalette } from "@/components/home/CommandPalette";
import { SmoothScroll } from "@/components/home/SmoothScroll";
import { SITE } from "@/data/site";
import "./globals.css";

const TITLE = `${SITE.name} · ${SITE.role}`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: TITLE,
    template: `%s · ${SITE.name}`,
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
      template: `%s · ${SITE.name}`,
    },
    description: SITE.tagline,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: {
      default: TITLE,
      template: `%s · ${SITE.name}`,
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
  themeColor: "#f1f0ea",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <body
        className="antialiased"
        style={{ fontFamily: "var(--font-archivo)" }}
      >
        <a href="#main-content" className="skip-link">Skip to content</a>
        <SmoothScroll />
        <div className="relative z-10">{children}</div>
        <CommandPalette />
        <Analytics />
      </body>
    </html>
  );
}

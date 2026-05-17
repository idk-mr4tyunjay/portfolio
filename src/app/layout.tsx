import type { Metadata, Viewport } from "next";
import { fontVariables } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "One Small Step",
  description:
    "A cinematic scroll-driven portfolio. From the vastness of space, through pixel memories and the digital realm, back to earth.",
  openGraph: {
    title: "One Small Step",
    description:
      "A cinematic scroll-driven portfolio. From the vastness of space, through pixel memories and the digital realm, back to earth.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "One Small Step",
  },
};

export const viewport: Viewport = {
  themeColor: "#000308",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={fontVariables}>
      <body className="bg-[var(--color-void)] text-[var(--color-star-white)] font-[var(--font-inter)] antialiased">
        {children}
      </body>
    </html>
  );
}

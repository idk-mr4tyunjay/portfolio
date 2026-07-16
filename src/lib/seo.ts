import { SITE } from "@/data/site";

/*
  Shared social-card descriptor. Next replaces (not deep-merges) openGraph/
  twitter when a page declares its own, so any page that sets them must
  re-attach the image — this is the single source for it. Resolves against
  metadataBase (layout.tsx) → https://mruthunjay.xyz/opengraph-image.
*/

export const OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: `${SITE.name} — ${SITE.role}`,
};

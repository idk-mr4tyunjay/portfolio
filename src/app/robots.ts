import type { MetadataRoute } from "next";
import { SITE } from "@/data/site";

/*
  robots.txt — generated at build. Allow everything, point crawlers
  at the sitemap, declare the canonical host.
*/

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}

import { CASE_STUDIES } from "@/data/experience";
import { PROJECTS } from "@/data/projects";
import { SITE } from "@/data/site";
import type { CaseStudyImage, CaseStudyLink, CaseStudyProduct } from "@/types";

export interface WorkEntry {
  slug: string;
  name: string;
  kind: "work" | "project";
  summary: string;
  period: string;
  discipline: string;
  brief?: string;
  contributions?: string[];
  products?: CaseStudyProduct[];
  image?: CaseStudyImage;
  images: CaseStudyImage[];
  tags: string[];
  links: CaseStudyLink[];
  archived?: boolean;
}

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/** Route content is derived from the same facts used on the home page. */
export const WORK_ENTRIES: WorkEntry[] = [
  ...CASE_STUDIES.map((entry): WorkEntry => ({
    slug: slugify(entry.name),
    name: entry.name,
    kind: "work",
    summary: entry.summary,
    period: entry.period,
    discipline: entry.tagsLine.split(" · ").slice(1).join(" / "),
    brief: entry.brief,
    contributions: entry.whatIDid?.filter((item) => !item.placeholder).map((item) => item.text),
    products: entry.products,
    image: entry.products?.find((product) => product.name === "ContextPool")?.image ?? entry.images?.[0] ?? entry.products?.[0]?.image,
    images: entry.images ?? [],
    tags: entry.chips,
    links: entry.links.map((link) => ({ ...link, label: link.label.replace(/\s*↗$/, "") })),
    archived: entry.name === "BharatBZ",
  })),
  ...PROJECTS.map((entry): WorkEntry => ({
    slug: slugify(entry.name),
    name: entry.name,
    kind: "project",
    summary: entry.description,
    period: entry.year,
    discipline: entry.tech?.join(" / ") ?? "Personal project",
    image: entry.image,
    images: entry.image ? [entry.image] : [],
    tags: entry.tech ?? [],
    links: [
      ...(entry.url ? [{ label: "Open project", url: entry.url }] : []),
      ...(entry.links?.map((link) => ({
        label: link.type === "github" ? (link.url === SITE.github ? "GitHub profile" : "Source on GitHub") : link.type,
        url: link.url,
      })) ?? []),
    ],
  })),
];

export function getWorkEntry(slug: string) {
  return WORK_ENTRIES.find((entry) => entry.slug === slug);
}

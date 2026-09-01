/*
  Canonical types.
*/

export interface NoteMeta {
  slug: string;
  title: string;
  /** ISO date string, e.g. "2026-07-11" */
  date: string;
  tags: string[];
  /** One line, shown in lists and search */
  summary: string;
}

/** Extra platform link shown as a small icon (the `type` picks the icon). */
export interface EntryLink {
  type: "github" | "x" | "producthunt";
  url: string;
}

export interface Project {
  name: string;
  /** One honest sentence. */
  description: string;
  year: string;
  /** Primary site — row renders a globe icon when present */
  url?: string;
  tech?: string[];
  links?: EntryLink[];
}

/** One line of the "what I did" list in a case study. */
export interface CaseStudyBullet {
  text: string;
  /** Unfilled TODO copy — rendered with a dashed underline as an editing cue */
  placeholder?: boolean;
}

/** A case-study screenshot slot — real image once `src` is set, placeholder until then. */
export interface CaseStudyImage {
  placeholder: string;
  src?: string;
}

/** One row of a multi-product case study (see CaseStudy.products). */
export interface CaseStudyProduct {
  name: string;
  description: string;
  year: string;
  /** Its own screenshot, shown alongside this product in the expanded panel */
  image?: CaseStudyImage;
}

/** Plain text link, e.g. "payflip.xyz ↗" — case studies list these inline, not as icons. */
export interface CaseStudyLink {
  label: string;
  url: string;
}

/** Work-index entry: an expandable case study (WorkIndex.tsx). */
export interface CaseStudy {
  num: string;
  name: string;
  /** Mono meta line, e.g. "engineer · react native · stablecoins" */
  tagsLine: string;
  summary: string;
  /** Free-form range shown in the collapsed row, e.g. "2026 — now" */
  period: string;
  /** Serif pull-quote under "the brief" */
  brief: string;
  whatIDid?: CaseStudyBullet[];
  /** Present instead of whatIDid for a multi-product case study */
  products?: CaseStudyProduct[];
  chips: string[];
  links: CaseStudyLink[];
  /**
   * Screenshot(s) for a single-product case study. A multi-product case
   * study (has `products`) carries its screenshots on each product instead.
   */
  images?: (CaseStudyImage & { id: string })[];
}

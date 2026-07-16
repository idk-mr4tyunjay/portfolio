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
  type: "x" | "producthunt";
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

export interface Experience {
  role: string;
  company: string;
  /** Free-form range, e.g. "2025 – present" */
  period: string;
  /** One honest sentence. */
  description: string;
  /** Primary site — row renders a globe icon when present */
  url?: string;
  tech?: string[];
  links?: EntryLink[];
}

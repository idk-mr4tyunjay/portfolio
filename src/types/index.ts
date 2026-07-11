/*
  Canonical types — SPEC.md §5.
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

export interface Project {
  name: string;
  /** One honest sentence. */
  description: string;
  year: string;
  /** External URL — row renders ↗ when present */
  url?: string;
  tech?: string[];
}

/*
  Canonical types — SPEC.md §5.
*/

export interface Project {
  name: string;
  /** One honest sentence. */
  description: string;
  year: string;
  /** External URL — row renders ↗ when present */
  url?: string;
  tech?: string[];
}

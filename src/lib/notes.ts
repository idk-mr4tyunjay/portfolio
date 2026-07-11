import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import type { NoteMeta } from "@/types";

/*
  Notes pipeline — SPEC.md §9. The repo is the CMS:
  drop a markdown file with frontmatter into content/notes/ and it ships.
  Server-only (fs) — everything renders at build time, zero client cost.
*/

const NOTES_DIR = path.join(process.cwd(), "content", "notes");

function toMeta(slug: string, data: Record<string, unknown>): NoteMeta {
  return {
    slug,
    title: typeof data.title === "string" ? data.title : slug,
    // YAML parses unquoted dates as Date objects — normalize either way
    date:
      data.date instanceof Date
        ? data.date.toISOString().slice(0, 10)
        : String(data.date ?? ""),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    summary: typeof data.summary === "string" ? data.summary : "",
  };
}

export function getAllNotes(): NoteMeta[] {
  if (!fs.existsSync(NOTES_DIR)) return [];
  return fs
    .readdirSync(NOTES_DIR)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(NOTES_DIR, file), "utf8");
      return toMeta(slug, matter(raw).data);
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getNote(
  slug: string,
): { meta: NoteMeta; html: string } | null {
  const file = path.join(NOTES_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  const html = marked.parse(content, { async: false }) as string;
  return { meta: toMeta(slug, data), html };
}

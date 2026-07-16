/*
  Renders a JSON-LD structured-data block. Server component — the object
  is serialized at render time. Content lives in the callers (data-driven).
*/

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe; no user input flows into schema.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

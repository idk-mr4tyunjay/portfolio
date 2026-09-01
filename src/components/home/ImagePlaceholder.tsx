/*
  Stand-in for a real screenshot. Same visual language as the design
  (swatch fill, hatched rail pattern, mono caption) so screenshots can be
  dropped in later by swapping this for a next/image without touching layout.
*/
export function ImagePlaceholder({
  caption,
  className = "",
}: {
  caption: string;
  className?: string;
}) {
  return (
    <div
      className={`relative flex aspect-video items-end border p-3 [border-color:var(--color-hairline)] ${className}`}
      style={{
        backgroundColor: "var(--color-swatch)",
        backgroundImage:
          "repeating-linear-gradient(135deg, var(--color-rail) 0 1px, transparent 1px 7px)",
      }}
    >
      <span
        className="text-[9.5px] tracking-[0.16em] uppercase"
        style={{ fontFamily: "var(--font-mono)", color: "var(--color-fg-secondary)" }}
      >
        {caption}
      </span>
    </div>
  );
}

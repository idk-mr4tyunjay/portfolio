import Image from "next/image";

/*
  Case-study screenshot slot. Renders the real screenshot via next/image when
  `src` is set; otherwise falls back to a swatch + hatched rail pattern with a
  mono caption as a stand-in until one is added.
*/
export function ImagePlaceholder({
  caption,
  src,
  className = "",
}: {
  caption: string;
  src?: string;
  className?: string;
}) {
  if (src) {
    return (
      <div
        className={`relative aspect-video overflow-hidden border [border-color:var(--color-hairline)] ${className}`}
      >
        <Image src={src} alt={caption} fill sizes="(min-width: 640px) 50vw, 100vw" className="object-cover object-top" />
      </div>
    );
  }

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

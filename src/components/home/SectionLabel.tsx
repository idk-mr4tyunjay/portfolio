/*
  Mono section label ("now", "about", "work experience") with the accent
  dot from the nav mark, so the brand thread runs through every section.
*/

export function SectionLabel({
  children,
  delay,
  className = "mb-3",
}: {
  children: React.ReactNode;
  delay?: string;
  className?: string;
}) {
  return (
    <p
      className={`fade-up flex items-center gap-2 text-xs ${className}`}
      style={{
        fontFamily: "var(--font-mono)",
        color: "var(--color-fg-muted)",
        animationDelay: delay,
      }}
    >
      <span
        aria-hidden
        className="inline-block size-1.5 rounded-full"
        style={{ background: "var(--color-accent)" }}
      />
      {children}
    </p>
  );
}

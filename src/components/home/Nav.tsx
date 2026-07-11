export function Nav() {
  return (
    <nav
      aria-label="Main"
      className="flex items-center justify-between pt-8"
    >
      <span
        className="text-[13px] font-medium"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        mj
      </span>
      <div className="flex gap-6 text-[13px]">
        <a
          href="#work"
          className="transition-colors duration-200"
          style={{ color: "var(--color-fg-secondary)" }}
        >
          work
        </a>
        <a
          href="#contact"
          className="transition-colors duration-200"
          style={{ color: "var(--color-fg-secondary)" }}
        >
          contact
        </a>
      </div>
    </nav>
  );
}

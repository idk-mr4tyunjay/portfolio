import Link from "next/link";

export function Nav() {
  return (
    <nav
      aria-label="Main"
      className="flex items-center justify-between pt-8"
    >
      <Link
        href="/"
        className="text-[13px] font-medium"
        style={{ fontFamily: "var(--font-mono)", color: "var(--color-fg)" }}
      >
        mj
      </Link>
      <div className="flex gap-6 text-[13px]">
        <Link href="/#work" className="quiet-link">
          work
        </Link>
        <Link href="/notes" className="quiet-link">
          notes
        </Link>
        <Link href="/#contact" className="quiet-link">
          contact
        </Link>
      </div>
    </nav>
  );
}

import Link from "next/link";

export function Nav() {
  return (
    <nav
      aria-label="Main"
      className="flex items-center justify-between gap-4 pt-8"
    >
      <Link
        href="/"
        className="flex items-center gap-2 py-2 text-[14px] font-medium"
        style={{ fontFamily: "var(--font-mono)", color: "var(--color-fg)" }}
      >
        <span
          aria-hidden
          className="inline-block size-2 rounded-full"
          style={{ background: "var(--color-accent)" }}
        />
        mj
      </Link>
      <div className="flex gap-4 text-[14px] sm:gap-6">
        <Link href="/#work" className="quiet-link nav-link py-2">
          work
        </Link>
        <Link href="/#projects" className="quiet-link nav-link py-2">
          projects
        </Link>
        <Link href="/notes" className="quiet-link nav-link py-2">
          notes
        </Link>
        <Link href="/#contact" className="quiet-link nav-link py-2">
          contact
        </Link>
      </div>
    </nav>
  );
}

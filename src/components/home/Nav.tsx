import Link from "next/link";

export function Nav() {
  return (
    <nav
      aria-label="Main"
      className="flex items-center justify-between pt-8"
    >
      <Link
        href="/"
        className="flex items-center gap-2 text-[13px] font-medium"
        style={{ fontFamily: "var(--font-mono)", color: "var(--color-fg)" }}
      >
        <span
          aria-hidden
          className="inline-block size-2 rounded-full"
          style={{ background: "var(--color-accent)" }}
        />
        mj
      </Link>
      <div className="flex gap-6 text-[13px]">
        <Link href="/#work" className="quiet-link nav-link">
          work
        </Link>
        <Link href="/#projects" className="quiet-link nav-link">
          projects
        </Link>
        <Link href="/notes" className="quiet-link nav-link">
          notes
        </Link>
        <Link href="/#contact" className="quiet-link nav-link">
          contact
        </Link>
      </div>
    </nav>
  );
}

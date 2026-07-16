import Link from "next/link";
import { Nav } from "@/components/home/Nav";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-[820px] px-6">
      <Nav />
      <main className="flex min-h-[70vh] flex-col justify-center pb-14">
        <h1
          className="fade-up m-0"
          style={{
            fontSize: "clamp(44px, 8vw, 76px)",
            fontWeight: 500,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
          }}
        >
          404
        </h1>
        <p
          className="fade-up mt-3 text-[13px]"
          style={{
            fontFamily: "var(--font-mono)",
            color: "var(--color-fg-muted)",
            animationDelay: "0.05s",
          }}
        >
          idk where that went either · it&apos;s literally in my username
        </p>
        <p
          className="fade-up mt-8 max-w-[52ch] text-[16px] leading-relaxed"
          style={{ color: "var(--color-fg-secondary)", animationDelay: "0.1s" }}
        >
          This page doesn&apos;t exist. Could be a typo, could be a link I broke
          and wrote a note about instead of fixing. Both are on brand.
        </p>
        <p
          className="fade-up mt-10 flex flex-wrap items-center gap-x-4 gap-y-2 text-[15px]"
          style={{ animationDelay: "0.15s" }}
        >
          <Link href="/" className="quiet-link" style={{ color: "var(--color-accent)" }}>
            go home →
          </Link>
          <Link href="/notes" className="quiet-link" style={{ color: "var(--color-accent)" }}>
            read the notes →
          </Link>
        </p>
      </main>
    </div>
  );
}

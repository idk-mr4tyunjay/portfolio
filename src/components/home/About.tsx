import { SITE } from "@/data/site";
import { STACK } from "@/data/stack";

export function About() {
  return (
    <section id="about" aria-label="About" className="pb-20">
      <p
        className="fade-up mb-3 text-xs"
        style={{
          fontFamily: "var(--font-mono)",
          color: "var(--color-fg-muted)",
          animationDelay: "0.2s",
        }}
      >
        about
      </p>
      <p
        className="fade-up max-w-[58ch] text-[15px] leading-relaxed"
        style={{ color: "var(--color-fg-secondary)", animationDelay: "0.25s" }}
      >
        {SITE.about}
      </p>

      <div
        className="fade-up mt-10 grid gap-8"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          animationDelay: "0.3s",
        }}
      >
        {STACK.map((group) => (
          <div key={group.group}>
            <p
              className="mb-3 text-xs"
              style={{
                fontFamily: "var(--font-mono)",
                color: "var(--color-fg-muted)",
              }}
            >
              {group.group}
            </p>
            <ul className="flex flex-col gap-1.5">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="text-[14px]"
                  style={{ color: "var(--color-fg-secondary)" }}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

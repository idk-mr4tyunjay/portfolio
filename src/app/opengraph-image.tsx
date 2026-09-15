import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { SITE } from "@/data/site";

/*
  Social share card — 1200×630 PNG generated at build with next/og.
  Also the Twitter image (crawlers fall back to og:image). Mirrors the hero:
  the name with the dot as its full stop, one sentence, the receipt line.
  Satori needs static font files; Archivo Bold stands in for the display
  weight since Bricolage ships variable-only.
*/

const DISPLAY = readFileSync(join(process.cwd(), "src/assets/fonts/Archivo-Bold.ttf"));
const MONO = readFileSync(join(process.cwd(), "src/assets/fonts/JetBrainsMono-Regular.ttf"));

const BG = "#f1f1ef";
const FG = "#0a0a0a";
const MUTED = "rgba(10, 10, 10, 0.55)";
const LIVE = "#0026ff";

// Baked at build. The fonts are read off disk, which only exists then.
export const dynamic = "force-static";

export const alt = `${SITE.name} · ${SITE.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 64px",
          background: BG,
          color: FG,
          fontFamily: "JetBrains Mono",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20, color: MUTED }}>
          <span>{SITE.url.replace("https://", "")}</span>
          <span>{SITE.role}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "flex-end", fontFamily: "Archivo", fontSize: 196, lineHeight: 0.9, letterSpacing: -12 }}>
            <span>{SITE.name}</span>
            <div style={{ display: "flex", width: 30, height: 30, borderRadius: 15, background: LIVE, marginLeft: 10, marginBottom: 12 }} />
          </div>
          <div style={{ display: "flex", marginTop: 40, maxWidth: 900, fontSize: 28, lineHeight: 1.4 }}>{SITE.intro}</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Archivo", data: DISPLAY, weight: 700, style: "normal" },
        { name: "JetBrains Mono", data: MONO, weight: 400, style: "normal" },
      ],
    },
  );
}

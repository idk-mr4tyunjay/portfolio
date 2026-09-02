import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { SITE } from "@/data/site";

/*
  Social share card — 1200×630 PNG generated at build with next/og.
  Also serves as the Twitter image (crawlers fall back to og:image).
  Mirrors the hero: cream ground, Archivo wordmark, mono meta lines.
  Colors are the light-theme tokens from globals.css.
*/

// Read at build time — paths stay literal so file tracing picks them up.
const ARCHIVO_BOLD = readFileSync(join(process.cwd(), "src/assets/fonts/Archivo-Bold.ttf"));
const MONO_REGULAR = readFileSync(join(process.cwd(), "src/assets/fonts/JetBrainsMono-Regular.ttf"));

const BG = "#e9e7e1";
const FG = "#141413";
const MUTED = "rgba(20, 20, 19, 0.62)";
const HAIRLINE = "rgba(20, 20, 19, 0.22)";
const ACCENT = "#c93c0a";

// Baked at build. The fonts are read off disk, which only exists then.
export const dynamic = "force-static";

export const alt = `${SITE.name} · ${SITE.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const tagline = `${SITE.heroTagline.lead} ${SITE.heroTagline.italic}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: BG,
          color: FG,
          fontFamily: "JetBrains Mono",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 21,
            letterSpacing: 3.6,
            color: MUTED,
          }}
        >
          <span>{SITE.url.replace("https://", "").toUpperCase()}</span>
          <span style={{ color: ACCENT }}>{SITE.role.toUpperCase()}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontFamily: "Archivo",
              fontSize: 188,
              lineHeight: 1,
              letterSpacing: -10,
              paddingBottom: 12,
            }}
          >
            {SITE.name}
          </div>
          <div style={{ display: "flex", height: 1, background: HAIRLINE, marginTop: 34 }} />
          <div
            style={{
              display: "flex",
              marginTop: 26,
              maxWidth: 960,
              fontSize: 27,
              lineHeight: 1.45,
              color: MUTED,
            }}
          >
            {tagline}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Archivo", data: ARCHIVO_BOLD, weight: 700, style: "normal" },
        { name: "JetBrains Mono", data: MONO_REGULAR, weight: 400, style: "normal" },
      ],
    },
  );
}

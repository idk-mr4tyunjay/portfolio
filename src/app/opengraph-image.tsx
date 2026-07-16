import { ImageResponse } from "next/og";
import { SITE } from "@/data/site";

/*
  Social share card — 1200×630 PNG generated at build with next/og.
  Also serves as the Twitter image (crawlers fall back to og:image).
  Colors mirror the design tokens in globals.css.
*/

export const alt = `${SITE.name} — ${SITE.role}`;
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
          justifyContent: "center",
          padding: "80px 90px",
          background: "#0a0a0b",
          backgroundImage:
            "radial-gradient(900px 600px at 15% -10%, rgba(124,246,255,0.14), transparent 60%)",
          color: "#f2f2f4",
          fontFamily: "monospace",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 26,
            color: "#7cf6ff",
            letterSpacing: 2,
          }}
        >
          {SITE.url.replace("https://", "")}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 40,
            fontSize: 128,
            fontWeight: 700,
            letterSpacing: -3,
            lineHeight: 1,
          }}
        >
          {SITE.name}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 40,
            color: "#8a8a90",
          }}
        >
          {SITE.tagline}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 56,
            width: 120,
            height: 6,
            borderRadius: 999,
            background: "#7cf6ff",
          }}
        />
      </div>
    ),
    { ...size },
  );
}

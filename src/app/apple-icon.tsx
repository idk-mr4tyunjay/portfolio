import { ImageResponse } from "next/og";

/*
  Apple touch icon — 180×180 opaque PNG (iOS rounds it itself).
  The mark is the dot: one point on a plain ground. Tokens inlined.
*/

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f1f1ef",
        }}
      >
        <div style={{ width: 56, height: 56, borderRadius: 28, background: "#0a0a0a" }} />
      </div>
    ),
    { ...size },
  );
}

import { ImageResponse } from "next/og";

/*
  Apple touch icon — 180×180 opaque PNG (iOS rounds it itself).
  Mirrors the reflow mark in icon.svg: three text lines with the
  accent cursor obstacle carving the middle one. Design tokens inlined.
*/

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const bar = (left: number, top: number, width: number) => ({
  position: "absolute" as const,
  left,
  top,
  width,
  height: 14,
  borderRadius: 7,
  background: "#e9e7e1",
});

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#141413",
        }}
      >
        <div style={bar(39, 48, 101)} />
        <div style={bar(39, 83, 37)} />
        <div style={bar(126, 83, 14)} />
        <div style={bar(39, 118, 79)} />
        <div
          style={{
            position: "absolute",
            left: 83,
            top: 72,
            width: 36,
            height: 36,
            borderRadius: 18,
            background: "#c93c0a",
          }}
        />
      </div>
    ),
    { ...size },
  );
}

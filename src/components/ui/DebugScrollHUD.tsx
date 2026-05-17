"use client";

import { useScrollStore } from "@/store/scroll";

/*
  Dev-only HUD showing scroll progress + active scene.
  Useful for verifying the band math while scrolling.
  Set NEXT_PUBLIC_DEBUG_SCROLL=1 to display, or pass `show` directly.
*/
export function DebugScrollHUD({ show = true }: { show?: boolean }) {
  const progress = useScrollStore((s) => s.progress);
  const active = useScrollStore((s) => s.activeScene);

  if (!show) return null;

  return (
    <div
      className="pointer-events-none fixed bottom-4 left-4 z-50 rounded border border-white/20 bg-black/60 px-3 py-2 text-xs backdrop-blur"
      style={{ fontFamily: "var(--font-mono)" }}
    >
      <div>scene: {active}</div>
      <div>progress: {progress.toFixed(3)}</div>
    </div>
  );
}

"use client";

import { HeroScene } from "@/components/scenes/HeroScene";

/*
  Renders the active scene. Only Scene 01 exists right now — additional
  scenes are added one at a time alongside their implementation.
*/
export function SceneSwitcher() {
  return <HeroScene />;
}

"use client";

import { useScrollStore } from "@/store/scroll";
import { HeroScene } from "@/components/scenes/HeroScene";
import { Portal1Scene } from "@/components/scenes/Portal1Scene";
import { PixelScene } from "@/components/scenes/PixelScene";
import { Portal2Scene } from "@/components/scenes/Portal2Scene";
import { ArsenalScene } from "@/components/scenes/ArsenalScene";
import { MissionsScene } from "@/components/scenes/MissionsScene";
import { LandingScene } from "@/components/scenes/LandingScene";

/*
  Renders only the scene matching the active scroll band.
  Adjacent scenes are mounted briefly during portal transitions so the
  outgoing scene can be fed into the portal shader as a render target.
*/
export function SceneSwitcher() {
  const active = useScrollStore((s) => s.activeScene);

  switch (active) {
    case "hero":
      return <HeroScene />;
    case "portal1":
      return <Portal1Scene />;
    case "pixel":
      return <PixelScene />;
    case "portal2":
      return <Portal2Scene />;
    case "arsenal":
      return <ArsenalScene />;
    case "missions":
      return <MissionsScene />;
    case "landing":
      return <LandingScene />;
  }
}

"use client";

import { useScrollStore } from "@/store/scroll";
import { ContactForm } from "./ContactForm";

/*
  DOM overlay for Scene 07: contact form sits on top of the 3D landing.
  Fades in once we're inside the landing band.
*/
export function LandingOverlay() {
  const active = useScrollStore((s) => s.activeScene);
  const visible = active === "landing";

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-12 z-10 transition-opacity duration-700"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <div className="pointer-events-auto">
        <ContactForm />
      </div>
    </div>
  );
}

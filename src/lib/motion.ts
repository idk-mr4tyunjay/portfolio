/*
  Capability checks shared by every animated component. Read once per call so
  a user toggling reduced motion mid-session is respected on the next mount.
*/

export const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const finePointer = () =>
  typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;

/** Custom event a branch fires when a leaf should let go. Weather.tsx listens. */
export const LEAF_EVENT = "mj:leaf";

export interface LeafDetail {
  /** Page coordinates. */
  x: number;
  y: number;
}

export function releaseLeaf(detail: LeafDetail) {
  window.dispatchEvent(new CustomEvent<LeafDetail>(LEAF_EVENT, { detail }));
}

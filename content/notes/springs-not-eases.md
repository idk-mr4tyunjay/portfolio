---
title: "Springs, not eases"
date: "2026-07-11"
tags: [animation, ux]
summary: "A five-line spring integrator makes motion feel hand-made, and it tells you exactly when to stop your rAF loop."
---

CSS easing curves run on a clock: fixed duration, predetermined path. Springs run on state: they chase a target, and if the target moves mid-flight they adjust without a visible seam. That difference is most of why sprung UIs feel alive and eased UIs feel like slideshows.

The whole integrator is five lines:

```ts
v = v * damping + (target - x) * stiffness;
x += v;
```

per axis, per frame. On this site the hero's obstacle uses `damping 0.8, stiffness 0.16`, tuned by feel: higher stiffness snaps, higher damping oozes.

## The part nobody mentions: springs know when they're done

An eased animation needs a timer to know it finished. A spring tells you: when velocity and remaining distance are both under an epsilon, it has settled:

```ts
const energy = Math.abs(v) + Math.abs(target - x);
if (energy < 0.08) stopRafLoop();
```

That's not just cleanliness. It means the animation loop **only runs while something moves**. At idle the page does literally zero work per frame, which is the difference between "smooth demo" and "laptop fan spins on a portfolio site."

## When to still use CSS

Hover states, fades, anything fire-and-forget with no moving target: CSS transitions are free and declarative. Springs earn their keep the moment the target is live: a cursor, a drag, a value that changes while the motion is still in flight.

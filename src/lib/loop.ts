/*
  One rAF loop for the page — SPEC.md §4. Anything that animates registers a
  tick(dt, t) that returns true while it still has work. The loop stops on its
  own when every tick returns false, so an idle page does zero work.
*/

type Tick = (dt: number, t: number) => boolean;

const ticks = new Set<Tick>();
let raf = 0;
let last = 0;

function frame(now: number) {
  const dt = last ? (now - last) / 1000 : 1 / 60;
  last = now;
  let busy = false;
  for (const tick of ticks) {
    if (tick(dt, now / 1000)) busy = true;
  }
  if (busy) {
    raf = requestAnimationFrame(frame);
  } else {
    raf = 0;
    last = 0;
  }
}

/** Register a tick. Call `wake()` whenever its state changes and it needs frames again. */
export function addTick(tick: Tick): () => void {
  ticks.add(tick);
  wake();
  return () => {
    ticks.delete(tick);
  };
}

export function wake() {
  if (!raf && ticks.size) raf = requestAnimationFrame(frame);
}

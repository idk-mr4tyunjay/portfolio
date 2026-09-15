/*
  Spring integrator — SPEC.md §3. Chases a moving target; settles when both
  displacement and velocity are tiny, which tells the caller to stop its loop.
*/

export interface SpringConfig {
  stiffness: number;
  damping: number;
  mass?: number;
}

export const SPRING = {
  /** Floating work image, nav dot. */
  follow: { stiffness: 170, damping: 26 },
  /** Cursor dot. */
  cursor: { stiffness: 120, damping: 20 },
  /** Cursor radius, image scale. */
  soft: { stiffness: 200, damping: 24 },
} as const satisfies Record<string, SpringConfig>;

export class Spring {
  value: number;
  target: number;
  velocity = 0;
  private readonly k: number;
  private readonly c: number;
  private readonly m: number;

  constructor(initial: number, { stiffness, damping, mass = 1 }: SpringConfig) {
    this.value = initial;
    this.target = initial;
    this.k = stiffness;
    this.c = damping;
    this.m = mass;
  }

  /** Advance by `dt` seconds. Returns true while still moving. */
  step(dt: number): boolean {
    const dtc = Math.min(dt, 1 / 30);
    const force = -this.k * (this.value - this.target) - this.c * this.velocity;
    this.velocity += (force / this.m) * dtc;
    this.value += this.velocity * dtc;
    if (Math.abs(this.value - this.target) < 0.05 && Math.abs(this.velocity) < 0.05) {
      this.value = this.target;
      this.velocity = 0;
      return false;
    }
    return true;
  }

  snap(v: number) {
    this.value = v;
    this.target = v;
    this.velocity = 0;
  }
}

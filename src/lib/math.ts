export const clamp = (n: number, min = 0, max = 1): number =>
  Math.min(Math.max(n, min), max);

export const lerp = (a: number, b: number, t: number): number =>
  a + (b - a) * t;

export const smoothstep = (edge0: number, edge1: number, x: number): number => {
  const t = clamp((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};

export const mapRange = (
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
  clamped = true,
): number => {
  const t = (value - inMin) / (inMax - inMin);
  const result = outMin + (outMax - outMin) * t;
  return clamped ? clamp(result, Math.min(outMin, outMax), Math.max(outMin, outMax)) : result;
};

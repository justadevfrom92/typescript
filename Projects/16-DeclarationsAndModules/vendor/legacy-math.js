// A plain JavaScript module with no types, like an old library you cannot rewrite.
export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function stats(values) {
  const sum = values.reduce((total, value) => total + value, 0);
  return { count: values.length, sum, mean: values.length ? sum / values.length : 0 };
}

export const VERSION = "1.4.0";

export default function lerp(from, to, t) {
  return from + (to - from) * t;
}

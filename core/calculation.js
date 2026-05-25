export function clamp(value, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

export function calcHill(x, ec50 = 450, n = 1.8) {
  if (!x || x <= 0) return 0;
  return Math.pow(x, n) / (Math.pow(ec50, n) + Math.pow(x, n));
}

export function round1(value) {
  return Math.round((Number(value) || 0) * 10) / 10;
}

export function sumBy(arr, fn) {
  return (arr || []).reduce((acc, item) => acc + (Number(fn(item)) || 0), 0);
}
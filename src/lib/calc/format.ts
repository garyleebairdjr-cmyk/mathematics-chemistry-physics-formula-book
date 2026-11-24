/** Parse a plain decimal, including scientific notation. Commas are not decimals. */
export function parseNum(raw: string): number | null {
  const t = raw.trim().replace(/\s+/g, "");
  if (!t) return null;
  if (!/^[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?$/.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function fmt(n: number): string {
  if (!Number.isFinite(n)) return "—";
  if (Object.is(n, -0) || n === 0) return "0";
  const abs = Math.abs(n);
  if (abs >= 1e7 || abs < 1e-4) {
    return n
      .toExponential(6)
      .replace(/(\.\d*?[1-9])0+e/, "$1e")
      .replace(/\.0+e/, "e")
      .replace("e+", "e");
  }
  const digits = abs >= 100 ? 8 : 6;
  const s = abs >= 1e-4 && abs < 1 ? n.toPrecision(4) : n.toPrecision(digits);
  if (/[eE]/.test(s)) return s.replace("e+", "e");
  return s.replace(/(\.\d*?[1-9])0+$/, "$1").replace(/\.0+$/, "");
}

export function fmtFixed(n: number, digits: number): string {
  if (!Number.isFinite(n)) return "—";
  return n
    .toFixed(digits)
    .replace(/(\.\d*?[1-9])0+$/, "$1")
    .replace(/\.0+$/, "");
}

export type Fail = { error: string };

export function isFail(value: unknown): value is Fail {
  return typeof value === "object" && value !== null && "error" in value;
}

export function take(
  values: Record<string, string>,
  specs: { key: string; label: string }[],
): Fail | Record<string, number> {
  const out: Record<string, number> = {};
  for (const spec of specs) {
    const n = parseNum(values[spec.key] ?? "");
    if (n === null) return { error: `Enter a number for ${spec.label}.` };
    out[spec.key] = n;
  }
  return out;
}

export function igcd(a: number, b: number): number {
  let x = Math.abs(Math.trunc(a));
  let y = Math.abs(Math.trunc(b));
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x;
}

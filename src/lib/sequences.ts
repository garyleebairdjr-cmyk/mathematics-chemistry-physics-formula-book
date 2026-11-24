/** Shared sequence arithmetic for the chapter model and the calculators. */

export const PHI = (1 + Math.sqrt(5)) / 2;
export const PSI = (1 - Math.sqrt(5)) / 2;

export type SequenceKind =
  | "arithmetic"
  | "geometric"
  | "fibonacci"
  | "lucas"
  | "triangular"
  | "squares"
  | "powers"
  | "factorial"
  | "harmonic";

export function fibAt(n: number): number {
  if (n <= 0) return 0;
  let a = 0;
  let b = 1;
  for (let i = 1; i < n; i += 1) {
    const next = a + b;
    a = b;
    b = next;
  }
  return b;
}

export function lucasAt(n: number): number {
  if (n <= 0) return 2;
  let a = 2;
  let b = 1;
  for (let i = 1; i < n; i += 1) {
    const next = a + b;
    a = b;
    b = next;
  }
  return b;
}

function factorialAt(n: number): number {
  let value = 1;
  for (let i = 2; i <= n; i += 1) value *= i;
  return value;
}

/** Terms a_1 through a_count. Fibonacci and Lucas use the standard index, skipping the n = 0 term. */
export function termsOf(kind: SequenceKind, count: number, first: number, step: number): number[] {
  const n = Math.max(1, Math.min(16, Math.floor(count)));
  const out: number[] = [];
  for (let i = 1; i <= n; i += 1) {
    if (kind === "arithmetic") out.push(first + (i - 1) * step);
    else if (kind === "geometric") out.push(first * step ** (i - 1));
    else if (kind === "fibonacci") out.push(fibAt(i));
    else if (kind === "lucas") out.push(lucasAt(i - 1));
    else if (kind === "triangular") out.push((i * (i + 1)) / 2);
    else if (kind === "squares") out.push(i * i);
    else if (kind === "powers") out.push(2 ** (i - 1));
    else if (kind === "factorial") out.push(factorialAt(i));
    else out.push(1 / i);
  }
  return out;
}

export function partialSums(values: number[]): number[] {
  const sums: number[] = [];
  let running = 0;
  for (const value of values) {
    running += value;
    sums.push(running);
  }
  return sums;
}

export type SpiralSquare = {
  x: number;
  y: number;
  s: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

/** Fibonacci squares with a quarter-circle in each. Arc end of one square is the arc start of the next. */
export function fibonacciSpiral(count: number): SpiralSquare[] {
  const n = Math.max(1, Math.min(10, Math.floor(count)));
  const sides: number[] = [];
  for (let i = 1; i <= n; i += 1) sides.push(fibAt(i));
  let cx = 0;
  let cy = 0;
  let ex = 0;
  let ey = -1;
  const squares: SpiralSquare[] = [];
  for (let i = 0; i < sides.length; i += 1) {
    const s = sides[i];
    const nx = -ey;
    const ny = ex;
    const x1 = cx + ex * s;
    const y1 = cy + ey * s;
    const x2 = cx + nx * s;
    const y2 = cy + ny * s;
    squares.push({
      x: Math.min(cx, x1, x2),
      y: Math.min(cy, y1, y2),
      s,
      x1,
      y1,
      x2,
      y2,
    });
    if (i + 1 < sides.length) {
      const sn = sides[i + 1];
      cx = x2 - nx * sn;
      cy = y2 - ny * sn;
      ex = nx;
      ey = ny;
    }
  }
  return squares;
}

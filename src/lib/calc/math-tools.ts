import { fmt, igcd, isFail, parseNum, take } from "./format.ts";
import { lines, num, sel, text, type Tool } from "./types.ts";

function rational(raw: string): { n: number; d: number } | null {
  const t = raw.trim();
  const slash = t.match(/^([+-]?\d+)\s*\/\s*([+-]?\d+)$/);
  if (slash) {
    const n = Number(slash[1]);
    const d = Number(slash[2]);
    if (d === 0) return null;
    return reduce(n, d);
  }
  if (/^[+-]?\d+$/.test(t)) return { n: Number(t), d: 1 };
  return null;
}

function reduce(n: number, d: number): { n: number; d: number } {
  if (d < 0) {
    n = -n;
    d = -d;
  }
  const g = igcd(n, d);
  return { n: n / g, d: d / g };
}

function showFrac(n: number, d: number): string {
  const r = reduce(n, d);
  return r.d === 1 ? String(r.n) : `${r.n}/${r.d}`;
}

function factor(n: number): string {
  let x = Math.abs(n);
  if (x === 0) return "0";
  if (x === 1) return n < 0 ? "−1" : "1";
  const parts: string[] = [];
  let p = 2;
  while (p * p <= x) {
    let c = 0;
    while (x % p === 0) {
      x /= p;
      c += 1;
    }
    if (c === 1) parts.push(String(p));
    else if (c > 1) parts.push(`${p}^${c}`);
    p = p === 2 ? 3 : p + 2;
    if (p > 1000000 && x > 1) return "too large to factor here";
  }
  if (x > 1) parts.push(String(x));
  return (n < 0 ? "−" : "") + parts.join(" × ");
}

function comb(n: number, k: number): number {
  if (!Number.isInteger(n) || !Number.isInteger(k) || k < 0 || n < 0 || k > n) return NaN;
  const kk = Math.min(k, n - k);
  let r = 1;
  for (let i = 1; i <= kk; i += 1) r = (r * (n - kk + i)) / i;
  return r;
}

function polyCoeffs(raw: string): number[] | { error: string } {
  const parts = raw
    .split(/[, ]+/)
    .map((part) => part.trim())
    .filter(Boolean);
  if (!parts.length)
    return { error: "Enter coefficients, highest power first. Example: 1, -3, 2." };
  const cs: number[] = [];
  for (const part of parts) {
    const n = parseNum(part);
    if (n === null) return { error: "Coefficients must be numbers, such as 1, -3, 2." };
    cs.push(n);
  }
  return cs;
}

function polyText(cs: number[]): string {
  const n = cs.length - 1;
  const terms: string[] = [];
  cs.forEach((c, i) => {
    if (c === 0) return;
    const p = n - i;
    const mag = fmt(Math.abs(c));
    const sign = c < 0 ? "−" : terms.length ? "+" : "";
    let body = mag;
    if (p === 1) body = mag === "1" ? "x" : `${mag}x`;
    if (p > 1) body = mag === "1" ? `x^${p}` : `${mag}x^${p}`;
    terms.push(`${sign} ${body}`.trim());
  });
  return terms.join(" ") || "0";
}

function horner(cs: number[], x: number): number {
  return cs.reduce((acc, c) => acc * x + c, 0);
}

function erf(x: number): number {
  const sign = Math.sign(x);
  const a = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * a);
  const y =
    1 -
    ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) *
      t *
      Math.exp(-a * a);
  return sign * y;
}

function parseBig(raw: string, base: number): bigint | { error: string } {
  const s = raw.trim().toLowerCase();
  if (!s) return { error: "Enter a number to convert." };
  const digits = "0123456789abcdefghijklmnopqrstuvwxyz";
  let n = 0n;
  for (const ch of s) {
    const v = digits.indexOf(ch);
    if (v < 0 || v >= base) return { error: `“${ch}” is not a digit in base ${base}.` };
    n = n * BigInt(base) + BigInt(v);
    if (n > 10n ** 18n) return { error: "That integer is too large for this converter." };
  }
  return n;
}

function writeBig(n: bigint, base: number): string {
  if (n === 0n) return "0";
  const digits = "0123456789abcdefghijklmnopqrstuvwxyz";
  let x = n;
  let out = "";
  while (x > 0n) {
    out = digits[Number(x % BigInt(base))] + out;
    x /= BigInt(base);
  }
  return base === 2 ? out.replace(/(.{4})/g, "$1 ").trim() : out;
}

export const mathTools: Tool[] = [
  {
    id: "fractions",
    group: "math",
    title: "Fractions",
    formula: "a/b  ∘  c/d",
    blurb: "Add, subtract, multiply, or divide two fractions and reduce the result.",
    fields: [
      text("a", "First fraction", "3/4", "3/4"),
      sel("op", "Operation", "add", [
        { value: "add", label: "Add" },
        { value: "sub", label: "Subtract" },
        { value: "mul", label: "Multiply" },
        { value: "div", label: "Divide" },
      ]),
      text("b", "Second fraction", "5/6", "5/6"),
    ],
    run: (v) => {
      const a = rational(v.a ?? "");
      const b = rational(v.b ?? "");
      if (!a || !b) return { error: "Use integers or fractions, such as 3/4." };
      let n = 0;
      let d = 1;
      if (v.op === "add") {
        n = a.n * b.d + b.n * a.d;
        d = a.d * b.d;
      } else if (v.op === "sub") {
        n = a.n * b.d - b.n * a.d;
        d = a.d * b.d;
      } else if (v.op === "mul") {
        n = a.n * b.n;
        d = a.d * b.d;
      } else {
        if (b.n === 0) return { error: "Cannot divide by zero." };
        n = a.n * b.d;
        d = a.d * b.n;
      }
      const shown = showFrac(n, d);
      const value = n / d;
      return lines(
        [
          { label: "Result", value: shown },
          { label: "Decimal", value: fmt(value) },
        ],
        [
          `${showFrac(a.n, a.d)} and ${showFrac(b.n, b.d)} combine over a common denominator, then cancel.`,
        ],
      );
    },
  },
  {
    id: "percent",
    group: "math",
    title: "Percent",
    formula: "part = (percent / 100) × whole",
    blurb:
      "A percent of a whole, what percent one number is of another, or the change between two numbers.",
    fields: [
      sel("mode", "Question", "of", [
        { value: "of", label: "What is P% of X?" },
        { value: "ratio", label: "X is what percent of Y?" },
        { value: "change", label: "Percent change from A to B" },
      ]),
      num("p", "P, X, or A", "15"),
      num("x", "X, Y, or B", "80"),
    ],
    run: (v) => {
      const g = take(v, [
        { key: "p", label: "the first value" },
        { key: "x", label: "the second value" },
      ]);
      if (isFail(g)) return g;
      if (v.mode === "of") {
        const part = (g.p / 100) * g.x;
        return lines(
          [
            { label: "Part", value: fmt(part) },
            { label: "Left after a reduction", value: fmt(g.x - part) },
          ],
          [`${fmt(g.p)}% of ${fmt(g.x)} is ${fmt(g.p / 100)} × ${fmt(g.x)}.`],
        );
      }
      if (v.mode === "ratio") {
        if (g.x === 0) return { error: "The whole cannot be zero." };
        return lines(
          [{ label: "Percent", value: `${fmt((g.p / g.x) * 100)}%` }],
          [`${fmt(g.p)} / ${fmt(g.x)} = ${fmt(g.p / g.x)}.`],
        );
      }
      if (g.p === 0) return { error: "The starting value cannot be zero." };
      const change = ((g.x - g.p) / g.p) * 100;
      return lines(
        [{ label: "Change", value: `${fmt(change)}%` }],
        [`(${fmt(g.x)} − ${fmt(g.p)}) / ${fmt(g.p)}.`],
      );
    },
  },
  {
    id: "gcd",
    group: "math",
    title: "GCD, LCM, and factors",
    formula: "gcd(a, b) × lcm(a, b) = |a b|",
    blurb: "Euclid’s algorithm, the least common multiple, and a prime factorization.",
    fields: [num("a", "First integer", "252"), num("b", "Second integer", "198")],
    run: (v) => {
      const g = take(v, [
        { key: "a", label: "the first integer" },
        { key: "b", label: "the second integer" },
      ]);
      if (isFail(g)) return g;
      if (!Number.isInteger(g.a) || !Number.isInteger(g.b)) return { error: "Use whole numbers." };
      if (Math.abs(g.a) > 1e12 || Math.abs(g.b) > 1e12)
        return { error: "Keep the integers under a trillion." };
      const d = igcd(g.a, g.b);
      const lcm = g.a === 0 || g.b === 0 ? 0 : Math.abs(g.a / d) * Math.abs(g.b);
      return lines(
        [
          { label: "gcd", value: fmt(d) },
          { label: "lcm", value: fmt(lcm) },
          { label: `Factors of ${fmt(g.a)}`, value: factor(g.a) },
          { label: `Factors of ${fmt(g.b)}`, value: factor(g.b) },
        ],
        ["The gcd is the last nonzero remainder. The lcm is the product divided by the gcd."],
      );
    },
  },
  {
    id: "sci",
    group: "math",
    title: "Scientific notation",
    formula: "a × 10^k,  with  1 ≤ |a| < 10",
    blurb: "Write a number in scientific notation, and multiply or divide two of them.",
    fields: [
      num("a", "First number", "3.2e4"),
      sel("op", "Operation", "mul", [
        { value: "id", label: "Just rewrite the first" },
        { value: "mul", label: "Multiply by the second" },
        { value: "div", label: "Divide by the second" },
      ]),
      num("b", "Second number", "5e-2"),
    ],
    run: (v) => {
      const a = parseNum(v.a ?? "");
      if (a === null) return { error: "Enter the first number." };
      let value = a;
      if (v.op !== "id") {
        const b = parseNum(v.b ?? "");
        if (b === null) return { error: "Enter the second number." };
        if (v.op === "div" && b === 0) return { error: "Cannot divide by zero." };
        value = v.op === "mul" ? a * b : a / b;
      }
      if (value === 0) return lines([{ label: "Scientific notation", value: "0" }]);
      const exp = Math.floor(Math.log10(Math.abs(value)));
      const coeff = value / 10 ** exp;
      return lines(
        [
          { label: "Scientific notation", value: `${fmt(coeff)} × 10^${exp}` },
          { label: "Decimal", value: fmt(value) },
        ],
        [
          "Multiply the coefficients and add the exponents, then shift until the coefficient sits between 1 and 10.",
        ],
      );
    },
  },
  {
    id: "linear",
    group: "math",
    title: "Linear equation",
    formula: "ax + b = c",
    blurb: "Solve a single linear equation.",
    fields: [num("a", "a", "4"), num("b", "b", "-7"), num("c", "c", "9")],
    run: (v) => {
      const g = take(v, [
        { key: "a", label: "a" },
        { key: "b", label: "b" },
        { key: "c", label: "c" },
      ]);
      if (isFail(g)) return g;
      if (g.a === 0) {
        return g.b === g.c
          ? lines([{ label: "Solution", value: "Every x works" }])
          : { error: "No solution: a is 0 and b does not equal c." };
      }
      const x = (g.c - g.b) / g.a;
      return lines(
        [{ label: "x", value: fmt(x) }],
        [`x = (${fmt(g.c)} − ${fmt(g.b)}) / ${fmt(g.a)}.`],
      );
    },
  },
  {
    id: "quadratic",
    group: "math",
    title: "Quadratic formula",
    formula: "x = (−b ± √(b² − 4ac)) / 2a",
    blurb: "Roots of ax² + bx + c = 0, real or complex.",
    fields: [num("a", "a", "1"), num("b", "b", "-3"), num("c", "c", "2")],
    run: (v) => {
      const g = take(v, [
        { key: "a", label: "a" },
        { key: "b", label: "b" },
        { key: "c", label: "c" },
      ]);
      if (isFail(g)) return g;
      if (g.a === 0)
        return { error: "a is 0, so this is not a quadratic. Use the linear equation." };
      const d = g.b * g.b - 4 * g.a * g.c;
      if (d > 0) {
        const r1 = (-g.b + Math.sqrt(d)) / (2 * g.a);
        const r2 = (-g.b - Math.sqrt(d)) / (2 * g.a);
        return lines(
          [
            { label: "Discriminant", value: fmt(d) },
            { label: "x₁", value: fmt(r1) },
            { label: "x₂", value: fmt(r2) },
          ],
          ["Two distinct real roots."],
        );
      }
      if (d === 0) {
        return lines(
          [
            { label: "Discriminant", value: "0" },
            { label: "x", value: fmt(-g.b / (2 * g.a)) },
          ],
          ["A repeated real root."],
        );
      }
      const real = -g.b / (2 * g.a);
      const imag = Math.sqrt(-d) / (2 * Math.abs(g.a));
      const sign = g.a > 0 ? 1 : -1;
      return lines(
        [
          { label: "Discriminant", value: fmt(d) },
          { label: "x", value: `${fmt(real)} ± ${fmt(sign * imag)} i` },
        ],
        ["The discriminant is negative, so the roots are complex conjugates."],
      );
    },
  },
  {
    id: "line",
    group: "math",
    title: "Line through two points",
    formula: "m = (y₂ − y₁) / (x₂ − x₁)",
    blurb: "Slope, intercept, midpoint, and distance.",
    fields: [
      num("x1", "x₁", "1"),
      num("y1", "y₁", "2"),
      num("x2", "x₂", "4"),
      num("y2", "y₂", "8"),
    ],
    run: (v) => {
      const g = take(v, [
        { key: "x1", label: "x₁" },
        { key: "y1", label: "y₁" },
        { key: "x2", label: "x₂" },
        { key: "y2", label: "y₂" },
      ]);
      if (isFail(g)) return g;
      const dx = g.x2 - g.x1;
      const dy = g.y2 - g.y1;
      const dist = Math.hypot(dx, dy);
      const mid = `(${fmt((g.x1 + g.x2) / 2)}, ${fmt((g.y1 + g.y2) / 2)})`;
      if (dx === 0) {
        return lines(
          [
            { label: "Slope", value: "undefined" },
            { label: "Line", value: `x = ${fmt(g.x1)}` },
            { label: "Midpoint", value: mid },
            { label: "Distance", value: fmt(dist) },
          ],
          ["The run is zero, so the line is vertical."],
        );
      }
      const m = dy / dx;
      const b = g.y1 - m * g.x1;
      return lines(
        [
          { label: "Slope", value: fmt(m) },
          { label: "Equation", value: `y = ${fmt(m)}x ${b < 0 ? "−" : "+"} ${fmt(Math.abs(b))}` },
          { label: "Midpoint", value: mid },
          { label: "Distance", value: fmt(dist) },
        ],
        ["Rise over run, then the intercept from either point."],
      );
    },
  },
  {
    id: "pythagoras",
    group: "math",
    title: "Pythagoras",
    formula: "a² + b² = c²",
    blurb: "Find the hypotenuse, or a leg, of a right triangle.",
    fields: [
      sel("mode", "Find", "hyp", [
        { value: "hyp", label: "Hypotenuse from two legs" },
        { value: "leg", label: "A leg from hypotenuse and the other leg" },
      ]),
      num("a", "Leg a, or hypotenuse", "3"),
      num("b", "Leg b", "4"),
    ],
    run: (v) => {
      const g = take(v, [
        { key: "a", label: "the first length" },
        { key: "b", label: "the second length" },
      ]);
      if (isFail(g)) return g;
      if (g.a <= 0 || g.b <= 0) return { error: "Lengths have to be positive." };
      if (v.mode === "hyp") {
        return lines(
          [{ label: "Hypotenuse", value: fmt(Math.hypot(g.a, g.b)) }],
          [`√(${fmt(g.a)}² + ${fmt(g.b)}²).`],
        );
      }
      if (g.a <= g.b) return { error: "The hypotenuse has to be longer than the known leg." };
      return lines(
        [{ label: "Other leg", value: fmt(Math.sqrt(g.a * g.a - g.b * g.b)) }],
        [`√(${fmt(g.a)}² − ${fmt(g.b)}²).`],
      );
    },
  },
  {
    id: "circle",
    group: "math",
    title: "Circle and sphere",
    formula: "A = πr²,   V = (4/3)πr³",
    blurb: "From a radius: circumference, disk area, sphere surface, and sphere volume.",
    fields: [num("r", "Radius", "3")],
    run: (v) => {
      const g = take(v, [{ key: "r", label: "the radius" }]);
      if (isFail(g)) return g;
      if (g.r < 0) return { error: "The radius cannot be negative." };
      const r = g.r;
      return lines(
        [
          { label: "Circumference", value: fmt(2 * Math.PI * r) },
          { label: "Disk area", value: fmt(Math.PI * r * r) },
          { label: "Sphere surface", value: fmt(4 * Math.PI * r * r) },
          { label: "Sphere volume", value: fmt((4 / 3) * Math.PI * r ** 3) },
        ],
        ["Length scales with r, area with r², volume with r³."],
      );
    },
  },
  {
    id: "triangle-area",
    group: "math",
    title: "Triangle area",
    formula: "A = (1/2)bh,   or Heron’s formula",
    blurb: "Area from base and height, or from three side lengths.",
    fields: [
      sel("mode", "Known", "bh", [
        { value: "bh", label: "Base and height" },
        { value: "sss", label: "Three sides" },
      ]),
      num("a", "Base, or side a", "10"),
      num("b", "Height, or side b", "4"),
      num("c", "Side c (three sides only)", "0"),
    ],
    run: (v) => {
      if (v.mode === "bh") {
        const g = take(v, [
          { key: "a", label: "the base" },
          { key: "b", label: "the height" },
        ]);
        if (isFail(g)) return g;
        if (g.a < 0 || g.b < 0) return { error: "Base and height cannot be negative." };
        return lines(
          [{ label: "Area", value: fmt(0.5 * g.a * g.b) }],
          ["Half of base times the perpendicular height."],
        );
      }
      const g = take(v, [
        { key: "a", label: "side a" },
        { key: "b", label: "side b" },
        { key: "c", label: "side c" },
      ]);
      if (isFail(g)) return g;
      const { a, b, c } = g;
      if (a <= 0 || b <= 0 || c <= 0) return { error: "Sides have to be positive." };
      if (a + b <= c || a + c <= b || b + c <= a)
        return { error: "Those lengths do not form a triangle." };
      const s = (a + b + c) / 2;
      const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
      return lines(
        [
          { label: "Area", value: fmt(area) },
          { label: "Semiperimeter", value: fmt(s) },
        ],
        ["Heron: √[s(s−a)(s−b)(s−c)]."],
      );
    },
  },
  {
    id: "right-triangle",
    group: "math",
    title: "Right triangle",
    formula: "sin θ = opposite / hypotenuse",
    blurb: "An acute angle and one side determine the other two sides.",
    fields: [
      num("angle", "Angle", "30", "°"),
      sel("known", "Known side", "hyp", [
        { value: "opp", label: "Opposite" },
        { value: "adj", label: "Adjacent" },
        { value: "hyp", label: "Hypotenuse" },
      ]),
      num("side", "That side", "10"),
    ],
    run: (v) => {
      const g = take(v, [
        { key: "angle", label: "the angle" },
        { key: "side", label: "the side" },
      ]);
      if (isFail(g)) return g;
      if (g.angle <= 0 || g.angle >= 90)
        return { error: "Use an acute angle, between 0° and 90°." };
      if (g.side <= 0) return { error: "The side has to be positive." };
      const rad = (g.angle * Math.PI) / 180;
      const sin = Math.sin(rad);
      const cos = Math.cos(rad);
      const tan = Math.tan(rad);
      let opp = 0;
      let adj = 0;
      let hyp = 0;
      if (v.known === "opp") {
        opp = g.side;
        hyp = opp / sin;
        adj = opp / tan;
      } else if (v.known === "adj") {
        adj = g.side;
        hyp = adj / cos;
        opp = adj * tan;
      } else {
        hyp = g.side;
        opp = hyp * sin;
        adj = hyp * cos;
      }
      return lines(
        [
          { label: "Opposite", value: fmt(opp) },
          { label: "Adjacent", value: fmt(adj) },
          { label: "Hypotenuse", value: fmt(hyp) },
        ],
        [`sin ${fmt(g.angle)}° = ${fmt(sin)}, cos = ${fmt(cos)}.`],
      );
    },
  },
  {
    id: "laws",
    group: "math",
    title: "Laws of sines and cosines",
    formula: "c² = a² + b² − 2ab cos C",
    blurb: "A side from two angles, a side from SAS, or an angle from three sides.",
    fields: [
      sel("mode", "Given", "aas", [
        { value: "aas", label: "Side a, angle A, angle B" },
        { value: "sas", label: "Sides a and b, included angle C" },
        { value: "sss", label: "Three sides, find angle C" },
      ]),
      num("a", "a", "5"),
      num("b", "b or angle B", "45"),
      num("c", "angle A, angle C, or side c", "30"),
    ],
    run: (v) => {
      const g = take(v, [
        { key: "a", label: "a" },
        { key: "b", label: "the second value" },
        { key: "c", label: "the third value" },
      ]);
      if (isFail(g)) return g;
      if (v.mode === "aas") {
        const A = (g.c * Math.PI) / 180;
        const B = (g.b * Math.PI) / 180;
        if (g.a <= 0 || A <= 0 || B <= 0 || A + B >= Math.PI)
          return { error: "Those angles do not leave room for a triangle." };
        const b = (g.a * Math.sin(B)) / Math.sin(A);
        return lines([{ label: "Side b", value: fmt(b) }], ["a / sin A = b / sin B."]);
      }
      if (v.mode === "sas") {
        if (g.a <= 0 || g.b <= 0) return { error: "Sides have to be positive." };
        const C = (g.c * Math.PI) / 180;
        const c = Math.sqrt(g.a ** 2 + g.b ** 2 - 2 * g.a * g.b * Math.cos(C));
        return lines(
          [{ label: "Side c", value: fmt(c) }],
          ["Law of cosines with the included angle."],
        );
      }
      const { a, b, c } = g;
      if (a <= 0 || b <= 0 || c <= 0 || a + b <= c || a + c <= b || b + c <= a) {
        return { error: "Those lengths do not form a triangle." };
      }
      const cos = (a * a + b * b - c * c) / (2 * a * b);
      const angle = (Math.acos(Math.min(1, Math.max(-1, cos))) * 180) / Math.PI;
      return lines(
        [{ label: "Angle C", value: `${fmt(angle)}°` }],
        ["Angle C is opposite side c."],
      );
    },
  },
  {
    id: "logs",
    group: "math",
    title: "Logarithms",
    formula: "log_b(x) = ln x / ln b",
    blurb: "A logarithm in any base, and the exponential that undoes it.",
    fields: [num("x", "x", "32"), num("b", "Base b", "2")],
    run: (v) => {
      const g = take(v, [
        { key: "x", label: "x" },
        { key: "b", label: "the base" },
      ]);
      if (isFail(g)) return g;
      if (g.x <= 0) return { error: "The log argument has to be positive." };
      if (g.b <= 0 || g.b === 1) return { error: "The base has to be positive and not 1." };
      const value = Math.log(g.x) / Math.log(g.b);
      return lines(
        [
          { label: `log base ${fmt(g.b)}`, value: fmt(value) },
          { label: "ln", value: fmt(Math.log(g.x)) },
          { label: "log₁₀", value: fmt(Math.log10(g.x)) },
          { label: "b raised back", value: fmt(g.b ** value) },
        ],
        ["Change of base: divide the natural logs."],
      );
    },
  },
  {
    id: "growth",
    group: "math",
    title: "Growth and doubling",
    formula: "N = N₀ (1 + r)^t    or    N₀ e^{kt}",
    blurb: "Discrete percent growth, or continuous exponential growth, and the doubling time.",
    fields: [
      sel("mode", "Kind", "discrete", [
        { value: "discrete", label: "Percent per period" },
        { value: "continuous", label: "Continuous rate k" },
      ]),
      num("n0", "N₀", "100"),
      num("r", "Percent per period, or k", "8"),
      num("t", "Periods, or time", "9"),
    ],
    run: (v) => {
      const g = take(v, [
        { key: "n0", label: "N₀" },
        { key: "r", label: "the rate" },
        { key: "t", label: "the time" },
      ]);
      if (isFail(g)) return g;
      if (v.mode === "discrete") {
        const factor = 1 + g.r / 100;
        if (factor <= 0)
          return { error: "A percent of −100 or worse does not stay on this formula." };
        const n = g.n0 * factor ** g.t;
        const doubling = Math.log(2) / Math.log(factor);
        return lines(
          [
            { label: "N", value: fmt(n) },
            { label: "Doubling time", value: fmt(doubling) },
          ],
          [`Each period multiplies by ${fmt(factor)}. Doubling time is ln 2 / ln(1 + r).`],
        );
      }
      const n = g.n0 * Math.exp(g.r * g.t);
      const doubling = g.r === 0 ? Infinity : Math.log(2) / g.r;
      return lines(
        [
          { label: "N", value: fmt(n) },
          { label: "Doubling time", value: fmt(doubling) },
        ],
        ["Continuous doubling time is ln 2 / k. A negative k is a half-life of ln 2 / |k|."],
        g.r < 0 ? `Half-life ${fmt(Math.log(2) / -g.r)}.` : undefined,
      );
    },
  },
  {
    id: "counting",
    group: "math",
    title: "Combinations and binomial probability",
    formula: "C(n, k) p^k (1 − p)^{n−k}",
    blurb: "How many ways, and the chance of exactly k successes.",
    fields: [num("n", "n", "10"), num("k", "k", "3"), num("p", "Success probability p", "0.5")],
    run: (v) => {
      const g = take(v, [
        { key: "n", label: "n" },
        { key: "k", label: "k" },
        { key: "p", label: "p" },
      ]);
      if (isFail(g)) return g;
      if (!Number.isInteger(g.n) || !Number.isInteger(g.k) || g.n < 0 || g.n > 1000) {
        return { error: "n and k should be whole numbers, with n up to 1000." };
      }
      if (g.k < 0 || g.k > g.n) return { error: "k has to sit between 0 and n." };
      if (g.p < 0 || g.p > 1) return { error: "p is a probability, from 0 to 1." };
      const ways = comb(g.n, g.k);
      const perm = ways * factorialSmall(g.k);
      const prob = ways * g.p ** g.k * (1 - g.p) ** (g.n - g.k);
      return lines(
        [
          { label: "Combinations", value: fmt(ways) },
          { label: "Permutations P(n, k)", value: fmt(perm) },
          { label: "Binomial probability", value: fmt(prob) },
          { label: "Mean np", value: fmt(g.n * g.p) },
          { label: "Variance np(1−p)", value: fmt(g.n * g.p * (1 - g.p)) },
        ],
        ["Order matters for permutations and does not for combinations."],
      );
    },
  },
  {
    id: "stats",
    group: "math",
    title: "Mean, median, and spread",
    formula: "x̄ = (Σ xᵢ) / n",
    blurb: "Paste a list. Commas or spaces both work.",
    fields: [text("data", "Numbers", "2, 4, 4, 4, 5, 5, 7, 9", "2, 4, 4, 7", true)],
    run: (v) => {
      const parts = (v.data ?? "").split(/[^0-9eE.+-]+/).filter(Boolean);
      const xs = parts.map((part) => parseNum(part)).filter((n): n is number => n !== null);
      if (!xs.length) return { error: "Enter at least one number." };
      const n = xs.length;
      const sum = xs.reduce((s, x) => s + x, 0);
      const mean = sum / n;
      const sorted = [...xs].sort((a, b) => a - b);
      const mid = Math.floor(n / 2);
      const median = n % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
      const pop = xs.reduce((s, x) => s + (x - mean) ** 2, 0) / n;
      const sample = n > 1 ? xs.reduce((s, x) => s + (x - mean) ** 2, 0) / (n - 1) : NaN;
      return lines(
        [
          { label: "Count", value: String(n) },
          { label: "Mean", value: fmt(mean) },
          { label: "Median", value: fmt(median) },
          { label: "Min", value: fmt(sorted[0]) },
          { label: "Max", value: fmt(sorted[n - 1]) },
          { label: "Population σ", value: fmt(Math.sqrt(pop)) },
          { label: "Sample s", value: fmt(Math.sqrt(sample)) },
        ],
        ["The sample standard deviation divides by n − 1. The population one divides by n."],
      );
    },
  },
  {
    id: "system",
    group: "math",
    title: "2 × 2 linear system",
    formula: "a₁x + b₁y = c₁,   a₂x + b₂y = c₂",
    blurb: "Cramer’s rule for two equations.",
    fields: [
      num("a1", "a₁", "2"),
      num("b1", "b₁", "1"),
      num("c1", "c₁", "5"),
      num("a2", "a₂", "1"),
      num("b2", "b₂", "-1"),
      num("c2", "c₂", "1"),
    ],
    run: (v) => {
      const g = take(
        v,
        ["a1", "b1", "c1", "a2", "b2", "c2"].map((key) => ({ key, label: key })),
      );
      if (isFail(g)) return g;
      const det = g.a1 * g.b2 - g.a2 * g.b1;
      if (Math.abs(det) < 1e-12) {
        return { error: "The determinant is 0. The lines are parallel or the same line." };
      }
      const x = (g.c1 * g.b2 - g.c2 * g.b1) / det;
      const y = (g.a1 * g.c2 - g.a2 * g.c1) / det;
      return lines(
        [
          { label: "x", value: fmt(x) },
          { label: "y", value: fmt(y) },
          { label: "Determinant", value: fmt(det) },
        ],
        ["Replace a column with the constants, then divide by the coefficient determinant."],
      );
    },
  },
  {
    id: "matrix",
    group: "math",
    title: "2 × 2 matrix",
    formula: "det = ad − bc",
    blurb: "Determinant, inverse, and eigenvalues of a matrix with rows (a, b) and (c, d).",
    fields: [num("a", "a", "1"), num("b", "b", "2"), num("c", "c", "3"), num("d", "d", "4")],
    run: (v) => {
      const g = take(
        v,
        ["a", "b", "c", "d"].map((key) => ({ key, label: key })),
      );
      if (isFail(g)) return g;
      const det = g.a * g.d - g.b * g.c;
      const tr = g.a + g.d;
      const disc = tr * tr - 4 * det;
      const eig =
        disc < 0
          ? `${fmt(tr / 2)} ± ${fmt(Math.sqrt(-disc) / 2)} i`
          : `${fmt((tr + Math.sqrt(disc)) / 2)} and ${fmt((tr - Math.sqrt(disc)) / 2)}`;
      const result: { label: string; value: string }[] = [
        { label: "Determinant", value: fmt(det) },
        { label: "Trace", value: fmt(tr) },
        { label: "Eigenvalues", value: eig },
      ];
      if (det !== 0) {
        result.push({
          label: "Inverse",
          value: `[${fmt(g.d / det)}, ${fmt(-g.b / det)}; ${fmt(-g.c / det)}, ${fmt(g.a / det)}]`,
        });
      }
      return lines(
        result,
        det === 0
          ? ["Determinant 0: no inverse."]
          : ["Inverse is (1/det) times [[d, −b], [−c, a]]."],
      );
    },
  },
  {
    id: "vectors",
    group: "math",
    title: "Vectors",
    formula: "u · v = |u| |v| cos θ",
    blurb: "Dot product, cross product, angle, and projection. Leave z at 0 for a plane vector.",
    fields: [
      num("ux", "uₓ", "1"),
      num("uy", "uᵧ", "2"),
      num("uz", "u_z", "0"),
      num("vx", "vₓ", "2"),
      num("vy", "vᵧ", "-1"),
      num("vz", "v_z", "0"),
    ],
    run: (v) => {
      const g = take(
        v,
        ["ux", "uy", "uz", "vx", "vy", "vz"].map((key) => ({ key, label: key })),
      );
      if (isFail(g)) return g;
      const dot = g.ux * g.vx + g.uy * g.vy + g.uz * g.vz;
      const cross = [
        g.uy * g.vz - g.uz * g.vy,
        g.uz * g.vx - g.ux * g.vz,
        g.ux * g.vy - g.uy * g.vx,
      ];
      const nu = Math.hypot(g.ux, g.uy, g.uz);
      const nv = Math.hypot(g.vx, g.vy, g.vz);
      if (nu === 0 || nv === 0) return { error: "A zero vector has no direction to compare." };
      const cos = Math.min(1, Math.max(-1, dot / (nu * nv)));
      const angle = (Math.acos(cos) * 180) / Math.PI;
      const scale = dot / (nv * nv);
      return lines(
        [
          { label: "u · v", value: fmt(dot) },
          { label: "u × v", value: `(${cross.map(fmt).join(", ")})` },
          { label: "|u|", value: fmt(nu) },
          { label: "|v|", value: fmt(nv) },
          { label: "Angle", value: `${fmt(angle)}°` },
          {
            label: "Projection of u onto v",
            value: `(${[g.vx, g.vy, g.vz].map((c) => fmt(scale * c)).join(", ")})`,
          },
        ],
        ["A zero dot product means a right angle."],
      );
    },
  },
  {
    id: "modular",
    group: "math",
    title: "Modular arithmetic",
    formula: "a^k mod m,   and   a⁻¹ mod m",
    blurb: "Powers and inverses without building the huge integer.",
    fields: [num("a", "a", "3"), num("k", "Exponent k", "4"), num("m", "Modulus m", "10")],
    run: (v) => {
      const g = take(v, [
        { key: "a", label: "a" },
        { key: "k", label: "the exponent" },
        { key: "m", label: "the modulus" },
      ]);
      if (isFail(g)) return g;
      if (!Number.isInteger(g.a) || !Number.isInteger(g.k) || !Number.isInteger(g.m)) {
        return { error: "Use whole numbers." };
      }
      if (g.m <= 1 || g.m > 1e9) return { error: "Use a modulus from 2 up to a billion." };
      if (g.k < 0 || g.k > 1e7) return { error: "Use an exponent from 0 up to ten million." };
      const m = BigInt(g.m);
      let base = ((BigInt(g.a) % m) + m) % m;
      let exp = BigInt(g.k);
      let pow = 1n;
      while (exp > 0n) {
        if (exp % 2n === 1n) pow = (pow * base) % m;
        base = (base * base) % m;
        exp /= 2n;
      }
      const inv = modInverse(BigInt(g.a), m);
      return lines(
        [
          { label: `${fmt(g.a)}^${fmt(g.k)} mod ${fmt(g.m)}`, value: pow.toString() },
          { label: "Inverse of a", value: inv === null ? "none" : inv.toString() },
        ],
        ["An inverse exists only when gcd(a, m) = 1."],
      );
    },
  },
  {
    id: "complex",
    group: "math",
    title: "Complex numbers",
    formula: "e^{iθ} = cos θ + i sin θ",
    blurb: "Multiply two numbers a + bi, or convert between rectangular and polar form.",
    fields: [
      sel("mode", "Do", "mul", [
        { value: "mul", label: "Multiply (a+bi)(c+di)" },
        { value: "polar", label: "Polar from a + bi" },
        { value: "rect", label: "Rectangular from r and θ" },
      ]),
      num("a", "a or r", "0"),
      num("b", "b or θ in degrees", "90"),
      num("c", "c", "0"),
      num("d", "d", "1"),
    ],
    run: (v) => {
      const g = take(v, [
        { key: "a", label: "the first value" },
        { key: "b", label: "the second value" },
      ]);
      if (isFail(g)) return g;
      if (v.mode === "rect") {
        const rad = (g.b * Math.PI) / 180;
        return lines(
          [
            { label: "Real", value: fmt(g.a * Math.cos(rad)) },
            { label: "Imaginary", value: fmt(g.a * Math.sin(rad)) },
          ],
          ["Euler’s formula, scaled by r."],
        );
      }
      const mod = Math.hypot(g.a, g.b);
      const arg = (Math.atan2(g.b, g.a) * 180) / Math.PI;
      if (v.mode === "polar") {
        return lines(
          [
            { label: "Modulus", value: fmt(mod) },
            { label: "Argument", value: `${fmt(arg)}°` },
          ],
          ["The argument is measured from the positive real axis."],
        );
      }
      const h = take(v, [
        { key: "c", label: "c" },
        { key: "d", label: "d" },
      ]);
      if (isFail(h)) return h;
      return lines(
        [
          {
            label: "Product",
            value: `${fmt(g.a * h.c - g.b * h.d)} + ${fmt(g.a * h.d + g.b * h.c)} i`,
          },
          { label: "Modulus of the first", value: fmt(mod) },
        ],
        ["(a+bi)(c+di) = (ac − bd) + (ad + bc)i."],
      );
    },
  },
  {
    id: "normal",
    group: "math",
    title: "Normal distribution",
    formula: "z = (x − μ) / σ",
    blurb: "A z-score and the fraction of a normal population below that score.",
    fields: [num("x", "x", "186"), num("mu", "Mean μ", "170"), num("sigma", "σ", "8")],
    run: (v) => {
      const g = take(v, [
        { key: "x", label: "x" },
        { key: "mu", label: "the mean" },
        { key: "sigma", label: "σ" },
      ]);
      if (isFail(g)) return g;
      if (g.sigma <= 0) return { error: "σ has to be positive." };
      const z = (g.x - g.mu) / g.sigma;
      const below = 0.5 * (1 + erf(z / Math.SQRT2));
      return lines(
        [
          { label: "z", value: fmt(z) },
          { label: "Fraction below", value: fmt(below) },
          { label: "Fraction above", value: fmt(1 - below) },
        ],
        ["The fraction uses the standard normal curve, an idealization of the data."],
      );
    },
  },
  {
    id: "bayes",
    group: "math",
    title: "Bayes",
    formula: "P(H|+) = P(+|H) P(H) / P(+)",
    blurb: "Update a prior with a test. Enter probabilities from 0 to 1, not percents.",
    fields: [
      num("prior", "Prior P(H)", "0.001"),
      num("hit", "True positive P(+|H)", "0.99"),
      num("false", "False positive P(+|not H)", "0.05"),
    ],
    run: (v) => {
      const g = take(v, [
        { key: "prior", label: "the prior" },
        { key: "hit", label: "the true-positive rate" },
        { key: "false", label: "the false-positive rate" },
      ]);
      if (isFail(g)) return g;
      for (const n of [g.prior, g.hit, g.false]) {
        if (n < 0 || n > 1) return { error: "Each input is a probability from 0 to 1." };
      }
      const pos = g.hit * g.prior + g.false * (1 - g.prior);
      if (pos === 0) return { error: "A positive result has probability 0 under these rates." };
      const post = (g.hit * g.prior) / pos;
      return lines(
        [
          { label: "P(positive)", value: fmt(pos) },
          { label: "P(H | positive)", value: fmt(post) },
        ],
        ["Most of the positive results can still be false when the condition is rare."],
      );
    },
  },
  {
    id: "base",
    group: "math",
    title: "Base converter",
    formula: "digits in base b",
    blurb: "Rewrite a whole number in another base, from 2 through 36.",
    fields: [
      text("n", "Number", "255", "ff"),
      num("from", "From base", "10"),
      num("to", "To base", "16"),
    ],
    run: (v) => {
      const from = parseNum(v.from ?? "");
      const to = parseNum(v.to ?? "");
      if (from === null || to === null || !Number.isInteger(from) || !Number.isInteger(to)) {
        return { error: "Bases should be whole numbers." };
      }
      if (from < 2 || from > 36 || to < 2 || to > 36) return { error: "Bases run from 2 to 36." };
      const n = parseBig(v.n ?? "", from);
      if (typeof n !== "bigint") return n;
      return lines(
        [
          { label: `Base ${to}`, value: writeBig(n, to) },
          { label: "Decimal", value: n.toString() },
        ],
        ["Each digit is a power of the base, starting from the right at power 0."],
      );
    },
  },
  {
    id: "polynomial",
    group: "math",
    title: "Polynomial derivative and integral",
    formula: "d/dx x^n = n x^{n−1}",
    blurb: "Coefficients from the highest power down. 1, -3, 2 means x² − 3x + 2.",
    fields: [
      text("cs", "Coefficients", "1, -3, 2", "1, 0, -4", true),
      num("x", "Evaluate at x", "2"),
      num("a", "Integral from", "0"),
      num("b", "Integral to", "1"),
    ],
    run: (v) => {
      const cs = polyCoeffs(v.cs ?? "");
      if ("error" in cs) return cs;
      const g = take(v, [
        { key: "x", label: "x" },
        { key: "a", label: "the lower limit" },
        { key: "b", label: "the upper limit" },
      ]);
      if (isFail(g)) return g;
      const n = cs.length - 1;
      const deriv = cs.slice(0, -1).map((c, i) => c * (n - i));
      const anti = cs.map((c, i) => c / (n - i + 1));
      anti.push(0);
      let area = 0;
      cs.forEach((c, i) => {
        const p = n - i + 1;
        area += (c / p) * (g.b ** p - g.a ** p);
      });
      return lines(
        [
          { label: "Polynomial", value: polyText(cs) },
          { label: "At x", value: fmt(horner(cs, g.x)) },
          { label: "Derivative", value: polyText(deriv.length ? deriv : [0]) },
          { label: "Derivative at x", value: fmt(horner(deriv.length ? deriv : [0], g.x)) },
          { label: "Antiderivative", value: `${polyText(anti)} + C` },
          { label: "Definite integral", value: fmt(area) },
        ],
        ["Power rule in both directions. The +C disappears between two limits."],
      );
    },
  },
  {
    id: "arith-seq",
    group: "math",
    title: "Arithmetic sequence",
    formula: "aₙ = a + (n−1)d",
    blurb: "A constant difference. Returns the nth term and the sum of the first n terms.",
    fields: [num("a", "a", "5"), num("d", "d", "3"), num("n", "n", "10")],
    run: (v) => {
      const g = take(v, [
        { key: "a", label: "a" },
        { key: "d", label: "d" },
        { key: "n", label: "n" },
      ]);
      if (isFail(g)) return g;
      if (!Number.isInteger(g.n) || g.n < 1)
        return { error: "n counts terms, so it should be a positive whole number." };
      const term = g.a + (g.n - 1) * g.d;
      const sum = (g.n / 2) * (g.a + term);
      return lines(
        [
          { label: "Term", value: fmt(term) },
          { label: "Sum", value: fmt(sum) },
        ],
        [
          `The 1st term is ${fmt(g.a)}. Reaching term ${fmt(g.n)} adds the difference ${fmt(g.n - 1)} times.`,
        ],
      );
    },
  },
  {
    id: "geom-seq",
    group: "math",
    title: "Geometric sequence",
    formula: "aₙ = a rⁿ⁻¹",
    blurb:
      "A constant ratio. The infinite sum is reported only when the ratio is strictly between −1 and 1.",
    fields: [num("a", "a", "3"), num("r", "r", "2"), num("n", "n", "6")],
    run: (v) => {
      const g = take(v, [
        { key: "a", label: "a" },
        { key: "r", label: "r" },
        { key: "n", label: "n" },
      ]);
      if (isFail(g)) return g;
      if (!Number.isInteger(g.n) || g.n < 1)
        return { error: "n counts terms, so it should be a positive whole number." };
      const term = g.a * g.r ** (g.n - 1);
      const sum = g.r === 1 ? g.n * g.a : (g.a * (1 - g.r ** g.n)) / (1 - g.r);
      const out = [
        { label: "Term", value: fmt(term) },
        { label: "Sum", value: fmt(sum) },
      ];
      if (Math.abs(g.r) < 1) out.push({ label: "Infinite sum", value: fmt(g.a / (1 - g.r)) });
      return lines(
        out,
        [
          g.r === 1
            ? "The ratio is 1, so every term equals the first and the sum is n times a."
            : "The finite-sum formula divides by 1 − r, which is why r = 1 is handled apart.",
        ],
        Math.abs(g.r) >= 1
          ? "There is no finite infinite-sum at this ratio. The terms do not shrink to 0."
          : undefined,
      );
    },
  },
  {
    id: "fibonacci",
    group: "math",
    title: "Fibonacci and Lucas",
    formula: "Fₙ = Fₙ₋₁ + Fₙ₋₂",
    blurb: "Fibonacci starts 0, 1. Lucas starts 2, 1. Same addition rule after that.",
    fields: [
      sel("kind", "Sequence", "fibonacci", [
        { value: "fibonacci", label: "Fibonacci" },
        { value: "lucas", label: "Lucas" },
      ]),
      num("n", "n", "10"),
    ],
    run: (v) => {
      const g = take(v, [{ key: "n", label: "n" }]);
      if (isFail(g)) return g;
      if (!Number.isInteger(g.n) || g.n < 0 || g.n > 300) {
        return { error: "n should be a whole number from 0 to 300." };
      }
      const lucas = v.kind === "lucas";
      let prev = lucas ? 2n : 0n;
      let curr = 1n;
      if (g.n === 0) curr = prev;
      else {
        for (let i = 1; i < g.n; i += 1) {
          const next = prev + curr;
          prev = curr;
          curr = next;
        }
      }
      const name = lucas ? "L" : "F";
      const rows = [{ label: "Term", value: curr.toString() }];
      if (g.n >= 2 && g.n <= 70) {
        const earlier = g.n === 1 ? (lucas ? 2n : 0n) : prev;
        if (earlier !== 0n) {
          rows.push({ label: "Ratio", value: fmt(Number(curr) / Number(earlier)) });
        }
      }
      if (!lucas && g.n <= 70) {
        const phi = (1 + Math.sqrt(5)) / 2;
        rows.push({ label: "Nearest φⁿ/√5", value: String(Math.round(phi ** g.n / Math.sqrt(5))) });
      }
      return lines(
        rows,
        [
          lucas
            ? "L₀ = 2, L₁ = 1, and each later term is the sum of the two before it."
            : "F₀ = 0, F₁ = 1, and each later term is the sum of the two before it.",
        ],
        g.n >= 2
          ? `The ratio ${name}ₙ/${name}ₙ₋₁ approaches the golden ratio and does not equal it.`
          : undefined,
      );
    },
  },
];

function factorialSmall(k: number): number {
  let r = 1;
  for (let i = 2; i <= k; i += 1) r *= i;
  return r;
}

function modInverse(a: bigint, m: bigint): bigint | null {
  let t = 0n;
  let newt = 1n;
  let r = m;
  let newr = ((a % m) + m) % m;
  while (newr !== 0n) {
    const q = r / newr;
    [t, newt] = [newt, t - q * newt];
    [r, newr] = [newr, r - q * newr];
  }
  if (r !== 1n) return null;
  return ((t % m) + m) % m;
}

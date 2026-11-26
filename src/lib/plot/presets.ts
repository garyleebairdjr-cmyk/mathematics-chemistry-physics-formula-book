/**
 * Graph lab models. Each one is a small, honest simulation of a formula in the
 * book, with sliders for its parameters, readouts computed from them, and a
 * suggestion of what to try.
 */

export type Params = Record<string, number>;

export type Param = {
  id: string;
  /** Label, may contain simple TeX for the symbol, e.g. "\\theta". */
  tex: string;
  name: string;
  min: number;
  max: number;
  step: number;
  value: number;
  unit?: string;
};

export type Hue = "accent" | "glow" | "physics" | "chemistry" | "math" | "stats" | "muted";

export type Curve =
  | { kind: "fn"; label: string; hue: Hue; dashed?: boolean; f: (x: number, p: Params) => number }
  | {
      kind: "path";
      label: string;
      hue: Hue;
      dashed?: boolean;
      x: (t: number, p: Params) => number;
      y: (t: number, p: Params) => number;
      t: (p: Params) => [number, number];
    };

export type Mark = { x: number; y: number; label: string };

export type Preset = {
  id: string;
  title: string;
  group: "Mathematics" | "Physics" | "Statistics" | "Biology";
  tex: string;
  blurb: string;
  /** What to try with the sliders. */
  explore: string;
  chapter: string;
  params: Param[];
  view: (p: Params) => { x: [number, number]; y: [number, number] };
  xLabel: string;
  yLabel: string;
  curves: (p: Params) => Curve[];
  readouts?: (p: Params) => { label: string; value: string }[];
  marks?: (p: Params) => Mark[];
  /** Shade the area under the first curve between two values. */
  area?: (p: Params) => [number, number];
  /** Draw left Riemann rectangles under the first curve: [a, b, n]. */
  riemann?: (p: Params) => [number, number, number];
  /** Animate a dot along the first curve. */
  animate?: boolean;
};

export const fmt = (n: number, digits = 3) => {
  if (!Number.isFinite(n)) return "—";
  const abs = Math.abs(n);
  if (abs !== 0 && (abs >= 1e5 || abs < 1e-3)) return n.toExponential(2).replace("e+", "e");
  return String(Number(n.toFixed(digits)));
};

const deg = (d: number) => (d * Math.PI) / 180;

function integrate(f: (x: number) => number, a: number, b: number, n = 600): number {
  // Simpson's rule; n even.
  const h = (b - a) / n;
  let sum = f(a) + f(b);
  for (let i = 1; i < n; i += 1) sum += (i % 2 ? 4 : 2) * f(a + i * h);
  return (sum * h) / 3;
}

function factorial(n: number): number {
  let out = 1;
  for (let i = 2; i <= n; i += 1) out *= i;
  return out;
}

export const presets: Preset[] = [
  {
    id: "quadratic",
    title: "Parabola",
    group: "Mathematics",
    tex: String.raw`y = ax^2 + bx + c`,
    blurb: "Every quadratic is a parabola. a bends it, b slides the vertex sideways, c lifts it.",
    explore:
      "Make the discriminant b² − 4ac negative and watch the roots disappear: the parabola stops touching the x-axis.",
    chapter: "algebra",
    params: [
      { id: "a", tex: "a", name: "Stretch", min: -3, max: 3, step: 0.1, value: 1 },
      { id: "b", tex: "b", name: "Tilt", min: -6, max: 6, step: 0.1, value: -2 },
      { id: "c", tex: "c", name: "Lift", min: -6, max: 6, step: 0.1, value: -3 },
    ],
    view: () => ({ x: [-6, 6], y: [-8, 8] }),
    xLabel: "x",
    yLabel: "y",
    curves: () => [
      { kind: "fn", label: "y", hue: "accent", f: (x, p) => p.a * x * x + p.b * x + p.c },
    ],
    readouts: (p) => {
      const disc = p.b * p.b - 4 * p.a * p.c;
      const vx = p.a === 0 ? NaN : -p.b / (2 * p.a);
      const roots =
        p.a === 0
          ? "linear"
          : disc < 0
            ? "none (complex)"
            : disc === 0
              ? fmt(vx)
              : `${fmt((-p.b - Math.sqrt(disc)) / (2 * p.a))}, ${fmt((-p.b + Math.sqrt(disc)) / (2 * p.a))}`;
      return [
        { label: "Discriminant b² − 4ac", value: fmt(disc) },
        { label: "Vertex", value: `(${fmt(vx)}, ${fmt(p.a * vx * vx + p.b * vx + p.c)})` },
        { label: "Roots", value: roots },
      ];
    },
    marks: (p) => {
      if (p.a === 0) return [];
      const disc = p.b * p.b - 4 * p.a * p.c;
      const vx = -p.b / (2 * p.a);
      const out: Mark[] = [{ x: vx, y: p.a * vx * vx + p.b * vx + p.c, label: "vertex" }];
      if (disc >= 0) {
        out.push({ x: (-p.b - Math.sqrt(disc)) / (2 * p.a), y: 0, label: "root" });
        if (disc > 0) out.push({ x: (-p.b + Math.sqrt(disc)) / (2 * p.a), y: 0, label: "root" });
      }
      return out;
    },
  },
  {
    id: "sine",
    title: "Sine wave",
    group: "Mathematics",
    tex: String.raw`y = A\sin(Bx + C) + D`,
    blurb: "Amplitude, frequency, phase, and offset: the four dials of every wave.",
    explore:
      "Double B and count the waves: the period 2π/B halves. Then move C and watch the whole wave slide.",
    chapter: "trigonometry",
    params: [
      { id: "A", tex: "A", name: "Amplitude", min: 0, max: 4, step: 0.1, value: 2 },
      { id: "B", tex: "B", name: "Frequency", min: 0.1, max: 4, step: 0.05, value: 1 },
      { id: "C", tex: "C", name: "Phase", min: -3.14, max: 3.14, step: 0.01, value: 0 },
      { id: "D", tex: "D", name: "Offset", min: -3, max: 3, step: 0.1, value: 0 },
    ],
    view: () => ({ x: [-2 * Math.PI, 2 * Math.PI], y: [-5, 5] }),
    xLabel: "x (radians)",
    yLabel: "y",
    curves: () => [
      { kind: "fn", label: "sin x", hue: "muted", dashed: true, f: (x) => Math.sin(x) },
      { kind: "fn", label: "y", hue: "accent", f: (x, p) => p.A * Math.sin(p.B * x + p.C) + p.D },
    ],
    readouts: (p) => [
      { label: "Period 2π/B", value: fmt((2 * Math.PI) / p.B) },
      { label: "Phase shift −C/B", value: fmt(-p.C / p.B) },
      { label: "Range", value: `[${fmt(p.D - p.A)}, ${fmt(p.D + p.A)}]` },
    ],
  },
  {
    id: "exponential",
    title: "Growth and decay",
    group: "Mathematics",
    tex: String.raw`y = P\,e^{kt}`,
    blurb: "A constant percentage change per step gives an exponential. k > 0 grows, k < 0 decays.",
    explore:
      "Set k = 0.69 and read the doubling time: about 1. The rule of 70 says doubling time ≈ 70 / (percent growth).",
    chapter: "functions",
    params: [
      { id: "P", tex: "P", name: "Start", min: 0.1, max: 5, step: 0.1, value: 1 },
      { id: "k", tex: "k", name: "Rate", min: -1.5, max: 1.5, step: 0.01, value: 0.35 },
    ],
    view: () => ({ x: [0, 10], y: [0, 20] }),
    xLabel: "t",
    yLabel: "y",
    curves: () => [{ kind: "fn", label: "y", hue: "accent", f: (t, p) => p.P * Math.exp(p.k * t) }],
    readouts: (p) => [
      {
        label: p.k >= 0 ? "Doubling time ln 2 / k" : "Half-life ln 2 / |k|",
        value: p.k === 0 ? "∞" : fmt(Math.LN2 / Math.abs(p.k)),
      },
      { label: "Value at t = 5", value: fmt(p.P * Math.exp(p.k * 5)) },
    ],
  },
  {
    id: "tangent",
    title: "The derivative as a slope",
    group: "Mathematics",
    tex: String.raw`f'(a) = \lim_{h\to 0}\frac{f(a+h)-f(a)}{h}`,
    blurb:
      "The secant through two points becomes the tangent as h shrinks. Its slope is the derivative.",
    explore:
      "Drag h toward 0 and watch the secant line settle onto the tangent. At a = ±1 the slope is 0: a peak and a valley.",
    chapter: "differential-calculus",
    params: [
      { id: "a", tex: "a", name: "Point", min: -2.5, max: 2.5, step: 0.01, value: 1.6 },
      { id: "h", tex: "h", name: "Gap", min: 0.01, max: 2, step: 0.01, value: 1 },
    ],
    view: () => ({ x: [-3, 3], y: [-5, 5] }),
    xLabel: "x",
    yLabel: "y",
    curves: (p) => {
      const f = (x: number) => x ** 3 - 3 * x;
      const secant = (f(p.a + p.h) - f(p.a)) / p.h;
      const slope = 3 * p.a * p.a - 3;
      return [
        { kind: "fn", label: "f(x) = x³ − 3x", hue: "accent", f },
        {
          kind: "fn",
          label: "secant",
          hue: "glow",
          dashed: true,
          f: (x) => f(p.a) + secant * (x - p.a),
        },
        { kind: "fn", label: "tangent", hue: "physics", f: (x) => f(p.a) + slope * (x - p.a) },
      ];
    },
    readouts: (p) => {
      const f = (x: number) => x ** 3 - 3 * x;
      return [
        { label: "Secant slope", value: fmt((f(p.a + p.h) - f(p.a)) / p.h) },
        { label: "Derivative f′(a) = 3a² − 3", value: fmt(3 * p.a * p.a - 3) },
      ];
    },
    marks: (p) => {
      const f = (x: number) => x ** 3 - 3 * x;
      return [
        { x: p.a, y: f(p.a), label: "a" },
        { x: p.a + p.h, y: f(p.a + p.h), label: "a + h" },
      ];
    },
  },
  {
    id: "riemann",
    title: "Area as a sum of rectangles",
    group: "Mathematics",
    tex: String.raw`\int_a^b f(x)\,dx = \lim_{n\to\infty}\sum_{i=0}^{n-1} f(x_i)\,\Delta x`,
    blurb: "Cut the interval into n strips, add up height × width, and let the strips get thin.",
    explore: "Raise n from 4 to 60. The rectangle total closes in on the exact integral.",
    chapter: "integral-calculus",
    params: [
      { id: "a", tex: "a", name: "From", min: -1, max: 4, step: 0.1, value: 0 },
      { id: "b", tex: "b", name: "To", min: 0, max: 6, step: 0.1, value: 4 },
      { id: "n", tex: "n", name: "Strips", min: 1, max: 60, step: 1, value: 6 },
    ],
    view: () => ({ x: [-1, 6.5], y: [-0.5, 3.5] }),
    xLabel: "x",
    yLabel: "f(x)",
    curves: () => [
      { kind: "fn", label: "f(x)", hue: "accent", f: (x) => 1.5 + Math.sin(x) * 0.9 + x * 0.12 },
    ],
    riemann: (p) => [p.a, Math.max(p.a, p.b), p.n],
    readouts: (p) => {
      const f = (x: number) => 1.5 + Math.sin(x) * 0.9 + x * 0.12;
      const b = Math.max(p.a, p.b);
      const dx = (b - p.a) / p.n;
      let sum = 0;
      for (let i = 0; i < p.n; i += 1) sum += f(p.a + i * dx) * dx;
      const exact = integrate(f, p.a, b);
      return [
        { label: "Rectangle sum", value: fmt(sum, 4) },
        { label: "Exact integral", value: fmt(exact, 4) },
        { label: "Error", value: fmt(sum - exact, 4) },
      ];
    },
  },
  {
    id: "taylor",
    title: "Taylor polynomials",
    group: "Mathematics",
    tex: String.raw`\sin x \approx \sum_{k=0}^{n} \frac{(-1)^k x^{2k+1}}{(2k+1)!}`,
    blurb:
      "A polynomial that matches more and more derivatives at 0 hugs sin x over a wider stretch.",
    explore: "Add terms one at a time. Each one buys roughly another half-wave of agreement.",
    chapter: "differential-calculus",
    params: [{ id: "n", tex: "n", name: "Terms", min: 0, max: 10, step: 1, value: 2 }],
    view: () => ({ x: [-10, 10], y: [-3, 3] }),
    xLabel: "x",
    yLabel: "y",
    curves: (p) => [
      { kind: "fn", label: "sin x", hue: "muted", dashed: true, f: (x) => Math.sin(x) },
      {
        kind: "fn",
        label: `degree ${2 * p.n + 1}`,
        hue: "accent",
        f: (x) => {
          let sum = 0;
          for (let k = 0; k <= p.n; k += 1)
            sum += ((-1) ** k * x ** (2 * k + 1)) / factorial(2 * k + 1);
          return sum;
        },
      },
    ],
    readouts: (p) => [{ label: "Polynomial degree", value: String(2 * p.n + 1) }],
  },
  {
    id: "normal",
    title: "The normal curve",
    group: "Statistics",
    tex: String.raw`f(x) = \frac{1}{\sigma\sqrt{2\pi}}\,e^{-\frac{(x-\mu)^2}{2\sigma^2}}`,
    blurb:
      "The bell curve. Probability is area: the shaded region is the chance of landing between a and b.",
    explore: "Set a = μ − σ and b = μ + σ: about 68% of the area. Widen to two σ for about 95%.",
    chapter: "probability",
    params: [
      { id: "mu", tex: String.raw`\mu`, name: "Mean", min: -3, max: 3, step: 0.1, value: 0 },
      {
        id: "sigma",
        tex: String.raw`\sigma`,
        name: "Spread",
        min: 0.3,
        max: 3,
        step: 0.05,
        value: 1,
      },
      { id: "a", tex: "a", name: "From", min: -6, max: 6, step: 0.1, value: -1 },
      { id: "b", tex: "b", name: "To", min: -6, max: 6, step: 0.1, value: 1 },
    ],
    view: () => ({ x: [-6, 6], y: [-0.05, 1.0] }),
    xLabel: "x",
    yLabel: "density",
    curves: () => [
      {
        kind: "fn",
        label: "f(x)",
        hue: "accent",
        f: (x, p) =>
          Math.exp(-((x - p.mu) ** 2) / (2 * p.sigma ** 2)) / (p.sigma * Math.sqrt(2 * Math.PI)),
      },
    ],
    area: (p) => [Math.min(p.a, p.b), Math.max(p.a, p.b)],
    readouts: (p) => {
      const f = (x: number) =>
        Math.exp(-((x - p.mu) ** 2) / (2 * p.sigma ** 2)) / (p.sigma * Math.sqrt(2 * Math.PI));
      const lo = Math.min(p.a, p.b);
      const hi = Math.max(p.a, p.b);
      return [
        { label: "P(a < X < b)", value: `${fmt(integrate(f, lo, hi) * 100, 2)}%` },
        {
          label: "z-scores",
          value: `${fmt((lo - p.mu) / p.sigma, 2)} to ${fmt((hi - p.mu) / p.sigma, 2)}`,
        },
        { label: "Peak height", value: fmt(f(p.mu)) },
      ];
    },
  },
  {
    id: "projectile",
    title: "Projectile motion",
    group: "Physics",
    tex: String.raw`\begin{aligned} x &= v_0\cos\theta\,t \\ y &= h + v_0\sin\theta\,t - \tfrac12 g t^2 \end{aligned}`,
    blurb:
      "Horizontal motion at constant speed, vertical motion under constant gravity. Together: a parabola.",
    explore:
      "From the ground (h = 0), 45° gives the longest range, and 30° and 60° land at the same spot. Try the Moon: g = 1.62.",
    chapter: "mechanics",
    params: [
      {
        id: "v",
        tex: "v_0",
        name: "Launch speed",
        min: 1,
        max: 40,
        step: 0.5,
        value: 20,
        unit: "m/s",
      },
      {
        id: "theta",
        tex: String.raw`\theta`,
        name: "Angle",
        min: 0,
        max: 90,
        step: 1,
        value: 45,
        unit: "°",
      },
      { id: "h", tex: "h", name: "Height", min: 0, max: 40, step: 0.5, value: 0, unit: "m" },
      {
        id: "g",
        tex: "g",
        name: "Gravity",
        min: 1,
        max: 25,
        step: 0.01,
        value: 9.81,
        unit: "m/s²",
      },
    ],
    // Fit the flight, keeping metres equal on both axes (the plot is 10:6).
    view: (p) => {
      const vy = p.v * Math.sin(deg(p.theta));
      const range = p.v * Math.cos(deg(p.theta)) * flight(p);
      const peak = p.h + (vy * vy) / (2 * p.g);
      const span = Math.max(10, range * 1.1, (peak * 1.2) / 0.6);
      return { x: [0, span], y: [0, span * 0.6] };
    },
    xLabel: "distance (m)",
    yLabel: "height (m)",
    curves: () => [
      {
        kind: "path",
        label: "path",
        hue: "accent",
        x: (t, p) => p.v * Math.cos(deg(p.theta)) * t,
        y: (t, p) => p.h + p.v * Math.sin(deg(p.theta)) * t - 0.5 * p.g * t * t,
        t: (p) => [0, flight(p)],
      },
    ],
    animate: true,
    readouts: (p) => {
      const vy = p.v * Math.sin(deg(p.theta));
      const T = flight(p);
      return [
        { label: "Time of flight", value: `${fmt(T, 2)} s` },
        { label: "Range", value: `${fmt(p.v * Math.cos(deg(p.theta)) * T, 2)} m` },
        { label: "Peak height", value: `${fmt(p.h + (vy * vy) / (2 * p.g), 2)} m` },
      ];
    },
    marks: (p) => {
      const vy = p.v * Math.sin(deg(p.theta));
      const tp = vy / p.g;
      return [
        {
          x: p.v * Math.cos(deg(p.theta)) * tp,
          y: p.h + (vy * vy) / (2 * p.g),
          label: "peak",
        },
      ];
    },
  },
  {
    id: "oscillator",
    title: "Damped oscillator",
    group: "Physics",
    tex: String.raw`x(t) = A\,e^{-\gamma t}\cos(\omega t)`,
    blurb:
      "A spring with friction: it still swings at about ω, inside an envelope that shrinks exponentially.",
    explore: "Set γ = 0 for a perfect spring. Raise it and count how many swings survive.",
    chapter: "differential-equations",
    params: [
      { id: "A", tex: "A", name: "Amplitude", min: 0.2, max: 3, step: 0.1, value: 2, unit: "m" },
      {
        id: "gamma",
        tex: String.raw`\gamma`,
        name: "Damping",
        min: 0,
        max: 1.5,
        step: 0.01,
        value: 0.25,
        unit: "1/s",
      },
      {
        id: "omega",
        tex: String.raw`\omega`,
        name: "Angular frequency",
        min: 0.5,
        max: 8,
        step: 0.1,
        value: 3,
        unit: "rad/s",
      },
    ],
    view: () => ({ x: [0, 12], y: [-3.2, 3.2] }),
    xLabel: "time (s)",
    yLabel: "position (m)",
    curves: () => [
      {
        kind: "fn",
        label: "envelope",
        hue: "muted",
        dashed: true,
        f: (t, p) => p.A * Math.exp(-p.gamma * t),
      },
      {
        kind: "fn",
        label: "−envelope",
        hue: "muted",
        dashed: true,
        f: (t, p) => -p.A * Math.exp(-p.gamma * t),
      },
      {
        kind: "fn",
        label: "x(t)",
        hue: "accent",
        f: (t, p) => p.A * Math.exp(-p.gamma * t) * Math.cos(p.omega * t),
      },
    ],
    animate: true,
    readouts: (p) => [
      { label: "Period 2π/ω", value: `${fmt((2 * Math.PI) / p.omega, 2)} s` },
      {
        label: "Amplitude halves every",
        value: p.gamma === 0 ? "never" : `${fmt(Math.LN2 / p.gamma, 2)} s`,
      },
    ],
  },
  {
    id: "beats",
    title: "Superposition and beats",
    group: "Physics",
    tex: String.raw`y = \sin(2\pi f_1 t) + \sin(2\pi f_2 t)`,
    blurb: "Two waves of nearly the same frequency add up to a wave that swells and fades: beats.",
    explore:
      "Tuners use this: bring f₂ toward f₁ and the beats slow down, vanishing when they match.",
    chapter: "energy-waves",
    params: [
      {
        id: "f1",
        tex: "f_1",
        name: "First frequency",
        min: 1,
        max: 12,
        step: 0.1,
        value: 6,
        unit: "Hz",
      },
      {
        id: "f2",
        tex: "f_2",
        name: "Second frequency",
        min: 1,
        max: 12,
        step: 0.1,
        value: 7,
        unit: "Hz",
      },
    ],
    view: () => ({ x: [0, 3], y: [-2.4, 2.4] }),
    xLabel: "time (s)",
    yLabel: "displacement",
    curves: () => [
      {
        kind: "fn",
        label: "envelope",
        hue: "glow",
        dashed: true,
        f: (t, p) => Math.abs(2 * Math.cos(Math.PI * (p.f1 - p.f2) * t)),
      },
      {
        kind: "fn",
        label: "y",
        hue: "accent",
        f: (t, p) => Math.sin(2 * Math.PI * p.f1 * t) + Math.sin(2 * Math.PI * p.f2 * t),
      },
    ],
    readouts: (p) => [
      { label: "Beat frequency |f₁ − f₂|", value: `${fmt(Math.abs(p.f1 - p.f2), 2)} Hz` },
      { label: "Average frequency", value: `${fmt((p.f1 + p.f2) / 2, 2)} Hz` },
    ],
  },
  {
    id: "logistic",
    title: "Logistic growth",
    group: "Biology",
    tex: String.raw`N(t) = \frac{K}{1 + \frac{K - N_0}{N_0}\,e^{-rt}}`,
    blurb: "Exponential at first, then braking as it nears the carrying capacity K.",
    explore: "Find the steepest point: it is always at N = K/2, wherever you put K.",
    chapter: "populations-genetics",
    params: [
      { id: "K", tex: "K", name: "Capacity", min: 10, max: 100, step: 1, value: 80 },
      { id: "N0", tex: "N_0", name: "Start", min: 1, max: 50, step: 1, value: 4 },
      { id: "r", tex: "r", name: "Rate", min: 0.05, max: 2, step: 0.01, value: 0.6 },
    ],
    view: () => ({ x: [0, 20], y: [0, 110] }),
    xLabel: "time",
    yLabel: "population",
    curves: () => [
      { kind: "fn", label: "K", hue: "muted", dashed: true, f: (_t, p) => p.K },
      {
        kind: "fn",
        label: "exponential",
        hue: "glow",
        dashed: true,
        f: (t, p) => p.N0 * Math.exp(p.r * t),
      },
      {
        kind: "fn",
        label: "N(t)",
        hue: "accent",
        f: (t, p) => p.K / (1 + ((p.K - p.N0) / p.N0) * Math.exp(-p.r * t)),
      },
    ],
    readouts: (p) => {
      const t = p.N0 >= p.K / 2 ? 0 : Math.log((p.K - p.N0) / p.N0) / p.r;
      return [
        { label: "Fastest growth at N = K/2, time", value: fmt(t, 2) },
        { label: "Peak growth rate rK/4", value: fmt((p.r * p.K) / 4, 2) },
      ];
    },
  },
];

function flight(p: Params): number {
  const vy = p.v * Math.sin(deg(p.theta));
  return (vy + Math.sqrt(vy * vy + 2 * p.g * p.h)) / p.g;
}

export const presetById = new Map(presets.map((preset) => [preset.id, preset]));

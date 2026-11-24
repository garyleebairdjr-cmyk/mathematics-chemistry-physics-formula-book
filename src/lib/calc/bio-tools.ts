import { C } from "./const.ts";
import { fmt, isFail, take } from "./format.ts";
import { lines, num, sel, type Tool } from "./types.ts";

export const biologyTools: Tool[] = [
  {
    id: "hardy",
    group: "biology",
    title: "Hardy–Weinberg",
    formula: "p² + 2pq + q² = 1",
    blurb: "Genotype frequencies from an allele frequency, or from the recessive phenotype.",
    fields: [
      sel("mode", "Given", "q2", [
        { value: "q2", label: "Recessive phenotype frequency q²" },
        { value: "p", label: "Allele frequency p" },
        { value: "q", label: "Allele frequency q" },
      ]),
      num("x", "Value", "0.09"),
    ],
    run: (values) => {
      const g = take(values, [{ key: "x", label: "the value" }]);
      if (isFail(g)) return g;
      if (g.x < 0 || g.x > 1) return { error: "A frequency sits between 0 and 1." };
      let q = 0;
      if (values.mode === "q2") q = Math.sqrt(g.x);
      else if (values.mode === "q") q = g.x;
      else q = 1 - g.x;
      const p = 1 - q;
      return lines(
        [
          { label: "p", value: fmt(p) },
          { label: "q", value: fmt(q) },
          { label: "p² dominant homozygote", value: fmt(p * p) },
          { label: "2pq carrier", value: fmt(2 * p * q) },
          { label: "q² recessive homozygote", value: fmt(q * q) },
        ],
        [
          "This is the equilibrium under the usual assumptions: no selection, no drift, no migration, random mating.",
        ],
      );
    },
  },
  {
    id: "mm",
    group: "biology",
    title: "Michaelis–Menten",
    formula: "v = Vmax [S] / (Km + [S])",
    blurb: "Initial rate, and the fraction of Vmax. At [S] = Km the rate is half maximum.",
    fields: [num("vmax", "Vmax", "100"), num("km", "Km", "5"), num("s", "[S]", "5")],
    run: (values) => {
      const g = take(values, [
        { key: "vmax", label: "Vmax" },
        { key: "km", label: "Km" },
        { key: "s", label: "[S]" },
      ]);
      if (isFail(g)) return g;
      if (g.km + g.s === 0) return { error: "Km + [S] cannot be zero." };
      const v = (g.vmax * g.s) / (g.km + g.s);
      return lines(
        [
          { label: "v", value: fmt(v) },
          { label: "Fraction of Vmax", value: fmt(v / g.vmax) },
          {
            label: "Lineweaver–Burk 1/v",
            value: g.s === 0 ? "—" : fmt((g.km + g.s) / (g.vmax * g.s)),
          },
        ],
        ["Units of v are whatever units you used for Vmax."],
      );
    },
  },
  {
    id: "nernst-ion",
    group: "biology",
    title: "Nernst potential",
    formula: "E = (RT / zF) ln([out] / [in])",
    blurb:
      "Equilibrium potential of one ion. The defaults are a typical potassium gradient at 25 °C.",
    fields: [
      num("out", "Outside", "4", "mM"),
      num("inn", "Inside", "140", "mM"),
      num("z", "Charge z", "1"),
      num("T", "Temperature", "25", "°C"),
    ],
    run: (values) => {
      const g = take(values, [
        { key: "out", label: "the outside concentration" },
        { key: "inn", label: "the inside concentration" },
        { key: "z", label: "z" },
        { key: "T", label: "the temperature" },
      ]);
      if (isFail(g)) return g;
      if (g.out <= 0 || g.inn <= 0 || g.z === 0)
        return { error: "Concentrations must be positive, and z cannot be zero." };
      const K = g.T + 273.15;
      const volts = ((C.R * K) / (g.z * C.F)) * Math.log(g.out / g.inn);
      return lines(
        [
          { label: "E", value: `${fmt(volts * 1000)} mV` },
          { label: "E", value: `${fmt(volts)} V` },
        ],
        ["The ratio is outside over inside. Potassium’s gradient makes this negative."],
      );
    },
  },
  {
    id: "logistic",
    group: "biology",
    title: "Logistic growth",
    formula: "N(t) = K / (1 + (K/N₀ − 1) e^{−rt})",
    blurb: "The closed form, and the instantaneous rate rN(1 − N/K).",
    fields: [
      num("n0", "N₀", "20"),
      num("K", "Carrying capacity K", "100"),
      num("r", "r", "0.5"),
      num("t", "Time", "2"),
    ],
    run: (values) => {
      const g = take(values, [
        { key: "n0", label: "N₀" },
        { key: "K", label: "K" },
        { key: "r", label: "r" },
        { key: "t", label: "the time" },
      ]);
      if (isFail(g)) return g;
      if (g.n0 <= 0 || g.K <= 0) return { error: "N₀ and K have to be positive." };
      const n = g.K / (1 + (g.K / g.n0 - 1) * Math.exp(-g.r * g.t));
      const rate = g.r * n * (1 - n / g.K);
      return lines(
        [
          { label: "N(t)", value: fmt(n) },
          { label: "dN/dt at that N", value: fmt(rate) },
        ],
        ["The two constant solutions are N = 0 and N = K."],
      );
    },
  },
  {
    id: "diffusion",
    group: "biology",
    title: "Diffusion time",
    formula: "t ≈ x² / 2D",
    blurb:
      "A rough time to diffuse a distance in one dimension. D for a small molecule in water is about 10⁻⁹ m²/s.",
    fields: [num("x", "Distance", "10", "μm"), num("D", "D", "1e-9", "m²/s")],
    run: (values) => {
      const g = take(values, [
        { key: "x", label: "the distance" },
        { key: "D", label: "D" },
      ]);
      if (isFail(g)) return g;
      if (g.D <= 0) return { error: "D has to be positive." };
      const metres = g.x * 1e-6;
      const t = (metres * metres) / (2 * g.D);
      return lines(
        [
          { label: "Time", value: `${fmt(t)} s` },
          { label: "Time", value: `${fmt(t / 60)} min` },
        ],
        [
          "Distance is in micrometres. This is an order-of-magnitude clock, not a first-passage theorem.",
        ],
      );
    },
  },
];

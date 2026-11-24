import { C } from "./const.ts";
import { fmt, isFail, parseNum, take } from "./format.ts";
import { formulaMass } from "./formula.ts";
import { convert } from "./units.ts";
import { lines, num, sel, text, type Tool } from "./types.ts";

function kelvin(value: number, unit: string): number | null {
  return convert("temperature", value, unit, "K");
}

export const chemistryTools: Tool[] = [
  {
    id: "formula-mass",
    group: "chemistry",
    title: "Formula mass",
    formula: "M = Σ nᵢ Mᵢ",
    blurb:
      "Molar mass and percent composition. Parentheses and hydrates work: Ca(OH)2, CuSO4·5H2O.",
    fields: [
      text("formula", "Formula", "Ca(OH)2", "C6H12O6"),
      num("grams", "Optional sample mass", "10", "g"),
    ],
    run: (values) => {
      const parsed = formulaMass(values.formula ?? "");
      if ("error" in parsed) return parsed;
      const grams = parseNum(values.grams ?? "");
      const rows = parsed.parts.map((part) => ({
        label: part.symbol,
        value: `${fmt(part.count)} × ${fmt(part.mass / part.count)} g/mol → ${fmt((100 * part.mass) / parsed.mass)}%`,
      }));
      const out = [{ label: "Molar mass", value: `${fmt(parsed.mass)} g/mol` }, ...rows];
      const steps = ["Conventional atomic weights, not isotopic masses."];
      if (grams !== null) {
        if (grams < 0) return { error: "Mass cannot be negative." };
        out.push({ label: "Amount in that sample", value: `${fmt(grams / parsed.mass)} mol` });
        out.push({ label: "Entities", value: fmt((grams / parsed.mass) * C.NA) });
      }
      return lines(out, steps);
    },
  },
  {
    id: "moles",
    group: "chemistry",
    title: "Moles, mass, and particles",
    formula: "n = m / M",
    blurb: "Any one of mass, amount, and particle count, given the molar mass.",
    fields: [
      sel("solve", "Solve for", "n", [
        { value: "n", label: "Moles from mass" },
        { value: "m", label: "Mass from moles" },
        { value: "N", label: "Particles from moles" },
      ]),
      num("m", "Mass", "18.015", "g"),
      num("M", "Molar mass", "18.015", "g/mol"),
      num("n", "Amount", "1", "mol"),
    ],
    run: (values) => {
      const M = parseNum(values.M ?? "");
      if (M === null || M <= 0) return { error: "Enter a positive molar mass." };
      if (values.solve === "n") {
        const m = parseNum(values.m ?? "");
        if (m === null) return { error: "Enter a mass." };
        const n = m / M;
        return lines([
          { label: "Amount", value: `${fmt(n)} mol` },
          { label: "Entities", value: fmt(n * C.NA) },
        ]);
      }
      const n = parseNum(values.n ?? "");
      if (n === null) return { error: "Enter an amount in moles." };
      if (values.solve === "m") return lines([{ label: "Mass", value: `${fmt(n * M)} g` }]);
      return lines([
        { label: "Entities", value: fmt(n * C.NA) },
        { label: "Mass", value: `${fmt(n * M)} g` },
      ]);
    },
  },
  {
    id: "molarity",
    group: "chemistry",
    title: "Molarity",
    formula: "n = C V",
    blurb: "Amount, concentration, and volume. Volume may be in litres or millilitres.",
    fields: [
      sel("solve", "Solve for", "C", [
        { value: "C", label: "Concentration" },
        { value: "n", label: "Moles" },
        { value: "V", label: "Volume" },
      ]),
      num("C", "Concentration", "0.5", "mol/L"),
      num("V", "Volume", "250"),
      sel("vu", "Volume unit", "mL", [
        { value: "L", label: "L" },
        { value: "mL", label: "mL" },
      ]),
      num("n", "Amount", "0.125", "mol"),
      num("M", "Molar mass, optional", "58.44", "g/mol"),
    ],
    run: (values) => {
      const vol = () => {
        const V = parseNum(values.V ?? "");
        if (V === null) return null;
        return values.vu === "mL" ? V / 1000 : V;
      };
      const M = parseNum(values.M ?? "");
      if (values.solve === "n") {
        const C = parseNum(values.C ?? "");
        const V = vol();
        if (C === null || V === null) return { error: "Enter concentration and volume." };
        const n = C * V;
        return lines([
          { label: "Amount", value: `${fmt(n)} mol` },
          { label: "Mass", value: M && M > 0 ? `${fmt(n * M)} g` : "Add a molar mass" },
        ]);
      }
      if (values.solve === "C") {
        const n = parseNum(values.n ?? "");
        const V = vol();
        if (n === null || V === null) return { error: "Enter amount and volume." };
        if (V === 0) return { error: "Volume cannot be zero." };
        return lines([{ label: "Concentration", value: `${fmt(n / V)} mol/L` }]);
      }
      const C = parseNum(values.C ?? "");
      const n = parseNum(values.n ?? "");
      if (C === null || n === null) return { error: "Enter concentration and amount." };
      if (C === 0) return { error: "Concentration cannot be zero." };
      const litres = n / C;
      return lines([
        { label: "Volume", value: `${fmt(litres)} L` },
        { label: "Volume", value: `${fmt(litres * 1000)} mL` },
      ]);
    },
  },
  {
    id: "dilution",
    group: "chemistry",
    title: "Dilution",
    formula: "C₁V₁ = C₂V₂",
    blurb:
      "Leave exactly one of the four blank. The filled example solves for the diluted concentration.",
    fields: [
      num("c1", "C₁", "1", "mol/L"),
      num("v1", "V₁", "10", "mL"),
      num("c2", "C₂", "", "mol/L"),
      num("v2", "V₂", "250", "mL"),
    ],
    run: (values) => {
      const keys = ["c1", "v1", "c2", "v2"] as const;
      const labels: Record<string, string> = { c1: "C₁", v1: "V₁", c2: "C₂", v2: "V₂" };
      const missing = keys.filter((key) => (values[key] ?? "").trim() === "");
      if (missing.length !== 1) return { error: "Leave exactly one of C₁, V₁, C₂, V₂ blank." };
      const known = take(
        values,
        keys.filter((key) => key !== missing[0]).map((key) => ({ key, label: labels[key] })),
      );
      if (isFail(known)) return known;
      const product = (k: "c1" | "v1" | "c2" | "v2") => (k in known ? known[k] : 1);
      let value = 0;
      const blank = missing[0];
      if (blank === "c1") value = (product("c2") * product("v2")) / product("v1");
      if (blank === "v1") value = (product("c2") * product("v2")) / product("c1");
      if (blank === "c2") value = (product("c1") * product("v1")) / product("v2");
      if (blank === "v2") value = (product("c1") * product("v1")) / product("c2");
      if (!Number.isFinite(value))
        return { error: "That division is undefined. Check for a zero." };
      return lines(
        [{ label: labels[blank], value: fmt(value) }],
        ["Use the same concentration unit on both sides, and the same volume unit on both sides."],
      );
    },
  },
  {
    id: "ideal-gas",
    group: "chemistry",
    title: "Ideal gas law",
    formula: "PV = nRT",
    blurb: "Solve for pressure, volume, amount, temperature, or mass. R is 8.314462618 J/(mol·K).",
    fields: [
      sel("solve", "Solve for", "n", [
        { value: "P", label: "Pressure" },
        { value: "V", label: "Volume" },
        { value: "n", label: "Amount" },
        { value: "T", label: "Temperature" },
        { value: "m", label: "Mass" },
      ]),
      num("P", "Pressure", "1"),
      sel("pu", "Pressure unit", "atm", [
        { value: "atm", label: "atm" },
        { value: "Pa", label: "Pa" },
        { value: "kPa", label: "kPa" },
        { value: "bar", label: "bar" },
        { value: "torr", label: "Torr" },
        { value: "psi", label: "psi" },
      ]),
      num("V", "Volume", "22.4"),
      sel("vu", "Volume unit", "L", [
        { value: "L", label: "L" },
        { value: "mL", label: "mL" },
        { value: "m3", label: "m³" },
      ]),
      num("n", "Amount", "1", "mol"),
      num("T", "Temperature", "0"),
      sel("tu", "Temperature unit", "C", [
        { value: "C", label: "°C" },
        { value: "K", label: "K" },
        { value: "F", label: "°F" },
      ]),
      num("M", "Molar mass", "28.013", "g/mol"),
    ],
    run: (values) => {
      const solve = values.solve;
      const read = (key: string) => parseNum(values[key] ?? "");
      const P = read("P");
      const V = read("V");
      const nIn = read("n");
      const T = read("T");
      const M = read("M");
      if (solve !== "P" && P === null) return { error: "Enter the pressure." };
      if (solve !== "V" && V === null) return { error: "Enter the volume." };
      if (solve !== "n" && solve !== "m" && nIn === null) return { error: "Enter the amount." };
      if (solve !== "T" && T === null) return { error: "Enter the temperature." };
      if (solve === "m" && (M === null || M <= 0)) return { error: "Enter a positive molar mass." };

      const pasIn = P === null ? null : convert("pressure", P, values.pu, "Pa");
      const m3In = V === null ? null : convert("volume", V, values.vu, "m3");
      const kelIn = T === null ? null : kelvin(T, values.tu);
      if (solve !== "P" && pasIn === null) return { error: "Could not read the pressure unit." };
      if (solve !== "V" && m3In === null) return { error: "Could not read the volume unit." };
      if (solve !== "T" && kelIn === null) return { error: "Could not read the temperature." };
      if (solve !== "T" && kelIn === 0)
        return { error: "Absolute zero is not a usable temperature here." };

      let pas = pasIn ?? 0;
      let m3 = m3In ?? 0;
      let n = nIn ?? 0;
      let kel = kelIn ?? 0;

      if (solve === "n" || solve === "m") n = (pas * m3) / (C.R * kel);
      else if (solve === "P") {
        if (m3 === 0) return { error: "Volume cannot be zero." };
        pas = (n * C.R * kel) / m3;
      } else if (solve === "V") {
        if (pas === 0) return { error: "Pressure cannot be zero." };
        m3 = (n * C.R * kel) / pas;
      } else {
        if (n === 0) return { error: "Amount cannot be zero." };
        kel = (pas * m3) / (n * C.R);
      }

      const outP = convert("pressure", pas, "Pa", values.pu) ?? pas;
      const outV = convert("volume", m3, "m3", values.vu) ?? m3;
      const outT = convert("temperature", kel, "K", values.tu) ?? kel;
      const unitT = values.tu === "C" ? "°C" : values.tu === "F" ? "°F" : "K";
      const unitV = values.vu === "m3" ? "m³" : values.vu;
      const rows = [
        { label: "P", value: `${fmt(outP)} ${values.pu}` },
        { label: "V", value: `${fmt(outV)} ${unitV}` },
        { label: "n", value: `${fmt(n)} mol` },
        { label: "T", value: `${fmt(outT)} ${unitT}` },
        { label: "T", value: `${fmt(kel)} K` },
      ];
      if (M !== null && M > 0) rows.push({ label: "Mass", value: `${fmt(n * M)} g` });
      return lines(rows, [
        "Inputs are converted to pascals, cubic metres, and kelvin, then R = 8.314462618 J/(mol·K) is used.",
      ]);
    },
  },
  {
    id: "gas-density",
    group: "chemistry",
    title: "Ideal gas density",
    formula: "ρ = PM / RT",
    blurb: "Mass density of an ideal gas.",
    fields: [
      num("P", "Pressure", "1", "atm"),
      num("M", "Molar mass", "28.964", "g/mol"),
      num("T", "Temperature", "25", "°C"),
    ],
    run: (values) => {
      const g = take(values, [
        { key: "P", label: "the pressure" },
        { key: "M", label: "the molar mass" },
        { key: "T", label: "the temperature" },
      ]);
      if (isFail(g)) return g;
      const K = g.T + 273.15;
      if (K <= 0 || g.M <= 0)
        return { error: "Temperature must be above absolute zero, and molar mass positive." };
      const pas = g.P * C.atm;
      const kgmol = g.M / 1000;
      const rho = (pas * kgmol) / (C.R * K);
      return lines(
        [
          { label: "Density", value: `${fmt(rho)} kg/m³` },
          { label: "Density", value: `${fmt(rho)} g/L` },
        ],
        ["Pressure is in atmospheres and temperature in °C. 1 kg/m³ = 1 g/L."],
      );
    },
  },
  {
    id: "dalton",
    group: "chemistry",
    title: "Dalton and mole fraction",
    formula: "P = Σ Pᵢ,   Pᵢ = xᵢ P",
    blurb: "Two gases. Partial pressures, or moles that become a mole fraction.",
    fields: [
      num("p1", "Partial pressure 1", "0.8", "atm"),
      num("p2", "Partial pressure 2", "0.2", "atm"),
      num("n1", "Optional moles of gas 1", "4"),
      num("n2", "Optional moles of gas 2", "1"),
    ],
    run: (values) => {
      const p = take(values, [
        { key: "p1", label: "the first pressure" },
        { key: "p2", label: "the second pressure" },
      ]);
      if (isFail(p)) return p;
      const total = p.p1 + p.p2;
      const rows = [
        { label: "Total pressure", value: fmt(total) },
        {
          label: "Fraction from the pressures",
          value: total === 0 ? "—" : `${fmt(p.p1 / total)} and ${fmt(p.p2 / total)}`,
        },
      ];
      const n1 = parseNum(values.n1 ?? "");
      const n2 = parseNum(values.n2 ?? "");
      if (n1 !== null && n2 !== null) {
        const n = n1 + n2;
        if (n === 0) return { error: "The amounts cannot both be zero." };
        rows.push({ label: "Mole fractions", value: `${fmt(n1 / n)} and ${fmt(n2 / n)}` });
        rows.push({
          label: "Partials if total is the sum above",
          value: `${fmt((n1 / n) * total)} and ${fmt((n2 / n) * total)}`,
        });
      }
      return lines(rows, ["Dalton: the total pressure is the sum of the partial pressures."]);
    },
  },
  {
    id: "ph",
    group: "chemistry",
    title: "pH and pOH",
    formula: "pH = −log₁₀[H⁺],   pH + pOH = 14",
    blurb: "At 25 °C, where K_w is 10⁻¹⁴. Enter any one of the four.",
    fields: [
      sel("which", "Given", "ph", [
        { value: "ph", label: "pH" },
        { value: "h", label: "[H⁺] in mol/L" },
        { value: "poh", label: "pOH" },
        { value: "oh", label: "[OH⁻] in mol/L" },
      ]),
      num("x", "Value", "3"),
    ],
    run: (values) => {
      const g = take(values, [{ key: "x", label: "the value" }]);
      if (isFail(g)) return g;
      let h = 0;
      if (values.which === "ph") h = 10 ** -g.x;
      else if (values.which === "h") {
        if (g.x <= 0) return { error: "[H⁺] has to be positive." };
        h = g.x;
      } else if (values.which === "poh") h = 10 ** -(14 - g.x);
      else {
        if (g.x <= 0) return { error: "[OH⁻] has to be positive." };
        h = 1e-14 / g.x;
      }
      const ph = -Math.log10(h);
      const oh = 1e-14 / h;
      const poh = 14 - ph;
      const kind = ph < 7 ? "Acidic" : ph > 7 ? "Basic" : "Neutral";
      return lines(
        [
          { label: "pH", value: fmt(ph) },
          { label: "[H⁺]", value: `${fmt(h)} mol/L` },
          { label: "pOH", value: fmt(poh) },
          { label: "[OH⁻]", value: `${fmt(oh)} mol/L` },
          { label: "At 25 °C", value: kind },
        ],
        ["The 14 is log₁₀ of 1/K_w and moves when the temperature does."],
        h < 1e-6 && values.which === "h"
          ? "This dilute, water’s own ions are no longer a small correction."
          : undefined,
      );
    },
  },
  {
    id: "weak-acid",
    group: "chemistry",
    title: "Weak acid pH",
    formula: "[H⁺]² + Kₐ[H⁺] − KₐC = 0",
    blurb: "A monoprotic weak acid. The exact quadratic, and the √(KₐC) shortcut.",
    fields: [num("ka", "Kₐ", "1.8e-5"), num("c", "Concentration", "0.1", "mol/L")],
    run: (values) => {
      const g = take(values, [
        { key: "ka", label: "Kₐ" },
        { key: "c", label: "the concentration" },
      ]);
      if (isFail(g)) return g;
      if (g.ka <= 0 || g.c <= 0) return { error: "Kₐ and concentration have to be positive." };
      const h = (-g.ka + Math.sqrt(g.ka * g.ka + 4 * g.ka * g.c)) / 2;
      const approx = Math.sqrt(g.ka * g.c);
      return lines(
        [
          { label: "[H⁺], quadratic", value: `${fmt(h)} mol/L` },
          { label: "pH", value: fmt(-Math.log10(h)) },
          { label: "[H⁺], shortcut", value: `${fmt(approx)} mol/L` },
          { label: "C / Kₐ", value: fmt(g.c / g.ka) },
        ],
        ["The shortcut is fair when C/Kₐ is several hundred or more, and [H⁺] is well above 10⁻⁶."],
      );
    },
  },
  {
    id: "henderson",
    group: "chemistry",
    title: "Henderson–Hasselbalch",
    formula: "pH = pKₐ + log₁₀([A⁻] / [HA])",
    blurb: "A buffer. Give the two concentrations, or a ratio.",
    fields: [
      num("pka", "pKₐ", "4.76"),
      num("a", "[A⁻]", "0.1", "mol/L"),
      num("ha", "[HA]", "0.1", "mol/L"),
    ],
    run: (values) => {
      const g = take(values, [
        { key: "pka", label: "pKₐ" },
        { key: "a", label: "[A⁻]" },
        { key: "ha", label: "[HA]" },
      ]);
      if (isFail(g)) return g;
      if (g.a <= 0 || g.ha <= 0) return { error: "Both concentrations have to be positive." };
      const ph = g.pka + Math.log10(g.a / g.ha);
      return lines(
        [
          { label: "pH", value: fmt(ph) },
          { label: "Ratio [A⁻]/[HA]", value: fmt(g.a / g.ha) },
        ],
        ["Equal concentrations put the pH on the pKₐ."],
      );
    },
  },
  {
    id: "yield",
    group: "chemistry",
    title: "Percent yield",
    formula: "yield = actual / theoretical × 100%",
    blurb: "How much of the calculated product you actually isolated.",
    fields: [num("actual", "Actual mass", "8.4", "g"), num("theo", "Theoretical mass", "10", "g")],
    run: (values) => {
      const g = take(values, [
        { key: "actual", label: "the actual mass" },
        { key: "theo", label: "the theoretical mass" },
      ]);
      if (isFail(g)) return g;
      if (g.theo === 0) return { error: "Theoretical mass cannot be zero." };
      return lines([{ label: "Percent yield", value: `${fmt((100 * g.actual) / g.theo)}%` }]);
    },
  },
  {
    id: "limiting",
    group: "chemistry",
    title: "Limiting reactant",
    formula: "aA + bB → cC",
    blurb:
      "Masses, molar masses, and coefficients. The extent is limited by the smaller of n/coefficient.",
    fields: [
      num("a", "Coefficient a", "1"),
      num("b", "Coefficient b", "1"),
      num("c", "Coefficient c", "1"),
      num("ma", "Mass of A", "10", "g"),
      num("MA", "Molar mass of A", "40", "g/mol"),
      num("mb", "Mass of B", "10", "g"),
      num("MB", "Molar mass of B", "36.5", "g/mol"),
      num("MC", "Molar mass of C", "58.44", "g/mol"),
    ],
    run: (values) => {
      const g = take(
        values,
        ["a", "b", "c", "ma", "MA", "mb", "MB", "MC"].map((key) => ({ key, label: key })),
      );
      if (isFail(g)) return g;
      if (g.a <= 0 || g.b <= 0 || g.c <= 0 || g.MA <= 0 || g.MB <= 0 || g.MC <= 0) {
        return { error: "Coefficients and molar masses have to be positive." };
      }
      const nA = g.ma / g.MA;
      const nB = g.mb / g.MB;
      const extA = nA / g.a;
      const extB = nB / g.b;
      const extent = Math.min(extA, extB);
      const limiting = extA < extB ? "A" : extB < extA ? "B" : "both, in exact proportion";
      const leftoverA = nA - extent * g.a;
      const leftoverB = nB - extent * g.b;
      return lines(
        [
          { label: "Moles of A", value: fmt(nA) },
          { label: "Moles of B", value: fmt(nB) },
          { label: "Limiting", value: limiting },
          { label: "Moles of C", value: fmt(extent * g.c) },
          { label: "Theoretical mass of C", value: `${fmt(extent * g.c * g.MC)} g` },
          { label: "A left over", value: `${fmt(leftoverA * g.MA)} g` },
          { label: "B left over", value: `${fmt(leftoverB * g.MB)} g` },
        ],
        ["Divide each amount by its coefficient. The smaller quotient is the reaction extent."],
      );
    },
  },
  {
    id: "titration",
    group: "chemistry",
    title: "Titration",
    formula: "Cₐ Vₐ / a = C_b V_b / b",
    blurb:
      "Monoprotic by default: one mole of base per mole of acid. Change the ratio for other stoichiometry.",
    fields: [
      num("ca", "Acid concentration", "0.1", "mol/L"),
      num("va", "Acid volume", "25", "mL"),
      num("vb", "Base volume", "22.4", "mL"),
      num("ratio", "Moles of base per mole of acid", "1"),
    ],
    run: (values) => {
      const g = take(values, [
        { key: "ca", label: "the acid concentration" },
        { key: "va", label: "the acid volume" },
        { key: "vb", label: "the base volume" },
        { key: "ratio", label: "the ratio" },
      ]);
      if (isFail(g)) return g;
      if (g.vb === 0 || g.ratio <= 0)
        return { error: "Base volume cannot be zero, and the ratio has to be positive." };
      const cb = (g.ca * g.va * g.ratio) / g.vb;
      return lines(
        [{ label: "Base concentration", value: `${fmt(cb)} in the same unit as the acid` }],
        ["Volumes can be mL or L, as long as both are the same unit."],
      );
    },
  },
  {
    id: "equilibrium",
    group: "chemistry",
    title: "Equilibrium constant",
    formula: "K = [C]^c [D]^d / ([A]^a [B]^b)",
    blurb: "From equilibrium concentrations. A coefficient of 0 drops that species.",
    fields: [
      num("a", "a", "1"),
      num("A", "[A]", "0.2"),
      num("b", "b", "1"),
      num("B", "[B]", "0.2"),
      num("c", "c", "1"),
      num("C", "[C]", "0.6"),
      num("d", "d", "1"),
      num("D", "[D]", "0.6"),
    ],
    run: (values) => {
      const g = take(
        values,
        ["a", "A", "b", "B", "c", "C", "d", "D"].map((key) => ({ key, label: key })),
      );
      if (isFail(g)) return g;
      const term = (coeff: number, conc: number) => {
        if (coeff === 0) return 1;
        if (conc < 0) return NaN;
        if (conc === 0) return coeff > 0 ? 0 : Infinity;
        return conc ** coeff;
      };
      const nume = term(g.c, g.C) * term(g.d, g.D);
      const den = term(g.a, g.A) * term(g.b, g.B);
      if (!Number.isFinite(nume) || !Number.isFinite(den) || den === 0) {
        return { error: "A zero concentration in the denominator makes K undefined." };
      }
      return lines(
        [{ label: "K", value: fmt(nume / den) }],
        [
          "This K is in concentration units. It is K_c, not K_p, unless every species is written so that they coincide.",
        ],
      );
    },
  },
  {
    id: "gibbs",
    group: "chemistry",
    title: "Gibbs free energy",
    formula: "ΔG = ΔH − TΔS",
    blurb:
      "ΔH in kJ/mol, ΔS in J/(mol·K), temperature in °C. Also the K that belongs to this value if it is ΔG°.",
    fields: [
      num("dH", "ΔH", "-92", "kJ/mol"),
      num("dS", "ΔS", "-198", "J/(mol·K)"),
      num("T", "Temperature", "25", "°C"),
    ],
    run: (values) => {
      const g = take(values, [
        { key: "dH", label: "ΔH" },
        { key: "dS", label: "ΔS" },
        { key: "T", label: "the temperature" },
      ]);
      if (isFail(g)) return g;
      const K = g.T + 273.15;
      if (K <= 0) return { error: "Temperature is below absolute zero." };
      const dG = g.dH - K * (g.dS / 1000);
      const lnK = (-dG * 1000) / (C.R * K);
      return lines(
        [
          { label: "ΔG", value: `${fmt(dG)} kJ/mol` },
          { label: "K if this is ΔG°", value: fmt(Math.exp(lnK)) },
        ],
        [
          "ΔS is divided by 1000 so it shares kJ with ΔH.",
          "K = exp(−ΔG° / RT). The sign of ΔG says which way is downhill, not how fast.",
        ],
      );
    },
  },
  {
    id: "kinetics",
    group: "chemistry",
    title: "First-order kinetics",
    formula: "N = N₀ e^{−kt},   t½ = ln 2 / k",
    blurb: "Remaining fraction from a rate constant, or from a half-life.",
    fields: [
      sel("mode", "Given", "half", [
        { value: "half", label: "Half-life" },
        { value: "k", label: "Rate constant k" },
      ]),
      num("n0", "N₀", "1"),
      num("k", "Half-life or k", "60"),
      num("t", "Time", "90"),
    ],
    run: (values) => {
      const g = take(values, [
        { key: "n0", label: "N₀" },
        { key: "k", label: "the half-life or k" },
        { key: "t", label: "the time" },
      ]);
      if (isFail(g)) return g;
      if (g.k <= 0) return { error: "The half-life or rate constant has to be positive." };
      const rate = values.mode === "half" ? Math.LN2 / g.k : g.k;
      const half = Math.LN2 / rate;
      const n = g.n0 * Math.exp(-rate * g.t);
      return lines(
        [
          { label: "Remaining", value: fmt(n) },
          { label: "k", value: fmt(rate) },
          { label: "Half-life", value: fmt(half) },
        ],
        ["k and the time must share a unit. If the half-life is in minutes, time is in minutes."],
      );
    },
  },
  {
    id: "arrhenius",
    group: "chemistry",
    title: "Arrhenius equation",
    formula: "ln(k₂/k₁) = −Eₐ/R (1/T₂ − 1/T₁)",
    blurb: "A second rate constant from the first, two temperatures, and the activation energy.",
    fields: [
      num("k1", "k₁", "1"),
      num("t1", "T₁", "25", "°C"),
      num("t2", "T₂", "35", "°C"),
      num("ea", "Eₐ", "50", "kJ/mol"),
    ],
    run: (values) => {
      const g = take(values, [
        { key: "k1", label: "k₁" },
        { key: "t1", label: "T₁" },
        { key: "t2", label: "T₂" },
        { key: "ea", label: "Eₐ" },
      ]);
      if (isFail(g)) return g;
      const T1 = g.t1 + 273.15;
      const T2 = g.t2 + 273.15;
      if (T1 <= 0 || T2 <= 0 || g.k1 <= 0)
        return { error: "Temperatures must be above absolute zero, and k₁ positive." };
      const lnRatio = ((-g.ea * 1000) / C.R) * (1 / T2 - 1 / T1);
      const k2 = g.k1 * Math.exp(lnRatio);
      return lines(
        [
          { label: "k₂", value: fmt(k2) },
          { label: "k₂ / k₁", value: fmt(k2 / g.k1) },
        ],
        ["Temperatures are in °C and are converted to kelvin. Eₐ is in kJ/mol."],
      );
    },
  },
  {
    id: "nernst-cell",
    group: "chemistry",
    title: "Cell potential",
    formula: "ΔG = −nFE,   E = E° − (RT/nF) ln Q",
    blurb: "Standard free energy, and the Nernst potential at a stated temperature.",
    fields: [
      num("e0", "E°", "1.10", "V"),
      num("n", "Electrons n", "2"),
      num("Q", "Reaction quotient Q", "1"),
      num("T", "Temperature", "25", "°C"),
    ],
    run: (values) => {
      const g = take(values, [
        { key: "e0", label: "E°" },
        { key: "n", label: "n" },
        { key: "Q", label: "Q" },
        { key: "T", label: "the temperature" },
      ]);
      if (isFail(g)) return g;
      if (g.n <= 0 || g.Q <= 0) return { error: "n and Q have to be positive." };
      const K = g.T + 273.15;
      if (K <= 0) return { error: "Temperature is below absolute zero." };
      const dG = (-g.n * C.F * g.e0) / 1000;
      const E = g.e0 - ((C.R * K) / (g.n * C.F)) * Math.log(g.Q);
      return lines(
        [
          { label: "ΔG°", value: `${fmt(dG)} kJ/mol` },
          { label: "E", value: `${fmt(E)} V` },
          { label: "(RT/F) ln 10", value: `${fmt(((C.R * K) / C.F) * Math.LN10)} V` },
        ],
        ["At 25 °C the factor in front of log₁₀ Q is about 0.059 V, divided by n."],
      );
    },
  },
  {
    id: "electrolysis",
    group: "chemistry",
    title: "Electrolysis",
    formula: "m = (I t / F) (M / z)",
    blurb: "Mass deposited or liberated by a current. z is the electrons per formula unit.",
    fields: [
      num("I", "Current", "2", "A"),
      num("t", "Time", "30", "min"),
      num("M", "Molar mass", "63.546", "g/mol"),
      num("z", "Electrons z", "2"),
    ],
    run: (values) => {
      const g = take(values, [
        { key: "I", label: "the current" },
        { key: "t", label: "the time" },
        { key: "M", label: "the molar mass" },
        { key: "z", label: "z" },
      ]);
      if (isFail(g)) return g;
      if (g.z <= 0 || g.M <= 0) return { error: "z and the molar mass have to be positive." };
      const seconds = g.t * 60;
      const molesE = (g.I * seconds) / C.F;
      const moles = molesE / g.z;
      return lines(
        [
          { label: "Charge", value: `${fmt(g.I * seconds)} C` },
          { label: "Moles of electrons", value: fmt(molesE) },
          { label: "Moles deposited", value: fmt(moles) },
          { label: "Mass", value: `${fmt(moles * g.M)} g` },
        ],
        ["Time is entered in minutes. Faraday’s constant is 96485.3321 C/mol."],
      );
    },
  },
  {
    id: "solution-units",
    group: "chemistry",
    title: "Solution concentration",
    formula: "ppm ≈ (mol/L) × M × 1000",
    blurb:
      "Molarity, g/L, and ppm for a dilute solution whose density is about 1 g/mL. That density is the assumption, and it fails for concentrated solutions.",
    fields: [
      sel("from", "Given", "M", [
        { value: "M", label: "mol/L" },
        { value: "gL", label: "g/L" },
        { value: "ppm", label: "ppm, as mg/L" },
      ]),
      num("x", "Value", "0.1"),
      num("M", "Molar mass", "58.44", "g/mol"),
    ],
    run: (values) => {
      const g = take(values, [
        { key: "x", label: "the value" },
        { key: "M", label: "the molar mass" },
      ]);
      if (isFail(g)) return g;
      if (g.M <= 0) return { error: "Molar mass has to be positive." };
      let mol = 0;
      if (values.from === "M") mol = g.x;
      else if (values.from === "gL") mol = g.x / g.M;
      else mol = g.x / (g.M * 1000);
      const gL = mol * g.M;
      const ppm = gL * 1000;
      return lines(
        [
          { label: "mol/L", value: fmt(mol) },
          { label: "g/L", value: fmt(gL) },
          { label: "mg/L, called ppm here", value: fmt(ppm) },
        ],
        [
          "1 ppm as used on water reports means 1 mg of solute per litre, which is 1 mg/kg only when the solution density is 1 g/mL.",
        ],
      );
    },
  },
];

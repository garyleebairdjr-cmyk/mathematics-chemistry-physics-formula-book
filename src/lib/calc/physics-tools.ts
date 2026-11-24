import { C } from "./const.ts";
import { fmt, isFail, take } from "./format.ts";
import { lines, num, sel, type Tool } from "./types.ts";

const rad = (deg: number) => (deg * Math.PI) / 180;

export const physicsTools: Tool[] = [
  {
    id: "kinematics",
    group: "physics",
    title: "Constant acceleration",
    formula: "v = v₀ + at,   Δx = v₀t + ½at²",
    blurb: "Choose which three you know. Displacement starts from zero.",
    fields: [
      sel("mode", "Known", "vat", [
        { value: "vat", label: "v₀, a, t" },
        { value: "vvt", label: "v₀, v, t" },
        { value: "vva", label: "v₀, v, a" },
        { value: "vax", label: "v₀, a, Δx" },
      ]),
      num("v0", "v₀", "0", "m/s"),
      num("v", "v", "20", "m/s"),
      num("a", "a", "9.80665", "m/s²"),
      num("t", "t", "2", "s"),
      num("dx", "Δx", "10", "m"),
    ],
    run: (values) => {
      const need = (keys: string[]) =>
        take(
          values,
          keys.map((key) => ({ key, label: key })),
        );
      if (values.mode === "vat") {
        const g = need(["v0", "a", "t"]);
        if (isFail(g)) return g;
        const v = g.v0 + g.a * g.t;
        const dx = g.v0 * g.t + 0.5 * g.a * g.t * g.t;
        return lines(
          [
            { label: "v", value: `${fmt(v)} m/s` },
            { label: "Δx", value: `${fmt(dx)} m` },
          ],
          ["v = v₀ + at.", "Δx = v₀t + ½at²."],
        );
      }
      if (values.mode === "vvt") {
        const g = need(["v0", "v", "t"]);
        if (isFail(g)) return g;
        if (g.t === 0) return { error: "Time cannot be zero if you are dividing by it." };
        const a = (g.v - g.v0) / g.t;
        const dx = 0.5 * (g.v0 + g.v) * g.t;
        return lines(
          [
            { label: "a", value: `${fmt(a)} m/s²` },
            { label: "Δx", value: `${fmt(dx)} m` },
          ],
          ["Average velocity is the mean of v₀ and v when acceleration is constant."],
        );
      }
      if (values.mode === "vva") {
        const g = need(["v0", "v", "a"]);
        if (isFail(g)) return g;
        if (g.a === 0)
          return { error: "Acceleration is zero, so time is not fixed by these two velocities." };
        const t = (g.v - g.v0) / g.a;
        const dx = (g.v * g.v - g.v0 * g.v0) / (2 * g.a);
        return lines(
          [
            { label: "t", value: `${fmt(t)} s` },
            { label: "Δx", value: `${fmt(dx)} m` },
          ],
          ["v² = v₀² + 2aΔx."],
        );
      }
      const g = need(["v0", "a", "dx"]);
      if (isFail(g)) return g;
      const disc = g.v0 * g.v0 + 2 * g.a * g.dx;
      if (disc < 0) return { error: "Those values never reach that displacement." };
      const v = Math.sqrt(disc);
      return lines(
        [
          { label: "v (away from the start)", value: `${fmt(v)} m/s` },
          { label: "v (the other root)", value: `${fmt(-v)} m/s` },
          {
            label: "t for the positive root",
            value: g.a === 0 ? "—" : `${fmt((-g.v0 + v) / g.a)} s`,
          },
        ],
        ["Two roots, because a parabola can cross a height twice."],
      );
    },
  },
  {
    id: "projectile",
    group: "physics",
    title: "Level projectile",
    formula: "R = v² sin 2θ / g",
    blurb: "Launch and landing at the same height. Air resistance is ignored.",
    fields: [
      num("v", "Launch speed", "20", "m/s"),
      num("deg", "Angle", "45", "°"),
      num("g", "g", "9.80665", "m/s²"),
    ],
    run: (values) => {
      const g = take(values, [
        { key: "v", label: "the speed" },
        { key: "deg", label: "the angle" },
        { key: "g", label: "g" },
      ]);
      if (isFail(g)) return g;
      if (g.v < 0 || g.g === 0) return { error: "Speed cannot be negative, and g cannot be zero." };
      const th = rad(g.deg);
      const range = (g.v * g.v * Math.sin(2 * th)) / g.g;
      const height = (g.v * g.v * Math.sin(th) ** 2) / (2 * g.g);
      const time = (2 * g.v * Math.sin(th)) / g.g;
      return lines(
        [
          { label: "Range", value: `${fmt(range)} m` },
          { label: "Max height", value: `${fmt(height)} m` },
          { label: "Time of flight", value: `${fmt(time)} s` },
        ],
        ["The complementary angle gives the same range on level ground."],
      );
    },
  },
  {
    id: "newton",
    group: "physics",
    title: "Newton’s second law",
    formula: "F = ma",
    blurb: "Leave the unknown as the one you are solving for by picking it in the menu.",
    fields: [
      sel("solve", "Solve for", "F", [
        { value: "F", label: "Force" },
        { value: "m", label: "Mass" },
        { value: "a", label: "Acceleration" },
      ]),
      num("F", "Force", "10", "N"),
      num("m", "Mass", "2", "kg"),
      num("a", "Acceleration", "5", "m/s²"),
    ],
    run: (values) => {
      const keys =
        values.solve === "F" ? ["m", "a"] : values.solve === "m" ? ["F", "a"] : ["F", "m"];
      const g = take(
        values,
        keys.map((key) => ({ key, label: key })),
      );
      if (isFail(g)) return g;
      if (values.solve === "F") return lines([{ label: "F", value: `${fmt(g.m * g.a)} N` }]);
      if (values.solve === "m") {
        if (g.a === 0) return { error: "Acceleration is zero, so the mass is not determined." };
        return lines([{ label: "m", value: `${fmt(g.F / g.a)} kg` }]);
      }
      if (g.m === 0) return { error: "Mass cannot be zero." };
      return lines([{ label: "a", value: `${fmt(g.F / g.m)} m/s²` }]);
    },
  },
  {
    id: "weight",
    group: "physics",
    title: "Weight",
    formula: "W = mg",
    blurb: "Weight is a force. Mass does not change when g does.",
    fields: [
      num("m", "Mass", "70", "kg"),
      sel("where", "Where", "earth", [
        { value: "earth", label: "Earth, 9.80665" },
        { value: "moon", label: "Moon, 1.62" },
        { value: "mars", label: "Mars, 3.71" },
        { value: "custom", label: "Custom g" },
      ]),
      num("g", "Custom g", "9.80665", "m/s²"),
    ],
    run: (values) => {
      const g = take(values, [{ key: "m", label: "the mass" }]);
      if (isFail(g)) return g;
      const table: Record<string, number> = { earth: C.g, moon: 1.62, mars: 3.71 };
      let accel = table[values.where] ?? C.g;
      if (values.where === "custom") {
        const custom = take(values, [{ key: "g", label: "g" }]);
        if (isFail(custom)) return custom;
        accel = custom.g;
      }
      return lines(
        [
          { label: "Weight", value: `${fmt(g.m * accel)} N` },
          { label: "g used", value: `${fmt(accel)} m/s²` },
        ],
        [
          "A kilogram-force is about 9.81 N, so a person’s weight in kgf is close to their mass in kg.",
        ],
      );
    },
  },
  {
    id: "gravity",
    group: "physics",
    title: "Newton’s gravitation",
    formula: "F = G m₁ m₂ / r²",
    blurb: "Force between two point masses, and the field due to the first mass.",
    fields: [
      num("m1", "m₁", "5.9722e24", "kg"),
      num("m2", "m₂", "1", "kg"),
      num("r", "r", "6.371e6", "m"),
    ],
    run: (values) => {
      const g = take(values, [
        { key: "m1", label: "m₁" },
        { key: "m2", label: "m₂" },
        { key: "r", label: "r" },
      ]);
      if (isFail(g)) return g;
      if (g.r === 0) return { error: "The separation cannot be zero." };
      const f = (C.G * g.m1 * g.m2) / g.r ** 2;
      const field = (C.G * g.m1) / g.r ** 2;
      return lines(
        [
          { label: "Force", value: `${fmt(f)} N` },
          { label: "Field of m₁", value: `${fmt(field)} m/s²` },
        ],
        [`G = ${C.G}. The defaults are Earth and a 1 kg mass at the mean surface.`],
      );
    },
  },
  {
    id: "orbit",
    group: "physics",
    title: "Circular orbit and escape",
    formula: "v = √(GM / r),   v_esc = √2 v",
    blurb: "Speed, period, and escape speed for a circular orbit. No atmosphere.",
    fields: [
      sel("body", "Central mass", "earth", [
        { value: "earth", label: "Earth" },
        { value: "moon", label: "Moon" },
        { value: "sun", label: "Sun" },
        { value: "custom", label: "Custom mass" },
      ]),
      num("m", "Custom mass", "5.9722e24", "kg"),
      num("r", "Orbital radius", "6.371e6", "m"),
    ],
    run: (values) => {
      const radius = take(values, [{ key: "r", label: "the radius" }]);
      if (isFail(radius)) return radius;
      if (radius.r <= 0) return { error: "The radius has to be positive." };
      const preset: Record<string, number> = { earth: C.earth, moon: C.moon, sun: C.sun };
      let mass = preset[values.body];
      if (values.body === "custom" || mass === undefined) {
        const custom = take(values, [{ key: "m", label: "the mass" }]);
        if (isFail(custom)) return custom;
        mass = custom.m;
      }
      if (mass <= 0) return { error: "The mass has to be positive." };
      const v = Math.sqrt((C.G * mass) / radius.r);
      const period = (2 * Math.PI * radius.r) / v;
      return lines(
        [
          { label: "Orbital speed", value: `${fmt(v)} m/s` },
          { label: "Escape speed", value: `${fmt(v * Math.SQRT2)} m/s` },
          { label: "Period", value: `${fmt(period)} s` },
          { label: "Period", value: `${fmt(period / 3600)} h` },
          { label: "Surface-style g", value: `${fmt((C.G * mass) / radius.r ** 2)} m/s²` },
        ],
        ["Escape speed is √2 times circular speed at the same radius."],
      );
    },
  },
  {
    id: "energy",
    group: "physics",
    title: "Momentum, energy, and work",
    formula: "K = ½mv²,   W = Fd cos θ,   U = mgh",
    blurb: "Newtonian kinetic energy, plus work and gravitational potential.",
    fields: [
      num("m", "Mass", "2", "kg"),
      num("v", "Speed", "3", "m/s"),
      num("F", "Force", "10", "N"),
      num("d", "Distance", "4", "m"),
      num("deg", "Angle between F and motion", "0", "°"),
      num("h", "Height", "5", "m"),
    ],
    run: (values) => {
      const g = take(
        values,
        ["m", "v", "F", "d", "deg", "h"].map((key) => ({ key, label: key })),
      );
      if (isFail(g)) return g;
      if (g.m < 0) return { error: "Mass cannot be negative." };
      const p = g.m * g.v;
      const k = 0.5 * g.m * g.v * g.v;
      const w = g.F * g.d * Math.cos(rad(g.deg));
      const u = g.m * C.g * g.h;
      const note =
        Math.abs(g.v) > 0.1 * C.c
          ? "This speed is past 0.1c. The Newtonian kinetic energy is no longer a good approximation."
          : undefined;
      return lines(
        [
          { label: "Momentum", value: `${fmt(p)} kg·m/s` },
          { label: "Kinetic energy", value: `${fmt(k)} J` },
          { label: "Work", value: `${fmt(w)} J` },
          { label: "Potential m g h", value: `${fmt(u)} J` },
        ],
        [
          "Work uses the component of force along the displacement.",
          `g = ${C.g} m/s² for the potential.`,
        ],
        note,
      );
    },
  },
  {
    id: "centripetal",
    group: "physics",
    title: "Centripetal acceleration",
    formula: "a = v² / r",
    blurb: "The acceleration, and the force, that keep a mass on a circle.",
    fields: [
      num("m", "Mass", "1", "kg"),
      num("v", "Speed", "10", "m/s"),
      num("r", "Radius", "2", "m"),
    ],
    run: (values) => {
      const g = take(values, [
        { key: "m", label: "the mass" },
        { key: "v", label: "the speed" },
        { key: "r", label: "the radius" },
      ]);
      if (isFail(g)) return g;
      if (g.r === 0) return { error: "The radius cannot be zero." };
      const a = (g.v * g.v) / g.r;
      return lines(
        [
          { label: "Acceleration", value: `${fmt(a)} m/s²` },
          { label: "Force", value: `${fmt(g.m * a)} N` },
          { label: "Period", value: g.v === 0 ? "—" : `${fmt((2 * Math.PI * g.r) / g.v)} s` },
        ],
        ["The force points toward the center. It does not point along the motion."],
      );
    },
  },
  {
    id: "density",
    group: "physics",
    title: "Density",
    formula: "ρ = m / V",
    blurb: "Mass over volume, reported in g/cm³ and kg/m³.",
    fields: [
      num("m", "Mass", "250", "g"),
      sel("mu", "Mass unit", "g", [
        { value: "g", label: "g" },
        { value: "kg", label: "kg" },
        { value: "lb", label: "lb" },
      ]),
      num("V", "Volume", "100"),
      sel("vu", "Volume unit", "mL", [
        { value: "mL", label: "mL or cm³" },
        { value: "L", label: "L" },
        { value: "m3", label: "m³" },
      ]),
    ],
    run: (values) => {
      const g = take(values, [
        { key: "m", label: "the mass" },
        { key: "V", label: "the volume" },
      ]);
      if (isFail(g)) return g;
      if (g.V === 0) return { error: "Volume cannot be zero." };
      const kg = g.m * (values.mu === "kg" ? 1 : values.mu === "lb" ? 0.45359237 : 0.001);
      const m3 = g.V * (values.vu === "m3" ? 1 : values.vu === "L" ? 0.001 : 1e-6);
      const rho = kg / m3;
      return lines(
        [
          { label: "Density", value: `${fmt(rho)} kg/m³` },
          { label: "Density", value: `${fmt(rho / 1000)} g/cm³` },
        ],
        ["1 g/cm³ = 1000 kg/m³ = 1 kg/L."],
      );
    },
  },
  {
    id: "pressure",
    group: "physics",
    title: "Pressure",
    formula: "P = F/A,   ΔP = ρgh",
    blurb: "Force on an area, and the gauge pressure under a fluid column.",
    fields: [
      num("F", "Force", "101325", "N"),
      num("A", "Area", "1", "m²"),
      num("rho", "Fluid density", "1000", "kg/m³"),
      num("h", "Depth", "10", "m"),
    ],
    run: (values) => {
      const g = take(values, [
        { key: "F", label: "the force" },
        { key: "A", label: "the area" },
        { key: "rho", label: "the density" },
        { key: "h", label: "the depth" },
      ]);
      if (isFail(g)) return g;
      if (g.A === 0) return { error: "Area cannot be zero." };
      const p = g.F / g.A;
      const hydro = g.rho * C.g * g.h;
      return lines(
        [
          { label: "P = F/A", value: `${fmt(p)} Pa` },
          { label: "P = F/A", value: `${fmt(p / C.atm)} atm` },
          { label: "Gauge ρgh", value: `${fmt(hydro)} Pa` },
          { label: "Absolute, if the top is 1 atm", value: `${fmt((hydro + C.atm) / C.atm)} atm` },
        ],
        ["ρgh is the extra pressure under the surface, not the absolute pressure."],
      );
    },
  },
  {
    id: "heat",
    group: "physics",
    title: "Sensible heat",
    formula: "Q = mcΔT",
    blurb: "Heat to change temperature, with no phase change.",
    fields: [
      num("m", "Mass", "0.2", "kg"),
      sel("c", "Material", "water", [
        { value: "water", label: "Water, 4184" },
        { value: "ice", label: "Ice, 2100" },
        { value: "al", label: "Aluminum, 900" },
        { value: "fe", label: "Iron, 450" },
        { value: "cu", label: "Copper, 385" },
        { value: "air", label: "Dry air, 1005" },
        { value: "custom", label: "Custom c" },
      ]),
      num("cc", "Custom c", "4184", "J/(kg·K)"),
      num("dT", "ΔT", "10", "K or °C"),
    ],
    run: (values) => {
      const g = take(values, [
        { key: "m", label: "the mass" },
        { key: "dT", label: "ΔT" },
      ]);
      if (isFail(g)) return g;
      const table: Record<string, number> = {
        water: 4184,
        ice: 2100,
        al: 900,
        fe: 450,
        cu: 385,
        air: 1005,
      };
      let c = table[values.c] ?? 4184;
      if (values.c === "custom") {
        const custom = take(values, [{ key: "cc", label: "c" }]);
        if (isFail(custom)) return custom;
        c = custom.cc;
      }
      const q = g.m * c * g.dT;
      return lines(
        [
          { label: "Q", value: `${fmt(q)} J` },
          { label: "Q", value: `${fmt(q / 4184)} kcal` },
          { label: "c used", value: `${fmt(c)} J/(kg·K)` },
        ],
        ["A temperature difference in °C equals the same difference in K."],
      );
    },
  },
  {
    id: "wave",
    group: "physics",
    title: "Wave speed",
    formula: "v = fλ",
    blurb: "Frequency, wavelength, and speed. Leave the unknown to the menu.",
    fields: [
      sel("solve", "Solve for", "v", [
        { value: "v", label: "Speed" },
        { value: "f", label: "Frequency" },
        { value: "l", label: "Wavelength" },
      ]),
      num("v", "Speed", "343", "m/s"),
      num("f", "Frequency", "440", "Hz"),
      num("l", "Wavelength", "0.78", "m"),
    ],
    run: (values) => {
      if (values.solve === "v") {
        const g = take(values, [
          { key: "f", label: "frequency" },
          { key: "l", label: "wavelength" },
        ]);
        if (isFail(g)) return g;
        return lines([
          { label: "Speed", value: `${fmt(g.f * g.l)} m/s` },
          { label: "Period", value: g.f === 0 ? "—" : `${fmt(1 / g.f)} s` },
        ]);
      }
      if (values.solve === "f") {
        const g = take(values, [
          { key: "v", label: "speed" },
          { key: "l", label: "wavelength" },
        ]);
        if (isFail(g)) return g;
        if (g.l === 0) return { error: "Wavelength cannot be zero." };
        return lines([{ label: "Frequency", value: `${fmt(g.v / g.l)} Hz` }]);
      }
      const g = take(values, [
        { key: "v", label: "speed" },
        { key: "f", label: "frequency" },
      ]);
      if (isFail(g)) return g;
      if (g.f === 0) return { error: "Frequency cannot be zero." };
      return lines([{ label: "Wavelength", value: `${fmt(g.v / g.f)} m` }]);
    },
  },
  {
    id: "string-wave",
    group: "physics",
    title: "Wave on a string",
    formula: "v = √(T / μ)",
    blurb: "Speed from tension and linear density.",
    fields: [num("T", "Tension", "100", "N"), num("mu", "Linear density μ", "0.01", "kg/m")],
    run: (values) => {
      const g = take(values, [
        { key: "T", label: "the tension" },
        { key: "mu", label: "μ" },
      ]);
      if (isFail(g)) return g;
      if (g.mu <= 0 || g.T < 0)
        return { error: "μ has to be positive, and tension cannot be negative." };
      return lines([{ label: "Speed", value: `${fmt(Math.sqrt(g.T / g.mu))} m/s` }]);
    },
  },
  {
    id: "pendulum",
    group: "physics",
    title: "Simple pendulum",
    formula: "T = 2π √(L / g)",
    blurb: "Small-angle period. The mass does not appear.",
    fields: [num("L", "Length", "1", "m"), num("g", "g", "9.80665", "m/s²")],
    run: (values) => {
      const g = take(values, [
        { key: "L", label: "the length" },
        { key: "g", label: "g" },
      ]);
      if (isFail(g)) return g;
      if (g.L < 0 || g.g <= 0)
        return { error: "Length cannot be negative, and g has to be positive." };
      const period = 2 * Math.PI * Math.sqrt(g.L / g.g);
      return lines(
        [
          { label: "Period", value: `${fmt(period)} s` },
          { label: "Frequency", value: `${fmt(1 / period)} Hz` },
        ],
        ["This is the small-angle result. A large swing is a little slower."],
      );
    },
  },
  {
    id: "ohm",
    group: "physics",
    title: "Ohm’s law and power",
    formula: "V = IR,   P = IV",
    blurb: "Two of voltage, current, and resistance determine the third and the power.",
    fields: [
      sel("solve", "Solve for", "V", [
        { value: "V", label: "Voltage" },
        { value: "I", label: "Current" },
        { value: "R", label: "Resistance" },
      ]),
      num("V", "Voltage", "12", "V"),
      num("I", "Current", "0.5", "A"),
      num("R", "Resistance", "24", "Ω"),
    ],
    run: (values) => {
      const keys =
        values.solve === "V" ? ["I", "R"] : values.solve === "I" ? ["V", "R"] : ["V", "I"];
      const g = take(
        values,
        keys.map((key) => ({ key, label: key })),
      );
      if (isFail(g)) return g;
      let V = 0;
      let I = 0;
      let R = 0;
      if (values.solve === "V") {
        I = g.I;
        R = g.R;
        V = I * R;
      } else if (values.solve === "I") {
        if (g.R === 0) return { error: "Resistance is zero." };
        V = g.V;
        R = g.R;
        I = V / R;
      } else {
        if (g.I === 0)
          return { error: "Current is zero, so resistance is not determined this way." };
        V = g.V;
        I = g.I;
        R = V / I;
      }
      return lines(
        [
          { label: "Voltage", value: `${fmt(V)} V` },
          { label: "Current", value: `${fmt(I)} A` },
          { label: "Resistance", value: `${fmt(R)} Ω` },
          { label: "Power", value: `${fmt(V * I)} W` },
        ],
        ["P = IV = I²R = V²/R, when R is not zero."],
      );
    },
  },
  {
    id: "resistors",
    group: "physics",
    title: "Two resistors",
    formula: "R_s = R₁ + R₂,   1/R_p = 1/R₁ + 1/R₂",
    blurb: "Series and parallel equivalents, and the current if you apply a voltage.",
    fields: [
      num("r1", "R₁", "100", "Ω"),
      num("r2", "R₂", "300", "Ω"),
      num("V", "Applied voltage", "12", "V"),
    ],
    run: (values) => {
      const g = take(values, [
        { key: "r1", label: "R₁" },
        { key: "r2", label: "R₂" },
        { key: "V", label: "the voltage" },
      ]);
      if (isFail(g)) return g;
      if (g.r1 === 0 || g.r2 === 0) return { error: "A zero resistance shorts a parallel pair." };
      const series = g.r1 + g.r2;
      const parallel = 1 / (1 / g.r1 + 1 / g.r2);
      return lines(
        [
          { label: "Series", value: `${fmt(series)} Ω` },
          { label: "Parallel", value: `${fmt(parallel)} Ω` },
          { label: "Series current", value: `${fmt(g.V / series)} A` },
          { label: "Parallel current", value: `${fmt(g.V / parallel)} A` },
        ],
        ["The parallel equivalent is smaller than either resistor."],
      );
    },
  },
  {
    id: "coulomb",
    group: "physics",
    title: "Coulomb’s law",
    formula: "F = k q₁ q₂ / r²",
    blurb: "Force between two point charges. A positive result is repulsion.",
    fields: [num("q1", "q₁", "1", "μC"), num("q2", "q₂", "2", "μC"), num("r", "r", "0.1", "m")],
    run: (values) => {
      const g = take(values, [
        { key: "q1", label: "q₁" },
        { key: "q2", label: "q₂" },
        { key: "r", label: "r" },
      ]);
      if (isFail(g)) return g;
      if (g.r === 0) return { error: "The separation cannot be zero." };
      const f = (C.ke * g.q1 * 1e-6 * g.q2 * 1e-6) / g.r ** 2;
      return lines(
        [
          { label: "Force", value: `${fmt(f)} N` },
          { label: "Direction", value: f > 0 ? "Repulsion" : f < 0 ? "Attraction" : "Zero" },
        ],
        ["Charges are entered in microcoulombs. Opposite signs attract."],
      );
    },
  },
  {
    id: "magnetic",
    group: "physics",
    title: "Magnetic force",
    formula: "F = |q| v B sin θ",
    blurb: "Force on a charge moving in a magnetic field. θ is the angle between v and B.",
    fields: [
      num("q", "Charge", "1.602e-19", "C"),
      num("v", "Speed", "1e6", "m/s"),
      num("B", "Field", "0.5", "T"),
      num("deg", "Angle", "90", "°"),
    ],
    run: (values) => {
      const g = take(
        values,
        ["q", "v", "B", "deg"].map((key) => ({ key, label: key })),
      );
      if (isFail(g)) return g;
      const f = Math.abs(g.q) * g.v * g.B * Math.sin(rad(g.deg));
      return lines(
        [{ label: "Force", value: `${fmt(f)} N` }],
        ["The force is perpendicular to both v and B, so it does no work."],
      );
    },
  },
  {
    id: "snell",
    group: "physics",
    title: "Snell’s law",
    formula: "n₁ sin θ₁ = n₂ sin θ₂",
    blurb: "The transmitted angle, and the critical angle when one exists.",
    fields: [num("n1", "n₁", "1.5"), num("th", "θ₁", "30", "°"), num("n2", "n₂", "1")],
    run: (values) => {
      const g = take(values, [
        { key: "n1", label: "n₁" },
        { key: "th", label: "θ₁" },
        { key: "n2", label: "n₂" },
      ]);
      if (isFail(g)) return g;
      if (g.n1 <= 0 || g.n2 <= 0) return { error: "Indexes have to be positive." };
      const s = (g.n1 / g.n2) * Math.sin(rad(g.th));
      const critical = g.n1 > g.n2 ? (Math.asin(g.n2 / g.n1) * 180) / Math.PI : null;
      if (Math.abs(s) > 1) {
        return lines(
          [
            { label: "Refraction", value: "Total internal reflection" },
            { label: "Critical angle", value: critical === null ? "none" : `${fmt(critical)}°` },
          ],
          ["The sine of the transmitted angle would have to exceed 1."],
        );
      }
      return lines(
        [
          { label: "θ₂", value: `${fmt((Math.asin(s) * 180) / Math.PI)}°` },
          {
            label: "Critical angle",
            value: critical === null ? "none, going into a higher index" : `${fmt(critical)}°`,
          },
        ],
        ["Angles are measured from the normal, not from the surface."],
      );
    },
  },
  {
    id: "photon",
    group: "physics",
    title: "Photon energy",
    formula: "E = hc / λ",
    blurb: "Energy, frequency, and wavelength of one photon.",
    fields: [
      sel("mode", "Given", "nm", [
        { value: "nm", label: "Wavelength in nm" },
        { value: "eV", label: "Energy in eV" },
      ]),
      num("x", "Value", "500"),
    ],
    run: (values) => {
      const g = take(values, [{ key: "x", label: "the value" }]);
      if (isFail(g)) return g;
      if (g.x <= 0) return { error: "Use a positive value." };
      const hc = C.h * C.c;
      const lambda = values.mode === "nm" ? g.x * 1e-9 : hc / (g.x * C.e);
      const eJ = hc / lambda;
      const eV = eJ / C.e;
      return lines(
        [
          { label: "Energy", value: `${fmt(eV)} eV` },
          { label: "Energy", value: `${fmt(eJ)} J` },
          { label: "Frequency", value: `${fmt(C.c / lambda)} Hz` },
          { label: "Wavelength", value: `${fmt(lambda * 1e9)} nm` },
        ],
        ["Visible light sits roughly between 380 and 750 nm, about 1.6 to 3.3 eV."],
      );
    },
  },
  {
    id: "photoelectric",
    group: "physics",
    title: "Photoelectric effect",
    formula: "K_max = hf − φ",
    blurb: "Maximum kinetic energy of a photoelectron. φ is the work function.",
    fields: [num("nm", "Wavelength", "400", "nm"), num("phi", "Work function", "2.3", "eV")],
    run: (values) => {
      const g = take(values, [
        { key: "nm", label: "the wavelength" },
        { key: "phi", label: "the work function" },
      ]);
      if (isFail(g)) return g;
      if (g.nm <= 0) return { error: "Wavelength has to be positive." };
      const eV = (C.h * C.c) / (g.nm * 1e-9) / C.e;
      const k = eV - g.phi;
      const threshold = (C.h * C.c) / (g.phi * C.e) / 1e-9;
      if (k <= 0) {
        return lines(
          [
            { label: "Photon", value: `${fmt(eV)} eV` },
            { label: "Electrons", value: "None. The photon is below the work function." },
            { label: "Threshold wavelength", value: `${fmt(threshold)} nm` },
          ],
          ["A brighter beam does not fix a photon that is too red."],
        );
      }
      return lines(
        [
          { label: "Photon", value: `${fmt(eV)} eV` },
          { label: "K max", value: `${fmt(k)} eV` },
          { label: "Threshold wavelength", value: `${fmt(threshold)} nm` },
        ],
        ["Energy left after paying the work function becomes kinetic energy."],
      );
    },
  },
  {
    id: "debroglie",
    group: "physics",
    title: "De Broglie wavelength",
    formula: "λ = h / p",
    blurb: "A mass and a speed, or a non-relativistic electron with a kinetic energy.",
    fields: [
      sel("mode", "Given", "electron", [
        { value: "electron", label: "Electron kinetic energy" },
        { value: "mv", label: "Mass and speed" },
      ]),
      num("ke", "Kinetic energy", "100", "eV"),
      num("m", "Mass", "9.109e-31", "kg"),
      num("v", "Speed", "1e6", "m/s"),
    ],
    run: (values) => {
      if (values.mode === "mv") {
        const g = take(values, [
          { key: "m", label: "the mass" },
          { key: "v", label: "the speed" },
        ]);
        if (isFail(g)) return g;
        if (g.m <= 0 || g.v === 0)
          return { error: "Mass has to be positive and speed cannot be zero." };
        const lambda = C.h / (g.m * Math.abs(g.v));
        return lines([
          { label: "Wavelength", value: `${fmt(lambda)} m` },
          { label: "Wavelength", value: `${fmt(lambda * 1e9)} nm` },
        ]);
      }
      const g = take(values, [{ key: "ke", label: "the kinetic energy" }]);
      if (isFail(g)) return g;
      if (g.ke <= 0) return { error: "Kinetic energy has to be positive." };
      const joule = g.ke * C.e;
      const p = Math.sqrt(2 * C.me * joule);
      const lambda = C.h / p;
      return lines(
        [
          { label: "Momentum", value: `${fmt(p)} kg·m/s` },
          { label: "Wavelength", value: `${fmt(lambda)} m` },
          { label: "Wavelength", value: `${fmt(lambda * 1e12)} pm` },
        ],
        ["Non-relativistic: p = √(2mK)."],
        g.ke > 10000
          ? "Above about 10 keV, a relativistic momentum is the better formula."
          : undefined,
      );
    },
  },
  {
    id: "dilation",
    group: "physics",
    title: "Time dilation",
    formula: "γ = 1 / √(1 − v²/c²)",
    blurb: "Lorentz factor, dilated time, and contracted length.",
    fields: [
      num("v", "Speed", "0.8", "fraction of c"),
      num("t", "Proper time", "1", "s"),
      num("L", "Proper length", "1", "m"),
    ],
    run: (values) => {
      const g = take(values, [
        { key: "v", label: "the speed" },
        { key: "t", label: "the proper time" },
        { key: "L", label: "the proper length" },
      ]);
      if (isFail(g)) return g;
      const beta = Math.abs(g.v);
      if (beta >= 1) return { error: "A massive clock cannot reach c. Enter a fraction below 1." };
      const gamma = 1 / Math.sqrt(1 - beta * beta);
      return lines(
        [
          { label: "β", value: fmt(beta) },
          { label: "γ", value: fmt(gamma) },
          { label: "Coordinate time", value: `${fmt(gamma * g.t)} s` },
          { label: "Contracted length", value: `${fmt(g.L / gamma)} m` },
          { label: "Speed", value: `${fmt(beta * C.c)} m/s` },
        ],
        [
          "Proper time is the time in the clock’s own rest frame. Proper length is the length in the object’s rest frame.",
        ],
      );
    },
  },
  {
    id: "mass-energy",
    group: "physics",
    title: "Mass–energy",
    formula: "E = mc²",
    blurb: "Rest energy. One atomic mass unit is about 931.5 MeV.",
    fields: [
      num("m", "Mass", "1"),
      sel("unit", "Mass unit", "u", [
        { value: "kg", label: "kg" },
        { value: "g", label: "g" },
        { value: "u", label: "u" },
      ]),
    ],
    run: (values) => {
      const g = take(values, [{ key: "m", label: "the mass" }]);
      if (isFail(g)) return g;
      if (g.m < 0) return { error: "Mass cannot be negative." };
      const kg = g.m * (values.unit === "kg" ? 1 : values.unit === "g" ? 0.001 : C.u);
      const joule = kg * C.c * C.c;
      return lines(
        [
          { label: "Rest energy", value: `${fmt(joule)} J` },
          { label: "Rest energy", value: `${fmt(joule / C.e / 1e6)} MeV` },
          { label: "Rest energy", value: `${fmt(joule / 3.6e6)} kWh` },
        ],
        ["This is the rest energy, not the kinetic energy."],
      );
    },
  },
  {
    id: "decay",
    group: "physics",
    title: "Radioactive decay",
    formula: "N = N₀ 2^{−t / t½}",
    blurb: "Remaining amount after a given time, and the decay constant.",
    fields: [
      num("n0", "N₀", "1000"),
      num("half", "Half-life", "5730"),
      num("t", "Elapsed time", "5730"),
    ],
    run: (values) => {
      const g = take(values, [
        { key: "n0", label: "N₀" },
        { key: "half", label: "the half-life" },
        { key: "t", label: "the elapsed time" },
      ]);
      if (isFail(g)) return g;
      if (g.half <= 0) return { error: "The half-life has to be positive." };
      const n = g.n0 * 2 ** (-g.t / g.half);
      const k = Math.LN2 / g.half;
      return lines(
        [
          { label: "Remaining", value: fmt(n) },
          { label: "Fraction left", value: fmt(n / g.n0) },
          { label: "Decay constant", value: `${fmt(k)} per unit time` },
        ],
        [
          "Use the same time unit for the half-life and the elapsed time. The defaults are one carbon-14 half-life.",
        ],
      );
    },
  },
  {
    id: "doppler",
    group: "physics",
    title: "Doppler effect, sound",
    formula: "f′ = f (v ± v_o) / (v ± v_s)",
    blurb:
      "Toward the other raises the pitch. Numerator: plus if the observer moves toward the source. Denominator: minus if the source moves toward the observer.",
    fields: [
      num("f", "Source frequency", "440", "Hz"),
      num("v", "Wave speed", "343", "m/s"),
      num("vo", "Observer speed", "0", "m/s"),
      sel("odir", "Observer moves", "still", [
        { value: "toward", label: "Toward the source" },
        { value: "away", label: "Away from the source" },
        { value: "still", label: "Not at all" },
      ]),
      num("vs", "Source speed", "30", "m/s"),
      sel("sdir", "Source moves", "toward", [
        { value: "toward", label: "Toward the observer" },
        { value: "away", label: "Away from the observer" },
        { value: "still", label: "Not at all" },
      ]),
    ],
    run: (values) => {
      const g = take(values, [
        { key: "f", label: "the frequency" },
        { key: "v", label: "the wave speed" },
        { key: "vo", label: "the observer speed" },
        { key: "vs", label: "the source speed" },
      ]);
      if (isFail(g)) return g;
      if (g.v <= 0) return { error: "Wave speed has to be positive." };
      const vo = values.odir === "still" ? 0 : g.vo;
      const vs = values.sdir === "still" ? 0 : g.vs;
      const nume = g.v + (values.odir === "toward" ? vo : values.odir === "away" ? -vo : 0);
      const den = g.v + (values.sdir === "toward" ? -vs : values.sdir === "away" ? vs : 0);
      if (den <= 0)
        return {
          error: "The source is at or above the wave speed, so this formula does not apply.",
        };
      if (nume < 0) return { error: "The observer is outrunning the wave." };
      return lines(
        [
          { label: "Heard frequency", value: `${fmt((g.f * nume) / den)} Hz` },
          { label: "Shift", value: `${fmt((g.f * nume) / den - g.f)} Hz` },
        ],
        ["This is the classical sound formula. Light uses a different one."],
      );
    },
  },
];

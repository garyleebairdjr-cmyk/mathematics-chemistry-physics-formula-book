import { C } from "./const.ts";
import { fmt, isFail, take } from "./format.ts";
import { lines, num, sel, type Tool } from "./types.ts";

const mu0over2pi = 2e-7;

export const lawTools: Tool[] = [
  {
    id: "hooke",
    group: "physics",
    title: "Hooke’s law",
    formula: "F = kx",
    blurb:
      "Magnitude of the spring force in the linear range. The restoring direction is toward equilibrium.",
    fields: [num("k", "k", "200", "N/m"), num("x", "x", "0.05", "m")],
    run: (values) => {
      const g = take(values, [
        { key: "k", label: "k" },
        { key: "x", label: "x" },
      ]);
      if (isFail(g)) return g;
      return lines(
        [{ label: "Force", value: `${fmt(Math.abs(g.k * g.x))} N` }],
        [
          "The force points opposite the displacement. This is only the straight part of the spring’s curve.",
        ],
      );
    },
  },
  {
    id: "friction",
    group: "physics",
    title: "Kinetic friction",
    formula: "f = μ N",
    blurb: "Sliding friction. Static friction is at most μₛN, and it is usually less.",
    fields: [num("mu", "μ", "0.2"), num("N", "N", "50", "N")],
    run: (values) => {
      const g = take(values, [
        { key: "mu", label: "μ" },
        { key: "N", label: "N" },
      ]);
      if (isFail(g)) return g;
      if (g.N < 0) return { error: "A normal force is a magnitude here. Enter it as positive." };
      return lines(
        [{ label: "Friction", value: `${fmt(g.mu * g.N)} N` }],
        [
          "Opposes the sliding. The coefficient is a property of the pair of surfaces, not of one object.",
        ],
      );
    },
  },
  {
    id: "impulse",
    group: "physics",
    title: "Impulse",
    formula: "J = F Δt = Δp",
    blurb: "Average force over a time interval, and the velocity change if you also give a mass.",
    fields: [num("F", "F", "5", "N"), num("dt", "Δt", "0.2", "s"), num("m", "Mass", "0.5", "kg")],
    run: (values) => {
      const g = take(values, [
        { key: "F", label: "F" },
        { key: "dt", label: "Δt" },
        { key: "m", label: "the mass" },
      ]);
      if (isFail(g)) return g;
      if (g.m <= 0) return { error: "Mass has to be positive." };
      const J = g.F * g.dt;
      return lines(
        [
          { label: "Impulse", value: `${fmt(J)} N·s` },
          { label: "Δv", value: `${fmt(J / g.m)} m/s` },
        ],
        [
          "Impulse and momentum change are the same quantity. Divide by mass to get the velocity change.",
        ],
      );
    },
  },
  {
    id: "kepler",
    group: "physics",
    title: "Kepler’s third law",
    formula: "T² / a³ = 4π² / GM",
    blurb:
      "Period or semimajor axis for a small body around a much heavier one. The default is Earth around the Sun.",
    fields: [
      sel("solve", "Solve for", "T", [
        { value: "T", label: "Period" },
        { value: "a", label: "Semimajor axis" },
      ]),
      num("a", "a", "1.496e11", "m"),
      num("T", "T", "365.25", "days"),
      num("M", "M", String(C.sun), "kg"),
    ],
    run: (values) => {
      const mass = take(values, [{ key: "M", label: "M" }]);
      if (isFail(mass)) return mass;
      if (mass.M <= 0) return { error: "The central mass has to be positive." };
      if (values.solve === "a") {
        const period = take(values, [{ key: "T", label: "T" }]);
        if (isFail(period)) return period;
        if (period.T <= 0) return { error: "The period has to be positive." };
        const seconds = period.T * 86400;
        const a = Math.cbrt((seconds ** 2 * C.G * mass.M) / (4 * Math.PI ** 2));
        return lines(
          [{ label: "a", value: `${fmt(a)} m` }],
          ["T was read in days and converted to seconds before using SI."],
        );
      }
      const axis = take(values, [{ key: "a", label: "a" }]);
      if (isFail(axis)) return axis;
      if (axis.a <= 0) return { error: "The semimajor axis has to be positive." };
      const seconds = 2 * Math.PI * Math.sqrt(axis.a ** 3 / (C.G * mass.M));
      return lines(
        [
          { label: "Period", value: `${fmt(seconds)} s` },
          { label: "Period", value: `${fmt(seconds / 86400)} days` },
        ],
        ["This is the two-body form with one body much lighter than M."],
      );
    },
  },
  {
    id: "archimedes",
    group: "physics",
    title: "Archimedes’ principle",
    formula: "F_b = ρ V g",
    blurb:
      "Weight of the displaced fluid. Give the object’s mass as well if you want to know whether it floats.",
    fields: [
      num("rho", "ρ fluid", "1000", "kg/m³"),
      num("V", "V displaced", "0.01", "m³"),
      num("m", "Object mass", "6", "kg"),
      num("g", "g", "9.8", "m/s²"),
    ],
    run: (values) => {
      const g = take(values, [
        { key: "rho", label: "the fluid density" },
        { key: "V", label: "the displaced volume" },
        { key: "m", label: "the object mass" },
        { key: "g", label: "g" },
      ]);
      if (isFail(g)) return g;
      if (g.V < 0 || g.rho < 0)
        return { error: "Density and displaced volume should be positive." };
      const buoyant = g.rho * g.V * g.g;
      const weight = g.m * g.g;
      return lines(
        [
          { label: "Buoyant force", value: `${fmt(buoyant)} N` },
          { label: "Weight", value: `${fmt(weight)} N` },
          { label: "Net, up", value: `${fmt(buoyant - weight)} N` },
        ],
        ["Positive net means the object accelerates upward while that volume stays displaced."],
      );
    },
  },
  {
    id: "fluids",
    group: "physics",
    title: "Continuity and Bernoulli",
    formula: "A₁v₁ = A₂v₂,   P + ρgh + ½ρv²",
    blurb:
      "Incompressible flow. Bernoulli here assumes steady, nonviscous flow along one streamline.",
    fields: [
      num("A1", "A₁", "0.004", "m²"),
      num("v1", "v₁", "2", "m/s"),
      num("A2", "A₂", "0.001", "m²"),
      num("P1", "P₁", "101300", "Pa"),
      num("rho", "ρ", "1000", "kg/m³"),
      num("h", "h₁ − h₂", "0", "m"),
    ],
    run: (values) => {
      const g = take(values, [
        { key: "A1", label: "A₁" },
        { key: "v1", label: "v₁" },
        { key: "A2", label: "A₂" },
        { key: "P1", label: "P₁" },
        { key: "rho", label: "ρ" },
        { key: "h", label: "the height drop" },
      ]);
      if (isFail(g)) return g;
      if (g.A2 === 0) return { error: "The downstream area cannot be zero." };
      const v2 = (g.A1 * g.v1) / g.A2;
      const P2 = g.P1 + g.rho * C.g * g.h + 0.5 * g.rho * (g.v1 ** 2 - v2 ** 2);
      return lines(
        [
          { label: "v₂", value: `${fmt(v2)} m/s` },
          { label: "P₂", value: `${fmt(P2)} Pa` },
        ],
        [
          "h₁ − h₂ positive means the fluid has dropped, which raises the downstream pressure if the speeds were equal.",
        ],
      );
    },
  },
  {
    id: "lens",
    group: "physics",
    title: "Thin lens",
    formula: "1/f = 1/dₒ + 1/dᵢ",
    blurb:
      "Converging lenses have positive f. A real object has positive dₒ. A positive dᵢ is a real image on the far side.",
    fields: [num("f", "f", "0.1", "m"), num("doo", "dₒ", "0.3", "m")],
    run: (values) => {
      const g = take(values, [
        { key: "f", label: "f" },
        { key: "doo", label: "dₒ" },
      ]);
      if (isFail(g)) return g;
      if (g.doo === 0) return { error: "The object distance cannot be zero." };
      const inv = 1 / g.f - 1 / g.doo;
      if (inv === 0) {
        return lines(
          [{ label: "Image", value: "At infinity" }],
          ["The object is in the focal plane, so the outgoing rays are parallel."],
        );
      }
      const di = 1 / inv;
      return lines(
        [
          { label: "dᵢ", value: `${fmt(di)} m` },
          { label: "Magnification", value: fmt(-di / g.doo) },
        ],
        [
          "Negative magnification means the image is inverted. Negative dᵢ means a virtual image on the object’s side.",
        ],
      );
    },
  },
  {
    id: "stefan",
    group: "physics",
    title: "Stefan–Boltzmann",
    formula: "P = εσA(T⁴ − Tₛ⁴)",
    blurb: "Net radiated power. Both temperatures are kelvin, not Celsius.",
    fields: [
      num("A", "Area", "1", "m²"),
      num("T", "T", "1000", "K"),
      num("Ts", "T surroundings", "0", "K"),
      num("eps", "ε", "1"),
    ],
    run: (values) => {
      const g = take(values, [
        { key: "A", label: "the area" },
        { key: "T", label: "T" },
        { key: "Ts", label: "the surroundings" },
        { key: "eps", label: "ε" },
      ]);
      if (isFail(g)) return g;
      if (g.T < 0 || g.Ts < 0)
        return {
          error: "Temperature in this law is absolute. Negative kelvin is not a temperature.",
        };
      if (g.eps < 0 || g.eps > 1) return { error: "Emissivity lies between 0 and 1." };
      const power = g.eps * C.sigma * g.A * (g.T ** 4 - g.Ts ** 4);
      return lines(
        [{ label: "Net power", value: `${fmt(power)} W` }],
        ["Positive means the surface loses energy. σ = 5.670374419×10⁻⁸ W·m⁻²·K⁻⁴."],
      );
    },
  },
  {
    id: "wien",
    group: "physics",
    title: "Wien’s law",
    formula: "λ_max T = b",
    blurb: "Peak wavelength of a blackbody. Temperature in kelvin.",
    fields: [num("T", "T", "5800", "K")],
    run: (values) => {
      const g = take(values, [{ key: "T", label: "T" }]);
      if (isFail(g)) return g;
      if (g.T <= 0) return { error: "Temperature has to be a positive number of kelvin." };
      const lambda = C.wien / g.T;
      return lines(
        [
          { label: "λ_max", value: `${fmt(lambda)} m` },
          { label: "λ_max", value: `${fmt(lambda * 1e9)} nm` },
        ],
        ["b = 2.897771955×10⁻³ m·K. The Sun is only approximately a 5800 K blackbody."],
      );
    },
  },
  {
    id: "cooling",
    group: "physics",
    title: "Newton’s law of cooling",
    formula: "T = T_env + (T₀ − T_env) e^{−kt}",
    blurb: "Exponential approach to the room. k and t must share a time unit.",
    fields: [
      num("T0", "T₀", "80"),
      num("Tenv", "T surroundings", "20"),
      num("k", "k", "0.1", "1/time"),
      num("t", "t", "10"),
    ],
    run: (values) => {
      const g = take(values, [
        { key: "T0", label: "T₀" },
        { key: "Tenv", label: "the surroundings" },
        { key: "k", label: "k" },
        { key: "t", label: "t" },
      ]);
      if (isFail(g)) return g;
      const T = g.Tenv + (g.T0 - g.Tenv) * Math.exp(-g.k * g.t);
      return lines(
        [{ label: "Temperature", value: fmt(T) }],
        [
          "The unit of temperature is whatever unit you used for both temperatures. k is not universal.",
        ],
      );
    },
  },
  {
    id: "capacitor",
    group: "physics",
    title: "Capacitor",
    formula: "Q = CV,   U = ½CV²",
    blurb: "Charge and stored energy. Enter C in the unit you select.",
    fields: [
      num("C", "C", "100"),
      sel("cu", "C unit", "uF", [
        { value: "F", label: "F" },
        { value: "uF", label: "μF" },
        { value: "nF", label: "nF" },
        { value: "pF", label: "pF" },
      ]),
      num("V", "V", "12", "V"),
    ],
    run: (values) => {
      const g = take(values, [
        { key: "C", label: "C" },
        { key: "V", label: "V" },
      ]);
      if (isFail(g)) return g;
      const scale =
        values.cu === "uF" ? 1e-6 : values.cu === "nF" ? 1e-9 : values.cu === "pF" ? 1e-12 : 1;
      const C = g.C * scale;
      return lines(
        [
          { label: "Charge", value: `${fmt(C * g.V)} C` },
          { label: "Energy", value: `${fmt(0.5 * C * g.V * g.V)} J` },
        ],
        ["V here is the potential difference, not a volume and not a speed."],
      );
    },
  },
  {
    id: "wire-field",
    group: "physics",
    title: "Field of a long wire",
    formula: "B = μ₀ I / (2πr)",
    blurb: "Steady current in a long straight wire. The field circles the wire.",
    fields: [num("I", "I", "10", "A"), num("r", "r", "0.02", "m")],
    run: (values) => {
      const g = take(values, [
        { key: "I", label: "I" },
        { key: "r", label: "r" },
      ]);
      if (isFail(g)) return g;
      if (g.r <= 0) return { error: "The distance from the wire has to be positive." };
      const B = (mu0over2pi * g.I) / g.r;
      return lines(
        [{ label: "B", value: `${fmt(B)} T` }],
        ["μ₀ is taken as 4π×10⁻⁷ N/A². The direction is azimuthal, given by the right-hand rule."],
      );
    },
  },
  {
    id: "transformer",
    group: "physics",
    title: "Ideal transformer",
    formula: "Vₛ / Vₚ = Nₛ / Nₚ",
    blurb:
      "Voltage follows the turns. Current, if you enter a primary current, follows the inverse so the power matches.",
    fields: [
      num("Vp", "Vₚ", "120", "V"),
      num("Np", "Nₚ", "600"),
      num("Ns", "Nₛ", "60"),
      num("Ip", "Iₚ", "0.5", "A"),
    ],
    run: (values) => {
      const g = take(values, [
        { key: "Vp", label: "Vₚ" },
        { key: "Np", label: "Nₚ" },
        { key: "Ns", label: "Nₛ" },
        { key: "Ip", label: "Iₚ" },
      ]);
      if (isFail(g)) return g;
      if (g.Np === 0 || g.Ns === 0) return { error: "A winding needs a nonzero number of turns." };
      const Vs = g.Vp * (g.Ns / g.Np);
      const Is = g.Ip * (g.Np / g.Ns);
      return lines(
        [
          { label: "Vₛ", value: `${fmt(Vs)} V` },
          { label: "Iₛ", value: `${fmt(Is)} A` },
        ],
        ["Ideal: no resistance, no leakage. Real transformers deliver less."],
      );
    },
  },
  {
    id: "bohr",
    group: "physics",
    title: "Bohr level",
    formula: "Eₙ = −13.6 eV / n²",
    blurb:
      "Hydrogen energy levels in the Bohr model. 13.6 eV is the conventional rounding of 13.598 eV.",
    fields: [num("n", "n", "2")],
    run: (values) => {
      const g = take(values, [{ key: "n", label: "n" }]);
      if (isFail(g)) return g;
      if (!Number.isInteger(g.n) || g.n < 1 || g.n > 100)
        return { error: "n is a positive integer, and this tool stops at 100." };
      const eV = -13.6 / g.n ** 2;
      return lines(
        [{ label: "Energy", value: `${fmt(eV)} eV` }],
        [
          "Relative to a free electron at rest. The orbits themselves are not what the electron does.",
        ],
      );
    },
  },
  {
    id: "rydberg",
    group: "physics",
    title: "Rydberg formula",
    formula: "1/λ = R (1/n₁² − 1/n₂²)",
    blurb: "Hydrogen line for a drop from n₂ to n₁. The Balmer series has n₁ = 2.",
    fields: [num("n1", "n₁", "2"), num("n2", "n₂", "3")],
    run: (values) => {
      const g = take(values, [
        { key: "n1", label: "n₁" },
        { key: "n2", label: "n₂" },
      ]);
      if (isFail(g)) return g;
      if (!Number.isInteger(g.n1) || !Number.isInteger(g.n2) || g.n1 < 1 || g.n2 <= g.n1) {
        return { error: "n₁ and n₂ are positive integers, and n₂ is the upper level." };
      }
      const inv = C.rydberg * (1 / g.n1 ** 2 - 1 / g.n2 ** 2);
      const lambda = 1 / inv;
      return lines(
        [
          { label: "λ", value: `${fmt(lambda)} m` },
          { label: "λ", value: `${fmt(lambda * 1e9)} nm` },
        ],
        ["R = 1.097373156816×10⁷ m⁻¹, the hydrogen Rydberg constant used here."],
      );
    },
  },
  {
    id: "heisenberg",
    group: "physics",
    title: "Heisenberg minimum",
    formula: "Δx Δp ≥ ℏ/2",
    blurb:
      "The smallest momentum spread allowed by a given position spread. This is not a model of a clumsy measurement.",
    fields: [num("dx", "Δx", "1e-10", "m")],
    run: (values) => {
      const g = take(values, [{ key: "dx", label: "Δx" }]);
      if (isFail(g)) return g;
      if (g.dx <= 0) return { error: "The position spread has to be positive." };
      const dp = C.hbar / (2 * g.dx);
      return lines(
        [{ label: "Minimum Δp", value: `${fmt(dp)} kg·m/s` }],
        [
          "ℏ = 1.054571817×10⁻³⁴ J·s. A real preparation can be, and usually is, less sharp than this bound.",
        ],
      );
    },
  },
  {
    id: "bragg",
    group: "physics",
    title: "Bragg’s law",
    formula: "nλ = 2d sin θ",
    blurb:
      "Glancing angle of a diffraction order. θ is measured from the plane, not from the normal.",
    fields: [num("n", "n", "1"), num("lambda", "λ", "0.154", "nm"), num("d", "d", "0.2", "nm")],
    run: (values) => {
      const g = take(values, [
        { key: "n", label: "n" },
        { key: "lambda", label: "λ" },
        { key: "d", label: "d" },
      ]);
      if (isFail(g)) return g;
      if (!Number.isInteger(g.n) || g.n < 1) return { error: "The order n is a positive integer." };
      if (g.d <= 0 || g.lambda <= 0)
        return { error: "Wavelength and spacing have to be positive." };
      const s = (g.n * g.lambda) / (2 * g.d);
      if (s > 1) return { error: "nλ is larger than 2d, so this order does not diffract." };
      const theta = (Math.asin(s) * 180) / Math.PI;
      return lines(
        [{ label: "θ", value: `${fmt(theta)}°` }],
        [
          "Both λ and d were read in the same unit, so the ratio does not care which unit that was.",
        ],
      );
    },
  },
  {
    id: "hubble",
    group: "physics",
    title: "Hubble’s law",
    formula: "v = H₀ d",
    blurb:
      "Recession speed from distance. The default H₀ is a round midpoint, not a settled measurement.",
    fields: [num("d", "Distance", "10", "Mpc"), num("H0", "H₀", "70", "km/s/Mpc")],
    run: (values) => {
      const g = take(values, [
        { key: "d", label: "the distance" },
        { key: "H0", label: "H₀" },
      ]);
      if (isFail(g)) return g;
      return lines(
        [{ label: "Recession speed", value: `${fmt(g.H0 * g.d)} km/s` }],
        [
          "Local estimates of H₀ sit near 73 km/s/Mpc. CMB inferences under ΛCDM sit near 67. The tool multiplies the number you type.",
        ],
      );
    },
  },
  {
    id: "rotation",
    group: "physics",
    title: "Torque and angular acceleration",
    formula: "τ = r F sin θ,   α = τ / I",
    blurb: "Torque of one force, and the angular acceleration if that torque is the net torque.",
    fields: [
      num("r", "r", "0.3", "m"),
      num("F", "F", "20", "N"),
      num("deg", "θ", "90", "°"),
      num("I", "I", "0.2", "kg·m²"),
    ],
    run: (values) => {
      const g = take(values, [
        { key: "r", label: "r" },
        { key: "F", label: "F" },
        { key: "deg", label: "θ" },
        { key: "I", label: "I" },
      ]);
      if (isFail(g)) return g;
      if (g.I <= 0) return { error: "The moment of inertia has to be positive." };
      const tau = g.r * g.F * Math.sin((g.deg * Math.PI) / 180);
      return lines(
        [
          { label: "Torque", value: `${fmt(tau)} N·m` },
          { label: "α", value: `${fmt(tau / g.I)} rad/s²` },
        ],
        [
          "θ is the angle between the position vector and the force. α assumes this torque is the net torque.",
        ],
      );
    },
  },
  {
    id: "angular",
    group: "physics",
    title: "Angular momentum",
    formula: "L = I ω",
    blurb: "Spin angular momentum, and the new spin if the inertia changes while L is conserved.",
    fields: [
      num("I", "I", "2", "kg·m²"),
      num("w", "ω", "2", "rad/s"),
      num("I2", "I after", "1", "kg·m²"),
    ],
    run: (values) => {
      const g = take(values, [
        { key: "I", label: "I" },
        { key: "w", label: "ω" },
        { key: "I2", label: "the later inertia" },
      ]);
      if (isFail(g)) return g;
      if (g.I <= 0 || g.I2 <= 0) return { error: "A moment of inertia has to be positive." };
      const L = g.I * g.w;
      return lines(
        [
          { label: "L", value: `${fmt(L)} kg·m²/s` },
          { label: "ω after", value: `${fmt(L / g.I2)} rad/s` },
        ],
        [
          "The second spin assumes no external torque. Kinetic energy is not conserved when the body pulls itself in.",
        ],
      );
    },
  },
  {
    id: "pascal",
    group: "physics",
    title: "Hydraulic press",
    formula: "F₁ / A₁ = F₂ / A₂",
    blurb: "Pascal’s law for two pistons on one static fluid, ignoring a height difference.",
    fields: [
      num("F1", "F₁", "10", "N"),
      num("A1", "A₁", "0.0002", "m²"),
      num("A2", "A₂", "0.002", "m²"),
    ],
    run: (values) => {
      const g = take(values, [
        { key: "F1", label: "F₁" },
        { key: "A1", label: "A₁" },
        { key: "A2", label: "A₂" },
      ]);
      if (isFail(g)) return g;
      if (g.A1 <= 0 || g.A2 <= 0) return { error: "Both areas have to be positive." };
      const P = g.F1 / g.A1;
      return lines(
        [
          { label: "Pressure", value: `${fmt(P)} Pa` },
          { label: "F₂", value: `${fmt(P * g.A2)} N` },
        ],
        ["A height difference between the pistons adds ρgh, which this tool leaves out."],
      );
    },
  },
  {
    id: "stokes",
    group: "physics",
    title: "Stokes’ drag",
    formula: "F = 6 π η r v",
    blurb: "Laminar drag on a sphere. The Reynolds number should be small.",
    fields: [
      num("eta", "η", "0.001", "Pa·s"),
      num("r", "r", "0.001", "m"),
      num("v", "v", "0.02", "m/s"),
    ],
    run: (values) => {
      const g = take(values, [
        { key: "eta", label: "η" },
        { key: "r", label: "r" },
        { key: "v", label: "v" },
      ]);
      if (isFail(g)) return g;
      if (g.r < 0 || g.eta < 0) return { error: "Radius and viscosity should be positive." };
      return lines(
        [{ label: "Drag", value: `${fmt(6 * Math.PI * g.eta * g.r * g.v)} N` }],
        [
          "Opposes the motion. A fast sphere, or air at ordinary speeds, is usually outside this law.",
        ],
      );
    },
  },
  {
    id: "poiseuille",
    group: "physics",
    title: "Poiseuille flow",
    formula: "Q = π r⁴ ΔP / (8 η L)",
    blurb: "Laminar volume flow in a straight round pipe.",
    fields: [
      num("r", "r", "0.001", "m"),
      num("dP", "ΔP", "100", "Pa"),
      num("eta", "η", "0.001", "Pa·s"),
      num("L", "L", "0.1", "m"),
    ],
    run: (values) => {
      const g = take(values, [
        { key: "r", label: "r" },
        { key: "dP", label: "ΔP" },
        { key: "eta", label: "η" },
        { key: "L", label: "L" },
      ]);
      if (isFail(g)) return g;
      if (g.r < 0 || g.eta <= 0 || g.L <= 0)
        return { error: "Radius should be positive, and viscosity and length cannot be zero." };
      const Q = (Math.PI * g.r ** 4 * g.dP) / (8 * g.eta * g.L);
      return lines(
        [{ label: "Flow", value: `${fmt(Q)} m³/s` }],
        [
          "The radius is to the fourth power. This is laminar flow of a Newtonian fluid, not blood in an artery and not a turbulent pipe.",
        ],
      );
    },
  },
  {
    id: "torricelli",
    group: "physics",
    title: "Torricelli efflux",
    formula: "v = √(2 g h)",
    blurb: "Ideal speed out of a hole a depth h below the surface of a large tank.",
    fields: [num("h", "h", "5", "m"), num("g", "g", "9.8", "m/s²")],
    run: (values) => {
      const g = take(values, [
        { key: "h", label: "h" },
        { key: "g", label: "g" },
      ]);
      if (isFail(g)) return g;
      if (g.h < 0 || g.g <= 0)
        return { error: "Depth should be positive, and g has to be positive." };
      return lines(
        [{ label: "Speed", value: `${fmt(Math.sqrt(2 * g.g * g.h))} m/s` }],
        [
          "Same speed as free fall through the height h. Viscosity and a falling surface both change it.",
        ],
      );
    },
  },
  {
    id: "carnot",
    group: "physics",
    title: "Carnot efficiency",
    formula: "η = 1 − T_C / T_H",
    blurb: "Highest efficiency of a heat engine between two absolute temperatures.",
    fields: [num("Th", "T hot", "600", "K"), num("Tc", "T cold", "300", "K")],
    run: (values) => {
      const g = take(values, [
        { key: "Th", label: "the hot temperature" },
        { key: "Tc", label: "the cold temperature" },
      ]);
      if (isFail(g)) return g;
      if (g.Th <= 0 || g.Tc < 0)
        return { error: "Temperatures are kelvin. The hot reservoir has to be above zero." };
      if (g.Tc > g.Th)
        return { error: "The cold reservoir is warmer than the hot one. Swap them." };
      const eta = 1 - g.Tc / g.Th;
      return lines(
        [{ label: "Efficiency", value: `${fmt(eta * 100)} %` }],
        ["No engine between these two reservoirs does better. Celsius will not do: 0 °C is 273 K."],
      );
    },
  },
  {
    id: "fourier",
    group: "physics",
    title: "Fourier conduction",
    formula: "P = k A ΔT / L",
    blurb: "Heat current through a slab. It flows toward the colder face.",
    fields: [
      num("k", "k", "0.8", "W/(m·K)"),
      num("A", "Area", "2", "m²"),
      num("dT", "ΔT", "20", "K"),
      num("L", "Thickness", "0.01", "m"),
    ],
    run: (values) => {
      const g = take(values, [
        { key: "k", label: "k" },
        { key: "A", label: "the area" },
        { key: "dT", label: "ΔT" },
        { key: "L", label: "the thickness" },
      ]);
      if (isFail(g)) return g;
      if (g.L <= 0) return { error: "The thickness has to be positive." };
      return lines(
        [{ label: "Heat current", value: `${fmt((g.k * g.A * g.dT) / g.L)} W` }],
        [
          "k is the material’s conductivity. ΔT is a difference, so kelvin and Celsius degrees match.",
        ],
      );
    },
  },
  {
    id: "planck",
    group: "physics",
    title: "Planck’s law",
    formula: "B_λ(T) = 2hc²/λ⁵ / (e^{hc/λkT} − 1)",
    blurb:
      "Blackbody spectral radiance per wavelength. Wavelength in nanometres, temperature in kelvin.",
    fields: [num("lambda", "λ", "500", "nm"), num("T", "T", "5800", "K")],
    run: (values) => {
      const g = take(values, [
        { key: "lambda", label: "λ" },
        { key: "T", label: "T" },
      ]);
      if (isFail(g)) return g;
      if (g.lambda <= 0 || g.T <= 0)
        return {
          error: "Wavelength and temperature have to be positive, and temperature is kelvin.",
        };
      const lambda = g.lambda * 1e-9;
      const c2 = (C.h * C.c) / C.kB;
      const x = c2 / (lambda * g.T);
      const denom = x > 700 ? Infinity : Math.expm1(x);
      const B = (2 * C.h * C.c ** 2) / lambda ** 5 / denom;
      return lines(
        [
          { label: "B_λ", value: `${fmt(B)} W/m²/sr/m` },
          { label: "Per nm", value: `${fmt(B * 1e-9)} W/m²/sr/nm` },
        ],
        [
          "This is the wavelength form. Integrating it over wavelength and a hemisphere recovers σT⁴.",
        ],
      );
    },
  },
  {
    id: "curie",
    group: "physics",
    title: "Curie’s law",
    formula: "χ = C / T",
    blurb: "Paramagnetic susceptibility at high temperature. C is the material’s Curie constant.",
    fields: [num("C", "C", "0.1", "K"), num("T", "T", "300", "K")],
    run: (values) => {
      const g = take(values, [
        { key: "C", label: "C" },
        { key: "T", label: "T" },
      ]);
      if (isFail(g)) return g;
      if (g.T <= 0) return { error: "Temperature has to be a positive number of kelvin." };
      return lines(
        [{ label: "χ", value: fmt(g.C / g.T) }],
        [
          "Not valid for a ferromagnet below its Curie temperature. C here is not capacitance and not the speed of light.",
        ],
      );
    },
  },
  {
    id: "ampere-force",
    group: "physics",
    title: "Force between wires",
    formula: "F/L = μ₀ I₁ I₂ / (2π d)",
    blurb:
      "Force per length on each of two long parallel wires. Same direction of current means attraction.",
    fields: [num("I1", "I₁", "1", "A"), num("I2", "I₂", "1", "A"), num("d", "d", "1", "m")],
    run: (values) => {
      const g = take(values, [
        { key: "I1", label: "I₁" },
        { key: "I2", label: "I₂" },
        { key: "d", label: "d" },
      ]);
      if (isFail(g)) return g;
      if (g.d <= 0) return { error: "The separation has to be positive." };
      const f = (mu0over2pi * g.I1 * g.I2) / g.d;
      return lines(
        [{ label: "Force per length", value: `${fmt(Math.abs(f))} N/m` }],
        ["The magnitude is shown. Currents of the same sign attract; opposite currents repel."],
      );
    },
  },
  {
    id: "malus",
    group: "physics",
    title: "Malus’s law",
    formula: "I = I₀ cos² θ",
    blurb: "Intensity through a perfect polarizer. The incident light is already polarized.",
    fields: [num("I0", "I₀", "8", "W/m²"), num("deg", "θ", "60", "°")],
    run: (values) => {
      const g = take(values, [
        { key: "I0", label: "I₀" },
        { key: "deg", label: "θ" },
      ]);
      if (isFail(g)) return g;
      const I = g.I0 * Math.cos((g.deg * Math.PI) / 180) ** 2;
      return lines(
        [{ label: "Intensity", value: `${fmt(I)} W/m²` }],
        [
          "θ is from the polarizer’s axis. Unpolarized light through the first polarizer is half, and Malus starts after that.",
        ],
      );
    },
  },
  {
    id: "brewster",
    group: "physics",
    title: "Brewster’s angle",
    formula: "tan θ_B = n₂ / n₁",
    blurb: "Incidence angle, from the normal, for fully polarized reflection.",
    fields: [num("n1", "n₁", "1"), num("n2", "n₂", "1.5")],
    run: (values) => {
      const g = take(values, [
        { key: "n1", label: "n₁" },
        { key: "n2", label: "n₂" },
      ]);
      if (isFail(g)) return g;
      if (g.n1 <= 0 || g.n2 <= 0) return { error: "Both indices have to be positive." };
      const theta = (Math.atan(g.n2 / g.n1) * 180) / Math.PI;
      return lines(
        [{ label: "θ_B", value: `${fmt(theta)}°` }],
        [
          "n₂ is the medium the light is entering. The angle is from the normal, not from the surface.",
        ],
      );
    },
  },
  {
    id: "doppler-light",
    group: "physics",
    title: "Relativistic Doppler",
    formula: "f_obs = f √((1±β)/(1∓β))",
    blurb:
      "Light along the line of sight. Approaching raises the frequency. This is not the sound formula.",
    fields: [
      num("f", "f", "1", "Hz"),
      num("beta", "β", "0.6"),
      sel("dir", "Motion", "toward", [
        { value: "toward", label: "Toward you" },
        { value: "away", label: "Away from you" },
      ]),
    ],
    run: (values) => {
      const g = take(values, [
        { key: "f", label: "f" },
        { key: "beta", label: "β" },
      ]);
      if (isFail(g)) return g;
      if (g.beta < 0 || g.beta >= 1)
        return { error: "β is a speed as a fraction of c, from 0 up to but not including 1." };
      const toward = values.dir !== "away";
      const factor = Math.sqrt(toward ? (1 + g.beta) / (1 - g.beta) : (1 - g.beta) / (1 + g.beta));
      return lines(
        [{ label: "Observed frequency", value: `${fmt(g.f * factor)} Hz` }],
        [
          "The sign is the source’s motion along your line of sight. A sideways motion is the transverse Doppler effect, which this tool does not compute.",
        ],
      );
    },
  },
  {
    id: "inv-square",
    group: "physics",
    title: "Inverse-square intensity",
    formula: "I = P / (4 π r²)",
    blurb: "Intensity from an isotropic source, if the power is conserved.",
    fields: [num("P", "Power", "100", "W"), num("r", "r", "2", "m")],
    run: (values) => {
      const g = take(values, [
        { key: "P", label: "the power" },
        { key: "r", label: "r" },
      ]);
      if (isFail(g)) return g;
      if (g.r <= 0) return { error: "The distance has to be positive." };
      return lines(
        [{ label: "Intensity", value: `${fmt(g.P / (4 * Math.PI * g.r ** 2))} W/m²` }],
        [
          "The source is idealized as radiating equally in every direction, with nothing in the way.",
        ],
      );
    },
  },
  {
    id: "velocity-add",
    group: "physics",
    title: "Velocity addition",
    formula: "u = (v + u′) / (1 + v u′/c²)",
    blurb: "Collinear relativistic addition. Enter both speeds as fractions of c.",
    fields: [num("v", "v", "0.8", "c"), num("u", "u′", "0.8", "c")],
    run: (values) => {
      const g = take(values, [
        { key: "v", label: "v" },
        { key: "u", label: "u′" },
      ]);
      if (isFail(g)) return g;
      if (Math.abs(g.v) >= 1 || Math.abs(g.u) >= 1)
        return { error: "Each speed has to be slower than light. Type it as a fraction of c." };
      const w = (g.v + g.u) / (1 + g.v * g.u);
      return lines(
        [{ label: "u", value: `${fmt(w)} c` }],
        ["Classical addition is v + u′. This formula keeps the result below c."],
      );
    },
  },
  {
    id: "compton",
    group: "physics",
    title: "Compton shift",
    formula: "Δλ = (h / m_e c) (1 − cos θ)",
    blurb: "Wavelength increase when a photon scatters off a free electron at rest.",
    fields: [num("deg", "θ", "180", "°")],
    run: (values) => {
      const g = take(values, [{ key: "deg", label: "θ" }]);
      if (isFail(g)) return g;
      const shift = (C.h / (C.me * C.c)) * (1 - Math.cos((g.deg * Math.PI) / 180));
      return lines(
        [
          { label: "Δλ", value: `${fmt(shift)} m` },
          { label: "Δλ", value: `${fmt(shift * 1e12)} pm` },
        ],
        [
          "h/(m_e c) = 2.426×10⁻¹² m. θ is how far the photon turned, not an incidence angle on a mirror.",
        ],
      );
    },
  },
];

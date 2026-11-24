import { formulaMass } from "../src/lib/calc/formula.ts";
import { defaults, tools } from "../src/lib/calc/index.ts";
import { convert } from "../src/lib/calc/units.ts";

let failed = 0;

function check(name: string, cond: boolean) {
  if (!cond) {
    failed += 1;
    console.error("FAIL", name);
  }
}

function near(actual: number | null, expected: number, tol = 1e-6) {
  return actual !== null && Math.abs(actual - expected) <= tol * Math.max(1, Math.abs(expected));
}

const water = formulaMass("H2O");
check("water", "mass" in water && near(water.mass, 18.015, 1e-4));
const lime = formulaMass("Ca(OH)2");
check("lime", "mass" in lime && near(lime.mass, 74.092, 1e-3));
const rust = formulaMass("Fe2(SO4)3");
check("rust", "mass" in rust && near(rust.mass, 399.877, 1e-3));
const hydrate = formulaMass("CuSO4·5H2O");
check("hydrate", "mass" in hydrate && near(hydrate.mass, 249.685, 2e-3));
const sugar = formulaMass("C6H12O6");
check("sugar", "mass" in sugar && near(sugar.mass, 180.156, 1e-3));

check("ft", near(convert("length", 1, "ft", "m"), 0.3048));
check("C to F", near(convert("temperature", 0, "C", "F"), 32, 1e-9));
check("boil", near(convert("temperature", 100, "C", "F"), 212, 1e-9));
check("atm", near(convert("pressure", 1, "atm", "Pa"), 101325, 1e-12));
check("litre", near(convert("volume", 1, "L", "m3"), 0.001));
check("molar", near(convert("molarity", 1, "M", "molm3"), 1000));
check("eV", near(convert("energy", 1, "eV", "J"), 1.602176634e-19, 1e-12));
check("kcal", near(convert("energy", 1, "kcal", "J"), 4184));
check("ppm", near(convert("fraction", 1, "ppm", "one"), 1e-6));

const byId = new Map(tools.map((tool) => [tool.id, tool]));

function run(id: string) {
  const tool = byId.get(id);
  if (!tool) {
    check(`missing ${id}`, false);
    return { error: "missing" };
  }
  return tool.run(defaults(tool));
}

const quad = run("quadratic");
check(
  "quadratic",
  "lines" in quad && quad.lines.some((line) => line.value === "1" || line.value === "2"),
);
const gas = run("ideal-gas");
check(
  "ideal gas",
  "lines" in gas && gas.lines.some((line) => line.label === "n" && line.value.startsWith("0.9994")),
);
const ph = run("ph");
check(
  "ph",
  "lines" in ph && ph.lines.some((line) => line.label === "[H⁺]" && line.value.startsWith("0.001")),
);
const orbit = run("orbit");
check("orbit", "lines" in orbit && orbit.lines[0].value.includes("m/s"));
const dilute = run("dilution");
check("dilution", "lines" in dilute && dilute.lines[0].value === "0.04");

for (const tool of tools) {
  const result = tool.run(defaults(tool));
  const ok = "lines" in result ? result.lines.length > 0 : result.error.length > 0;
  check(`runs ${tool.id}`, ok);
}

console.log(failed ? `${failed} failed` : `ok, ${tools.length} calculators`);
if (failed) process.exit(1);

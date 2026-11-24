/** Conventional standard atomic weights, in g/mol. Enough for ordinary formulas. */
export const ELEMENTS: Record<string, number> = {
  H: 1.008,
  He: 4.0026,
  Li: 6.94,
  Be: 9.0122,
  B: 10.81,
  C: 12.011,
  N: 14.007,
  O: 15.999,
  F: 18.998,
  Ne: 20.18,
  Na: 22.99,
  Mg: 24.305,
  Al: 26.982,
  Si: 28.085,
  P: 30.974,
  S: 32.06,
  Cl: 35.45,
  Ar: 39.948,
  K: 39.098,
  Ca: 40.078,
  Sc: 44.956,
  Ti: 47.867,
  V: 50.942,
  Cr: 51.996,
  Mn: 54.938,
  Fe: 55.845,
  Co: 58.933,
  Ni: 58.693,
  Cu: 63.546,
  Zn: 65.38,
  Ga: 69.723,
  Ge: 72.63,
  As: 74.922,
  Se: 78.971,
  Br: 79.904,
  Kr: 83.798,
  Rb: 85.468,
  Sr: 87.62,
  Y: 88.906,
  Zr: 91.224,
  Nb: 92.906,
  Mo: 95.95,
  Ru: 101.07,
  Rh: 102.906,
  Pd: 106.42,
  Ag: 107.868,
  Cd: 112.414,
  In: 114.818,
  Sn: 118.71,
  Sb: 121.76,
  Te: 127.6,
  I: 126.904,
  Xe: 131.293,
  Cs: 132.905,
  Ba: 137.327,
  La: 138.905,
  Hf: 178.49,
  Ta: 180.948,
  W: 183.84,
  Re: 186.207,
  Os: 190.23,
  Ir: 192.217,
  Pt: 195.084,
  Au: 196.967,
  Hg: 200.592,
  Tl: 204.38,
  Pb: 207.2,
  Bi: 208.98,
  Th: 232.038,
  U: 238.029,
};

export type Composition = { symbol: string; count: number; mass: number };

export type FormulaMass = {
  mass: number;
  parts: Composition[];
};

const OPEN = new Set(["(", "["]);
const CLOSE: Record<string, string> = { "(": ")", "[": "]" };

export function formulaMass(input: string): FormulaMass | { error: string } {
  const text = input.trim();
  if (!text) return { error: "Enter a formula, such as H2O or Ca(OH)2." };
  const chunks = text.split(/[·•*.]/);
  const totals = new Map<string, number>();
  let mass = 0;
  for (const chunk of chunks) {
    const piece = readPiece(chunk);
    if ("error" in piece) return piece;
    mass += piece.mass;
    for (const part of piece.parts) {
      totals.set(part.symbol, (totals.get(part.symbol) ?? 0) + part.count);
    }
  }
  const parts = [...totals.entries()].map(([symbol, count]) => ({
    symbol,
    count,
    mass: ELEMENTS[symbol] * count,
  }));
  return { mass, parts };
}

function readPiece(raw: string): FormulaMass | { error: string } {
  let s = raw.replace(/\s+/g, "");
  if (!s) return { error: "A hydrate piece is empty. Try CuSO4·5H2O." };
  let multiplier = 1;
  const lead = s.match(/^(\d+)(?=[A-Z([]|$)/);
  if (lead) {
    multiplier = Number(lead[1]);
    s = s.slice(lead[1].length);
    if (!s) return { error: "A leading count needs a formula after it." };
    if (multiplier < 1) return { error: "A count has to be at least 1." };
  }
  let i = 0;
  const totals = new Map<string, number>();

  function fail(error: string): { error: string } {
    return { error };
  }

  function parseCount(): number | { error: string } {
    if (i >= s.length || !/[0-9]/.test(s[i])) return 1;
    let n = 0;
    while (i < s.length && /[0-9]/.test(s[i])) {
      n = n * 10 + Number(s[i]);
      i += 1;
      if (n > 100000) return fail("That count is too large.");
    }
    if (n < 1) return fail("A count has to be at least 1.");
    return n;
  }

  function add(symbol: string, count: number) {
    totals.set(symbol, (totals.get(symbol) ?? 0) + count);
  }

  function parseGroup(end: string | null): true | { error: string } {
    let saw = false;
    while (i < s.length && s[i] !== end) {
      saw = true;
      const ch = s[i];
      if (OPEN.has(ch)) {
        i += 1;
        const before = new Map(totals);
        const inner = parseGroup(CLOSE[ch]);
        if (inner !== true) return inner;
        if (s[i] !== CLOSE[ch]) return fail(`Missing ${CLOSE[ch]}.`);
        i += 1;
        const n = parseCount();
        if (typeof n !== "number") return n;
        for (const [symbol, count] of totals) {
          const prior = before.get(symbol) ?? 0;
          const added = count - prior;
          totals.set(symbol, prior + added * n);
        }
        continue;
      }
      if (/[A-Z]/.test(ch)) {
        let symbol = ch;
        i += 1;
        if (i < s.length && /[a-z]/.test(s[i])) {
          symbol += s[i];
          i += 1;
        }
        if (ELEMENTS[symbol] === undefined) return fail(`No element “${symbol}” in this table.`);
        const n = parseCount();
        if (typeof n !== "number") return n;
        add(symbol, n);
        continue;
      }
      return fail(`Cannot read “${ch}”. Use element symbols, counts, and parentheses.`);
    }
    if (!saw) return fail("Empty parentheses.");
    return true;
  }

  const parsed = parseGroup(null);
  if (parsed !== true) return parsed;
  if (i !== s.length) return fail("Could not read the whole formula.");
  const parts = [...totals.entries()].map(([symbol, count]) => ({
    symbol,
    count: count * multiplier,
    mass: ELEMENTS[symbol] * count * multiplier,
  }));
  return { mass: parts.reduce((sum, part) => sum + part.mass, 0), parts };
}

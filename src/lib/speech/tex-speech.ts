/**
 * Turn the book's TeX and its plain-text math (Unicode symbols such as σ, x̄, ²)
 * into words a speech engine reads naturally: \frac{a}{b} → "a over b",
 * x_i → "x sub i", \sum_{i=1}^{n} → "the sum from i equals 1 to n of".
 *
 * It aims at a clear spoken reading, not a lossless one. Unknown commands are
 * read by name rather than dropped.
 */

const GREEK: Record<string, string> = {
  alpha: "alpha",
  beta: "beta",
  gamma: "gamma",
  delta: "delta",
  epsilon: "epsilon",
  varepsilon: "epsilon",
  zeta: "zeta",
  eta: "eta",
  theta: "theta",
  vartheta: "theta",
  iota: "iota",
  kappa: "kappa",
  lambda: "lambda",
  mu: "mu",
  nu: "nu",
  xi: "xi",
  pi: "pi",
  varpi: "pi",
  rho: "rho",
  varrho: "rho",
  sigma: "sigma",
  varsigma: "sigma",
  tau: "tau",
  upsilon: "upsilon",
  phi: "phi",
  varphi: "phi",
  chi: "chi",
  psi: "psi",
  omega: "omega",
  Gamma: "capital gamma",
  Delta: "delta",
  Theta: "capital theta",
  Lambda: "capital lambda",
  Xi: "capital xi",
  Pi: "capital pi",
  Sigma: "capital sigma",
  Upsilon: "capital upsilon",
  Phi: "capital phi",
  Psi: "capital psi",
  Omega: "omega",
  ell: "ell",
  hbar: "h bar",
  infty: "infinity",
  partial: "partial",
  nabla: "del",
};

const WORDS: Record<string, string> = {
  cdot: "times",
  times: "times",
  div: "divided by",
  pm: "plus or minus",
  mp: "minus or plus",
  le: "is less than or equal to",
  leq: "is less than or equal to",
  ge: "is greater than or equal to",
  geq: "is greater than or equal to",
  ne: "is not equal to",
  neq: "is not equal to",
  approx: "is approximately",
  sim: "is distributed as",
  simeq: "is approximately",
  propto: "is proportional to",
  equiv: "is equivalent to",
  ll: "is much less than",
  gg: "is much greater than",
  to: "to",
  rightarrow: "gives",
  Rightarrow: "implies",
  leftrightarrow: "is equivalent to",
  Leftrightarrow: "if and only if",
  implies: "implies",
  iff: "if and only if",
  mapsto: "maps to",
  mid: "given",
  cap: "and",
  cup: "or",
  setminus: "minus",
  subset: "is a subset of",
  subseteq: "is a subset of",
  in: "in",
  notin: "is not in",
  forall: "for all",
  exists: "there exists",
  neg: "not",
  land: "and",
  lor: "or",
  emptyset: "the empty set",
  varnothing: "the empty set",
  circ: "degrees",
  degree: "degrees",
  prime: "prime",
  ldots: "and so on",
  cdots: "and so on",
  dots: "and so on",
  vdots: "and so on",
  log: "log",
  ln: "natural log",
  lg: "log",
  exp: "exp",
  sin: "sine",
  cos: "cosine",
  tan: "tangent",
  sec: "secant",
  csc: "cosecant",
  cot: "cotangent",
  arcsin: "arc sine",
  arccos: "arc cosine",
  arctan: "arc tangent",
  sinh: "hyperbolic sine",
  cosh: "hyperbolic cosine",
  tanh: "hyperbolic tangent",
  det: "determinant",
  gcd: "g c d",
  deg: "degree",
  dim: "dimension",
  ker: "kernel",
  Pr: "probability",
  angle: "angle",
  triangle: "triangle",
  perp: "is perpendicular to",
  parallel: "is parallel to",
  star: "star",
  ast: "star",
  oplus: "direct sum",
  otimes: "tensor",
  langle: "",
  rangle: "",
  lfloor: "the floor of",
  rfloor: "",
  lceil: "the ceiling of",
  rceil: "",
};

/** Spacing commands, read as a short pause. */
const PAUSE = new Set([";", ":", "quad", "qquad", "enspace"]);
/** Commands with no sound of their own. */
const SILENT = new Set([
  "left",
  "right",
  "big",
  "Big",
  "bigg",
  "Bigg",
  "bigl",
  "bigr",
  "Bigl",
  "Bigr",
  "displaystyle",
  "textstyle",
  "limits",
  "nolimits",
  "!",
  ",",
  " ",
  "thinspace",
  "{",
  "}",
  "|",
  "middle",
  "nonumber",
]);
const STYLE = new Set([
  "mathbf",
  "boldsymbol",
  "bm",
  "mathit",
  "mathnormal",
  "mathsf",
  "mathcal",
  "mathfrak",
  "mathscr",
]);
const TEXT = new Set([
  "text",
  "textrm",
  "textit",
  "textbf",
  "mathrm",
  "operatorname",
  "textsf",
  "texttt",
]);
const BIG_OPS: Record<string, string> = {
  sum: "the sum",
  prod: "the product",
  int: "the integral",
  iint: "the double integral",
  iiint: "the triple integral",
  oint: "the contour integral",
  bigcup: "the union",
  bigcap: "the intersection",
  lim: "the limit",
  max: "the maximum",
  min: "the minimum",
  sup: "the supremum",
  inf: "the infimum",
  argmax: "the arg max",
  argmin: "the arg min",
};
const SETS: Record<string, string> = {
  R: "the real numbers",
  N: "the natural numbers",
  Z: "the integers",
  Q: "the rationals",
  C: "the complex numbers",
};
/** Abbreviations that appear in \mathrm{} and read better as words or letters. */
const NAMES: Record<string, string> = {
  Var: "the variance of",
  Cov: "the covariance of",
  Corr: "the correlation of",
  SE: "S E",
  SD: "S D",
  IQR: "I Q R",
  CV: "C V",
  AIC: "A I C",
  BIC: "B I C",
  PPV: "P P V",
  NNT: "N N T",
  ARR: "A R R",
  RR: "R R",
  Beta: "Beta",
  T: "T",
  d: "d",
  pH: "p H",
  pOH: "p O H",
  pK: "p K",
};
const FUNCTION_LETTERS = new Set(["P", "E", "f", "g", "h", "F", "G", "p", "L", "V", "ℓ"]);
const ORDINAL: Record<string, string> = {
  "2": "square",
  "3": "cube",
  "4": "fourth",
  "5": "fifth",
  n: "n-th",
};

type Token =
  { t: "cmd"; v: string } | { t: "ch"; v: string } | { t: "num"; v: string } | { t: "space" };

function tokenize(tex: string): Token[] {
  const out: Token[] = [];
  let i = 0;
  while (i < tex.length) {
    const ch = tex[i];
    if (ch === "\\") {
      const rest = tex.slice(i + 1);
      const name = /^[A-Za-z]+/.exec(rest)?.[0];
      if (name) {
        out.push({ t: "cmd", v: name });
        i += 1 + name.length;
      } else {
        out.push({ t: "cmd", v: rest[0] ?? "" });
        i += 2;
      }
      continue;
    }
    if (/\s/.test(ch)) {
      out.push({ t: "space" });
      i += 1;
      continue;
    }
    const num = /^\d+(?:\.\d+)?/.exec(tex.slice(i))?.[0];
    if (num) {
      out.push({ t: "num", v: num });
      i += num.length;
      continue;
    }
    out.push({ t: "ch", v: ch });
    i += 1;
  }
  return out;
}

type Item = {
  words: string;
  kind: "atom" | "group" | "op" | "func" | "pause";
  simple: boolean;
  /** Already read as "the quantity …" or "of …"; do not wrap again. */
  wrapped?: boolean;
};

class Reader {
  private i = 0;
  private absOpen = false;
  private tokens: Token[];
  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  private peek(skipSpace = true): Token | undefined {
    let j = this.i;
    while (skipSpace && this.tokens[j]?.t === "space") j += 1;
    return this.tokens[j];
  }

  private next(): Token | undefined {
    while (this.tokens[this.i]?.t === "space") this.i += 1;
    return this.tokens[this.i++];
  }

  /** Raw text of a {...} argument, for \text and friends. */
  private rawArg(): string {
    const open = this.peek();
    if (!open || open.t !== "ch" || open.v !== "{") {
      const tok = this.next();
      return tok && tok.t !== "space" ? ("v" in tok ? tok.v : "") : "";
    }
    this.next();
    let depth = 1;
    let text = "";
    while (this.i < this.tokens.length) {
      const tok = this.tokens[this.i++];
      if (tok.t === "ch" && tok.v === "{") depth += 1;
      if (tok.t === "ch" && tok.v === "}") {
        depth -= 1;
        if (depth === 0) break;
      }
      text +=
        tok.t === "space" ? " " : tok.t === "cmd" ? (GREEK[tok.v] ?? WORDS[tok.v] ?? "") : tok.v;
    }
    return text;
  }

  /** A single argument: a braced group or the next atom. */
  arg(): Item {
    const tok = this.peek();
    if (tok?.t === "ch" && tok.v === "{") {
      this.next();
      return this.sequence("}");
    }
    // TeX reads an unbraced argument as one character: \frac12 is 1 over 2.
    const raw = this.tokens[this.i];
    if (tok?.t === "num" && raw === tok && tok.v.length > 1) {
      this.tokens[this.i] = { t: "num", v: tok.v.slice(1) };
      return { words: tok.v[0], kind: "atom", simple: true };
    }
    return this.atom() ?? { words: "", kind: "atom", simple: true };
  }

  /** Parse until the closing token (consumed) or the end. */
  sequence(close?: string): Item {
    const items: Item[] = [];
    while (this.i < this.tokens.length) {
      const tok = this.peek();
      if (!tok) break;
      if (close && tok.t === "ch" && tok.v === close) {
        this.next();
        break;
      }
      if (tok.t === "cmd" && tok.v === "right" && close && close !== "}") {
        this.next();
        const delim = this.next();
        if (delim && "v" in delim && (delim.v === close || delim.v === ".")) break;
        continue;
      }
      if (tok.t === "ch" && (tok.v === "^" || tok.v === "_")) {
        this.next();
        const script = this.arg();
        const last = items[items.length - 1];
        if (!last) continue;
        if (tok.v === "^") {
          last.words = withSuperscript(last, script);
          if (last.kind === "group" && !last.simple) last.wrapped = true;
        } else {
          last.words = withSubscript(last, script);
        }
        last.simple = false;
        continue;
      }
      const item = this.atom();
      if (!item) continue;
      const prev = items[items.length - 1];
      if (item.kind === "group" && prev && prev.kind === "func" && !/^\d/.test(item.words)) {
        item.words = `of ${item.words}`;
        item.wrapped = true;
      }
      items.push(item);
    }
    const words = items
      .map((item, index) => {
        if (item.kind !== "group") return item.words;
        const prev = items[index - 1];
        const product =
          prev && prev.kind !== "op" && prev.kind !== "pause" && !item.words.startsWith("of ");
        const body = item.wrapped || item.simple ? item.words : `the quantity ${item.words},`;
        return product ? `times ${body}` : body;
      })
      .filter(Boolean)
      .join(" ");
    const simple = items.length <= 1 && (items[0]?.simple ?? true);
    return { words, kind: "group", simple };
  }

  atom(): Item | null {
    const tok = this.next();
    if (!tok || tok.t === "space") return null;
    if (tok.t === "num") return { words: tok.v, kind: "atom", simple: true };
    if (tok.t === "ch") return this.char(tok.v);
    return this.command(tok.v);
  }

  private char(ch: string): Item | null {
    switch (ch) {
      case "{": {
        const group = this.sequence("}");
        return { ...group, kind: "atom" };
      }
      case "}":
        return null;
      case "(":
      case "[": {
        const group = this.sequence(ch === "(" ? ")" : "]");
        return { words: group.words, kind: "group", simple: group.simple };
      }
      case ")":
      case "]":
        return null;
      case "|": {
        this.absOpen = !this.absOpen;
        return this.absOpen
          ? { words: "the absolute value of", kind: "op", simple: false }
          : { words: ",", kind: "pause", simple: true };
      }
      case "=":
        return { words: "equals", kind: "op", simple: false };
      case "+":
        return { words: "plus", kind: "op", simple: false };
      case "-":
        return { words: "minus", kind: "op", simple: false };
      case "<":
        return { words: "is less than", kind: "op", simple: false };
      case ">":
        return { words: "is greater than", kind: "op", simple: false };
      case "!":
        return { words: "factorial", kind: "op", simple: true };
      case "'":
        return { words: "prime", kind: "atom", simple: true };
      case "/":
        return { words: "over", kind: "op", simple: false };
      case "*":
        return { words: "star", kind: "atom", simple: true };
      case ",":
        return { words: ",", kind: "pause", simple: true };
      case "&":
        return { words: ",", kind: "pause", simple: true };
      case "~":
      case ".":
        return null;
      default: {
        const words = plainSymbol(ch);
        const kind = FUNCTION_LETTERS.has(ch) ? "func" : "atom";
        return { words, kind, simple: true };
      }
    }
  }

  private command(name: string): Item | null {
    if (SILENT.has(name)) return null;
    if (PAUSE.has(name))
      return { words: name === "qquad" ? ";" : ",", kind: "pause", simple: true };
    if (name === "\\") return { words: ";", kind: "pause", simple: true };
    if (name === "{" || name === "}") return null;
    if (name === "frac" || name === "dfrac" || name === "tfrac" || name === "cfrac") {
      const top = this.arg();
      const bottom = this.arg();
      if (top.simple && bottom.simple) {
        return { words: `${top.words} over ${bottom.words}`, kind: "atom", simple: false };
      }
      return {
        words: `the fraction ${top.words}, over ${bottom.words},`,
        kind: "atom",
        simple: false,
      };
    }
    if (name === "sqrt") {
      let root = "square";
      const open = this.peek();
      if (open?.t === "ch" && open.v === "[") {
        this.next();
        const index = this.sequence("]").words.trim();
        root = ORDINAL[index] ?? `${index}-th`;
      }
      const body = this.arg();
      return {
        words: `the ${root} root of ${body.words}${body.simple ? "" : ","}`,
        kind: "atom",
        simple: false,
      };
    }
    if (name === "binom" || name === "dbinom" || name === "tbinom") {
      const n = this.arg();
      const k = this.arg();
      return { words: `${n.words} choose ${k.words}`, kind: "atom", simple: false };
    }
    if (name === "bar" || name === "overline") return this.accent("bar");
    if (name === "hat" || name === "widehat") return this.accent("hat");
    if (name === "tilde" || name === "widetilde") return this.accent("tilde");
    if (name === "dot") return this.accent("dot");
    if (name === "ddot") return this.accent("double dot");
    if (name === "vec" || name === "overrightarrow") {
      const body = this.arg();
      return { words: `vector ${body.words}`, kind: "atom", simple: true };
    }
    if (STYLE.has(name)) {
      const body = this.arg();
      return {
        ...body,
        kind: body.words.length === 1 && FUNCTION_LETTERS.has(body.words) ? "func" : "atom",
      };
    }
    if (name === "mathbb") {
      const body = this.rawArg().trim();
      return { words: SETS[body] ?? body, kind: "atom", simple: true };
    }
    if (TEXT.has(name)) {
      const raw = this.rawArg().trim();
      const named = NAMES[raw];
      if (named) {
        return { words: named, kind: named.endsWith(" of") ? "op" : "func", simple: true };
      }
      return { words: raw, kind: raw.length <= 3 ? "func" : "atom", simple: !/\s/.test(raw) };
    }
    if (name === "xrightarrow") {
      const over = this.arg();
      return { words: `goes, with ${tidy(over.words)}, to`, kind: "op", simple: false };
    }
    if (name === "begin" || name === "end") {
      this.rawArg();
      return null;
    }
    if (name === "arg") {
      const after = this.peek();
      if (after?.t === "cmd" && (after.v === "max" || after.v === "min")) {
        this.next();
        return this.bigOp(`argmax`.replace("max", after.v));
      }
      return { words: "arg", kind: "func", simple: true };
    }
    if (BIG_OPS[name]) return this.bigOp(name);
    if (GREEK[name]) {
      const kind = name === "phi" || name === "psi" || name === "ell" ? "func" : "atom";
      return { words: GREEK[name], kind, simple: true };
    }
    if (name in WORDS) {
      const words = WORDS[name];
      const fn = [
        "log",
        "ln",
        "lg",
        "exp",
        "sin",
        "cos",
        "tan",
        "sec",
        "csc",
        "cot",
        "det",
        "Pr",
      ].includes(name);
      return { words, kind: fn ? "func" : words.startsWith("is ") ? "op" : "atom", simple: true };
    }
    return { words: name, kind: "atom", simple: true };
  }

  private accent(mark: string): Item {
    const body = this.arg();
    return { words: `${body.words} ${mark}`, kind: "atom", simple: true };
  }

  /** \sum_{i=1}^{n}, \int_a^b, \lim_{x\to 0}, \max_\theta … */
  private bigOp(name: string): Item {
    let lower: Item | null = null;
    let upper: Item | null = null;
    for (let k = 0; k < 2; k += 1) {
      const tok = this.peek();
      if (tok?.t === "ch" && tok.v === "_" && !lower) {
        this.next();
        lower = this.arg();
      } else if (tok?.t === "ch" && tok.v === "^" && !upper) {
        this.next();
        upper = this.arg();
      }
    }
    const label = BIG_OPS[name] ?? name;
    let words = label;
    if (name === "lim" && lower) {
      words = `${label} as ${lower.words.replace(/\bto\b/, "approaches")}`;
    } else if (lower && upper) {
      words = `${label} from ${lower.words} to ${upper.words}`;
    } else if (lower) {
      words = `${label} over ${lower.words}`;
    }
    return { words: `${words} of`, kind: "op", simple: false };
  }
}

function withSuperscript(base: Item, sup: Item): string {
  const s = sup.words.trim();
  const b = base.words;
  const head = base.kind === "group" && !base.simple ? `the quantity ${b},` : b;
  if (s === "2") return `${head} squared`;
  if (s === "3") return `${head} cubed`;
  if (s === "T" || s === "transpose") return `${b} transpose`;
  if (s === "star") return `${b} star`;
  if (s === "prime") return `${b} prime`;
  if (s === "degrees") return `${b} degrees`;
  if (s === "minus 1" && (base.kind === "group" || /^[A-Z]$/.test(b))) {
    return base.kind === "group" ? `the quantity ${b}, inverse` : `${b} inverse`;
  }
  if (sup.simple) return `${head} to the ${s}`;
  return `${head} to the power ${s},`;
}

function withSubscript(base: Item, sub: Item): string {
  const s = sub.words.trim();
  if (!s) return base.words;
  if (/\s/.test(s) && !sub.simple) return `${base.words} sub ${s},`;
  return `${base.words} sub ${s}`;
}

/** A single non-ASCII or ASCII character inside TeX or text. */
function plainSymbol(ch: string): string {
  return UNICODE[ch] ?? ch;
}

const UNICODE: Record<string, string> = {
  α: "alpha",
  β: "beta",
  γ: "gamma",
  δ: "delta",
  ε: "epsilon",
  ζ: "zeta",
  η: "eta",
  θ: "theta",
  κ: "kappa",
  λ: "lambda",
  μ: "mu",
  ν: "nu",
  ξ: "xi",
  π: "pi",
  ρ: "rho",
  σ: "sigma",
  τ: "tau",
  φ: "phi",
  ϕ: "phi",
  χ: "chi",
  ψ: "psi",
  ω: "omega",
  Γ: "capital gamma",
  Δ: "delta",
  Θ: "capital theta",
  Λ: "capital lambda",
  Π: "capital pi",
  Σ: "sigma",
  Φ: "capital phi",
  Ψ: "capital psi",
  Ω: "omega",
  ℓ: "ell",
  ħ: "h bar",
  "∞": "infinity",
  "∂": "partial",
  "∇": "del",
  "−": "minus",
  "×": "times",
  "·": "times",
  "÷": "divided by",
  "±": "plus or minus",
  "≈": "is approximately",
  "≤": "is less than or equal to",
  "≥": "is greater than or equal to",
  "≠": "is not equal to",
  "∝": "is proportional to",
  "→": "to",
  "⇒": "implies",
  "∩": "and",
  "∪": "or",
  "∈": "in",
  "√": "the square root of",
  "∑": "the sum of",
  "∫": "the integral of",
  "°": "degrees",
  "′": "prime",
};

/** Read a TeX formula aloud. */
export function texToSpeech(tex: string): string {
  const reader = new Reader(tokenize(tex));
  return tidy(reader.sequence().words);
}

const SUPER: Record<string, string> = {
  "⁰": "0",
  "¹": "1",
  "²": "2",
  "³": "3",
  "⁴": "4",
  "⁵": "5",
  "⁶": "6",
  "⁷": "7",
  "⁸": "8",
  "⁹": "9",
  "⁻": "minus ",
  "⁺": "plus ",
};
const SUB: Record<string, string> = {
  "₀": "0",
  "₁": "1",
  "₂": "2",
  "₃": "3",
  "₄": "4",
  "₅": "5",
  "₆": "6",
  "₇": "7",
  "₈": "8",
  "₉": "9",
  ₐ: "a",
  ₑ: "e",
  ᵢ: "i",
  ₙ: "n",
  ₜ: "t",
};

/** Read prose that contains math written with Unicode symbols. */
export function textToSpeech(text: string): string {
  let s = text.normalize("NFC");
  // Accents: x̄ (combining macron), ȳ, p̂, ŷ, θ̂.
  s = s.replace(/([A-Za-zα-ω])̄/g, "$1 bar").replace(/ȳ/g, "y bar");
  s = s
    .replace(/([A-Za-zα-ω])̂/g, "$1 hat")
    .replace(/ŷ/g, "y hat")
    .replace(/p̂/g, "p hat");
  s = s.replace(/ᵀ/g, " transpose");
  // Superscript runs: ² → squared, ³ → cubed, others → "to the N".
  s = s.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺]+/g, (run) => {
    const value = [...run]
      .map((ch) => SUPER[ch] ?? "")
      .join("")
      .trim();
    if (value === "2") return " squared";
    if (value === "3") return " cubed";
    return ` to the ${value}`;
  });
  s = s.replace(/[₀₁₂₃₄₅₆₇₈₉ₐₑᵢₙₜ]+/g, (run) => ` ${[...run].map((ch) => SUB[ch] ?? "").join("")}`);
  // ASCII scripts written in prose: x_i, p_(i), t^*, e^0.8.
  s = s.replace(/([A-Za-zα-ωΑ-Ω]+)_\(?([A-Za-z0-9]+)\)?/g, "$1 sub $2");
  s = s.replace(/\^\*/g, " star");
  s = s.replace(/\^\(?(-?[\w.]+)\)?/g, (_, p: string) =>
    p === "2" ? " squared" : p === "3" ? " cubed" : ` to the ${p.replace("-", "minus ")}`,
  );
  // Probability notation.
  s = s.replace(/\s\|\s/g, " given ");
  s = s.replace(/\s?=\s?/g, " equals ").replace(/\s\+\s/g, " plus ");
  s = s.replace(/\b([PEfgpL])\((?!\d)/g, "$1 of (");
  s = s.replace(/\bE\[/g, "E of [");
  // Fractions written with a slash.
  s = s.replace(/(\d)\/(\d)/g, "$1 over $2");
  s = s.replace(/\s\/\s/g, " divided by ");
  // −3 at the start of a number reads as "minus 3".
  s = [...s].map((ch) => (UNICODE[ch] && !/[A-Za-z]/.test(ch) ? ` ${UNICODE[ch]} ` : ch)).join("");
  s = s.replace(/[“”"]/g, "").replace(/[()[\]{}]/g, " ");
  return tidy(s);
}

function tidy(s: string): string {
  return s
    .replace(/\s+/g, " ")
    .replace(/\s+([,.;:?!%])/g, "$1")
    .replace(/([,;])(?:\s*[,;])+/g, "$1")
    .replace(/^[,;\s]+|[,;\s]+$/g, "")
    .trim();
}

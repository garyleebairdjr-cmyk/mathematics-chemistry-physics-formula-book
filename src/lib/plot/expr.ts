/**
 * A small, safe math expression compiler for the graph lab. No eval: the text
 * is parsed into a tree and the tree is walked.
 *
 * Supports + − × ÷ ^, unary minus, implicit multiplication (2x, 3(x+1), x sin x
 * is not supported but 2sin(x) and (x+1)(x−1) are), the usual functions, and
 * the constants pi, π, e, and g.
 */

type Node =
  | { t: "num"; v: number }
  | { t: "var"; name: string }
  | { t: "neg"; a: Node }
  | { t: "bin"; op: "+" | "-" | "*" | "/" | "^"; a: Node; b: Node }
  | { t: "call"; fn: string; args: Node[] };

const FUNCTIONS: Record<string, (...args: number[]) => number> = {
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  asin: Math.asin,
  acos: Math.acos,
  atan: Math.atan,
  arcsin: Math.asin,
  arccos: Math.acos,
  arctan: Math.atan,
  sinh: Math.sinh,
  cosh: Math.cosh,
  tanh: Math.tanh,
  sec: (x) => 1 / Math.cos(x),
  csc: (x) => 1 / Math.sin(x),
  cot: (x) => 1 / Math.tan(x),
  exp: Math.exp,
  ln: Math.log,
  log: Math.log10,
  log10: Math.log10,
  log2: Math.log2,
  sqrt: Math.sqrt,
  cbrt: Math.cbrt,
  abs: Math.abs,
  floor: Math.floor,
  ceil: Math.ceil,
  round: Math.round,
  sign: Math.sign,
  min: Math.min,
  max: Math.max,
  pow: Math.pow,
};

const CONSTANTS: Record<string, number> = {
  pi: Math.PI,
  π: Math.PI,
  e: Math.E,
  g: 9.81,
  tau: 2 * Math.PI,
};

type Token = { k: "num"; v: number } | { k: "id"; v: string } | { k: "op"; v: string };

function tokenize(src: string): Token[] {
  const s = src
    .replace(/[−–]/g, "-")
    .replace(/[×·⋅]/g, "*")
    .replace(/÷/g, "/")
    .replace(/²/g, "^2")
    .replace(/³/g, "^3")
    .replace(/√/g, "sqrt");
  const out: Token[] = [];
  let i = 0;
  while (i < s.length) {
    const ch = s[i];
    if (/\s/.test(ch)) {
      i += 1;
      continue;
    }
    const num = /^(\d+\.?\d*|\.\d+)(e[+-]?\d+)?/i.exec(s.slice(i));
    if (num) {
      out.push({ k: "num", v: Number(num[0]) });
      i += num[0].length;
      continue;
    }
    const id = /^[A-Za-zα-ωπ_][A-Za-z0-9α-ωπ_]*/.exec(s.slice(i));
    if (id) {
      out.push({ k: "id", v: id[0] });
      i += id[0].length;
      continue;
    }
    if ("+-*/^(),".includes(ch)) {
      out.push({ k: "op", v: ch });
      i += 1;
      continue;
    }
    throw new Error(`Unexpected “${ch}”.`);
  }
  return out;
}

/** Split an identifier like "ax" or "xt" into known names when it is not itself a name. */
function splitIdentifier(id: string, known: Set<string>): string[] | null {
  if (known.has(id) || id in CONSTANTS || id in FUNCTIONS) return [id];
  const parts: string[] = [];
  let rest = id;
  while (rest) {
    // Prefer the longest known prefix (so "pix" is pi·x).
    let hit = "";
    for (let n = rest.length; n > 0; n -= 1) {
      const head = rest.slice(0, n);
      if (known.has(head) || head in CONSTANTS) {
        hit = head;
        break;
      }
    }
    if (!hit) return null;
    parts.push(hit);
    rest = rest.slice(hit.length);
  }
  return parts;
}

class Parser {
  private i = 0;
  private tokens: Token[];
  private known: Set<string>;

  constructor(tokens: Token[], known: Set<string>) {
    this.tokens = tokens;
    this.known = known;
  }

  parse(): Node {
    const node = this.expr();
    if (this.i < this.tokens.length) throw new Error("Unexpected text at the end.");
    return node;
  }

  private peek() {
    return this.tokens[this.i];
  }

  private isOp(v: string) {
    const t = this.peek();
    return t?.k === "op" && t.v === v;
  }

  private expr(): Node {
    let a = this.term();
    while (this.isOp("+") || this.isOp("-")) {
      const op = (this.tokens[this.i++] as { v: "+" | "-" }).v;
      a = { t: "bin", op, a, b: this.term() };
    }
    return a;
  }

  /** Starts an implicit product: a number, a name, or an opening bracket. */
  private startsFactor() {
    const t = this.peek();
    return !!t && (t.k === "num" || t.k === "id" || (t.k === "op" && t.v === "("));
  }

  private term(): Node {
    let a = this.unary();
    for (;;) {
      if (this.isOp("*") || this.isOp("/")) {
        const op = (this.tokens[this.i++] as { v: "*" | "/" }).v;
        a = { t: "bin", op, a, b: this.unary() };
      } else if (this.startsFactor()) {
        a = { t: "bin", op: "*", a, b: this.power() };
      } else return a;
    }
  }

  private unary(): Node {
    if (this.isOp("-")) {
      this.i += 1;
      return { t: "neg", a: this.unary() };
    }
    if (this.isOp("+")) {
      this.i += 1;
      return this.unary();
    }
    return this.power();
  }

  private power(): Node {
    const base = this.atom();
    if (this.isOp("^")) {
      this.i += 1;
      // Right-associative, and -x^2 means -(x^2) because unary sits above.
      return { t: "bin", op: "^", a: base, b: this.unary() };
    }
    return base;
  }

  private atom(): Node {
    const t = this.tokens[this.i++];
    if (!t) throw new Error("The expression ends too soon.");
    if (t.k === "num") return { t: "num", v: t.v };
    if (t.k === "op" && t.v === "(") {
      const inner = this.expr();
      if (!this.isOp(")")) throw new Error("A bracket is not closed.");
      this.i += 1;
      return inner;
    }
    if (t.k === "id") {
      const name = t.v;
      if (name in FUNCTIONS) {
        if (!this.isOp("(")) {
          // sin x → sin(x), with the next single factor.
          return { t: "call", fn: name, args: [this.power()] };
        }
        this.i += 1;
        const args = [this.expr()];
        while (this.isOp(",")) {
          this.i += 1;
          args.push(this.expr());
        }
        if (!this.isOp(")")) throw new Error(`${name}( is not closed.`);
        this.i += 1;
        return { t: "call", fn: name, args };
      }
      const parts = splitIdentifier(name, this.known);
      if (!parts) throw new Error(`Unknown name “${name}”.`);
      let node: Node | null = null;
      for (const part of parts) {
        const leaf: Node = { t: "var", name: part };
        node = node ? { t: "bin", op: "*", a: node, b: leaf } : leaf;
      }
      return node!;
    }
    throw new Error(`Unexpected “${t.v}”.`);
  }
}

function evaluate(node: Node, scope: Record<string, number>): number {
  switch (node.t) {
    case "num":
      return node.v;
    case "var":
      return node.name in scope ? scope[node.name] : (CONSTANTS[node.name] ?? NaN);
    case "neg":
      return -evaluate(node.a, scope);
    case "bin": {
      const a = evaluate(node.a, scope);
      const b = evaluate(node.b, scope);
      if (node.op === "+") return a + b;
      if (node.op === "-") return a - b;
      if (node.op === "*") return a * b;
      if (node.op === "/") return a / b;
      return Math.pow(a, b);
    }
    case "call":
      return FUNCTIONS[node.fn](...node.args.map((arg) => evaluate(arg, scope)));
  }
}

export type Compiled = (scope: Record<string, number>) => number;

/** Compile an expression in the given variable names. Throws with a readable message. */
export function compile(src: string, variables: string[]): Compiled {
  if (!src.trim()) throw new Error("Type an expression, for example a*sin(b*x).");
  const tree = new Parser(tokenize(src), new Set(variables)).parse();
  return (scope) => evaluate(tree, scope);
}

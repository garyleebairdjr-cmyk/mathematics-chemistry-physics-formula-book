/** Match KaTeX atoms with a formula's symbol glosses, so hovering a symbol can explain it. */

export type SymbolGloss = { sym: string; means: string };

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
  "₊": "+",
  "⁺": "+",
  "₋": "-",
  "⁻": "-",
  "−": "-",
  // Accents, so "x̄" and "p̂" in a gloss match KaTeX's \bar{x} and \hat{p}.
  "\u0304": "ˉ",
  "¯": "ˉ",
  "\u0302": "^",
  ˆ: "^",
};

/** Compare a typeset atom with the symbol as written in the chapter. */
export function symbolKey(raw: string): string {
  let out = "";
  for (const ch of raw) {
    if (SUB[ch]) out += SUB[ch];
    else if (ch === "ȳ") out += "yˉ";
    else if (ch === "ŷ") out += "y^";
    else if (ch === "_" || ch === " " || ch === "{" || ch === "}" || ch === "$") continue;
    else out += ch;
  }
  return out;
}

function glossMap(symbols: SymbolGloss[]): Map<string, string> {
  const map = new Map<string, string>();
  for (const symbol of symbols) {
    const parts = symbol.sym
      .split(/[,;]/)
      .map((part) => part.trim())
      .filter(Boolean);
    for (const part of parts) {
      const key = symbolKey(part);
      if (!key || map.has(key)) continue;
      map.set(key, `${part} — ${symbol.means}`);
    }
  }
  return map;
}

function collapsed(el: Element): string {
  return (el.textContent ?? "").replace(/\s|\u200b|\u200c|\u200d|\ufeff/g, "");
}

function isLetter(ch: string): boolean {
  return /\p{L}/u.test(ch);
}

/** Mark KaTeX atoms whose text is a symbol from this formula. Idempotent. */
export function annotateSymbols(root: HTMLElement, symbols: SymbolGloss[]) {
  const map = glossMap(symbols);
  if (map.size === 0) return;
  const atoms = [...root.querySelectorAll(".mord")].filter((el) => !el.closest("[data-def]"));
  const claimed = new Set<Element>();

  const ranked = atoms
    .map((el) => ({ el, key: symbolKey(collapsed(el)) }))
    .filter((item) => item.key.length > 0)
    .sort((a, b) => b.key.length - a.key.length);

  for (const item of ranked) {
    if (claimed.has(item.el)) continue;
    const means = map.get(item.key);
    if (!means) continue;
    if ([...item.el.querySelectorAll(".mord")].some((child) => claimed.has(child))) continue;
    item.el.setAttribute("data-def", means);
    item.el.classList.add("sym-def");
    claimed.add(item.el);
    item.el.querySelectorAll(".mord").forEach((child) => claimed.add(child));
  }

  for (const el of atoms) {
    if (claimed.has(el) || el.querySelector(".mord") || el.querySelector(".sym-def")) continue;
    const text = collapsed(el);
    if (text.length < 2 || ![...text].every((ch) => isLetter(ch) && map.has(ch))) continue;
    el.textContent = "";
    for (const ch of text) {
      const span = document.createElement("span");
      span.textContent = ch;
      span.dataset.def = map.get(ch) ?? "";
      span.className = "sym-def";
      el.appendChild(span);
    }
  }
}

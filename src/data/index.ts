import type { Chapter } from "./types.ts";
import { foundations } from "./math-foundations.ts";
import { higher } from "./math-higher.ts";
import { sciences } from "./sciences.ts";
import { lawsChapter } from "./laws.ts";
import { sequencesChapter } from "./sequences.ts";

const pool = new Map<string, Chapter>(
  [...foundations, ...higher, ...sciences, sequencesChapter, lawsChapter].map((chapter) => [
    chapter.slug,
    chapter,
  ]),
);

const order = [
  "arithmetic",
  "algebra",
  "geometry",
  "trigonometry",
  "functions",
  "sequences",
  "differential-calculus",
  "integral-calculus",
  "linear-algebra",
  "multivariable",
  "probability",
  "discrete",
  "proof",
  "differential-equations",
  "number-theory",
  "real-analysis",
  "complex-analysis",
  "abstract-algebra",
  "topology",
  "frontier",
  "mechanics",
  "energy-waves",
  "electromagnetism",
  "modern-physics",
  "laws",
  "quantities-gases",
  "equilibrium-energy",
  "acids-electrochemistry",
  "populations-genetics",
  "physiology",
];

export const chapters: Chapter[] = order.map((slug) => {
  const chapter = pool.get(slug);
  if (!chapter) throw new Error(`Missing chapter: ${slug}`);
  return chapter;
});

export const chapterBySlug = new Map(chapters.map((chapter) => [chapter.slug, chapter]));

export const formulaCount = chapters.reduce((count, chapter) => count + chapter.formulas.length, 0);

export function neighbors(slug: string) {
  const index = chapters.findIndex((chapter) => chapter.slug === slug);
  return {
    index,
    prev: index > 0 ? chapters[index - 1] : null,
    next: index >= 0 && index < chapters.length - 1 ? chapters[index + 1] : null,
  };
}

export const paths: { title: string; blurb: string; slugs: string[] }[] = [
  {
    title: "The foundations",
    blurb: "Number, algebra, shape, functions, and the sequences they generate.",
    slugs: ["arithmetic", "algebra", "geometry", "trigonometry", "functions", "sequences"],
  },
  {
    title: "Calculus and linear algebra",
    blurb: "Change, accumulation, and the geometry of linear maps.",
    slugs: [
      "differential-calculus",
      "integral-calculus",
      "linear-algebra",
      "multivariable",
      "differential-equations",
    ],
  },
  {
    title: "Pure mathematics",
    blurb: "Proof, number, limit, structure, shape, and the frontier.",
    slugs: [
      "discrete",
      "proof",
      "number-theory",
      "real-analysis",
      "complex-analysis",
      "abstract-algebra",
      "topology",
      "frontier",
    ],
  },
  {
    title: "The sciences",
    blurb: "The formulas physics, chemistry, and biology compute with.",
    slugs: [
      "mechanics",
      "energy-waves",
      "electromagnetism",
      "modern-physics",
      "laws",
      "quantities-gases",
      "equilibrium-energy",
      "acids-electrochemistry",
      "populations-genetics",
      "physiology",
    ],
  },
];

export const constants: { symbol: string; name: string; value: string }[] = [
  { symbol: "π", name: "Circle constant", value: "3.14159…" },
  { symbol: "e", name: "Base of the natural logarithm", value: "2.71828…" },
  { symbol: "g", name: "Standard gravity", value: "9.80665 m/s²" },
  { symbol: "G", name: "Gravitational constant", value: "6.67430×10⁻¹¹ N·m²/kg²" },
  { symbol: "c", name: "Speed of light", value: "2.99792458×10⁸ m/s" },
  { symbol: "h", name: "Planck constant", value: "6.62607015×10⁻³⁴ J·s" },
  { symbol: "k", name: "Coulomb constant", value: "8.98755×10⁹ N·m²/C²" },
  { symbol: "R", name: "Gas constant", value: "8.314 J/(mol·K)" },
  { symbol: "Nₐ", name: "Avogadro constant", value: "6.02214076×10²³ /mol" },
  { symbol: "F", name: "Faraday constant", value: "96485 C/mol" },
  { symbol: "k_B", name: "Boltzmann constant", value: "1.380649×10⁻²³ J/K" },
  { symbol: "σ", name: "Stefan–Boltzmann constant", value: "5.670374419×10⁻⁸ W·m⁻²·K⁻⁴" },
  { symbol: "b", name: "Wien displacement constant", value: "2.897771955×10⁻³ m·K" },
  { symbol: "K_w", name: "Water ion product, 25 °C", value: "1.0×10⁻¹⁴" },
];

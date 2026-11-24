export type VolumeId = "mathematics" | "physics" | "chemistry" | "biology";

export type Level = "foundational" | "intermediate" | "advanced" | "frontier";

/** LaTeX written once. `L`\frac{a}{b}`` — no doubled backslashes. */
export function L(strings: TemplateStringsArray): string {
  return strings.raw[0] ?? "";
}

export type Formula = {
  id: string;
  name: string;
  tex: string;
  meaning: string;
  symbols: { sym: string; means: string }[];
};

export type Worked = {
  title: string;
  prompt: string;
  steps: string[];
  answer: string;
};

export type Chapter = {
  slug: string;
  volume: VolumeId;
  level: Level;
  title: string;
  minutes: number;
  summary: string;
  prereqs: string[];
  ideas: string[];
  body: string[];
  formulas: Formula[];
  examples: Worked[];
  practice: { q: string; a: string }[];
  pitfalls: string[];
};

export const levelLabel: Record<Level, string> = {
  foundational: "Foundational",
  intermediate: "Intermediate",
  advanced: "Advanced",
  frontier: "Frontier",
};

export function volumeTitle(id: VolumeId) {
  return volumes.find((volume) => volume.id === id)?.title ?? id;
}

export const volumes: {
  id: VolumeId;
  title: string;
  lede: string;
}[] = [
  {
    id: "mathematics",
    title: "Mathematics",
    lede: "From counting and shape to proof, structure, and the frontier.",
  },
  {
    id: "physics",
    title: "Physics",
    lede: "Motion, energy, fields, light, and the constants that set their scale.",
  },
  {
    id: "chemistry",
    title: "Chemistry",
    lede: "Amounts, gases, equilibrium, energy, acids, and charge.",
  },
  {
    id: "biology",
    title: "Biology",
    lede: "Growth, genes, enzymes, membranes, and the physics cells obey.",
  },
];

import katex from "katex";
import { chapterBySlug, chapters, paths } from "../src/data/index.ts";
import { volumes } from "../src/data/types.ts";
import { chunkText } from "../src/lib/speech/engine.ts";
import { buildLesson, formulaSpeech } from "../src/lib/speech/lesson.ts";
import { texToSpeech, textToSpeech } from "../src/lib/speech/tex-speech.ts";
import { symbolKey } from "../src/lib/symbols.ts";

let failed = 0;
let checks = 0;

function check(name: string, cond: boolean, detail?: unknown) {
  checks += 1;
  if (!cond) {
    failed += 1;
    console.error("FAIL", name, detail === undefined ? "" : detail);
  }
}

function unique(name: string, values: string[]) {
  const seen = new Set<string>();
  for (const value of values) {
    check(`${name}: duplicate "${value.slice(0, 60)}"`, !seen.has(value));
    seen.add(value);
  }
}

// --- The book's structure -------------------------------------------------

unique(
  "chapter slugs",
  chapters.map((chapter) => chapter.slug),
);
for (const volume of volumes) {
  check(
    `volume ${volume.id} has chapters`,
    chapters.some((chapter) => chapter.volume === volume.id),
  );
}
for (const path of paths) {
  for (const slug of path.slugs)
    check(`path ${path.title}: ${slug} exists`, chapterBySlug.has(slug));
}

for (const chapter of chapters) {
  const where = chapter.slug;
  for (const prereq of chapter.prereqs)
    check(`${where}: prereq ${prereq} exists`, chapterBySlug.has(prereq));
  // These lists are used as React keys and lesson anchors, so they must be unique.
  unique(
    `${where} body`,
    chapter.body.map((paragraph) => paragraph.slice(0, 48)),
  );
  unique(`${where} ideas`, chapter.ideas);
  unique(
    `${where} formula ids`,
    chapter.formulas.map((formula) => formula.id),
  );
  unique(
    `${where} examples`,
    chapter.examples.map((example) => example.title),
  );
  unique(
    `${where} practice`,
    chapter.practice.map((item) => item.q),
  );
  unique(`${where} pitfalls`, chapter.pitfalls);
  for (const example of chapter.examples) unique(`${where} ${example.title} steps`, example.steps);

  for (const formula of chapter.formulas) {
    unique(
      `${where}/${formula.id} symbols`,
      formula.symbols.map((symbol) => symbol.sym),
    );
    check(`${where}/${formula.id} has a meaning`, formula.meaning.trim().length > 0);
    try {
      katex.renderToString(formula.tex, { throwOnError: true, strict: "ignore", output: "html" });
    } catch (error) {
      check(`${where}/${formula.id} renders`, false, (error as Error).message);
    }
    const spoken = texToSpeech(formula.tex);
    check(`${where}/${formula.id} speaks`, spoken.length > 0);
    check(`${where}/${formula.id} speech has no TeX left`, !/[\\{}^_]/.test(spoken), spoken);
  }
}

// --- Statistics volume ----------------------------------------------------

const stats = chapters.filter((chapter) => chapter.volume === "statistics");
check(
  "statistics has basic, intermediate, and advanced chapters",
  ["foundational", "intermediate", "advanced"].every((level) =>
    stats.some((chapter) => chapter.level === level),
  ),
);
check(
  "statistics has a chapter on pitfalls",
  chapterBySlug.get("statistical-pitfalls")?.volume === "statistics",
);
for (const chapter of stats) {
  check(`${chapter.slug} has formulas`, chapter.formulas.length >= 5);
  check(`${chapter.slug} has worked examples`, chapter.examples.length >= 4);
  check(`${chapter.slug} has practice`, chapter.practice.length >= 4);
  check(`${chapter.slug} has pitfalls`, chapter.pitfalls.length >= 5);
  for (const formula of chapter.formulas) {
    check(`${chapter.slug}/${formula.id} explains its variables`, formula.symbols.length > 0);
  }
}

// --- Reading math aloud ---------------------------------------------------

const tex: [string, string][] = [
  [String.raw`\frac{a}{b}`, "a over b"],
  [String.raw`\frac12 at^2`, "1 over 2 a t squared"],
  [String.raw`x_i`, "x sub i"],
  [String.raw`\bar{x}`, "x bar"],
  [String.raw`\hat{p}`, "p hat"],
  [String.raw`s^2`, "s squared"],
  [String.raw`P(A\mid B)`, "P of A given B"],
  [String.raw`\sum_{i=1}^{n} x_i`, "the sum from i equals 1 to n of x sub i"],
  [String.raw`\sqrt{n}`, "the square root of n"],
  [String.raw`(x-\mu)^2`, "the quantity x minus mu, squared"],
  [String.raw`\rho\,(x-\mu)`, "rho times the quantity x minus mu,"],
  [String.raw`(X^{\mathsf T}X)^{-1}`, "the quantity X transpose X, inverse"],
  [String.raw`\binom{n}{k}`, "n choose k"],
  [String.raw`\lim_{x\to 0} f(x)`, "the limit as x approaches 0 of f of x"],
  [String.raw`PV=nRT`, "P V equals n R T"],
  [String.raw`\chi^2`, "chi squared"],
];
for (const [input, expected] of tex) {
  const actual = texToSpeech(input);
  check(`speak ${input}`, actual === expected.replace(/,$/, ""), actual);
}

const text: [string, string][] = [
  ["x̄", "x bar"],
  ["ȳ", "y bar"],
  ["p̂", "p hat"],
  ["s²", "s squared"],
  ["0.95²⁰", "0.95 to the 20"],
  ["x_i, y_i", "x sub i, y sub i"],
  ["P(A | B)", "P of A given B"],
  ["(x − μ) / σ", "x minus mu divided by sigma"],
  ["13/52", "13 over 52"],
  ["Xᵀ", "X transpose"],
];
for (const [input, expected] of text) {
  const actual = textToSpeech(input);
  check(`read ${input}`, actual === expected, actual);
}

// --- Guided lessons -------------------------------------------------------

for (const chapter of chapters) {
  const lesson = buildLesson(chapter);
  const questions = lesson.filter((segment) => segment.kind === "question");
  check(
    `${chapter.slug}: one question per practice item`,
    questions.length === chapter.practice.length,
  );
  lesson.forEach((segment, i) => {
    if (segment.kind === "question") {
      check(`${chapter.slug}: question ${segment.practice} waits`, segment.wait === true);
      check(
        `${chapter.slug}: question ${segment.practice} is followed by its answer`,
        lesson[i + 1]?.kind === "answer" && lesson[i + 1]?.practice === segment.practice,
      );
    }
    check(`${chapter.slug}: segment ${i} says something`, segment.speech.trim().length > 0);
  });
  check(
    `${chapter.slug}: every formula is in the lesson`,
    chapter.formulas.every((formula) => lesson.some((segment) => segment.anchor === formula.id)),
  );
}

const sampleMean = chapterBySlug
  .get("descriptive-statistics")
  ?.formulas.find((formula) => formula.id === "sample-mean");
if (sampleMean) {
  const spoken = formulaSpeech(sampleMean, 1);
  check("formula speech names the formula", spoken.startsWith("Formula 1: Sample mean."), spoken);
  check("formula speech explains a variable", spoken.includes("x bar is the sample mean"), spoken);
}

const long = "One two three, four five six. ".repeat(40);
const chunks = chunkText(long, 120);
check(
  "chunks stay short",
  chunks.every((chunk) => chunk.length <= 120),
  chunks.map((chunk) => chunk.length),
);
check(
  "chunks keep every word",
  chunks.join(" ").split(/\s+/).length === long.trim().split(/\s+/).length,
);

// --- Hover matching -------------------------------------------------------

// KaTeX renders \bar{x} as "x" followed by "ˉ", and \hat{p} as "p" followed by "^".
check("x̄ matches \\bar{x}", symbolKey("x̄") === "xˉ");
check("ȳ matches \\bar{y}", symbolKey("ȳ") === "yˉ");
check("p̂ matches \\hat{p}", symbolKey("p̂") === "p^");
check("μ_0 matches \\mu_0", symbolKey("μ_0") === "μ0");

if (failed > 0) {
  console.error(`${failed} of ${checks} content checks failed`);
  process.exit(1);
}
console.log(`ok, ${checks} content checks across ${chapters.length} chapters`);

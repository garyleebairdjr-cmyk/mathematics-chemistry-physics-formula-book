import type { Chapter, Formula } from "../../data/types.ts";
import { levelLabel, volumeTitle } from "../../data/types.ts";
import { splitSentences } from "./sentences.ts";
import { texToSpeech, textToSpeech } from "./tex-speech.ts";

/** Who speaks a segment. The tutor voice asks and answers the practice questions. */
export type Role = "narrator" | "tutor";

/**
 * One spoken piece of a segment, usually a sentence. The stage shows `text`;
 * the page highlights sentence `say` inside the element marked `target`.
 */
export type Part = {
  /** cue: spoken only ("Step 2."). tex: a formula. symbol: one variable explained. */
  kind: "cue" | "text" | "tex" | "symbol";
  text: string;
  speech: string;
  target?: string;
  say?: number;
  /** For symbol parts: the symbol as written and what it means here. */
  sym?: string;
  means?: string;
};

export type Segment = {
  /** Matches the data-lesson attribute of the element it reads. */
  anchor: string;
  kind: "intro" | "heading" | "text" | "formula" | "step" | "question" | "answer" | "outro";
  role: Role;
  parts: Part[];
  /** Everything the voice says, in one string. */
  speech: string;
  /** A short line for the mini player. */
  caption: string;
  /** For formula segments: the formula, kept on stage while it is explained. */
  formula?: Formula;
  /** Stop after this segment and wait for the student to try the question. */
  wait?: boolean;
  /** Index of the practice question this segment belongs to. */
  practice?: number;
};

function lowerFirst(text: string): string {
  if (!text) return text;
  // Keep acronyms and proper nouns such as "P(B)" or "Type I" intact.
  if (/^[A-Z][A-Z0-9(]/.test(text)) return text;
  return text[0].toLowerCase() + text.slice(1);
}

function sentence(text: string): string {
  const trimmed = text.trim();
  return /[.!?:]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

function cue(speech: string): Part {
  return { kind: "cue", text: "", speech };
}

/** The sentences of a block of prose, each tied to its place on the page. */
export function sentenceParts(target: string, text: string): Part[] {
  return splitSentences(text).map((piece, say) => ({
    kind: "text",
    text: piece,
    speech: textToSpeech(piece),
    target,
    say,
  }));
}

/** The parts that explain a formula: its name, the formula, its meaning, then each symbol. */
export function formulaParts(formula: Formula, number?: number): Part[] {
  const lead = number ? `Formula ${number}: ${formula.name}.` : `${formula.name}.`;
  const parts: Part[] = [
    { kind: "text", text: formula.name, speech: lead, target: `${formula.id}-name`, say: 0 },
    { kind: "tex", text: formula.tex, speech: sentence(texToSpeech(formula.tex)) },
    ...sentenceParts(`${formula.id}-meaning`, formula.meaning),
  ];
  formula.symbols.forEach((symbol, k) => {
    const said = `${textToSpeech(symbol.sym)} is ${textToSpeech(lowerFirst(symbol.means))}`;
    parts.push({
      kind: "symbol",
      text: symbol.means,
      speech: sentence(k === 0 ? `Here, ${said}` : said),
      target: `${formula.id}-sym-${k}`,
      say: 0,
      sym: symbol.sym,
      means: symbol.means,
    });
  });
  return parts;
}

function joined(parts: Part[]): string {
  return parts
    .map((part) => part.speech.trim())
    .filter(Boolean)
    .join(" ");
}

/** Spoken explanation of a formula: its name, the formula, what it means, and each symbol. */
export function formulaSpeech(formula: Formula, number?: number): string {
  return joined(formulaParts(formula, number));
}

/** The whole guided lesson for a chapter, in reading order. */
export function buildLesson(chapter: Chapter): Segment[] {
  const out: Segment[] = [];
  const push = (segment: Omit<Segment, "speech">) =>
    out.push({ ...segment, speech: joined(segment.parts) });

  push({
    anchor: "lesson-intro",
    kind: "intro",
    role: "narrator",
    caption: chapter.title,
    parts: [
      {
        kind: "text",
        text: chapter.title,
        speech: `${chapter.title}.`,
        target: "lesson-title",
        say: 0,
      },
      cue(
        `A ${levelLabel[chapter.level].toLowerCase()} lesson in ${volumeTitle(chapter.volume).toLowerCase()}.`,
      ),
      ...sentenceParts("lesson-summary", chapter.summary),
    ],
  });

  chapter.body.forEach((paragraph, i) => {
    push({
      anchor: `lesson-body-${i}`,
      kind: "text",
      role: "narrator",
      caption: paragraph,
      parts: [
        ...(i === 0 ? [cue("The idea.")] : []),
        ...sentenceParts(`lesson-body-${i}`, paragraph),
      ],
    });
  });

  chapter.ideas.forEach((idea, i) => {
    push({
      anchor: `lesson-idea-${i}`,
      kind: "text",
      role: "narrator",
      caption: idea,
      parts: [
        ...(i === 0 ? [cue("Hold onto these.")] : []),
        cue(`${i + 1}.`),
        ...sentenceParts(`lesson-idea-${i}`, idea),
      ],
    });
  });

  chapter.formulas.forEach((formula, i) => {
    push({
      anchor: formula.id,
      kind: "formula",
      role: "narrator",
      caption: formula.name,
      formula,
      parts: [...(i === 0 ? [cue("Now the formulas.")] : []), ...formulaParts(formula, i + 1)],
    });
  });

  chapter.examples.forEach((example, i) => {
    push({
      anchor: `lesson-example-${i}`,
      kind: "heading",
      role: "narrator",
      caption: example.title,
      parts: [
        ...(i === 0 ? [cue("Worked examples.")] : []),
        {
          kind: "text",
          text: example.title,
          speech: `Example ${i + 1}: ${example.title}.`,
          target: `lesson-example-${i}-title`,
          say: 0,
        },
        ...sentenceParts(`lesson-example-${i}-prompt`, example.prompt),
      ],
    });
    example.steps.forEach((step, j) => {
      const anchor = `lesson-example-${i}-step-${j}`;
      push({
        anchor,
        kind: "step",
        role: "narrator",
        caption: step,
        parts: [cue(`Step ${j + 1}.`), ...sentenceParts(anchor, step)],
      });
    });
    const answer = `lesson-example-${i}-answer`;
    push({
      anchor: answer,
      kind: "text",
      role: "narrator",
      caption: example.answer,
      parts: [cue("So:"), ...sentenceParts(answer, example.answer)],
    });
  });

  chapter.practice.forEach((item, i) => {
    push({
      anchor: `lesson-practice-${i}`,
      kind: "question",
      role: "tutor",
      caption: item.q,
      parts: [
        ...(i === 0 ? [cue("Your turn.")] : []),
        cue(`Question ${i + 1}.`),
        ...sentenceParts(`lesson-practice-${i}-q`, item.q),
        cue("Take a moment to work it out, then show the answer."),
      ],
      wait: true,
      practice: i,
    });
    push({
      anchor: `lesson-practice-${i}`,
      kind: "answer",
      role: "tutor",
      caption: item.a,
      parts: [cue("Here is the answer."), ...sentenceParts(`lesson-practice-${i}-a`, item.a)],
      practice: i,
    });
  });

  chapter.pitfalls.forEach((pitfall, i) => {
    push({
      anchor: `lesson-pitfall-${i}`,
      kind: "text",
      role: "narrator",
      caption: pitfall,
      parts: [
        ...(i === 0 ? [cue("Finally, the mistakes to watch for.")] : []),
        ...sentenceParts(`lesson-pitfall-${i}`, pitfall),
      ],
    });
  });

  push({
    anchor: "lesson-outro",
    kind: "outro",
    role: "narrator",
    caption: "End of the lesson",
    parts: [
      {
        kind: "text",
        text: `That is the end of ${chapter.title}.`,
        speech: `That is the end of ${chapter.title}. Mark the chapter read when you are ready, or replay any section.`,
      },
    ],
  });

  return out;
}

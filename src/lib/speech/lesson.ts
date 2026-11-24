import type { Chapter, Formula } from "../../data/types.ts";
import { levelLabel, volumeTitle } from "../../data/types.ts";
import { texToSpeech, textToSpeech } from "./tex-speech.ts";

/** Who speaks a segment. The tutor voice asks and answers the practice questions. */
export type Role = "narrator" | "tutor";

export type Segment = {
  /** Matches the data-lesson attribute of the element it reads. */
  anchor: string;
  kind: "intro" | "heading" | "text" | "formula" | "step" | "question" | "answer" | "outro";
  role: Role;
  /** What the voice says. */
  speech: string;
  /** What the caption shows. */
  caption: string;
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

/** Spoken explanation of a formula: its name, the formula, what it means, and each symbol. */
export function formulaSpeech(formula: Formula, number?: number): string {
  const lead = number ? `Formula ${number}: ${formula.name}.` : `${formula.name}.`;
  const symbols = formula.symbols
    .map((symbol) => `${textToSpeech(symbol.sym)} is ${textToSpeech(lowerFirst(symbol.means))}`)
    .join("; ");
  return [
    lead,
    sentence(texToSpeech(formula.tex)),
    sentence(textToSpeech(formula.meaning)),
    symbols ? sentence(`Here, ${symbols}`) : "",
  ]
    .filter(Boolean)
    .join(" ");
}

/** The whole guided lesson for a chapter, in reading order. */
export function buildLesson(chapter: Chapter): Segment[] {
  const out: Segment[] = [];
  const push = (segment: Segment) => out.push(segment);

  push({
    anchor: "lesson-intro",
    kind: "intro",
    role: "narrator",
    caption: chapter.title,
    speech: `${chapter.title}. A ${levelLabel[chapter.level].toLowerCase()} lesson in ${volumeTitle(chapter.volume).toLowerCase()}. ${textToSpeech(chapter.summary)}`,
  });

  chapter.body.forEach((paragraph, i) => {
    push({
      anchor: `lesson-body-${i}`,
      kind: "text",
      role: "narrator",
      caption: paragraph,
      speech: (i === 0 ? "The idea. " : "") + textToSpeech(paragraph),
    });
  });

  chapter.ideas.forEach((idea, i) => {
    push({
      anchor: `lesson-idea-${i}`,
      kind: "text",
      role: "narrator",
      caption: idea,
      speech: (i === 0 ? "Hold onto these. " : "") + `${i + 1}. ${textToSpeech(idea)}`,
    });
  });

  chapter.formulas.forEach((formula, i) => {
    push({
      anchor: formula.id,
      kind: "formula",
      role: "narrator",
      caption: formula.name,
      speech: (i === 0 ? "Now the formulas. " : "") + formulaSpeech(formula, i + 1),
    });
  });

  chapter.examples.forEach((example, i) => {
    push({
      anchor: `lesson-example-${i}`,
      kind: "heading",
      role: "narrator",
      caption: example.title,
      speech: `${i === 0 ? "Worked examples. " : ""}Example ${i + 1}: ${example.title}. ${textToSpeech(example.prompt)}`,
    });
    example.steps.forEach((step, j) => {
      push({
        anchor: `lesson-example-${i}-step-${j}`,
        kind: "step",
        role: "narrator",
        caption: step,
        speech: `Step ${j + 1}. ${textToSpeech(step)}`,
      });
    });
    push({
      anchor: `lesson-example-${i}-answer`,
      kind: "text",
      role: "narrator",
      caption: example.answer,
      speech: `So: ${textToSpeech(example.answer)}`,
    });
  });

  chapter.practice.forEach((item, i) => {
    push({
      anchor: `lesson-practice-${i}`,
      kind: "question",
      role: "tutor",
      caption: item.q,
      speech: `${i === 0 ? "Your turn. " : ""}Question ${i + 1}. ${textToSpeech(item.q)} Take a moment to work it out, then show the answer.`,
      wait: true,
      practice: i,
    });
    push({
      anchor: `lesson-practice-${i}`,
      kind: "answer",
      role: "tutor",
      caption: item.a,
      speech: `Here is the answer. ${textToSpeech(item.a)}`,
      practice: i,
    });
  });

  chapter.pitfalls.forEach((pitfall, i) => {
    push({
      anchor: `lesson-pitfall-${i}`,
      kind: "text",
      role: "narrator",
      caption: pitfall,
      speech: (i === 0 ? "Finally, the mistakes to watch for. " : "") + textToSpeech(pitfall),
    });
  });

  push({
    anchor: "lesson-outro",
    kind: "outro",
    role: "narrator",
    caption: "End of the lesson",
    speech: `That is the end of ${chapter.title}. Mark the chapter read when you are ready, or replay any section.`,
  });

  return out;
}

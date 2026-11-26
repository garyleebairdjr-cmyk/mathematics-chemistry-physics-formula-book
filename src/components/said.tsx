import { useMemo } from "react";
import { splitSentences } from "@/lib/speech/sentences";
import { sentenceState, useLesson } from "@/lib/speech/lesson-store";

/**
 * Prose that reads along with the guided lesson. Each sentence is a span: the
 * one being spoken lights up, the ones already spoken fade, and while a lesson
 * is open, tapping a sentence reads from there.
 */
export function Said({ target, text }: { target: string; text: string }) {
  const sentences = useMemo(() => splitSentences(text), [text]);
  // One string per render keeps re-renders to the blocks whose highlight changed.
  const states = useLesson((state) =>
    state.segments[state.index]?.parts.some((part) => part.target === target)
      ? sentences.map((_, i) => sentenceState(state, target, i) ?? "").join("|")
      : "",
  );
  const reading = useLesson((state) => state.segments.length > 0);
  const playAt = useLesson((state) => state.playAt);
  const marks = states ? states.split("|") : [];

  return (
    <>
      {sentences.map((sentence, i) => (
        <span key={i}>
          {i > 0 ? " " : null}
          <span
            className="say"
            data-state={marks[i] || undefined}
            onClick={
              reading
                ? () => {
                    // Selecting text should not jump the lesson.
                    if (window.getSelection()?.toString()) return;
                    playAt(target, i);
                  }
                : undefined
            }
          >
            {sentence}
          </span>
        </span>
      ))}
    </>
  );
}

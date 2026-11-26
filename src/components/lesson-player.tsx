import {
  Eye,
  Headphones,
  Keyboard,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  Settings2,
  SkipBack,
  SkipForward,
  Square,
  Volume2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { SymbolTex } from "@/components/symbol-tex";
import { SymText } from "@/components/sym-text";
import { VoiceVisualizer } from "@/components/voice-visualizer";
import { useSpeechStatus } from "@/lib/speech/use-speech-status";
import type { Chapter } from "@/data/types";
import { speechSupported } from "@/lib/speech/engine";
import { buildLesson, type Segment } from "@/lib/speech/lesson";
import { SPEEDS, useLesson, useVoicePrefs, voiceFor } from "@/lib/speech/lesson-store";
import { characterName } from "@/lib/speech/characters";
import { useSettings } from "@/lib/settings";

/** Typical speaking pace, in characters per second at 1×. */
const CHARS_PER_SECOND = 14.5;

function useSupported() {
  const [supported, setSupported] = useState(true);
  const engine = useVoicePrefs((state) => state.engine);
  useEffect(() => setSupported(speechSupported() || engine !== "device"), [engine]);
  return supported;
}

function clock(seconds: number): string {
  const s = Math.max(0, Math.round(seconds));
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, "0")}`;
}

function remainingSeconds(segments: Segment[], index: number, part: number, rate: number) {
  let chars = 0;
  segments.forEach((segment, i) => {
    if (i < index) return;
    segment.parts.forEach((p, j) => {
      if (i === index && j < part) return;
      chars += p.speech.length;
    });
  });
  return chars / (CHARS_PER_SECOND * rate);
}

function lessonSeconds(segments: Segment[]) {
  return segments.reduce((sum, segment) => sum + segment.speech.length, 0) / CHARS_PER_SECOND;
}

// --- Launcher -------------------------------------------------------------------

/** The card at the top of a chapter that starts the guided lesson. */
export function LessonLauncher({ chapter }: { chapter: Chapter }) {
  const active = useLesson((state) => state.slug === chapter.slug);
  const open = useLesson((state) => state.open);
  const play = useLesson((state) => state.play);
  const setStage = useLesson((state) => state.setStage);
  const supported = useSupported();
  const minutes = useMemo(
    () => Math.max(1, Math.round(lessonSeconds(buildLesson(chapter)) / 60)),
    [chapter],
  );

  if (!supported) {
    return (
      <p className="panel mt-6 p-4 text-sm text-muted">
        This browser cannot speak text, so the read-along lesson is not available here. Current
        versions of Chrome, Edge, Safari, and Firefox support it, or connect a voice server in the
        settings.
      </p>
    );
  }

  const start = (focus: boolean) => {
    if (!active) open(chapter.slug, chapter.title, buildLesson(chapter));
    setStage(focus);
    play(active ? undefined : 0);
  };

  return (
    <section className="panel relative mt-8 overflow-hidden p-5 sm:p-6">
      <div
        className="pointer-events-none absolute -top-24 -right-24 size-64 rounded-full opacity-30 blur-3xl"
        style={{ background: "var(--color-glow)" }}
        aria-hidden
      />
      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient text-on-accent shadow-lg">
          <Headphones className="size-7" aria-hidden />
        </div>
        <div className="flex-1">
          <p className="text-xs font-semibold tracking-[0.14em] text-accent uppercase">
            Read-along lesson · about {minutes} min
          </p>
          <h2 className="mt-1 font-display text-xl font-semibold">Listen while you read</h2>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            A voice reads each sentence as it lights up, says every formula aloud and points at each
            symbol, steps through the worked examples, then pauses on the practice questions so you
            can try them first. Tap any sentence to read from there.
          </p>
        </div>
      </div>
      <div className="relative mt-5 flex flex-wrap gap-3">
        <button type="button" className="btn-primary" onClick={() => start(false)}>
          <Play className="size-4" aria-hidden />
          {active ? "Resume lesson" : "Start lesson"}
        </button>
        <button type="button" className="btn-ghost" onClick={() => start(true)}>
          <Maximize2 className="size-4" aria-hidden />
          Focus mode
        </button>
      </div>
    </section>
  );
}

/** A small button that reads one formula aloud, outside the lesson. */
export function ListenButton({ id, text, label }: { id: string; text: string; label: string }) {
  const listening = useLesson((state) => state.listening === id);
  const listen = useLesson((state) => state.listen);
  const supported = useSupported();
  if (!supported) return null;

  return (
    <button
      type="button"
      className={
        "inline-flex min-h-9 items-center justify-center gap-1.5 rounded-full border px-3 text-xs font-medium transition-colors " +
        (listening
          ? "border-accent bg-accent text-on-accent"
          : "border-line text-accent hover:border-accent")
      }
      aria-label={listening ? `Stop reading ${label}` : `Listen to ${label}`}
      aria-pressed={listening}
      onClick={() => listen(id, text)}
    >
      {listening ? (
        <Square className="size-3.5" aria-hidden />
      ) : (
        <Volume2 className="size-3.5" aria-hidden />
      )}
      <span>{listening ? "Stop" : "Listen"}</span>
    </button>
  );
}

const KIND_LABEL: Record<Segment["kind"], string> = {
  intro: "Introduction",
  heading: "Worked example",
  text: "Reading",
  formula: "Formula",
  step: "Step",
  question: "Your turn",
  answer: "Answer",
  outro: "Done",
};

// --- Keyboard -------------------------------------------------------------------

function useLessonKeys(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    const onKey = (event: KeyboardEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      if (target?.closest("input, textarea, select, [contenteditable='true']")) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const lesson = useLesson.getState();
      if (event.key === " " || event.key === "k") {
        if (target?.closest("button")) return;
        event.preventDefault();
        if (lesson.status === "waiting") lesson.reveal();
        else lesson.toggle();
      } else if (event.key === "ArrowRight" || event.key === "l") {
        event.preventDefault();
        lesson.next();
      } else if (event.key === "ArrowLeft" || event.key === "j") {
        event.preventDefault();
        lesson.prev();
      } else if (event.key === "a" && lesson.status === "waiting") {
        lesson.reveal();
      } else if (event.key === "f") {
        lesson.setStage(!lesson.stage);
      } else if (event.key === "Escape" && lesson.stage) {
        lesson.setStage(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [enabled]);
}

/** True while a neural voice is still generating the sentence the lesson is on. */
function usePreparing() {
  const playing = useLesson((state) => state.status === "playing");
  const neural = useVoicePrefs((state) => state.engine !== "device");
  const { speaking } = useSpeechStatus();
  return playing && neural && !speaking;
}

function openVoice() {
  useSettings.getState().show("voice");
}

// --- Mini player ------------------------------------------------------------------

/** The floating player at the bottom of the chapter while a lesson is open, plus the stage. */
export function LessonBar({ slug }: { slug: string }) {
  const lesson = useLesson();
  const preparing = usePreparing();
  const active = lesson.slug === slug && lesson.segments.length > 0;
  const segment = active ? lesson.segments[lesson.index] : undefined;
  useLessonKeys(active);

  // Close the lesson when leaving the chapter.
  useEffect(() => {
    return () => {
      if (useLesson.getState().slug === slug) useLesson.getState().close();
    };
  }, [slug]);

  // Highlight and scroll to the block being read.
  useEffect(() => {
    if (!segment) return;
    const el =
      document.querySelector<HTMLElement>(`[data-lesson="${CSS.escape(segment.anchor)}"]`) ??
      document.getElementById(segment.anchor);
    if (!el) return;
    el.classList.add("lesson-current");
    if (!useLesson.getState().stage) {
      const rect = el.getBoundingClientRect();
      const hidden = rect.top < 80 || rect.bottom > window.innerHeight - 200;
      if (hidden) {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        el.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" });
      }
    }
    return () => el.classList.remove("lesson-current");
  }, [segment]);

  if (!active || !segment) return null;

  const playing = lesson.status === "playing";
  const waiting = lesson.status === "waiting";
  const progress = ((lesson.index + 1) / lesson.segments.length) * 100;

  // Portaled to <body> so the stage and the player sit above the sticky header.
  return createPortal(
    <>
      {lesson.stage ? <LessonStage onSettings={openVoice} /> : null}
      {!lesson.stage ? (
        <div
          className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
          role="region"
          aria-label="Read-along player"
        >
          <div className="glass mx-auto max-w-3xl overflow-hidden rounded-2xl border border-line shadow-[0_18px_60px_-20px_rgba(0,0,0,0.55)]">
            <div className="h-1 bg-line/60">
              <div
                className="bg-gradient h-1 transition-[width] duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex items-center gap-3 px-3 py-2.5">
              <button
                type="button"
                className="play-orb inline-flex size-12 shrink-0 items-center justify-center"
                data-live={playing}
                aria-label={waiting ? "Show answer" : playing ? "Pause" : "Play"}
                onClick={() => (waiting ? lesson.reveal() : lesson.toggle())}
              >
                {waiting ? (
                  <Eye className="size-5" />
                ) : playing ? (
                  <Pause className="size-5" />
                ) : (
                  <Play className="ml-0.5 size-5" />
                )}
              </button>
              <div className="min-w-0 flex-1" aria-live="polite">
                <p className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.12em] text-accent uppercase">
                  <span>{KIND_LABEL[segment.kind]}</span>
                  <span className="mono text-muted">
                    {lesson.index + 1}/{lesson.segments.length}
                  </span>
                  {waiting ? <span className="text-ink">· press Show answer</span> : null}
                  {preparing ? (
                    <span className="animate-pulse text-muted normal-case">· preparing voice…</span>
                  ) : null}
                </p>
                <p className="mt-0.5 line-clamp-1 text-sm">{segment.caption}</p>
              </div>
              <VoiceVisualizer bars={18} className="hidden h-8 w-24 shrink-0 sm:block" />
              <div className="flex shrink-0 items-center">
                <IconButton label="Previous (←)" onClick={lesson.prev}>
                  <SkipBack className="size-[18px]" />
                </IconButton>
                <IconButton label="Next (→)" onClick={lesson.next}>
                  <SkipForward className="size-[18px]" />
                </IconButton>
                <IconButton
                  label="Focus mode (F)"
                  className="hidden min-[420px]:inline-flex"
                  onClick={() => lesson.setStage(true)}
                >
                  <Maximize2 className="size-[18px]" />
                </IconButton>
                <IconButton label="Voice settings" onClick={openVoice}>
                  <Settings2 className="size-[18px]" />
                </IconButton>
                <IconButton label="Close lesson" onClick={lesson.close}>
                  <X className="size-[18px]" />
                </IconButton>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>,
    document.body,
  );
}

function IconButton({
  label,
  onClick,
  pressed,
  className = "",
  children,
}: {
  label: string;
  onClick: () => void;
  pressed?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className={
        "inline-flex size-10 items-center justify-center rounded-full transition-colors hover:bg-raise " +
        (pressed ? "bg-accent-soft text-accent " : "text-ink ") +
        className
      }
      aria-label={label}
      title={label}
      aria-pressed={pressed}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

// --- Focus stage ------------------------------------------------------------------

/** Full-screen read-along: the visualizer, the formula, and the sentences as they are read. */
function LessonStage({ onSettings }: { onSettings: () => void }) {
  const lesson = useLesson();
  const preparing = usePreparing();
  const rate = useVoicePrefs((state) => state.rate);
  const setRate = useVoicePrefs((state) => state.set);
  const status = useSpeechStatus();
  const dialog = useRef<HTMLDivElement>(null);
  const segment = lesson.segments[lesson.index];
  const current = segment?.parts[lesson.part];

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.current?.focus();
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  const totalParts = useMemo(
    () => lesson.segments.reduce((sum, s) => sum + s.parts.length, 0),
    [lesson.segments],
  );
  const doneParts = useMemo(
    () =>
      lesson.segments.slice(0, lesson.index).reduce((sum, s) => sum + s.parts.length, 0) +
      lesson.part,
    [lesson.segments, lesson.index, lesson.part],
  );
  if (!segment) return null;

  const playing = lesson.status === "playing";
  const waiting = lesson.status === "waiting";
  const left = remainingSeconds(lesson.segments, lesson.index, lesson.part, rate);
  const elapsed = lessonSeconds(lesson.segments) / rate - left;
  const nextSegment = lesson.segments[lesson.index + 1];
  const voice = voiceFor(segment.role);
  const prose = segment.parts
    .map((part, i) => ({ part, i }))
    .filter(({ part }) => part.kind === "text");
  const symbols = segment.parts
    .map((part, i) => ({ part, i }))
    .filter(({ part }) => part.kind === "symbol");
  const texLive = current?.kind === "tex";

  const seek = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const goal = ((event.clientX - rect.left) / rect.width) * totalParts;
    let count = 0;
    for (let i = 0; i < lesson.segments.length; i += 1) {
      count += lesson.segments[i].parts.length;
      if (count > goal) return lesson.play(i);
    }
  };

  return (
    <div
      ref={dialog}
      tabIndex={-1}
      className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-paper outline-none"
      role="dialog"
      aria-modal="true"
      aria-label="Read-along focus mode"
    >
      <div className="backdrop" aria-hidden />
      <header className="relative z-10 mx-auto flex w-full max-w-5xl items-center gap-3 px-4 pt-4">
        <div className="flex size-10 items-center justify-center rounded-xl bg-gradient text-on-accent">
          <Headphones className="size-5" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-display text-lg leading-tight font-semibold">
            Read<span className="font-flair text-xl font-normal italic text-gradient">along</span>
          </p>
          <p className="truncate text-xs text-muted">{lesson.title}</p>
        </div>
        <button type="button" className="btn-ghost !min-h-10 !px-3" onClick={onSettings}>
          <Settings2 className="size-4" aria-hidden />
          <span className="hidden sm:inline">Voice</span>
        </button>
        <button
          type="button"
          className="btn-ghost !min-h-10 !px-3"
          onClick={() => lesson.setStage(false)}
          title="Back to the chapter (Esc)"
        >
          <Minimize2 className="size-4" aria-hidden />
          <span className="hidden sm:inline">Chapter</span>
        </button>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-4">
        <div className="panel flex flex-1 flex-col p-4 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.6)] sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="chip mono !text-accent">
              {String(lesson.index + 1).padStart(2, "0")} / {lesson.segments.length}
            </span>
            <span className="chip">
              <span
                className={"size-1.5 rounded-full " + (status.speaking ? "bg-accent" : "bg-track")}
              />
              {segment.role === "tutor" ? "Tutor" : "Narrator"}
              {voice.web
                ? ` · ${characterName(voice.web.voice)}`
                : voice.server
                  ? ` · ${characterName(voice.server.voice || voice.server.model)}`
                  : ""}
            </span>
            <span className="chip">{KIND_LABEL[segment.kind]}</span>
            {preparing ? (
              <span className="chip animate-pulse !text-accent">Preparing voice…</span>
            ) : null}
            <span className="mono ml-auto text-xs text-muted">{clock(left)} left</span>
          </div>

          <VoiceVisualizer className="mt-5 h-16 w-full sm:h-20" />

          <div className="mt-6 flex flex-1 flex-col gap-6" aria-live="polite">
            {segment.formula ? (
              <div
                className={
                  "formula-hero rounded-2xl border px-4 py-6 text-center transition-all duration-300 " +
                  (texLive
                    ? "border-accent bg-accent-soft/60 shadow-[0_0_60px_-20px_var(--color-glow)]"
                    : "border-line bg-card/60")
                }
              >
                <SymbolTex
                  tex={segment.formula.tex}
                  symbols={segment.formula.symbols}
                  live={current?.kind === "symbol" ? current.means : undefined}
                  display
                />
              </div>
            ) : null}

            {segment.kind === "question" || segment.kind === "answer" ? (
              <p className="text-xs font-semibold tracking-[0.14em] text-accent uppercase">
                {segment.kind === "question"
                  ? `Question ${(segment.practice ?? 0) + 1}`
                  : `Answer ${(segment.practice ?? 0) + 1}`}
              </p>
            ) : null}

            <p className="font-display text-2xl leading-snug font-medium sm:text-3xl sm:leading-snug">
              {prose.map(({ part, i }) => (
                <span key={i}>
                  <span
                    role="button"
                    tabIndex={0}
                    className="say cursor-pointer"
                    data-state={i === lesson.part ? "now" : i < lesson.part ? "said" : undefined}
                    onClick={() => lesson.playAt(part.target ?? "", part.say ?? 0)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") lesson.playAt(part.target ?? "", part.say ?? 0);
                    }}
                  >
                    {part.text}
                  </span>{" "}
                </span>
              ))}
            </p>

            {symbols.length > 0 ? (
              <ul className="grid gap-2 sm:grid-cols-2">
                {symbols.map(({ part, i }) => {
                  const now = i === lesson.part;
                  return (
                    <li
                      key={i}
                      className={
                        "flex items-baseline gap-3 rounded-xl border px-3 py-2 text-sm transition-colors " +
                        (now
                          ? "border-accent bg-accent-soft text-ink"
                          : i < lesson.part
                            ? "border-line text-muted"
                            : "border-line")
                      }
                    >
                      <span className="font-serif text-lg font-semibold text-accent">
                        <SymText text={part.sym ?? ""} />
                      </span>
                      <span>{part.means}</span>
                    </li>
                  );
                })}
              </ul>
            ) : null}

            {waiting ? (
              <div className="fade-up flex flex-col items-start gap-3 rounded-2xl border border-accent/50 bg-accent-soft/50 p-4 sm:flex-row sm:items-center">
                <p className="flex-1 text-sm">
                  Work it out on paper first. When you are ready, show the answer.
                </p>
                <div className="flex gap-2">
                  <button type="button" className="btn-primary" onClick={lesson.reveal}>
                    <Eye className="size-4" aria-hidden />
                    Show answer
                  </button>
                  <button type="button" className="btn-ghost" onClick={lesson.skip}>
                    Skip
                  </button>
                </div>
              </div>
            ) : null}
          </div>

          <div className="mt-8">
            <div
              className="group relative h-2 cursor-pointer rounded-full bg-line/70"
              onClick={seek}
              role="presentation"
            >
              <div
                className="bg-gradient absolute inset-y-0 left-0 rounded-full transition-[width] duration-300"
                style={{ width: `${(doneParts / Math.max(1, totalParts)) * 100}%` }}
              />
              <div
                className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-paper bg-ink shadow transition-[left] duration-300"
                style={{ left: `${(doneParts / Math.max(1, totalParts)) * 100}%` }}
              />
            </div>
            <div className="mono mt-2 flex justify-between text-xs text-muted">
              <span>{clock(elapsed)}</span>
              <span>-{clock(left)}</span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-center gap-5">
            <IconButton
              label="Previous (←)"
              onClick={lesson.prev}
              className="!size-12 border border-line"
            >
              <SkipBack className="size-5" />
            </IconButton>
            <button
              type="button"
              className="play-orb inline-flex size-20 items-center justify-center"
              data-live={playing}
              aria-label={waiting ? "Show answer" : playing ? "Pause" : "Play"}
              onClick={() => (waiting ? lesson.reveal() : lesson.toggle())}
            >
              {waiting ? (
                <Eye className="size-8" />
              ) : playing ? (
                <Pause className="size-8" />
              ) : (
                <Play className="ml-1 size-8" />
              )}
            </button>
            <IconButton
              label="Next (→)"
              onClick={lesson.next}
              className="!size-12 border border-line"
            >
              <SkipForward className="size-5" />
            </IconButton>
          </div>

          {status.error && (voice.server || voice.web) ? (
            <p className="mt-3 text-center text-xs text-muted">
              Neural voice unavailable, so the built-in voice is reading. {status.error}
            </p>
          ) : null}
        </div>

        <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
          <div className="panel flex !rounded-full p-1" role="group" aria-label="Speed">
            {SPEEDS.map((speed) => (
              <button
                key={speed.rate}
                type="button"
                aria-pressed={rate === speed.rate}
                className={
                  "min-h-9 rounded-full px-3.5 text-sm font-medium transition-colors " +
                  (rate === speed.rate ? "bg-accent text-on-accent" : "text-muted hover:text-ink")
                }
                onClick={() => setRate({ rate: speed.rate })}
              >
                {speed.label}
              </button>
            ))}
          </div>
          {nextSegment ? (
            <p className="line-clamp-1 max-w-md text-sm text-muted">
              <span className="font-medium text-ink">Up next · </span>
              {nextSegment.caption}
            </p>
          ) : null}
          <p className="hidden items-center gap-1.5 text-xs text-muted lg:flex">
            <Keyboard className="size-3.5" aria-hidden />
            Space play · ← → move · F focus · Esc exit
          </p>
        </div>
      </main>
    </div>
  );
}

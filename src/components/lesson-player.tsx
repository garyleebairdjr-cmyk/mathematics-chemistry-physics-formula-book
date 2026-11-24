import {
  Eye,
  Headphones,
  Pause,
  Play,
  Settings2,
  SkipBack,
  SkipForward,
  Square,
  Volume2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Chapter } from "@/data/types";
import {
  listVoices,
  onVoicesChanged,
  speak,
  speechSupported,
  type VoiceOption,
} from "@/lib/speech/engine";
import { buildLesson } from "@/lib/speech/lesson";
import { RATES, useLesson, useVoicePrefs } from "@/lib/speech/lesson-store";

function useVoices(): VoiceOption[] {
  const [voices, setVoices] = useState<VoiceOption[]>([]);
  useEffect(() => {
    let alive = true;
    const load = () =>
      void listVoices().then((list) => {
        if (alive) setVoices(list);
      });
    load();
    const off = onVoicesChanged(load);
    return () => {
      alive = false;
      off();
    };
  }, []);
  return voices;
}

/** The card at the top of a chapter that starts the guided lesson. */
export function LessonLauncher({ chapter }: { chapter: Chapter }) {
  const active = useLesson((state) => state.slug === chapter.slug);
  const open = useLesson((state) => state.open);
  const play = useLesson((state) => state.play);
  const [supported, setSupported] = useState(true);

  useEffect(() => setSupported(speechSupported()), []);

  if (!supported) {
    return (
      <p className="mt-6 rounded-lg border border-line bg-card p-4 text-sm text-muted">
        This browser cannot speak text, so the guided lesson is not available here. Current versions
        of Chrome, Edge, Safari, and Firefox support it.
      </p>
    );
  }

  return (
    <section className="mt-6 flex flex-col gap-3 rounded-lg border border-line bg-card p-4 sm:flex-row sm:items-center">
      <Headphones className="size-6 shrink-0 text-accent" aria-hidden />
      <div className="flex-1">
        <h2 className="font-medium">Guided lesson</h2>
        <p className="mt-1 text-sm leading-relaxed text-muted">
          A voice reads the chapter, explains every formula and its symbols, walks through the
          examples step by step, then pauses on each practice question so you can try it first.
        </p>
      </div>
      <button
        type="button"
        className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-accent px-4 text-sm font-medium text-on-accent"
        onClick={() => {
          if (!active) open(chapter.slug, buildLesson(chapter));
          play(active ? undefined : 0);
        }}
      >
        <Play className="size-4" aria-hidden />
        {active ? "Resume lesson" : "Start lesson"}
      </button>
    </section>
  );
}

/** A small button that reads one formula aloud, outside the lesson. */
export function ListenButton({ id, text, label }: { id: string; text: string; label: string }) {
  const listening = useLesson((state) => state.listening === id);
  const listen = useLesson((state) => state.listen);
  const [supported, setSupported] = useState(false);
  useEffect(() => setSupported(speechSupported()), []);
  if (!supported) return null;

  return (
    <button
      type="button"
      className="inline-flex min-h-11 min-w-11 items-center justify-center gap-1 rounded-lg px-2 text-xs font-medium text-accent"
      aria-label={listening ? `Stop reading ${label}` : `Listen to ${label}`}
      aria-pressed={listening}
      onClick={() => listen(id, text)}
    >
      {listening ? (
        <Square className="size-4" aria-hidden />
      ) : (
        <Volume2 className="size-4" aria-hidden />
      )}
      <span>{listening ? "Stop" : "Listen"}</span>
    </button>
  );
}

const KIND_LABEL: Record<string, string> = {
  intro: "Introduction",
  heading: "Worked example",
  text: "Reading",
  formula: "Formula",
  step: "Step",
  question: "Your turn",
  answer: "Answer",
  outro: "Done",
};

/** The player bar fixed to the bottom of the chapter while a lesson is open. */
export function LessonBar({ slug }: { slug: string }) {
  const lesson = useLesson();
  const [settings, setSettings] = useState(false);
  const active = lesson.slug === slug && lesson.segments.length > 0;
  const segment = active ? lesson.segments[lesson.index] : undefined;

  // Close the lesson when leaving the chapter.
  useEffect(() => {
    return () => {
      if (useLesson.getState().slug === slug) useLesson.getState().close();
    };
  }, [slug]);

  // Highlight and scroll to what is being read.
  useEffect(() => {
    if (!segment) return;
    const el =
      document.querySelector<HTMLElement>(`[data-lesson="${CSS.escape(segment.anchor)}"]`) ??
      document.getElementById(segment.anchor);
    if (!el) return;
    el.classList.add("lesson-current");
    const rect = el.getBoundingClientRect();
    const hidden = rect.top < 72 || rect.bottom > window.innerHeight - 180;
    if (hidden) {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" });
    }
    return () => el.classList.remove("lesson-current");
  }, [segment]);

  if (!active || !segment) return null;

  const playing = lesson.status === "playing";
  const waiting = lesson.status === "waiting";
  const progress = ((lesson.index + 1) / lesson.segments.length) * 100;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-card/95 shadow-[0_-8px_24px_-16px_rgba(0,0,0,0.4)] backdrop-blur"
      role="region"
      aria-label="Guided lesson player"
    >
      <div className="h-1 bg-line">
        <div className="h-1 bg-accent transition-[width]" style={{ width: `${progress}%` }} />
      </div>
      {settings ? <VoiceSettings onClose={() => setSettings(false)} /> : null}
      <div className="mx-auto flex max-w-3xl flex-col gap-2 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div aria-live="polite">
          <p className="text-xs font-medium tracking-wide text-accent uppercase">
            {KIND_LABEL[segment.kind]} · {lesson.index + 1} of {lesson.segments.length}
            {lesson.status === "done" ? " · finished" : ""}
          </p>
          <p className="mt-1 line-clamp-2 font-serif text-sm leading-snug">{segment.caption}</p>
        </div>
        <div className="flex flex-wrap items-center gap-1">
          <IconButton label="Previous" onClick={lesson.prev}>
            <SkipBack className="size-5" />
          </IconButton>
          {waiting ? (
            <>
              <button
                type="button"
                className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-accent px-4 text-sm font-medium text-on-accent"
                onClick={lesson.reveal}
              >
                <Eye className="size-4" aria-hidden />
                Show answer
              </button>
              <button
                type="button"
                className="inline-flex min-h-11 items-center rounded-lg border border-line px-3 text-sm"
                onClick={lesson.skip}
              >
                Skip
              </button>
            </>
          ) : (
            <button
              type="button"
              className="inline-flex size-11 items-center justify-center rounded-full bg-accent text-on-accent"
              aria-label={playing ? "Pause" : "Play"}
              onClick={() => (playing ? lesson.pause() : lesson.play())}
            >
              {playing ? <Pause className="size-5" /> : <Play className="size-5" />}
            </button>
          )}
          <IconButton label="Next" onClick={lesson.next}>
            <SkipForward className="size-5" />
          </IconButton>
          <span className="flex-1" />
          <IconButton
            label="Voice settings"
            pressed={settings}
            onClick={() => setSettings((v) => !v)}
          >
            <Settings2 className="size-5" />
          </IconButton>
          <IconButton label="Close lesson" onClick={lesson.close}>
            <X className="size-5" />
          </IconButton>
        </div>
      </div>
    </div>
  );
}

function IconButton({
  label,
  onClick,
  pressed,
  children,
}: {
  label: string;
  onClick: () => void;
  pressed?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className={
        "inline-flex size-11 items-center justify-center rounded-lg " +
        (pressed ? "bg-accent-soft text-accent" : "text-ink")
      }
      aria-label={label}
      aria-pressed={pressed}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function VoiceSelect({
  label,
  value,
  onChange,
  voices,
  emptyLabel,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  voices: VoiceOption[];
  emptyLabel: string;
}) {
  const groups = useMemo(() => {
    const byLang = new Map<string, VoiceOption[]>();
    for (const voice of voices) {
      const list = byLang.get(voice.lang) ?? [];
      list.push(voice);
      byLang.set(voice.lang, list);
    }
    return [...byLang.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [voices]);

  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-xs font-medium tracking-wide text-muted uppercase">{label}</span>
      <select
        className="h-11 w-full rounded-lg border border-line bg-paper px-3 text-sm"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="">{emptyLabel}</option>
        {groups.map(([lang, list]) => (
          <optgroup key={lang} label={lang}>
            {list.map((voice) => (
              <option key={voice.id} value={voice.id}>
                {voice.name}
                {voice.local ? "" : " (online)"}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </label>
  );
}

function VoiceSettings({ onClose }: { onClose: () => void }) {
  const all = useVoices();
  const prefs = useVoicePrefs();
  const shown = all.filter(
    (voice) =>
      prefs.allLanguages ||
      voice.lang.toLowerCase().startsWith("en") ||
      voice.id === prefs.voiceId ||
      voice.id === prefs.tutorVoiceId,
  );

  return (
    <div className="border-b border-line">
      <div className="mx-auto flex max-w-3xl flex-col gap-3 px-4 py-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium">Voices</h2>
          <button
            type="button"
            className="inline-flex min-h-11 items-center text-sm text-accent"
            onClick={onClose}
          >
            Done
          </button>
        </div>
        {all.length === 0 ? (
          <p className="text-sm text-muted">
            No voices reported yet. Some browsers load them after the first lesson starts.
          </p>
        ) : null}
        <div className="grid gap-3 sm:grid-cols-2">
          <VoiceSelect
            label="Narrator"
            value={prefs.voiceId}
            onChange={(voiceId) => prefs.set({ voiceId })}
            voices={shown}
            emptyLabel="Browser default"
          />
          <VoiceSelect
            label="Practice questions"
            value={prefs.tutorVoiceId}
            onChange={(tutorVoiceId) => prefs.set({ tutorVoiceId })}
            voices={shown}
            emptyLabel="Same as narrator"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium tracking-wide text-muted uppercase">Speed</span>
          {RATES.map((rate) => (
            <button
              key={rate}
              type="button"
              className={
                "inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg px-2 text-sm tabular-nums " +
                (prefs.rate === rate ? "bg-accent text-on-accent" : "border border-line")
              }
              aria-pressed={prefs.rate === rate}
              onClick={() => prefs.set({ rate })}
            >
              {rate}×
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <label className="inline-flex min-h-11 items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="size-4 accent-[var(--color-accent)]"
              checked={prefs.allLanguages}
              onChange={(event) => prefs.set({ allLanguages: event.target.checked })}
            />
            Show voices in every language
          </label>
          <button
            type="button"
            className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-line px-3 text-sm"
            onClick={() => {
              useLesson.getState().pause();
              void speak("This is the narrator voice. The mean of 2, 4, and 6 is 4.", {
                voiceId: prefs.voiceId,
                rate: prefs.rate,
              }).then((done) => {
                if (!done) return;
                void speak("And this voice asks the practice questions. What is the median?", {
                  voiceId: prefs.tutorVoiceId || prefs.voiceId,
                  rate: prefs.rate,
                });
              });
            }}
          >
            <Volume2 className="size-4" aria-hidden />
            Test voices
          </button>
        </div>
        <p className="text-xs leading-relaxed text-muted">
          Voices come from your device and browser, so the list differs between computers and
          phones. Changes apply from the next part of the lesson. Your choice is saved in this
          browser.
        </p>
      </div>
    </div>
  );
}

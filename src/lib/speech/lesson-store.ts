import { create } from "zustand";
import { persist } from "zustand/middleware";
import { speak, stop as stopSpeech } from "./engine";
import type { Segment } from "./lesson";

export const RATES = [0.75, 0.9, 1, 1.15, 1.3, 1.5] as const;

type VoicePrefs = {
  /** Narrator voice, by voiceURI. Empty means the browser default. */
  voiceId: string;
  /** Voice for practice questions and answers. Empty means the narrator. */
  tutorVoiceId: string;
  rate: number;
  /** Show voices for every language, not only English. */
  allLanguages: boolean;
  set: (patch: Partial<Omit<VoicePrefs, "set">>) => void;
};

export const useVoicePrefs = create<VoicePrefs>()(
  persist(
    (set) => ({
      voiceId: "",
      tutorVoiceId: "",
      rate: 1,
      allLanguages: false,
      set: (patch) => set(patch),
    }),
    { name: "axioma-voice" },
  ),
);

export type LessonStatus = "idle" | "playing" | "paused" | "waiting" | "done";

type LessonState = {
  slug: string | null;
  segments: Segment[];
  index: number;
  status: LessonStatus;
  /** Practice questions whose answers the lesson has revealed. */
  revealed: number[];
  /** Id of a formula being read on its own, outside the lesson. */
  listening: string | null;
  open: (slug: string, segments: Segment[]) => void;
  play: (from?: number) => void;
  pause: () => void;
  next: () => void;
  prev: () => void;
  reveal: () => void;
  skip: () => void;
  close: () => void;
  listen: (id: string, text: string) => void;
};

let run = 0;

function voiceFor(segment: Segment): { voiceId: string; rate: number } {
  const prefs = useVoicePrefs.getState();
  const voiceId =
    segment.role === "tutor" && prefs.tutorVoiceId ? prefs.tutorVoiceId : prefs.voiceId;
  return { voiceId, rate: prefs.rate };
}

export const useLesson = create<LessonState>()((set, get) => {
  async function playFrom(start: number) {
    const mine = ++run;
    const { segments } = get();
    set({ listening: null });
    for (let i = Math.max(0, start); i < segments.length; i += 1) {
      const segment = segments[i];
      set((state) => ({
        index: i,
        status: "playing",
        revealed:
          segment.kind === "answer" &&
          segment.practice !== undefined &&
          !state.revealed.includes(segment.practice)
            ? [...state.revealed, segment.practice]
            : state.revealed,
      }));
      const finished = await speak(segment.speech, voiceFor(segment));
      if (mine !== run) return;
      if (!finished) {
        set({ status: "paused" });
        return;
      }
      if (segment.wait) {
        set({ status: "waiting" });
        return;
      }
    }
    set({ status: "done", index: Math.max(0, segments.length - 1) });
  }

  function halt() {
    run += 1;
    stopSpeech();
  }

  return {
    slug: null,
    segments: [],
    index: 0,
    status: "idle",
    revealed: [],
    listening: null,
    open: (slug, segments) => {
      halt();
      set({ slug, segments, index: 0, status: "paused", revealed: [], listening: null });
    },
    play: (from) => {
      const { index, status, segments } = get();
      if (segments.length === 0) return;
      const start = from ?? (status === "done" ? 0 : status === "waiting" ? index + 1 : index);
      void playFrom(start);
    },
    pause: () => {
      halt();
      set({ status: "paused" });
    },
    next: () => {
      // From a question, the next segment is its answer.
      const { index, segments } = get();
      void playFrom(Math.min(segments.length - 1, index + 1));
    },
    prev: () => {
      const { index, segments } = get();
      let target = Math.max(0, index - 1);
      // Step back over an answer to its question.
      if (segments[target]?.kind === "answer") target = Math.max(0, target - 1);
      void playFrom(target);
    },
    reveal: () => {
      const { index } = get();
      void playFrom(index + 1);
    },
    skip: () => {
      const { index, segments } = get();
      const after = segments[index + 1]?.kind === "answer" ? index + 2 : index + 1;
      if (after >= segments.length) {
        halt();
        set({ status: "done" });
        return;
      }
      void playFrom(after);
    },
    close: () => {
      halt();
      set({ slug: null, segments: [], index: 0, status: "idle", revealed: [], listening: null });
    },
    listen: (id, text) => {
      const { listening, status } = get();
      halt();
      if (status === "playing" || status === "waiting") set({ status: "paused" });
      if (listening === id) {
        set({ listening: null });
        return;
      }
      set({ listening: id });
      const mine = run;
      const prefs = useVoicePrefs.getState();
      void speak(text, { voiceId: prefs.voiceId, rate: prefs.rate }).then(() => {
        if (mine === run) set({ listening: null });
      });
    },
  };
});

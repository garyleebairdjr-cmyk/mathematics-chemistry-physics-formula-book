import { create } from "zustand";
import { persist } from "zustand/middleware";
import { prefetch, speak, stop as stopSpeech, type SpeakOptions } from "./engine";
import type { Part, Segment } from "./lesson";

/** Named speeds, like a reader's presets, then finer steps. */
export const SPEEDS = [
  { rate: 0.8, label: "Slow" },
  { rate: 1, label: "Steady" },
  { rate: 1.2, label: "Brisk" },
  { rate: 1.4, label: "Fast" },
] as const;

export const RATES = [0.7, 0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.4, 1.6] as const;

type VoicePrefs = {
  /** Narrator voice, by voiceURI. Empty means the browser default. */
  voiceId: string;
  /** Voice for practice questions and answers. Empty means the narrator. */
  tutorVoiceId: string;
  rate: number;
  /** Show voices for every language, not only English. */
  allLanguages: boolean;
  /**
   * "device": the browser's built-in voices. "web": neural voices running in
   * this browser tab. "server": neural voices from a server on this computer.
   */
  engine: "device" | "web" | "server";
  /** Kokoro voice characters for the narrator and the tutor (web and server). */
  character: string;
  tutorCharacter: string;
  webQuality: "q8" | "fp32";
  serverUrl: string;
  serverModel: string;
  serverVoice: string;
  serverTutorVoice: string;
  set: (patch: Partial<Omit<VoicePrefs, "set">>) => void;
};

export const useVoicePrefs = create<VoicePrefs>()(
  persist(
    (set) => ({
      voiceId: "",
      tutorVoiceId: "",
      rate: 1,
      allLanguages: false,
      engine: "device",
      character: "af_heart",
      tutorCharacter: "bf_emma",
      webQuality: "q8",
      serverUrl: "http://127.0.0.1:3939",
      serverModel: "kokoro",
      serverVoice: "",
      serverTutorVoice: "",
      set: (patch) => set(patch),
    }),
    {
      name: "axioma-voice",
      version: 1,
      // Version 0 pointed the server at port 3900 with no voice characters.
      migrate: (saved) => {
        const old = (saved ?? {}) as Partial<VoicePrefs>;
        return {
          ...old,
          engine: old.engine === "server" ? "server" : "device",
          character: "af_heart",
          tutorCharacter: "bf_emma",
          webQuality: "q8",
          serverUrl: "http://127.0.0.1:3939",
          serverModel: "kokoro",
        } as VoicePrefs;
      },
    },
  ),
);

export type LessonStatus = "idle" | "playing" | "paused" | "waiting" | "done";

type LessonState = {
  slug: string | null;
  title: string;
  segments: Segment[];
  index: number;
  /** Which part of the current segment is being spoken. */
  part: number;
  status: LessonStatus;
  /** Practice questions whose answers the lesson has revealed. */
  revealed: number[];
  /** Id of a formula being read on its own, outside the lesson. */
  listening: string | null;
  /** The full-screen read-along stage is open. */
  stage: boolean;
  open: (slug: string, title: string, segments: Segment[]) => void;
  play: (from?: number) => void;
  playAt: (target: string, say: number) => void;
  pause: () => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  reveal: () => void;
  skip: () => void;
  close: () => void;
  setStage: (open: boolean) => void;
  listen: (id: string, text: string) => void;
};

let run = 0;

export function voiceFor(role: Segment["role"]): SpeakOptions {
  const prefs = useVoicePrefs.getState();
  const tutor = role === "tutor";
  const deviceVoice = tutor && prefs.tutorVoiceId ? prefs.tutorVoiceId : prefs.voiceId;
  const character = (tutor && prefs.tutorCharacter) || prefs.character || "af_heart";
  if (prefs.engine === "web") {
    return {
      rate: prefs.rate,
      voiceId: deviceVoice,
      web: { voice: character, quality: prefs.webQuality },
    };
  }
  if (prefs.engine === "server" && prefs.serverUrl.trim()) {
    const kokoro = prefs.serverModel.trim() === "kokoro";
    return {
      rate: prefs.rate,
      voiceId: deviceVoice,
      server: {
        url: prefs.serverUrl.trim(),
        model: prefs.serverModel.trim(),
        // Kokoro servers use the characters; other servers take a typed voice name.
        voice: kokoro
          ? character
          : (tutor && prefs.serverTutorVoice.trim()) || prefs.serverVoice.trim(),
      },
    };
  }
  return {
    voiceId: tutor && prefs.tutorVoiceId ? prefs.tutorVoiceId : prefs.voiceId,
    rate: prefs.rate,
  };
}

/**
 * The next few spoken parts after (segment, part), for prefetching. Neural
 * voices can take longer to generate a sentence than to say it, so they work
 * a few sentences ahead. It stops at a question, which waits for the student.
 */
function upcoming(segments: Segment[], i: number, p: number, count: number): [Segment, Part][] {
  const out: [Segment, Part][] = [];
  let si = i;
  let pi = p + 1;
  while (out.length < count && segments[si]) {
    const segment = segments[si];
    if (pi < segment.parts.length) {
      out.push([segment, segment.parts[pi]]);
      pi += 1;
    } else {
      if (segment.wait) break;
      si += 1;
      pi = 0;
    }
  }
  return out;
}

export const useLesson = create<LessonState>()((set, get) => {
  async function playFrom(start: number, startPart = 0) {
    const mine = ++run;
    const { segments } = get();
    set({ listening: null });
    for (let i = Math.max(0, start); i < segments.length; i += 1) {
      const segment = segments[i];
      const first = i === start ? Math.min(startPart, segment.parts.length - 1) : 0;
      for (let p = Math.max(0, first); p < segment.parts.length; p += 1) {
        set((state) => ({
          index: i,
          part: p,
          status: "playing",
          revealed:
            segment.kind === "answer" &&
            segment.practice !== undefined &&
            !state.revealed.includes(segment.practice)
              ? [...state.revealed, segment.practice]
              : state.revealed,
        }));
        const options = voiceFor(segment.role);
        if (options.server || options.web) {
          for (const [next, part] of upcoming(segments, i, p, 4))
            prefetch(part.speech, voiceFor(next.role));
        }
        const finished = await speak(segment.parts[p].speech, options);
        if (mine !== run) return;
        if (!finished) {
          set({ status: "paused" });
          return;
        }
      }
      if (segment.wait) {
        set({ status: "waiting" });
        return;
      }
    }
    set({ status: "done", index: Math.max(0, segments.length - 1), part: 0 });
  }

  function halt() {
    run += 1;
    stopSpeech();
  }

  return {
    slug: null,
    title: "",
    segments: [],
    index: 0,
    part: 0,
    status: "idle",
    revealed: [],
    listening: null,
    stage: false,
    open: (slug, title, segments) => {
      halt();
      set({
        slug,
        title,
        segments,
        index: 0,
        part: 0,
        status: "paused",
        revealed: [],
        listening: null,
      });
    },
    play: (from) => {
      const { index, part, status, segments } = get();
      if (segments.length === 0) return;
      if (from !== undefined) return void playFrom(from);
      if (status === "done") return void playFrom(0);
      if (status === "waiting") return void playFrom(index + 1);
      void playFrom(index, part);
    },
    playAt: (target, say) => {
      const { segments } = get();
      for (let i = 0; i < segments.length; i += 1) {
        const p = segments[i].parts.findIndex((part) => part.target === target && part.say === say);
        if (p >= 0) return void playFrom(i, p);
      }
    },
    pause: () => {
      halt();
      set({ status: "paused" });
    },
    toggle: () => {
      const { status } = get();
      if (status === "playing") get().pause();
      else get().play();
    },
    next: () => {
      // From a question, the next segment is its answer.
      const { index, segments } = get();
      void playFrom(Math.min(segments.length - 1, index + 1));
    },
    prev: () => {
      const { index, part, segments } = get();
      // Partway into a segment, go back to its start first.
      if (part > 1) return void playFrom(index);
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
      set({
        slug: null,
        title: "",
        segments: [],
        index: 0,
        part: 0,
        status: "idle",
        revealed: [],
        listening: null,
        stage: false,
      });
    },
    setStage: (stage) => set({ stage }),
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
      void speak(text, voiceFor("narrator")).then(() => {
        if (mine === run) set({ listening: null });
      });
    },
  };
});

/** Where a sentence on the page stands in the lesson: being read, already read, or neither. */
export function sentenceState(
  state: Pick<LessonState, "segments" | "index" | "part" | "status">,
  target: string,
  say: number,
): "now" | "said" | undefined {
  if (state.status === "idle") return undefined;
  const segment = state.segments[state.index];
  if (!segment) return undefined;
  for (let p = 0; p < segment.parts.length; p += 1) {
    const part = segment.parts[p];
    if (part.target !== target || part.say !== say) continue;
    if (p === state.part) return "now";
    if (p < state.part) return "said";
  }
  return undefined;
}

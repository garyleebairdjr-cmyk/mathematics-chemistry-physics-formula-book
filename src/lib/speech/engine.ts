/**
 * Speech output. Two engines sit behind the same calls (speak, stop, prefetch):
 *
 * - "device": the browser's Web Speech API. Works on a static host with no
 *   server; the voices are whatever the operating system provides.
 * - "server": any OpenAI-compatible text-to-speech server
 *   (POST {url}/v1/audio/speech), such as a local VoiceStudio or Kokoro set up
 *   by Natural Voice Reader. Its audio runs through an AnalyserNode, so the
 *   visualizer can follow the real voice. If it fails, the device voice reads
 *   instead and the failure is reported through onSpeechStatus.
 *
 * This module has no DOM imports at load time, so tests can import chunkText.
 */

export type VoiceOption = {
  id: string;
  name: string;
  lang: string;
  /** True when the voice runs on this device rather than over the network. */
  local: boolean;
  isDefault: boolean;
};

export type ServerVoice = {
  /** Base URL, for example http://127.0.0.1:3900 */
  url: string;
  model: string;
  voice: string;
};

export type WebVoice = {
  /** Kokoro voice id, for example "af_heart". */
  voice: string;
  quality: "q8" | "fp32";
};

export type SpeakOptions = {
  voiceId?: string;
  rate?: number;
  /** Use a neural voice server instead of the device voice. */
  server?: ServerVoice | null;
  /** Use the neural web voices running in this browser. */
  web?: WebVoice | null;
};

export function speechSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    "speechSynthesis" in window &&
    "SpeechSynthesisUtterance" in window
  );
}

function snapshot(): VoiceOption[] {
  return window.speechSynthesis.getVoices().map((voice) => ({
    id: voice.voiceURI,
    name: voice.name,
    lang: voice.lang,
    local: voice.localService,
    isDefault: voice.default,
  }));
}

/** Voices load asynchronously in Chrome; wait briefly for them. */
export function listVoices(): Promise<VoiceOption[]> {
  if (!speechSupported()) return Promise.resolve([]);
  const now = snapshot();
  if (now.length > 0) return Promise.resolve(now);
  return new Promise((resolve) => {
    const synth = window.speechSynthesis;
    const done = () => {
      synth.removeEventListener("voiceschanged", done);
      clearTimeout(timer);
      resolve(snapshot());
    };
    const timer = setTimeout(done, 2500);
    synth.addEventListener("voiceschanged", done);
  });
}

/** Call back whenever the browser's voice list changes. */
export function onVoicesChanged(callback: () => void): () => void {
  if (!speechSupported()) return () => {};
  window.speechSynthesis.addEventListener("voiceschanged", callback);
  return () => window.speechSynthesis.removeEventListener("voiceschanged", callback);
}

/**
 * Split long text into sentence-sized pieces. Some engines (Chrome on desktop
 * in particular) stop a single long utterance after about fifteen seconds.
 */
export function chunkText(text: string, max = 220): string[] {
  const sentences = text.match(/[^.!?;:]+[.!?;:]*\s*/g) ?? [text];
  const chunks: string[] = [];
  let current = "";
  for (const sentence of sentences) {
    if ((current + sentence).length > max && current) {
      chunks.push(current.trim());
      current = "";
    }
    if (sentence.length > max) {
      for (const piece of sentence.split(/(?<=,)\s+/)) {
        if ((current + piece).length > max && current) {
          chunks.push(current.trim());
          current = "";
        }
        current += piece + " ";
      }
    } else {
      current += sentence;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

// --- Activity, for the visualizer and the status line ----------------------

export type SpeechStatus = {
  speaking: boolean;
  /** Which engine produced the current or last audio. */
  engine: "device" | "server" | "web";
  /** Set when the server voice failed and the device voice took over. */
  error: string | null;
};

let status: SpeechStatus = { speaking: false, engine: "device", error: null };
const listeners = new Set<(value: SpeechStatus) => void>();

function setStatus(patch: Partial<SpeechStatus>) {
  status = { ...status, ...patch };
  for (const listener of listeners) listener(status);
}

export function getSpeechStatus(): SpeechStatus {
  return status;
}

export function onSpeechStatus(listener: (value: SpeechStatus) => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// --- Neural voices (server or web) ---------------------------------------------------------------

let audioContext: AudioContext | null = null;
let analyser: AnalyserNode | null = null;
let currentAudio: HTMLAudioElement | null = null;
const cache = new Map<string, Promise<Blob>>();

/** The live analyser while a server voice plays; null for the device voice. */
export function getAnalyser(): AnalyserNode | null {
  return status.engine !== "device" ? analyser : null;
}

function ensureAudioGraph(): { ctx: AudioContext; node: AnalyserNode } | null {
  if (typeof window === "undefined" || typeof AudioContext === "undefined") return null;
  if (!audioContext) {
    audioContext = new AudioContext();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.72;
    analyser.connect(audioContext.destination);
  }
  if (audioContext.state === "suspended") void audioContext.resume();
  return { ctx: audioContext, node: analyser! };
}

/** Audio for one piece from a neural engine, cached so prefetching pays off. */
function neuralAudio(text: string, options: SpeakOptions): Promise<Blob> {
  const rate = options.rate ?? 1;
  if (options.web) {
    const web = options.web;
    const key = `web|${web.quality}|${web.voice}|${rate}|${text}`;
    return remember(key, () =>
      import("./neural").then(({ webSpeech }) => webSpeech(text, web.voice, rate, web.quality)),
    );
  }
  const server = options.server!;
  const key = `${server.url}|${server.model}|${server.voice}|${rate}|${text}`;
  return remember(key, () => fetchSpeech(text, server, rate));
}

function remember(key: string, make: () => Promise<Blob>): Promise<Blob> {
  const hit = cache.get(key);
  if (hit) return hit;
  const request = make();
  cache.set(key, request);
  request.catch(() => cache.delete(key));
  // Keep the cache small: a lesson only needs the next few pieces.
  if (cache.size > 24) cache.delete(cache.keys().next().value!);
  return request;
}

function fetchSpeech(text: string, server: ServerVoice, rate: number): Promise<Blob> {
  return (async () => {
    const res = await fetch(`${server.url.replace(/\/+$/, "")}/v1/audio/speech`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: server.model || "kokoro",
        input: text,
        voice: server.voice || undefined,
        speed: rate,
        response_format: server.model === "kokoro" ? "wav" : "mp3",
      }),
      signal: AbortSignal.timeout(120_000),
    });
    if (!res.ok) throw new Error(`The voice server answered ${res.status}.`);
    const blob = await res.blob();
    if (blob.size < 64) throw new Error("The voice server sent back no audio.");
    return blob;
  })();
}

/** Start generating a piece in the background so it is ready when its turn comes. */
export function prefetch(text: string, options: SpeakOptions) {
  if (!(options.server?.url || options.web) || !text.trim()) return;
  void neuralAudio(text, options).catch(() => {});
}

/** Check that a server answers. Resolves to null when it works, or the reason it does not. */
export async function testServer(server: ServerVoice): Promise<string | null> {
  try {
    await neuralAudio("The voice server is ready.", { server, rate: 1 });
    return null;
  } catch (error) {
    return explain(error);
  }
}

function explain(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  if (/failed to fetch|networkerror|load failed/i.test(message)) {
    return "Could not reach the voice server. Check the address, that it is running, and that it allows requests from this page (CORS).";
  }
  if (/timeout|abort/i.test(message)) return "The voice server took too long to answer.";
  if (/web voices|kokoro|onnx|wasm/i.test(message))
    return `The web voices could not run: ${message}`;
  return message;
}

async function speakNeural(text: string, options: SpeakOptions, mine: number) {
  const blob = await neuralAudio(text, options);
  if (mine !== generation) return false;
  const graph = ensureAudioGraph();
  const audio = new Audio(URL.createObjectURL(blob));
  currentAudio = audio;
  if (graph) {
    try {
      graph.ctx.createMediaElementSource(audio).connect(graph.node);
    } catch {
      // Without the graph the audio still plays; the visualizer falls back to its idle wave.
    }
  }
  setStatus({ engine: options.web ? "web" : "server", speaking: true, error: null });
  return new Promise<boolean>((resolve) => {
    const finish = (ok: boolean) => {
      URL.revokeObjectURL(audio.src);
      if (currentAudio === audio) currentAudio = null;
      resolve(ok);
    };
    audio.onended = () => finish(true);
    audio.onerror = () => finish(false);
    audio.onpause = () => {
      if (!audio.ended) finish(false);
    };
    audio.play().catch(() => finish(false));
  });
}

// --- Device voice ---------------------------------------------------------------

async function speakDevice(text: string, options: SpeakOptions, mine: number) {
  if (!speechSupported()) return false;
  const synth = window.speechSynthesis;
  const voice = synth.getVoices().find((item) => item.voiceURI === options.voiceId) ?? null;
  setStatus({ engine: "device", speaking: true });
  for (const chunk of chunkText(text)) {
    if (mine !== generation) return false;
    const finished = await new Promise<boolean>((resolve) => {
      const utterance = new SpeechSynthesisUtterance(chunk);
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
      }
      utterance.rate = options.rate ?? 1;
      utterance.onend = () => resolve(true);
      utterance.onerror = () => resolve(false);
      synth.speak(utterance);
      // Some engines start paused after a cancel(); nudge them.
      if (synth.paused) synth.resume();
    });
    if (!finished || mine !== generation) return false;
  }
  return true;
}

// --- Public calls ---------------------------------------------------------------

let generation = 0;

/** Stop anything being spoken. Pending speak() calls resolve with false. */
export function stop() {
  generation += 1;
  if (speechSupported()) window.speechSynthesis.cancel();
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  if (status.speaking) setStatus({ speaking: false });
}

/**
 * Speak text. Resolves true when it finished, false when it was stopped or the
 * engine failed. Starting a new speak() stops the previous one.
 */
export async function speak(text: string, options: SpeakOptions = {}): Promise<boolean> {
  if (!text.trim()) return true;
  stop();
  const mine = generation;
  let finished: boolean;
  if (options.server?.url || options.web) {
    try {
      finished = await speakNeural(text, options, mine);
    } catch (error) {
      if (mine !== generation) return false;
      setStatus({ error: explain(error) });
      finished = await speakDevice(text, options, mine);
    }
  } else {
    finished = await speakDevice(text, options, mine);
  }
  if (mine === generation) setStatus({ speaking: false });
  return finished && mine === generation;
}

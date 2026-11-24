/**
 * Speech output through the browser's Web Speech API. Works on a static host
 * with no server. The voices are whatever the operating system and browser
 * provide, so the list differs between devices.
 *
 * The engine is the only place that touches speechSynthesis, so another
 * engine (for example a local VoiceStudio server) can be added behind the same
 * three calls: listVoices, speak, stop.
 */

export type VoiceOption = {
  id: string;
  name: string;
  lang: string;
  /** True when the voice runs on this device rather than over the network. */
  local: boolean;
  isDefault: boolean;
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

let generation = 0;

/** Stop anything being spoken. Pending speak() calls resolve with false. */
export function stop() {
  generation += 1;
  if (speechSupported()) window.speechSynthesis.cancel();
}

/**
 * Speak text. Resolves true when it finished, false when it was stopped or the
 * engine failed. Starting a new speak() stops the previous one.
 */
export async function speak(
  text: string,
  options: { voiceId?: string; rate?: number } = {},
): Promise<boolean> {
  if (!speechSupported() || !text.trim()) return !text.trim();
  stop();
  const mine = generation;
  const synth = window.speechSynthesis;
  const voice = synth.getVoices().find((item) => item.voiceURI === options.voiceId) ?? null;

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

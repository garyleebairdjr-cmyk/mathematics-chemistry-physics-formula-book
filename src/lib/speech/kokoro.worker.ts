/// <reference lib="webworker" />
/**
 * Runs the Kokoro-82M voice model in a worker, so generating speech never
 * blocks the page. The library (kokoro-js, Apache-2.0) is loaded from a CDN the
 * first time someone installs the web voices; the model files come from
 * Hugging Face and the browser caches them, so later visits work offline.
 */

const KOKORO_URL = "https://cdn.jsdelivr.net/npm/kokoro-js@1.2.1/dist/kokoro.web.js";
const MODEL_ID = "onnx-community/Kokoro-82M-v1.0-ONNX";

type Tts = {
  generate: (
    text: string,
    options: { voice: string; speed: number },
  ) => Promise<{ audio: Float32Array; sampling_rate: number }>;
};

type Incoming =
  | { type: "load"; dtype: "q8" | "fp32"; device: "wasm" | "webgpu" }
  | { type: "generate"; id: number; text: string; voice: string; speed: number };

let tts: Promise<Tts> | null = null;
// Generate one piece at a time; the model is not re-entrant.
let queue: Promise<unknown> = Promise.resolve();

const post = (message: unknown, transfer: Transferable[] = []) =>
  (self as unknown as DedicatedWorkerGlobalScope).postMessage(message, transfer);

self.onmessage = (event: MessageEvent<Incoming>) => {
  const msg = event.data;
  if (msg.type === "load") {
    tts ??= (async () => {
      const { KokoroTTS } = await import(/* @vite-ignore */ KOKORO_URL);
      const model = (await KokoroTTS.from_pretrained(MODEL_ID, {
        dtype: msg.dtype,
        device: msg.device,
        progress_callback: (p: {
          status: string;
          file?: string;
          loaded?: number;
          total?: number;
        }) => post({ type: "progress", ...p }),
      })) as Tts;
      post({ type: "ready", device: msg.device });
      return model;
    })();
    tts.catch((error: unknown) => {
      tts = null;
      post({ type: "error", message: error instanceof Error ? error.message : String(error) });
    });
    return;
  }
  if (msg.type === "generate") {
    queue = queue.then(async () => {
      try {
        if (!tts) throw new Error("The web voices are not loaded.");
        const model = await tts;
        const out = await model.generate(msg.text, { voice: msg.voice, speed: msg.speed });
        const samples = new Float32Array(out.audio);
        post({ type: "audio", id: msg.id, samples, rate: out.sampling_rate }, [samples.buffer]);
      } catch (error) {
        post({
          type: "error",
          id: msg.id,
          message: error instanceof Error ? error.message : String(error),
        });
      }
    });
  }
};

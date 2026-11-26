/**
 * Web voices: the Kokoro-82M model running inside this browser tab (in a
 * worker). Nothing is installed on the computer; the model files are cached by
 * the browser after the first download.
 */

export type WebQuality = "q8" | "fp32";

/** Approximate one-time download for each quality. */
export const WEB_QUALITY: Record<WebQuality, { label: string; size: string; note: string }> = {
  q8: { label: "Compact", size: "about 92 MB", note: "Runs on any modern browser, using the CPU." },
  fp32: {
    label: "Studio",
    size: "about 330 MB",
    note: "Cleaner sound. Fast with a graphics card (WebGPU).",
  },
};

export type WebVoiceState = {
  status: "idle" | "downloading" | "ready" | "error";
  /** 0..1 while downloading. */
  progress: number;
  detail: string;
  quality: WebQuality | null;
  device: "wasm" | "webgpu" | null;
};

let state: WebVoiceState = { status: "idle", progress: 0, detail: "", quality: null, device: null };
const listeners = new Set<(value: WebVoiceState) => void>();

function setState(patch: Partial<WebVoiceState>) {
  state = { ...state, ...patch };
  for (const listener of listeners) listener(state);
}

export function getWebVoiceState() {
  return state;
}

export function onWebVoiceState(listener: (value: WebVoiceState) => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

type GpuNavigator = Navigator & { gpu?: { requestAdapter: () => Promise<unknown> } };

let gpuCheck: Promise<boolean> | null = null;

/** True when this browser has a usable graphics adapter (not just the WebGPU API). */
export function webGpuAvailable(): Promise<boolean> {
  gpuCheck ??= (async () => {
    const gpu = typeof navigator !== "undefined" ? (navigator as GpuNavigator).gpu : undefined;
    if (!gpu) return false;
    try {
      return !!(await gpu.requestAdapter());
    } catch {
      return false;
    }
  })();
  return gpuCheck;
}

let worker: Worker | null = null;
let loading: Promise<void> | null = null;
let nextId = 1;
const waiting = new Map<
  number,
  { resolve: (blob: Blob) => void; reject: (error: Error) => void }
>();

function encodeWav(samples: Float32Array, rate: number): Blob {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);
  const write = (offset: number, text: string) => {
    for (let i = 0; i < text.length; i += 1) view.setUint8(offset + i, text.charCodeAt(i));
  };
  write(0, "RIFF");
  view.setUint32(4, 36 + samples.length * 2, true);
  write(8, "WAVE");
  write(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, rate, true);
  view.setUint32(28, rate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  write(36, "data");
  view.setUint32(40, samples.length * 2, true);
  for (let i = 0; i < samples.length; i += 1) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(44 + i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return new Blob([buffer], { type: "audio/wav" });
}

/**
 * Download (the first time) and start the web voices. Later calls with the
 * same quality return the same promise.
 */
export function loadWebVoices(quality: WebQuality): Promise<void> {
  if (loading && state.quality === quality && state.status !== "error") return loading;
  worker?.terminate();
  const files = new Map<string, { loaded: number; total: number }>();
  setState({ status: "downloading", progress: 0, detail: "Starting…", quality, device: null });

  loading = new Promise<void>((resolve, reject) => {
    void start(resolve, reject);
  });
  loading.catch(() => {
    loading = null;
  });
  return loading;

  async function start(resolve: () => void, reject: (error: Error) => void) {
    const device = quality === "fp32" && (await webGpuAvailable()) ? "webgpu" : "wasm";
    setState({ device });
    const w = new Worker(new URL("./kokoro.worker.ts", import.meta.url), { type: "module" });
    worker = w;
    w.onmessage = (event) => {
      const msg = event.data;
      if (msg.type === "progress") {
        if (msg.file && typeof msg.total === "number" && msg.total > 0) {
          files.set(msg.file, { loaded: msg.loaded ?? 0, total: msg.total });
          let loaded = 0;
          let total = 0;
          for (const f of files.values()) {
            loaded += f.loaded;
            total += f.total;
          }
          setState({
            progress: total ? loaded / total : 0,
            detail: `${Math.round(loaded / 1e6)} of ${Math.round(total / 1e6)} MB`,
          });
        }
      } else if (msg.type === "ready") {
        setState({ status: "ready", progress: 1, detail: "", device: msg.device });
        resolve();
      } else if (msg.type === "audio") {
        waiting.get(msg.id)?.resolve(encodeWav(msg.samples, msg.rate));
        waiting.delete(msg.id);
      } else if (msg.type === "error") {
        if (msg.id && waiting.has(msg.id)) {
          waiting.get(msg.id)!.reject(new Error(msg.message));
          waiting.delete(msg.id);
        } else {
          setState({ status: "error", detail: msg.message });
          reject(new Error(msg.message));
        }
      }
    };
    w.onerror = (event) => {
      const message = event.message || "The web voice engine could not start";
      setState({ status: "error", detail: message });
      reject(new Error(message));
    };
    w.postMessage({ type: "load", dtype: quality, device });
  }
}

/** Speak one piece with a web voice. Loads the engine first if needed. */
export async function webSpeech(text: string, voice: string, speed: number, quality: WebQuality) {
  await loadWebVoices(quality);
  const id = nextId++;
  return new Promise<Blob>((resolve, reject) => {
    waiting.set(id, { resolve, reject });
    worker!.postMessage({ type: "generate", id, text, voice, speed });
  });
}

const MODEL_FILE: Record<WebQuality, string> = {
  q8: "model_quantized.onnx",
  fp32: "model.onnx",
};

/** True when this browser already has the model files cached. */
export async function webVoicesInstalled(quality: WebQuality): Promise<boolean> {
  if (typeof caches === "undefined") return false;
  try {
    const cache = await caches.open("transformers-cache");
    const keys = await cache.keys();
    return keys.some(
      (request) =>
        request.url.includes("Kokoro-82M-v1.0-ONNX") &&
        request.url.endsWith(`/${MODEL_FILE[quality]}`),
    );
  } catch {
    return false;
  }
}

/** Stop the engine and delete the downloaded model from this browser. */
export async function removeWebVoices() {
  worker?.terminate();
  worker = null;
  loading = null;
  for (const entry of waiting.values()) entry.reject(new Error("The web voices were removed."));
  waiting.clear();
  setState({ status: "idle", progress: 0, detail: "", quality: null, device: null });
  if (typeof caches === "undefined") return;
  try {
    const cache = await caches.open("transformers-cache");
    for (const request of await cache.keys()) {
      if (request.url.includes("Kokoro-82M-v1.0-ONNX")) await cache.delete(request);
    }
  } catch {
    // Storage can be unavailable (private mode); nothing was kept then anyway.
  }
}

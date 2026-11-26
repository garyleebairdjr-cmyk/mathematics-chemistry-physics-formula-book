import {
  Check,
  ChevronDown,
  Copy,
  Cpu,
  Download,
  Globe,
  Laptop,
  Loader2,
  Monitor,
  Moon,
  Play,
  RotateCcw,
  Search,
  Settings2,
  Square,
  Sun,
  Trash2,
  Volume2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";
import {
  listVoices,
  onVoicesChanged,
  speak,
  stop,
  type SpeakOptions,
  type VoiceOption,
} from "@/lib/speech/engine";
import { CHARACTERS, characterName, type VoiceCharacter } from "@/lib/speech/characters";
import { RATES, useLesson, useVoicePrefs, voiceFor } from "@/lib/speech/lesson-store";
import {
  getWebVoiceState,
  loadWebVoices,
  onWebVoiceState,
  removeWebVoices,
  WEB_QUALITY,
  webGpuAvailable,
  webVoicesInstalled,
  type WebQuality,
} from "@/lib/speech/neural";
import { useProgress } from "@/lib/progress";
import { useSpeechStatus } from "@/lib/speech/use-speech-status";
import { useSettings, type SettingsTab } from "@/lib/settings";
import { INKS, useAppearance, type ThemePref } from "@/lib/theme";

const REPO_RAW =
  "https://raw.githubusercontent.com/garyleebairdjr-cmyk/mathematics-chemistry-physics-formula-book/main/scripts/voice-server.py";

/** The gear button in the header. It shows and hides the settings drawer. */
export function SettingsButton() {
  const open = useSettings((state) => state.open);
  const toggle = useSettings((state) => state.toggle);
  return (
    <button
      type="button"
      onClick={toggle}
      aria-expanded={open}
      aria-controls="settings-panel"
      aria-label={open ? "Hide settings" : "Show settings"}
      title={open ? "Hide settings" : "Settings"}
      className={
        "inline-flex size-10 items-center justify-center rounded-full border transition-colors " +
        (open
          ? "border-accent bg-accent text-on-accent"
          : "border-line bg-card/50 text-muted hover:text-ink")
      }
    >
      <Settings2 className={"size-4 transition-transform " + (open ? "rotate-90" : "")} />
    </button>
  );
}

const TABS: { id: SettingsTab; label: string }[] = [
  { id: "voice", label: "Voice" },
  { id: "appearance", label: "Appearance" },
  { id: "progress", label: "Progress" },
];

/** The drawer itself. Rendered once by the shell, above everything else. */
export function SettingsPanel() {
  const open = useSettings((state) => state.open);
  const tab = useSettings((state) => state.tab);
  const setTab = useSettings((state) => state.setTab);
  const hide = useSettings((state) => state.hide);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        // Close the drawer first, not the focus stage behind it.
        event.stopPropagation();
        hide();
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [open, hide]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Settings">
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        aria-label="Hide settings"
        onClick={hide}
      />
      <div
        id="settings-panel"
        className="slide-in thin-scroll absolute inset-y-0 right-0 flex w-full max-w-[30rem] flex-col overflow-y-auto border-l border-line bg-card shadow-2xl"
      >
        <div className="sticky top-0 z-10 border-b border-line bg-card/95 px-5 pt-4 backdrop-blur">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
              <Settings2 className="size-5 text-accent" aria-hidden />
              Settings
            </h2>
            <button
              type="button"
              className="inline-flex size-9 items-center justify-center rounded-full hover:bg-raise"
              aria-label="Hide settings"
              onClick={hide}
            >
              <X className="size-5" />
            </button>
          </div>
          <div className="mt-3 flex gap-1" role="tablist" aria-label="Settings sections">
            {TABS.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={tab === item.id}
                onClick={() => setTab(item.id)}
                className={
                  "-mb-px border-b-2 px-3 pb-2.5 text-sm font-medium transition-colors " +
                  (tab === item.id
                    ? "border-accent text-ink"
                    : "border-transparent text-muted hover:text-ink")
                }
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-6 p-5" role="tabpanel">
          {tab === "voice" ? <VoiceSection /> : null}
          {tab === "appearance" ? <AppearanceSection /> : null}
          {tab === "progress" ? <ProgressSection /> : null}
        </div>
      </div>
    </div>,
    document.body,
  );
}

// --- Voice ------------------------------------------------------------------------

const ENGINES = [
  {
    id: "device",
    icon: Monitor,
    title: "Built-in",
    blurb: "Your device's own voices. Instant, nothing to download; quality varies.",
  },
  {
    id: "web",
    icon: Globe,
    title: "Web voices",
    blurb: "Natural neural voices that run inside this browser. One download, then offline.",
  },
  {
    id: "server",
    icon: Laptop,
    title: "On this computer",
    blurb: "Install the voice engine locally. Fastest, works offline, shared by every browser.",
  },
] as const;

function VoiceSection() {
  const prefs = useVoicePrefs();
  return (
    <>
      <Group title="Voice engine">
        <div className="grid gap-2">
          {ENGINES.map((engine) => {
            const on = prefs.engine === engine.id;
            return (
              <button
                key={engine.id}
                type="button"
                aria-pressed={on}
                onClick={() => prefs.set({ engine: engine.id })}
                className={
                  "flex items-start gap-3 rounded-xl border p-3 text-left transition-colors " +
                  (on ? "border-accent bg-accent-soft/60" : "border-line hover:border-accent/60")
                }
              >
                <span
                  className={
                    "flex size-9 shrink-0 items-center justify-center rounded-lg " +
                    (on ? "bg-gradient text-on-accent" : "bg-raise text-muted")
                  }
                >
                  <engine.icon className="size-4" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2 text-sm font-semibold">
                    {engine.title}
                    {on ? <Check className="size-4 text-accent" aria-hidden /> : null}
                  </span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-muted">
                    {engine.blurb}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </Group>

      {prefs.engine === "web" ? <WebInstall /> : null}
      {prefs.engine === "server" ? <ServerInstall /> : null}
      {prefs.engine === "device" ? <DeviceVoices /> : <Characters />}

      <Group title={`Speed · ${prefs.rate}×`}>
        <div className="flex flex-wrap gap-1.5">
          {RATES.map((rate) => (
            <button
              key={rate}
              type="button"
              className={
                "mono inline-flex min-h-9 min-w-12 items-center justify-center rounded-full px-2 text-xs " +
                (prefs.rate === rate ? "bg-accent text-on-accent" : "border border-line")
              }
              aria-pressed={prefs.rate === rate}
              onClick={() => prefs.set({ rate })}
            >
              {rate}×
            </button>
          ))}
        </div>
      </Group>

      <TestVoices />
    </>
  );
}

function Group({
  title,
  children,
  aside,
}: {
  title: string;
  children: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-[11px] font-semibold tracking-[0.12em] text-muted uppercase">
          {title}
        </h3>
        {aside}
      </div>
      {children}
    </section>
  );
}

function useWebVoiceState() {
  return useSyncExternalStore(onWebVoiceState, getWebVoiceState, getWebVoiceState);
}

function WebInstall() {
  const prefs = useVoicePrefs();
  const state = useWebVoiceState();
  const [cached, setCached] = useState<boolean | null>(null);
  const [gpu, setGpu] = useState<boolean | null>(null);
  useEffect(() => {
    void webGpuAvailable().then(setGpu);
  }, []);
  const quality = prefs.webQuality;
  const busy = state.status === "downloading" && state.quality === quality;
  const ready = state.status === "ready" && state.quality === quality;

  useEffect(() => {
    let alive = true;
    void webVoicesInstalled(quality).then((value) => alive && setCached(value));
    return () => {
      alive = false;
    };
  }, [quality, state.status]);

  return (
    <Group title="Web voices">
      <div className="flex flex-col gap-3 rounded-xl border border-line p-4">
        <div className="grid grid-cols-2 gap-2">
          {(Object.keys(WEB_QUALITY) as WebQuality[]).map((id) => (
            <button
              key={id}
              type="button"
              aria-pressed={quality === id}
              onClick={() => prefs.set({ webQuality: id })}
              className={
                "rounded-lg border p-2.5 text-left " +
                (quality === id ? "border-accent bg-accent-soft/50" : "border-line")
              }
            >
              <span className="block text-sm font-semibold">{WEB_QUALITY[id].label}</span>
              <span className="mono block text-[11px] text-muted">{WEB_QUALITY[id].size}</span>
              <span className="mt-1 block text-[11px] leading-snug text-muted">
                {WEB_QUALITY[id].note}
              </span>
            </button>
          ))}
        </div>
        {quality === "fp32" && gpu === false ? (
          <p className="text-xs text-muted">
            This browser has no WebGPU, so Studio would run on the CPU and be slow. Compact is the
            better choice here.
          </p>
        ) : null}

        {busy ? (
          <div className="flex flex-col gap-1.5">
            <div className="h-2 overflow-hidden rounded-full bg-line">
              <div
                className="bg-gradient h-full transition-[width] duration-300"
                style={{ width: `${Math.max(3, state.progress * 100)}%` }}
              />
            </div>
            <p className="mono flex justify-between text-xs text-muted">
              <span>Downloading the voice model…</span>
              <span>{state.detail || "starting"}</span>
            </p>
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-2">
          {ready ? (
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-chemistry)]">
              <Check className="size-4" aria-hidden />
              Ready · running on {state.device === "webgpu" ? "the graphics card" : "the CPU"}
            </span>
          ) : (
            <button
              type="button"
              className="btn-primary !min-h-10"
              disabled={busy}
              onClick={() => void loadWebVoices(quality).catch(() => {})}
            >
              {busy ? (
                <Loader2 className="size-4 animate-spin" aria-hidden />
              ) : (
                <Download className="size-4" aria-hidden />
              )}
              {cached ? "Start web voices" : `Download and start (${WEB_QUALITY[quality].size})`}
            </button>
          )}
          {cached || ready ? (
            <button
              type="button"
              className="btn-ghost !min-h-10 !text-xs"
              onClick={() => void removeWebVoices().then(() => setCached(false))}
            >
              <Trash2 className="size-3.5" aria-hidden />
              Remove from this browser
            </button>
          ) : null}
        </div>
        {state.status === "error" ? (
          <p className="text-xs text-[var(--color-stats)]" role="alert">
            {state.detail.replace(/\.$/, "")}. Until this works, lessons use the built-in voice.
          </p>
        ) : null}
        <p className="text-xs leading-relaxed text-muted">
          Kokoro-82M (Apache-2.0) runs entirely in this tab. The model is downloaded once from
          Hugging Face and kept by the browser, so it also works offline. Nothing is installed on
          your computer.
        </p>
      </div>
    </Group>
  );
}

type Health = { state: "checking" | "offline" | "loading" | "ok" | "error"; message?: string };

function useServerHealth(url: string): Health {
  const [health, setHealth] = useState<Health>({ state: "checking" });
  useEffect(() => {
    let alive = true;
    const base = url.trim().replace(/\/+$/, "");
    const check = async () => {
      try {
        const res = await fetch(`${base}/health`, { signal: AbortSignal.timeout(2500) });
        const data = (await res.json().catch(() => ({}))) as { status?: string };
        if (!alive) return;
        if (!res.ok) setHealth({ state: "error", message: `answered ${res.status}` });
        else setHealth({ state: data.status === "loading" ? "loading" : "ok" });
      } catch {
        if (alive) setHealth({ state: "offline" });
      }
    };
    void check();
    const timer = window.setInterval(check, 3000);
    return () => {
      alive = false;
      window.clearInterval(timer);
    };
  }, [url]);
  return health;
}

function CopyLine({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-stretch overflow-hidden rounded-lg border border-line bg-paper">
      <code className="mono thin-scroll flex-1 overflow-x-auto px-3 py-2 text-xs whitespace-nowrap">
        {text}
      </code>
      <button
        type="button"
        className="flex shrink-0 items-center gap-1 border-l border-line px-2.5 text-xs text-muted hover:text-ink"
        aria-label="Copy command"
        onClick={() => {
          void navigator.clipboard?.writeText(text).then(() => {
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1500);
          });
        }}
      >
        {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      </button>
    </div>
  );
}

function ServerInstall() {
  const prefs = useVoicePrefs();
  const health = useServerHealth(prefs.serverUrl);
  const local = ["localhost", "127.0.0.1"].includes(window.location.hostname);
  const base = `${window.location.origin}${import.meta.env.BASE_URL}`.replace(/\/+$/, "");
  const windows = /win/i.test(navigator.platform);

  const status = {
    checking: { dot: "bg-track", text: "Checking…" },
    offline: { dot: "bg-track", text: "Not running yet" },
    loading: {
      dot: "bg-[var(--color-biology)] animate-pulse",
      text: "Starting: downloading or loading the model…",
    },
    ok: { dot: "bg-[var(--color-chemistry)]", text: "Connected. Lessons will use these voices." },
    error: { dot: "bg-[var(--color-stats)]", text: `The server ${health.message ?? "failed"}` },
  }[health.state];

  return (
    <Group title="Install on this computer">
      <div className="flex flex-col gap-4 rounded-xl border border-line p-4">
        <p className="flex items-center gap-2 text-sm" aria-live="polite">
          <span className={`size-2.5 shrink-0 rounded-full ${status.dot}`} />
          {status.text}
        </p>
        <ol className="flex flex-col gap-3 text-sm">
          <li className="flex flex-col gap-1.5">
            <span>
              <b>1.</b> Install{" "}
              <a
                href="https://docs.astral.sh/uv/getting-started/installation/"
                target="_blank"
                rel="noreferrer"
                className="text-accent hover:underline"
              >
                uv
              </a>
              , a small Python runner (once):
            </span>
            <CopyLine
              text={
                windows
                  ? 'powershell -c "irm https://astral.sh/uv/install.ps1 | iex"'
                  : "curl -LsSf https://astral.sh/uv/install.sh | sh"
              }
            />
          </li>
          <li className="flex flex-col gap-1.5">
            <span>
              <b>2.</b> Start the voices. The first run downloads the model (about 90 MB):
            </span>
            <CopyLine text={`uv run ${REPO_RAW}`} />
            <span className="text-xs text-muted">
              From a copy of this repository, <span className="mono">npm run voices</span> does the
              same.
            </span>
          </li>
          <li>
            <b>3.</b> Leave it running. The status above turns green on its own.
          </li>
        </ol>
        <details className="group text-sm">
          <summary className="flex cursor-pointer list-none items-center gap-1 text-xs font-medium text-muted hover:text-ink">
            <ChevronDown className="size-3.5 transition-transform group-open:rotate-180" />
            Server address and other engines
          </summary>
          <div className="mt-3 flex flex-col gap-3">
            <Field
              label="Address"
              value={prefs.serverUrl}
              onChange={(serverUrl) => prefs.set({ serverUrl })}
              placeholder="http://127.0.0.1:3939"
            />
            <div className="flex flex-wrap gap-1.5">
              <Preset
                label="Formula Book voices"
                onClick={() =>
                  prefs.set({ serverUrl: "http://127.0.0.1:3939", serverModel: "kokoro" })
                }
              />
              {local ? (
                <>
                  <Preset
                    label="Natural Voice Reader · Kokoro"
                    onClick={() =>
                      prefs.set({ serverUrl: `${base}/nvr-kokoro`, serverModel: "kokoro" })
                    }
                  />
                  <Preset
                    label="Natural Voice Reader · VoiceStudio"
                    onClick={() =>
                      prefs.set({ serverUrl: `${base}/nvr-voicestudio`, serverModel: "kittentts" })
                    }
                  />
                </>
              ) : null}
            </div>
            {prefs.serverModel !== "kokoro" ? (
              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="Model"
                  value={prefs.serverModel}
                  onChange={(serverModel) => prefs.set({ serverModel })}
                />
                <Field
                  label="Voice"
                  value={prefs.serverVoice}
                  onChange={(serverVoice) => prefs.set({ serverVoice })}
                  placeholder="server default"
                />
              </div>
            ) : null}
            <p className="text-xs leading-relaxed text-muted">
              Any server with an OpenAI-style <span className="mono">/v1/audio/speech</span> works.
              {local
                ? " When the book runs locally, Natural Voice Reader's servers are reached through this page's own address, so they need no extra setup."
                : " It must allow requests from this page (CORS); the Formula Book voice server does."}
            </p>
          </div>
        </details>
      </div>
    </Group>
  );
}

function Preset({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" className="chip hover:border-accent hover:!text-ink" onClick={onClick}>
      {label}
    </button>
  );
}

/** Preview a character with the chosen neural engine. */
function previewOptions(voice: string): SpeakOptions {
  const prefs = useVoicePrefs.getState();
  const base = voiceFor("narrator");
  if (prefs.engine === "web") return { ...base, web: { voice, quality: prefs.webQuality } };
  if (base.server) return { ...base, server: { ...base.server, voice } };
  return base;
}

function Characters() {
  const prefs = useVoicePrefs();
  const [active, setActive] = useState<string | null>(null);
  const { speaking } = useSpeechStatus();

  useEffect(() => () => stop(), []);

  const preview = (character: VoiceCharacter) => {
    useLesson.getState().pause();
    if (active === character.id) {
      stop();
      setActive(null);
      return;
    }
    setActive(character.id);
    void speak(character.line, previewOptions(character.id)).finally(() =>
      setActive((id) => (id === character.id ? null : id)),
    );
  };

  return (
    <Group
      title="Voice characters"
      aside={
        <span className="text-[11px] text-muted">
          Narrator: <b className="text-ink">{characterName(prefs.character)}</b> · Tutor:{" "}
          <b className="text-ink">{characterName(prefs.tutorCharacter)}</b>
        </span>
      }
    >
      <ul className="grid gap-2">
        {CHARACTERS.map((character) => {
          const narrator = prefs.character === character.id;
          const tutor = prefs.tutorCharacter === character.id;
          const busy = active === character.id;
          // The first web-voice sentence takes a moment to generate.
          const preparing = busy && !speaking;
          return (
            <li
              key={character.id}
              className={
                "flex items-center gap-3 rounded-xl border p-3 " +
                (narrator || tutor ? "border-accent/60 bg-accent-soft/30" : "border-line")
              }
            >
              <button
                type="button"
                onClick={() => preview(character)}
                aria-label={busy ? `Stop ${character.name}` : `Preview ${character.name}`}
                className="relative flex size-11 shrink-0 items-center justify-center rounded-full font-display text-base font-semibold text-white shadow"
                style={{
                  background: `linear-gradient(135deg, ${character.hues[0]}, ${character.hues[1]})`,
                }}
              >
                <span className={busy ? "opacity-0" : ""}>{character.name[0]}</span>
                {preparing ? (
                  <Loader2 className="absolute size-5 animate-spin" aria-hidden />
                ) : busy ? (
                  <Square className="absolute size-4" aria-hidden />
                ) : (
                  <Play
                    className="absolute right-0 bottom-0 size-4 rounded-full bg-card p-0.5 text-accent"
                    aria-hidden
                  />
                )}
              </button>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 text-sm font-semibold">
                  {character.name}
                  <span className="chip !px-1.5 !py-0 !text-[10px]">{character.accent}</span>
                </p>
                <p className="text-xs leading-snug text-muted">{character.style}</p>
              </div>
              <div className="flex shrink-0 flex-col gap-1">
                <RoleToggle
                  on={narrator}
                  label="Narrator"
                  onClick={() => prefs.set({ character: character.id })}
                />
                <RoleToggle
                  on={tutor}
                  label="Tutor"
                  onClick={() => prefs.set({ tutorCharacter: character.id })}
                />
              </div>
            </li>
          );
        })}
      </ul>
      <p className="text-xs text-muted">
        Tap a face to hear it. The narrator reads the lesson; the tutor asks and answers the
        practice questions.
      </p>
    </Group>
  );
}

function RoleToggle({ on, label, onClick }: { on: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={
        "inline-flex h-6 items-center justify-center gap-1 rounded-full px-2 text-[11px] font-medium " +
        (on ? "bg-accent text-on-accent" : "border border-line text-muted hover:text-ink")
      }
    >
      {on ? <Check className="size-3" aria-hidden /> : null}
      {label}
    </button>
  );
}

function useDeviceVoices(): VoiceOption[] {
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

function DeviceVoices() {
  const all = useDeviceVoices();
  const prefs = useVoicePrefs();
  const shown = all.filter(
    (voice) =>
      prefs.allLanguages ||
      voice.lang.toLowerCase().startsWith("en") ||
      voice.id === prefs.voiceId ||
      voice.id === prefs.tutorVoiceId,
  );
  return (
    <Group title="Built-in voices">
      {all.length === 0 ? (
        <p className="text-sm text-muted">
          No voices reported yet. Some browsers load them after the first lesson starts.
        </p>
      ) : null}
      <VoicePicker
        label="Narrator"
        value={prefs.voiceId}
        onChange={(voiceId) => prefs.set({ voiceId })}
        voices={shown}
        emptyLabel="Browser default"
      />
      <VoicePicker
        label="Practice questions"
        value={prefs.tutorVoiceId}
        onChange={(tutorVoiceId) => prefs.set({ tutorVoiceId })}
        voices={shown}
        emptyLabel="Same as narrator"
      />
      <label className="inline-flex min-h-9 items-center gap-2 text-sm">
        <input
          type="checkbox"
          className="size-4 accent-[var(--color-accent)]"
          checked={prefs.allLanguages}
          onChange={(event) => prefs.set({ allLanguages: event.target.checked })}
        />
        Show voices in every language
      </label>
      <p className="text-xs leading-relaxed text-muted">
        These come from your operating system and browser, so the list differs between computers and
        phones. For natural voices on any device, choose Web voices above.
      </p>
    </Group>
  );
}

function VoicePicker({
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
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const chosen = voices.find((voice) => voice.id === value);
  const needle = query.trim().toLowerCase();
  const shown = useMemo(
    () =>
      voices.filter(
        (voice) =>
          !needle ||
          voice.name.toLowerCase().includes(needle) ||
          voice.lang.toLowerCase().includes(needle),
      ),
    [voices, needle],
  );

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs text-muted">{label}</span>
      <button
        type="button"
        className="flex min-h-11 items-center justify-between gap-2 rounded-xl border border-line bg-paper px-3 text-left text-sm"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="truncate">
          {chosen ? (
            <>
              {chosen.name} <span className="text-muted">· {chosen.lang}</span>
            </>
          ) : (
            emptyLabel
          )}
        </span>
        <ChevronDown
          className={"size-4 shrink-0 transition-transform " + (open ? "rotate-180" : "")}
        />
      </button>
      {open ? (
        <div className="overflow-hidden rounded-xl border border-line bg-paper">
          <label className="flex items-center gap-2 border-b border-line px-3">
            <Search className="size-4 text-muted" aria-hidden />
            <span className="sr-only">Search voices</span>
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search voices"
              className="h-10 w-full bg-transparent text-sm outline-none placeholder:text-muted"
            />
          </label>
          <ul
            className="thin-scroll max-h-56 overflow-y-auto p-1"
            role="listbox"
            aria-label={label}
          >
            {[{ id: "", name: emptyLabel, lang: "", local: true, isDefault: false }, ...shown].map(
              (voice) => {
                const selected = voice.id === value;
                return (
                  <li key={voice.id || "default"}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={selected}
                      className={
                        "flex min-h-10 w-full items-center gap-2 rounded-lg px-2 text-left text-sm " +
                        (selected ? "bg-accent-soft text-accent" : "hover:bg-raise")
                      }
                      onClick={() => {
                        onChange(voice.id);
                        setOpen(false);
                        setQuery("");
                      }}
                    >
                      <Check className={"size-4 shrink-0 " + (selected ? "" : "invisible")} />
                      <span className="min-w-0 flex-1 truncate">{voice.name}</span>
                      {voice.lang ? (
                        <span className="mono shrink-0 text-[11px] text-muted">
                          {voice.lang}
                          {voice.local ? "" : " · online"}
                        </span>
                      ) : null}
                    </button>
                  </li>
                );
              },
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function TestVoices() {
  const [on, setOn] = useState(false);
  return (
    <button
      type="button"
      className="btn-primary self-start"
      onClick={() => {
        if (on) {
          stop();
          setOn(false);
          return;
        }
        setOn(true);
        useLesson.getState().pause();
        void speak(
          "This is the narrator. The derivative of x squared is two x.",
          voiceFor("narrator"),
        )
          .then((done) =>
            done
              ? speak(
                  "And I ask the practice questions. What is the derivative of x cubed?",
                  voiceFor("tutor"),
                )
              : false,
          )
          .finally(() => setOn(false));
      }}
    >
      {on ? <Square className="size-4" aria-hidden /> : <Volume2 className="size-4" aria-hidden />}
      {on ? "Stop" : "Test narrator and tutor"}
    </button>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs text-muted">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        spellCheck={false}
        className="mono h-10 rounded-lg border border-line bg-paper px-3 text-sm outline-none focus:border-accent"
      />
    </label>
  );
}

// --- Appearance ---------------------------------------------------------------------

const THEMES: { id: ThemePref; label: string; icon: typeof Sun }[] = [
  { id: "light", label: "Light", icon: Sun },
  { id: "dark", label: "Dark", icon: Moon },
  { id: "system", label: "System", icon: Cpu },
];

function AppearanceSection() {
  const theme = useAppearance((state) => state.theme);
  const ink = useAppearance((state) => state.ink);
  const setTheme = useAppearance((state) => state.setTheme);
  const setInk = useAppearance((state) => state.setInk);
  return (
    <>
      <Group title="Theme">
        <div className="grid grid-cols-3 gap-1 rounded-full border border-line p-1">
          {THEMES.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={theme === item.id}
              onClick={() => setTheme(item.id)}
              className={
                "inline-flex h-9 items-center justify-center gap-1.5 rounded-full text-sm font-medium " +
                (theme === item.id ? "bg-accent text-on-accent" : "text-muted hover:text-ink")
              }
            >
              <item.icon className="size-4" aria-hidden />
              {item.label}
            </button>
          ))}
        </div>
      </Group>
      <Group title="Accent">
        <div className="grid grid-cols-4 gap-2">
          {INKS.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={ink === item.id}
              onClick={() => setInk(item.id)}
              className="flex flex-col items-center gap-1.5 text-xs text-muted"
            >
              <span
                className={
                  "flex size-12 items-center justify-center rounded-full ring-offset-2 ring-offset-card " +
                  (ink === item.id ? "ring-2 ring-ink" : "")
                }
                style={{
                  background: `linear-gradient(135deg, ${item.swatch[0]}, ${item.swatch[1]})`,
                }}
              >
                {ink === item.id ? <Check className="size-5 text-black/70" /> : null}
              </span>
              {item.label}
            </button>
          ))}
        </div>
      </Group>
    </>
  );
}

// --- Progress -----------------------------------------------------------------------

function ProgressSection() {
  const read = useProgress((state) => state.read);
  const practice = useProgress((state) => state.practice);
  const [confirm, setConfirm] = useState(false);
  const solved = Object.values(practice).filter((v) => v === "got").length;
  return (
    <Group title="Your progress">
      <p className="text-sm leading-relaxed">
        {read.length} chapters read and {solved} practice questions solved. Progress is kept only in
        this browser; nothing is sent anywhere.
      </p>
      {confirm ? (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-[var(--color-stats)]/50 p-3 text-sm">
          <span className="flex-1">Forget every chapter read, answer, and streak?</span>
          <button
            type="button"
            className="btn-primary !min-h-9 !bg-[var(--color-stats)]"
            onClick={() => {
              useProgress.setState({ read: [], last: null, practice: {}, days: [] });
              setConfirm(false);
            }}
          >
            Reset
          </button>
          <button type="button" className="btn-ghost !min-h-9" onClick={() => setConfirm(false)}>
            Keep
          </button>
        </div>
      ) : (
        <button type="button" className="btn-ghost self-start" onClick={() => setConfirm(true)}>
          <RotateCcw className="size-4" aria-hidden />
          Reset progress
        </button>
      )}
    </Group>
  );
}

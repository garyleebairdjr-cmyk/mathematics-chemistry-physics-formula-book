import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, BookOpen, FlaskConical, Lightbulb, Square, Volume2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Plot } from "@/components/plot";
import { Shell } from "@/components/shell";
import { Tex } from "@/components/tex";
import { chapterBySlug } from "@/data";
import { compile } from "@/lib/plot/expr";
import {
  fmt,
  presetById,
  presets,
  type Curve,
  type Param,
  type Params,
  type Preset,
} from "@/lib/plot/presets";
import { speak, stop } from "@/lib/speech/engine";
import { voiceFor } from "@/lib/speech/lesson-store";
import { textToSpeech } from "@/lib/speech/tex-speech";
import { useTitle } from "@/lib/use-title";

type Search = { model?: string };

export const Route = createFileRoute("/lab")({
  validateSearch: (search: Record<string, unknown>): Search =>
    typeof search.model === "string" ? { model: search.model } : {},
  component: Lab,
});

const CUSTOM = "custom";
const GROUPS = ["Mathematics", "Statistics", "Physics", "Biology"] as const;

function initial(preset: Preset): Params {
  return Object.fromEntries(preset.params.map((param) => [param.id, param.value]));
}

function Lab() {
  useTitle("Graph lab");
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const id =
    search.model === CUSTOM || presetById.has(search.model ?? "") ? search.model! : presets[0].id;

  return (
    <Shell wide>
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-semibold tracking-[0.16em] text-accent uppercase">Graph lab</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          See the math <span className="font-flair font-normal italic text-gradient">move</span>.
        </h1>
        <p className="mt-3 max-w-2xl font-serif text-lg leading-relaxed text-muted">
          Live models of the formulas in the book. Drag a slider and the graph, the numbers, and the
          story change together. Or type your own function.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          {GROUPS.map((group) => {
            const items = presets.filter((preset) => preset.group === group);
            if (items.length === 0) return null;
            return (
              <div key={group} className="flex flex-wrap items-center gap-2">
                <span className="w-24 shrink-0 text-xs font-medium text-muted">{group}</span>
                {items.map((preset) => (
                  <ModelChip
                    key={preset.id}
                    label={preset.title}
                    active={preset.id === id}
                    onClick={() => navigate({ search: { model: preset.id }, replace: true })}
                  />
                ))}
                {group === "Mathematics" ? (
                  <ModelChip
                    label="Your own function"
                    active={id === CUSTOM}
                    onClick={() => navigate({ search: { model: CUSTOM }, replace: true })}
                  />
                ) : null}
              </div>
            );
          })}
        </div>

        {id === CUSTOM ? <CustomModel /> : <PresetModel key={id} preset={presetById.get(id)!} />}
      </div>
    </Shell>
  );
}

function ModelChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={
        "min-h-9 rounded-full border px-3.5 text-sm font-medium transition-colors " +
        (active
          ? "border-accent bg-accent text-on-accent shadow-[0_6px_20px_-8px_var(--color-accent)]"
          : "border-line bg-card/70 hover:border-accent")
      }
    >
      {label}
    </button>
  );
}

function Slider({
  param,
  value,
  onChange,
}: {
  param: Param;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="flex items-baseline justify-between gap-2 text-sm">
        <span className="flex items-baseline gap-2">
          <span className="font-serif text-base text-accent">
            <Tex tex={param.tex} />
          </span>
          <span className="text-muted">{param.name}</span>
        </span>
        <span className="mono text-xs tabular-nums">
          {fmt(value, 2)}
          {param.unit ? ` ${param.unit}` : ""}
        </span>
      </span>
      <input
        type="range"
        min={param.min}
        max={param.max}
        step={param.step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full"
      />
    </label>
  );
}

function ReadAloud({ text }: { text: string }) {
  const [on, setOn] = useState(false);
  useEffect(() => () => stop(), []);
  return (
    <button
      type="button"
      className="btn-ghost !min-h-10"
      aria-pressed={on}
      onClick={() => {
        if (on) {
          stop();
          setOn(false);
          return;
        }
        setOn(true);
        void speak(textToSpeech(text), voiceFor("narrator")).then(() => setOn(false));
      }}
    >
      {on ? <Square className="size-4" aria-hidden /> : <Volume2 className="size-4" aria-hidden />}
      {on ? "Stop" : "Read aloud"}
    </button>
  );
}

function PresetModel({ preset }: { preset: Preset }) {
  const [params, setParams] = useState<Params>(() => initial(preset));
  const [derivative, setDerivative] = useState(false);
  const curves = useMemo(() => preset.curves(params), [preset, params]);
  const view = useMemo(() => preset.view(params), [preset, params]);
  const chapter = chapterBySlug.get(preset.chapter);
  const hasFn = curves.some((curve) => curve.kind === "fn");

  return (
    <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
      <section className="panel overflow-hidden p-3 sm:p-4">
        <Plot
          view={view}
          curves={curves}
          params={params}
          marks={preset.marks?.(params)}
          area={preset.area?.(params)}
          riemann={preset.riemann?.(params)}
          derivative={derivative}
          animate={preset.animate}
          xLabel={preset.xLabel}
          yLabel={preset.yLabel}
          resetKey={preset.id}
        />
      </section>

      <aside className="flex flex-col gap-4">
        <div className="panel formula-card p-4">
          <p className="text-xs font-semibold tracking-[0.14em] text-accent uppercase">
            {preset.title}
          </p>
          <div className="mt-2 overflow-x-auto py-1 text-[0.85rem] sm:text-[0.95rem]">
            <Tex tex={preset.tex} display />
          </div>
        </div>
        <div className="panel flex flex-col gap-4 p-4">
          {preset.params.map((param) => (
            <Slider
              key={param.id}
              param={param}
              value={params[param.id]}
              onChange={(v) => setParams((p) => ({ ...p, [param.id]: v }))}
            />
          ))}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="btn-ghost !min-h-9 !text-xs"
              onClick={() => setParams(initial(preset))}
            >
              Reset sliders
            </button>
            {hasFn ? (
              <button
                type="button"
                aria-pressed={derivative}
                className={
                  "btn-ghost !min-h-9 !text-xs " + (derivative ? "!border-accent !text-accent" : "")
                }
                onClick={() => setDerivative((v) => !v)}
              >
                Show slope f′
              </button>
            ) : null}
          </div>
        </div>
        {preset.readouts ? (
          <dl className="panel grid gap-px overflow-hidden !bg-line p-0">
            {preset.readouts(params).map((item) => (
              <div
                key={item.label}
                className="flex items-baseline justify-between gap-3 bg-card px-4 py-2.5"
              >
                <dt className="text-xs text-muted">{item.label}</dt>
                <dd className="mono text-sm font-medium tabular-nums">{item.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </aside>

      <section className="panel flex flex-col gap-4 p-5 lg:col-span-2 lg:flex-row lg:items-start">
        <div className="flex-1">
          <p className="font-serif text-lg leading-relaxed">{preset.blurb}</p>
          <p className="mt-3 flex gap-2 text-sm leading-relaxed text-muted">
            <Lightbulb className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
            <span>
              <span className="font-medium text-ink">Try this. </span>
              {preset.explore}
            </span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ReadAloud text={`${preset.title}. ${preset.blurb} Try this. ${preset.explore}`} />
          {chapter ? (
            <Link
              to="/read/$slug"
              params={{ slug: chapter.slug }}
              className="btn-primary !min-h-10"
            >
              <BookOpen className="size-4" aria-hidden />
              {chapter.title}
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          ) : null}
        </div>
      </section>
    </div>
  );
}

const CUSTOM_PARAMS: Param[] = ["a", "b", "c"].map((id, i) => ({
  id,
  tex: id,
  name: `Parameter ${id}`,
  min: -5,
  max: 5,
  step: 0.1,
  value: [1, 1, 0][i],
}));

const EXAMPLES = [
  "a*sin(b*x) + c",
  "a*x^3 - b*x",
  "exp(-x^2/2)*cos(b*x)",
  "a/(1 + exp(-b*x))",
  "sqrt(abs(x))*a",
  "floor(x)",
];

function CustomModel() {
  const [f, setF] = useState("a*sin(b*x) + c");
  const [g, setG] = useState("");
  const [params, setParams] = useState<Params>({ a: 1, b: 1, c: 0 });
  const [derivative, setDerivative] = useState(true);

  const compiled = useMemo(() => {
    const vars = ["x", "a", "b", "c"];
    const out: { curves: Curve[]; error: string | null } = { curves: [], error: null };
    try {
      if (g.trim()) {
        const gf = compile(g, vars);
        out.curves.push({ kind: "fn", label: "g(x)", hue: "glow", f: (x, p) => gf({ ...p, x }) });
      }
      const ff = compile(f, vars);
      out.curves.push({ kind: "fn", label: "f(x)", hue: "accent", f: (x, p) => ff({ ...p, x }) });
    } catch (error) {
      out.error = error instanceof Error ? error.message : String(error);
    }
    return out;
  }, [f, g]);

  return (
    <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
      <section className="panel overflow-hidden p-3 sm:p-4">
        <Plot
          view={{ x: [-10, 10], y: [-6, 6] }}
          curves={compiled.curves}
          params={params}
          derivative={derivative}
          xLabel="x"
          yLabel="y"
          resetKey="custom"
        />
      </section>
      <aside className="flex flex-col gap-4">
        <div className="panel flex flex-col gap-3 p-4">
          <ExprField label="f(x) =" value={f} onChange={setF} />
          <ExprField label="g(x) =" value={g} onChange={setG} placeholder="optional second curve" />
          {compiled.error ? (
            <p className="text-sm text-[var(--color-stats)]" role="alert">
              {compiled.error}
            </p>
          ) : null}
          <div className="flex flex-wrap gap-1.5">
            {EXAMPLES.map((example) => (
              <button
                key={example}
                type="button"
                className="chip mono hover:border-accent hover:!text-ink"
                onClick={() => setF(example)}
              >
                {example}
              </button>
            ))}
          </div>
        </div>
        <div className="panel flex flex-col gap-4 p-4">
          {CUSTOM_PARAMS.map((param) => (
            <Slider
              key={param.id}
              param={param}
              value={params[param.id]}
              onChange={(v) => setParams((p) => ({ ...p, [param.id]: v }))}
            />
          ))}
          <button
            type="button"
            aria-pressed={derivative}
            className={
              "btn-ghost self-start !min-h-9 !text-xs " +
              (derivative ? "!border-accent !text-accent" : "")
            }
            onClick={() => setDerivative((v) => !v)}
          >
            Show slope f′
          </button>
        </div>
        <p className="flex gap-2 px-1 text-xs leading-relaxed text-muted">
          <FlaskConical className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
          Use x, the sliders a, b, c, and functions such as sin, cos, tan, exp, ln, log, sqrt, abs.
          Write powers with ^. Constants: pi, e, g. 2x and 3(x + 1) work as products.
        </p>
      </aside>
    </div>
  );
}

function ExprField({
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
    <label className="flex items-center gap-2 rounded-xl border border-line bg-paper px-3 focus-within:border-accent">
      <span className="font-serif text-accent italic">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        spellCheck={false}
        autoCapitalize="off"
        className="mono h-11 w-full bg-transparent text-sm outline-none placeholder:text-muted"
      />
    </label>
  );
}

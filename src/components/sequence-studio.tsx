import { useMemo, useState } from "react";
import { Def } from "@/components/def";
import { PHI, fibonacciSpiral, partialSums, termsOf, type SequenceKind } from "@/lib/sequences";

const kinds: { id: SequenceKind; label: string }[] = [
  { id: "arithmetic", label: "Arithmetic" },
  { id: "geometric", label: "Geometric" },
  { id: "fibonacci", label: "Fibonacci" },
  { id: "lucas", label: "Lucas" },
  { id: "triangular", label: "Triangular" },
  { id: "squares", label: "Squares" },
  { id: "powers", label: "Powers of 2" },
  { id: "factorial", label: "Factorial" },
  { id: "harmonic", label: "Harmonic" },
];

function parseTerm(raw: string): number | null {
  const text = raw.trim();
  const fraction = text.match(/^([+-]?\d+(?:\.\d+)?)\s*\/\s*([+-]?\d+(?:\.\d+)?)$/);
  if (fraction) {
    const denominator = Number(fraction[2]);
    if (denominator === 0) return null;
    const value = Number(fraction[1]) / denominator;
    return Number.isFinite(value) ? value : null;
  }
  const value = Number(text);
  return Number.isFinite(value) ? value : null;
}

function show(value: number): string {
  if (!Number.isFinite(value)) return "—";
  const nearest = Math.round(value);
  if (Math.abs(value - nearest) < 1e-9 && Math.abs(nearest) < 1e15) return String(nearest);
  const abs = Math.abs(value);
  if (abs !== 0 && (abs >= 1e6 || abs < 1e-3)) {
    return value.toExponential(3).replace("e+", "e");
  }
  return String(Number(value.toPrecision(6)));
}

export function SequenceStudio() {
  const [kind, setKind] = useState<SequenceKind>("fibonacci");
  const [count, setCount] = useState(8);
  const [firstText, setFirstText] = useState("3");
  const [stepText, setStepText] = useState("2");
  const [sums, setSums] = useState(false);
  const [log, setLog] = useState(false);

  const tunable = kind === "arithmetic" || kind === "geometric";
  const first = parseTerm(firstText);
  const step = parseTerm(stepText);
  const ready =
    !tunable ||
    (first !== null && step !== null && (kind !== "geometric" || step !== 0 || count === 1));

  const terms = useMemo(() => {
    if (!ready || first === null || step === null) return [];
    return termsOf(kind, count, first, step);
  }, [kind, count, first, step, ready]);

  const shown = sums ? partialSums(terms) : terms;
  const positive = shown.length > 0 && shown.every((value) => value > 0);
  const useLog = log && positive;
  const spiral = kind === "fibonacci" ? fibonacciSpiral(Math.min(count, 8)) : [];

  return (
    <section className="mt-8 rounded-lg border border-line bg-card p-4">
      <h2 className="font-serif text-2xl">A model you can move</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Change the rule and the length. The bars are the terms, unless you ask for the running sum.
        Hover a marked word if the letter is doing silent work.
      </p>

      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Sequence">
        {kinds.map((item) => {
          const selected = item.id === kind;
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={selected}
              className={
                "inline-flex min-h-11 items-center rounded-lg px-3 text-sm " +
                (selected ? "bg-accent text-on-accent" : "border border-line bg-paper text-ink")
              }
              onClick={() => {
                setKind(item.id);
                setLog(false);
                if (item.id === "geometric") {
                  setFirstText("3");
                  setStepText("2");
                }
                if (item.id === "arithmetic") {
                  setFirstText("3");
                  setStepText("2");
                }
              }}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label htmlFor="seq-count">
          <span className="text-xs font-medium tracking-wide text-muted uppercase">
            Terms, {count}
          </span>
          <input
            id="seq-count"
            type="range"
            min={4}
            max={12}
            value={count}
            onChange={(event) => setCount(Number(event.target.value))}
            className="mt-2 block w-full"
          />
        </label>
        {tunable ? (
          <>
            <label htmlFor="seq-first">
              <span className="text-xs font-medium tracking-wide text-muted uppercase">
                <Def term="a" definition="First term, a₁. Fractions such as 1/2 are allowed." />
              </span>
              <input
                id="seq-first"
                value={firstText}
                onChange={(event) => setFirstText(event.target.value)}
                className="mt-1 h-11 w-full rounded-lg border border-line bg-paper px-3 text-sm outline-none"
              />
            </label>
            <label htmlFor="seq-step">
              <span className="text-xs font-medium tracking-wide text-muted uppercase">
                {kind === "arithmetic" ? (
                  <Def
                    term="d"
                    definition="Common difference. Each term is the one before it, plus d."
                  />
                ) : (
                  <Def
                    term="r"
                    definition="Common ratio. Each term is the one before it, times r."
                  />
                )}
              </span>
              <input
                id="seq-step"
                value={stepText}
                onChange={(event) => setStepText(event.target.value)}
                className="mt-1 h-11 w-full rounded-lg border border-line bg-paper px-3 text-sm outline-none"
              />
            </label>
          </>
        ) : (
          <p className="self-end text-sm leading-relaxed text-muted">{blurb(kind)}</p>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-4">
        <label className="inline-flex min-h-11 items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={sums}
            onChange={(event) => setSums(event.target.checked)}
          />
          Partial sums
        </label>
        <label className="inline-flex min-h-11 items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={useLog}
            disabled={!positive}
            onChange={(event) => setLog(event.target.checked)}
          />
          Log scale
        </label>
      </div>
      {!positive && log ? (
        <p className="text-sm text-muted">Log scale needs every displayed value to be positive.</p>
      ) : null}
      {!ready ? <p className="mt-3 text-sm">Enter a number or a fraction for each box.</p> : null}

      {shown.length > 0 ? (
        <>
          <Bars values={shown} log={useLog} />
          <ol className="mt-3 flex flex-wrap gap-2">
            {shown.map((value, index) => (
              <li
                key={`${kind}-${index}`}
                className="min-w-12 rounded-lg border border-line bg-paper px-2 py-1"
              >
                <span className="block text-xs text-muted">{index + 1}</span>
                <span className="font-serif">{show(value)}</span>
              </li>
            ))}
          </ol>
          <p className="mt-3 text-sm leading-relaxed">{caption(kind, terms, sums, first, step)}</p>
          {kind === "fibonacci" || kind === "lucas" ? <RatioLine values={terms} /> : null}
          {kind === "fibonacci" ? <Spiral squares={spiral} /> : null}
        </>
      ) : null}
    </section>
  );
}

function blurb(kind: SequenceKind): string {
  if (kind === "fibonacci")
    return "F₀ = 0, F₁ = 1, and each later term adds the previous two. The bars start at F₁.";
  if (kind === "lucas")
    return "Same addition rule as Fibonacci. The bars start at L₀ = 2, then 1, 3, 4, 7, …";
  if (kind === "triangular") return "Tₙ = n(n + 1)/2, the sum of 1 through n.";
  if (kind === "squares") return "1, 4, 9, 16, … the squares of the positive integers.";
  if (kind === "powers") return "1, 2, 4, 8, … a geometric sequence with first term 1 and ratio 2.";
  if (kind === "factorial")
    return "1!, 2!, 3!, … Each term multiplies by the next integer, not by a fixed ratio.";
  return "1, 1/2, 1/3, 1/4, … The partial sums are the harmonic numbers. They grow without a finite limit.";
}

function caption(
  kind: SequenceKind,
  terms: number[],
  sums: boolean,
  first: number | null,
  step: number | null,
): string {
  const total = terms.reduce((sum, value) => sum + value, 0);
  const head = sums ? "Bars show the running sum." : "Bars show the terms.";
  if (kind === "arithmetic" && first !== null && step !== null) {
    return `${head} Sum of these ${terms.length} terms: ${show(total)}. The formula gives the same sum when you pair the first term ${show(first)} with the last.`;
  }
  if (kind === "geometric" && first !== null && step !== null) {
    const infinite =
      Math.abs(step) < 1
        ? ` The infinite sum is ${show(first / (1 - step))}.`
        : " The infinite sum is not a finite number at this ratio.";
    return `${head} Sum of these ${terms.length} terms: ${show(total)}.${infinite}`;
  }
  if (kind === "fibonacci") {
    const ratio = terms.length >= 2 ? terms[terms.length - 1] / terms[terms.length - 2] : null;
    const gap = ratio === null ? "" : ` The last ratio is ${show(ratio)}; φ is ${show(PHI)}.`;
    return `${head} Sum of the terms shown: ${show(total)}, which is Fₙ₊₂ − 1 for this many terms.${gap}`;
  }
  return `${head} Sum of the values shown: ${show(total)}.`;
}

function RatioLine({ values }: { values: number[] }) {
  if (values.length < 3) return null;
  const ratios = values.slice(1).map((value, index) => value / values[index]);
  const min = Math.min(...ratios, PHI);
  const max = Math.max(...ratios, PHI);
  const span = max - min || 1;
  const w = 320;
  const h = 72;
  const points = ratios
    .map((ratio, index) => {
      const x = (index / (ratios.length - 1)) * (w - 16) + 8;
      const y = h - 8 - ((ratio - min) / span) * (h - 16);
      return `${x},${y}`;
    })
    .join(" ");
  const phiY = h - 8 - ((PHI - min) / span) * (h - 16);
  return (
    <figure className="mt-4">
      <figcaption className="text-sm">
        Neighbor ratios against{" "}
        <Def
          term="φ"
          definition="The golden ratio, (1 + √5)/2 ≈ 1.61803. Consecutive Fibonacci and Lucas ratios approach it."
        />
      </figcaption>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="mt-2 h-20 w-full"
        role="img"
        aria-label="Ratios of consecutive terms approaching phi"
      >
        <line
          x1="8"
          x2={w - 8}
          y1={phiY}
          y2={phiY}
          className="stroke-accent"
          strokeDasharray="4 3"
        />
        <polyline points={points} fill="none" className="stroke-ink" strokeWidth="1.5" />
      </svg>
    </figure>
  );
}

function Bars({ values, log }: { values: number[]; log: boolean }) {
  const plotted = values.map((value) => (log ? Math.log10(value) : value));
  const min = Math.min(0, ...plotted);
  const max = Math.max(0, ...plotted);
  const span = max - min || 1;
  const w = 640;
  const h = 180;
  const slot = w / values.length;
  const zero = h - ((0 - min) / span) * (h - 24) - 16;
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="mt-4 h-48 w-full"
      role="img"
      aria-label="Bar chart of the sequence"
    >
      <line x1="0" x2={w} y1={zero} y2={zero} className="stroke-line" />
      {plotted.map((value, index) => {
        const barTop = h - ((value - min) / span) * (h - 24) - 16;
        const y = Math.min(barTop, zero);
        const height = Math.max(1, Math.abs(barTop - zero));
        const width = Math.max(2, slot - 6);
        return (
          <rect
            key={index}
            x={index * slot + 3}
            y={y}
            width={width}
            height={height}
            className="fill-accent"
            rx="2"
          >
            <title>
              {index + 1}: {show(values[index])}
            </title>
          </rect>
        );
      })}
    </svg>
  );
}

function Spiral({ squares }: { squares: ReturnType<typeof fibonacciSpiral> }) {
  if (squares.length === 0) return null;
  const minX = Math.min(...squares.map((square) => square.x));
  const minY = Math.min(...squares.map((square) => square.y));
  const maxX = Math.max(...squares.map((square) => square.x + square.s));
  const maxY = Math.max(...squares.map((square) => square.y + square.s));
  const path = squares
    .map((square, index) => {
      const move = index === 0 ? `M ${square.x1} ${square.y1} ` : "";
      return `${move}A ${square.s} ${square.s} 0 0 1 ${square.x2} ${square.y2}`;
    })
    .join(" ");
  return (
    <figure className="mt-4">
      <figcaption className="text-sm leading-relaxed">
        Squares whose sides are 1, 1, 2, 3, 5, …, the Fibonacci numbers from F₁. The quarter-circle
        in each square starts where the previous one ended. The figure fills a rectangle only
        because each new side is the sum of the two before it.
      </figcaption>
      <svg
        viewBox={`${minX - 0.4} ${minY - 0.4} ${maxX - minX + 0.8} ${maxY - minY + 0.8}`}
        className="mt-2 h-64 w-full"
        role="img"
        aria-label="Fibonacci squares and spiral"
      >
        {squares.map((square, index) => (
          <rect
            key={index}
            x={square.x}
            y={square.y}
            width={square.s}
            height={square.s}
            className="fill-accent-soft stroke-accent"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />
        ))}
        <path
          d={path}
          fill="none"
          className="stroke-ink"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </figure>
  );
}

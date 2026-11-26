import { useEffect, useMemo, useRef, useState } from "react";
import type { Curve, Hue, Mark, Params } from "@/lib/plot/presets";
import { fmt } from "@/lib/plot/presets";

const W = 1000;
const H = 600;
const PAD = { left: 56, right: 18, top: 18, bottom: 42 };

const HUE: Record<Hue, string> = {
  accent: "var(--color-accent)",
  glow: "var(--color-glow)",
  physics: "var(--color-physics)",
  chemistry: "var(--color-chemistry)",
  math: "var(--color-math)",
  stats: "var(--color-stats)",
  muted: "var(--color-track)",
};

export type View = { x: [number, number]; y: [number, number] };

/** Round tick spacing: 1, 2, or 5 times a power of ten. */
function niceStep(span: number, target: number) {
  const raw = span / target;
  const power = 10 ** Math.floor(Math.log10(raw));
  const unit = raw / power;
  return (unit < 1.5 ? 1 : unit < 3.5 ? 2 : unit < 7.5 ? 5 : 10) * power;
}

function ticks([lo, hi]: [number, number], target: number) {
  const step = niceStep(hi - lo, target);
  const out: number[] = [];
  for (let v = Math.ceil(lo / step) * step; v <= hi + step * 1e-9; v += step) {
    out.push(Math.abs(v) < step * 1e-9 ? 0 : v);
  }
  return out;
}

function label(v: number) {
  const abs = Math.abs(v);
  if (abs !== 0 && (abs >= 1e4 || abs < 1e-2)) return v.toExponential(0).replace("e+", "e");
  return String(Number(v.toPrecision(4)));
}

export function Plot({
  view: baseView,
  curves,
  params,
  marks = [],
  area,
  riemann,
  derivative,
  animate = false,
  xLabel,
  yLabel,
  resetKey,
}: {
  view: View;
  curves: Curve[];
  params: Params;
  marks?: Mark[];
  area?: [number, number];
  riemann?: [number, number, number];
  /** Also draw the numeric derivative of the main curve. */
  derivative?: boolean;
  animate?: boolean;
  xLabel: string;
  yLabel: string;
  /** Changing this resets pan and zoom. */
  resetKey: string;
}) {
  const svg = useRef<SVGSVGElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState<[number, number]>([0, 0]);
  const [hover, setHover] = useState<number | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const drag = useRef<{ x: number; y: number; pan: [number, number] } | null>(null);

  useEffect(() => {
    setZoom(1);
    setPan([0, 0]);
    setProgress(null);
  }, [resetKey]);

  // The visible window: the preset's window, zoomed about its centre, then panned.
  const view = useMemo<View>(() => {
    const cx = (baseView.x[0] + baseView.x[1]) / 2 + pan[0];
    const cy = (baseView.y[0] + baseView.y[1]) / 2 + pan[1];
    const hx = (baseView.x[1] - baseView.x[0]) / 2 / zoom;
    const hy = (baseView.y[1] - baseView.y[0]) / 2 / zoom;
    return { x: [cx - hx, cx + hx], y: [cy - hy, cy + hy] };
  }, [baseView, zoom, pan]);

  const sx = (x: number) =>
    PAD.left + ((x - view.x[0]) / (view.x[1] - view.x[0])) * (W - PAD.left - PAD.right);
  const sy = (y: number) =>
    H - PAD.bottom - ((y - view.y[0]) / (view.y[1] - view.y[0])) * (H - PAD.top - PAD.bottom);
  const toX = (px: number) =>
    view.x[0] + ((px - PAD.left) / (W - PAD.left - PAD.right)) * (view.x[1] - view.x[0]);

  const main = [...curves].reverse().find((curve) => curve.hue === "accent") ?? curves[0];
  const mainFn = main?.kind === "fn" ? (x: number) => main.f(x, params) : null;

  const paths = useMemo(() => {
    const ySpan = view.y[1] - view.y[0];
    const yLo = view.y[0] - ySpan * 4;
    const yHi = view.y[1] + ySpan * 4;
    const build = (points: [number, number][]) => {
      let d = "";
      let pen = false;
      for (const [x, y] of points) {
        if (!Number.isFinite(y) || !Number.isFinite(x) || y < yLo || y > yHi) {
          pen = false;
          continue;
        }
        d += `${pen ? "L" : "M"}${sx(x).toFixed(1)},${sy(y).toFixed(1)}`;
        pen = true;
      }
      return d;
    };
    const out = curves.map((curve) => {
      const points: [number, number][] = [];
      if (curve.kind === "fn") {
        const n = 700;
        for (let i = 0; i <= n; i += 1) {
          const x = view.x[0] + ((view.x[1] - view.x[0]) * i) / n;
          points.push([x, curve.f(x, params)]);
        }
      } else {
        const [t0, t1] = curve.t(params);
        const n = 400;
        for (let i = 0; i <= n; i += 1) {
          const t = t0 + ((t1 - t0) * i) / n;
          points.push([curve.x(t, params), curve.y(t, params)]);
        }
      }
      return { curve, d: build(points) };
    });
    if (derivative && mainFn) {
      const h = (view.x[1] - view.x[0]) / 1e4;
      const points: [number, number][] = [];
      const n = 700;
      for (let i = 0; i <= n; i += 1) {
        const x = view.x[0] + ((view.x[1] - view.x[0]) * i) / n;
        points.push([x, (mainFn(x + h) - mainFn(x - h)) / (2 * h)]);
      }
      out.push({
        curve: { kind: "fn", label: "derivative", hue: "physics", dashed: true, f: () => 0 },
        d: build(points),
      });
    }
    return out;
    // sx/sy depend only on view.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curves, params, view, derivative]);

  const shade = useMemo(() => {
    if (!area || !mainFn) return null;
    const [a, b] = area;
    const n = 200;
    let d = `M${sx(a)},${sy(0)}`;
    for (let i = 0; i <= n; i += 1) {
      const x = a + ((b - a) * i) / n;
      d += `L${sx(x).toFixed(1)},${sy(mainFn(x)).toFixed(1)}`;
    }
    return `${d}L${sx(b)},${sy(0)}Z`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [area, mainFn, view, params]);

  // Animation: each press of Play runs a dot along the main curve once.
  const [runs, setRuns] = useState(0);
  useEffect(() => {
    if (runs === 0) return;
    const start = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / 4000);
      setProgress(p);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [runs]);

  let runner: [number, number] | null = null;
  if (progress !== null && main) {
    if (main.kind === "path") {
      const [t0, t1] = main.t(params);
      const t = t0 + (t1 - t0) * progress;
      runner = [main.x(t, params), main.y(t, params)];
    } else {
      const x = baseView.x[0] + (baseView.x[1] - baseView.x[0]) * progress;
      runner = [x, main.f(x, params)];
    }
  }

  const xs = ticks(view.x, 10);
  const ys = ticks(view.y, 6);
  const hoverY = hover !== null && mainFn ? mainFn(hover) : null;

  const pointer = (event: React.PointerEvent<SVGSVGElement>) => {
    const box = svg.current!.getBoundingClientRect();
    const px = ((event.clientX - box.left) / box.width) * W;
    const py = ((event.clientY - box.top) / box.height) * H;
    if (drag.current) {
      const dx = ((px - drag.current.x) / (W - PAD.left - PAD.right)) * (view.x[1] - view.x[0]);
      const dy = ((py - drag.current.y) / (H - PAD.top - PAD.bottom)) * (view.y[1] - view.y[0]);
      setPan([drag.current.pan[0] - dx, drag.current.pan[1] + dy]);
      return;
    }
    setHover(px >= PAD.left && px <= W - PAD.right ? toX(px) : null);
  };

  return (
    <div className="relative">
      <svg
        ref={svg}
        viewBox={`0 0 ${W} ${H}`}
        className="block w-full touch-none select-none"
        role="img"
        aria-label={`Graph of ${yLabel} against ${xLabel}`}
        onPointerMove={pointer}
        onPointerLeave={() => {
          setHover(null);
          drag.current = null;
        }}
        onPointerDown={(event) => {
          const box = svg.current!.getBoundingClientRect();
          drag.current = {
            x: ((event.clientX - box.left) / box.width) * W,
            y: ((event.clientY - box.top) / box.height) * H,
            pan,
          };
          (event.target as Element).setPointerCapture?.(event.pointerId);
        }}
        onPointerUp={() => {
          drag.current = null;
        }}
        style={{ cursor: drag.current ? "grabbing" : "crosshair" }}
      >
        <defs>
          <clipPath id="plot-clip">
            <rect
              x={PAD.left}
              y={PAD.top}
              width={W - PAD.left - PAD.right}
              height={H - PAD.top - PAD.bottom}
            />
          </clipPath>
          <linearGradient id="plot-area" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.45" />
            <stop offset="100%" stopColor="var(--color-glow)" stopOpacity="0.12" />
          </linearGradient>
          <filter id="plot-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Grid */}
        {xs.map((x) => (
          <line
            key={`gx${x}`}
            x1={sx(x)}
            x2={sx(x)}
            y1={PAD.top}
            y2={H - PAD.bottom}
            stroke="var(--color-line)"
            strokeWidth={1}
            opacity={0.7}
          />
        ))}
        {ys.map((y) => (
          <line
            key={`gy${y}`}
            x1={PAD.left}
            x2={W - PAD.right}
            y1={sy(y)}
            y2={sy(y)}
            stroke="var(--color-line)"
            strokeWidth={1}
            opacity={0.7}
          />
        ))}

        <g clipPath="url(#plot-clip)">
          {/* Axes through the origin when visible */}
          {view.y[0] <= 0 && view.y[1] >= 0 ? (
            <line
              x1={PAD.left}
              x2={W - PAD.right}
              y1={sy(0)}
              y2={sy(0)}
              stroke="var(--color-muted)"
              strokeWidth={1.5}
            />
          ) : null}
          {view.x[0] <= 0 && view.x[1] >= 0 ? (
            <line
              x1={sx(0)}
              x2={sx(0)}
              y1={PAD.top}
              y2={H - PAD.bottom}
              stroke="var(--color-muted)"
              strokeWidth={1.5}
            />
          ) : null}

          {shade ? <path d={shade} fill="url(#plot-area)" /> : null}

          {riemann && mainFn
            ? Array.from({ length: Math.max(1, Math.round(riemann[2])) }, (_, i) => {
                const [a, b, n] = riemann;
                const dx = (b - a) / Math.round(n);
                const x = a + i * dx;
                const y = mainFn(x);
                return (
                  <rect
                    key={i}
                    x={sx(x)}
                    width={Math.max(0, sx(x + dx) - sx(x))}
                    y={Math.min(sy(y), sy(0))}
                    height={Math.abs(sy(y) - sy(0))}
                    fill="var(--color-accent)"
                    fillOpacity={0.18}
                    stroke="var(--color-accent)"
                    strokeOpacity={0.6}
                    strokeWidth={1}
                  />
                );
              })
            : null}

          {paths.map(({ curve, d }, i) => (
            <path
              key={i}
              d={d}
              fill="none"
              stroke={HUE[curve.hue]}
              strokeWidth={curve === main ? 3.5 : 2.2}
              strokeDasharray={curve.dashed ? "8 7" : undefined}
              strokeLinecap="round"
              strokeLinejoin="round"
              filter={curve === main ? "url(#plot-glow)" : undefined}
            />
          ))}

          {marks.map((mark, i) =>
            Number.isFinite(mark.x) && Number.isFinite(mark.y) ? (
              <g key={i}>
                <circle
                  cx={sx(mark.x)}
                  cy={sy(mark.y)}
                  r={7}
                  fill="var(--color-card)"
                  stroke="var(--color-glow)"
                  strokeWidth={3}
                />
                <text
                  x={sx(mark.x) + 12}
                  y={sy(mark.y) - 10}
                  fontSize={20}
                  fill="var(--color-ink)"
                  className="font-sans"
                >
                  {mark.label} ({fmt(mark.x, 2)}, {fmt(mark.y, 2)})
                </text>
              </g>
            ) : null,
          )}

          {runner && Number.isFinite(runner[1]) ? (
            <circle
              cx={sx(runner[0])}
              cy={sy(runner[1])}
              r={11}
              fill="var(--color-glow)"
              stroke="var(--color-card)"
              strokeWidth={3}
              filter="url(#plot-glow)"
            />
          ) : null}

          {hover !== null && hoverY !== null && Number.isFinite(hoverY) ? (
            <g>
              <line
                x1={sx(hover)}
                x2={sx(hover)}
                y1={PAD.top}
                y2={H - PAD.bottom}
                stroke="var(--color-accent)"
                strokeOpacity={0.4}
                strokeDasharray="4 5"
              />
              <circle cx={sx(hover)} cy={sy(hoverY)} r={6} fill="var(--color-accent)" />
            </g>
          ) : null}
        </g>

        {/* Tick labels */}
        {xs.map((x) => (
          <text
            key={`tx${x}`}
            x={sx(x)}
            y={H - PAD.bottom + 24}
            textAnchor="middle"
            fontSize={17}
            fill="var(--color-muted)"
            className="font-sans tabular-nums"
          >
            {label(x)}
          </text>
        ))}
        {ys.map((y) => (
          <text
            key={`ty${y}`}
            x={PAD.left - 10}
            y={sy(y) + 6}
            textAnchor="end"
            fontSize={17}
            fill="var(--color-muted)"
            className="font-sans tabular-nums"
          >
            {label(y)}
          </text>
        ))}
      </svg>

      <div className="pointer-events-none absolute top-3 left-16 flex flex-wrap gap-2">
        {paths
          .filter(({ curve }) => curve.label)
          .map(({ curve }, i) => (
            <span key={i} className="chip glass !text-ink">
              <span
                className="inline-block h-0.5 w-4 rounded"
                style={{
                  background: curve.dashed
                    ? `repeating-linear-gradient(90deg, ${HUE[curve.hue]} 0 4px, transparent 4px 7px)`
                    : HUE[curve.hue],
                }}
              />
              {curve.label}
            </span>
          ))}
      </div>

      <div className="absolute top-3 right-3 flex gap-1">
        {animate ? (
          <button
            type="button"
            className="btn-primary !min-h-9 !px-3 !text-xs"
            onClick={() => setRuns((n) => n + 1)}
          >
            Play
          </button>
        ) : null}
        <button
          type="button"
          className="btn-ghost glass !min-h-9 !px-3"
          aria-label="Zoom in"
          onClick={() => setZoom((z) => z * 1.5)}
        >
          +
        </button>
        <button
          type="button"
          className="btn-ghost glass !min-h-9 !px-3"
          aria-label="Zoom out"
          onClick={() => setZoom((z) => z / 1.5)}
        >
          −
        </button>
        <button
          type="button"
          className="btn-ghost glass !min-h-9 !px-3 !text-xs"
          onClick={() => {
            setZoom(1);
            setPan([0, 0]);
          }}
        >
          Reset
        </button>
      </div>

      <p className="mono mt-2 flex flex-wrap justify-between gap-2 px-1 text-xs text-muted">
        <span>
          {xLabel} → · {yLabel} ↑ · drag to pan
        </span>
        {hover !== null && hoverY !== null && Number.isFinite(hoverY) ? (
          <span className="text-ink">
            x = {fmt(hover, 3)}, y = {fmt(hoverY, 3)}
          </span>
        ) : null}
      </p>
    </div>
  );
}

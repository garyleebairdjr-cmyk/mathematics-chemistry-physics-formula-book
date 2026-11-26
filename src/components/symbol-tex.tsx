import katex from "katex";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type FocusEvent,
  type PointerEvent,
} from "react";
import "katex/dist/katex.min.css";

import { SymText } from "@/components/sym-text";
import { annotateSymbols, type SymbolGloss } from "@/lib/symbols";

export type { SymbolGloss };

export type FormulaSummary = { name: string; meaning: string };

type Tip =
  | { kind: "symbol"; text: string; left: number; top: number }
  | { kind: "formula"; left: number; top: number; bottom: number };

const TIP_WIDTH = 256;
const SUMMARY_WIDTH = 320;

/**
 * A typeset formula. Hovering or focusing a symbol says what it stands for.
 * With `summary`, hovering or focusing anywhere else on the formula describes
 * the whole formula and lists its variables.
 */
export function SymbolTex({
  tex,
  symbols,
  display = false,
  summary,
  live,
  className,
}: {
  tex: string;
  symbols: SymbolGloss[];
  display?: boolean;
  summary?: FormulaSummary;
  /** Light up the atoms of the symbol with this meaning (the one being explained aloud). */
  live?: string;
  className?: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const [tip, setTip] = useState<Tip | null>(null);
  const html = katex.renderToString(tex, {
    throwOnError: false,
    displayMode: display,
    output: "html",
    strict: "ignore",
  });

  useLayoutEffect(() => {
    if (root.current) annotateSymbols(root.current, symbols);
  }, [html, symbols]);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const suffix = live ? ` — ${live}` : null;
    for (const atom of el.querySelectorAll<HTMLElement>("[data-def]")) {
      atom.classList.toggle("sym-live", !!suffix && (atom.dataset.def ?? "").endsWith(suffix));
    }
  }, [html, symbols, live]);

  // A fixed tooltip would drift away from its formula on scroll; close it.
  useEffect(() => {
    if (!tip) return;
    const close = () => setTip(null);
    window.addEventListener("scroll", close, { passive: true, capture: true });
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("scroll", close, { capture: true });
      window.removeEventListener("resize", close);
    };
  }, [tip]);

  function show(target: EventTarget | null) {
    if (!root.current || !(target instanceof Element) || !root.current.contains(target)) return;
    const el = target.closest<HTMLElement>("[data-def]");
    if (el && root.current.contains(el)) {
      const rect = el.getBoundingClientRect();
      const left = Math.max(8, Math.min(rect.left, window.innerWidth - TIP_WIDTH - 8));
      setTip({ kind: "symbol", text: el.dataset.def ?? "", left, top: rect.bottom + 6 });
      return;
    }
    if (!summary) {
      setTip(null);
      return;
    }
    const box = (root.current.querySelector(".katex") ?? root.current).getBoundingClientRect();
    const width = Math.min(SUMMARY_WIDTH, window.innerWidth - 16);
    const left = Math.max(8, Math.min(box.left, window.innerWidth - width - 8));
    setTip({ kind: "formula", left, top: box.bottom + 6, bottom: box.top - 6 });
  }

  function hide(event: PointerEvent | FocusEvent) {
    const next = event.relatedTarget;
    if (next instanceof Element && root.current?.contains(next)) return;
    setTip(null);
  }

  // Open upward when the formula sits low in the window.
  const flip = tip?.kind === "formula" && tip.top > window.innerHeight * 0.6;

  return (
    <div
      ref={root}
      className={
        [display ? "formula-display overflow-x-auto" : "", className ?? ""].join(" ").trim() ||
        undefined
      }
      tabIndex={summary ? 0 : undefined}
      aria-label={summary ? `${summary.name}. ${summary.meaning}` : undefined}
      onPointerOver={(event) => show(event.target)}
      onPointerOut={hide}
      onFocus={(event) => show(event.target)}
      onBlur={hide}
    >
      <div dangerouslySetInnerHTML={{ __html: html }} />
      {tip?.kind === "symbol" ? (
        <span
          role="tooltip"
          className="fixed z-50 w-64 rounded-lg border border-line bg-card px-3 py-2 text-left text-xs leading-relaxed text-ink shadow-sm"
          style={{ left: tip.left, top: tip.top }}
        >
          <TipText text={tip.text} />
        </span>
      ) : null}
      {tip?.kind === "formula" && summary ? (
        <span
          role="tooltip"
          className="fixed z-50 flex max-h-[50vh] flex-col gap-2 overflow-y-auto rounded-lg border border-line bg-card px-3 py-2 text-left text-xs leading-relaxed text-ink shadow-sm"
          style={{
            left: tip.left,
            width: Math.min(SUMMARY_WIDTH, window.innerWidth - 16),
            ...(flip ? { bottom: window.innerHeight - tip.bottom } : { top: tip.top }),
          }}
        >
          <span className="font-medium text-accent">{summary.name}</span>
          <span>{summary.meaning}</span>
          {symbols.length > 0 ? (
            <span className="flex flex-col gap-0.5 border-t border-line pt-2">
              {symbols.map((symbol) => (
                <span key={symbol.sym}>
                  <span className="font-medium">
                    <SymText text={symbol.sym} />
                  </span>
                  <span className="text-muted"> — </span>
                  {symbol.means}
                </span>
              ))}
            </span>
          ) : null}
        </span>
      ) : null}
    </div>
  );
}

/** "x_i — The i-th observation", with the symbol typeset. */
function TipText({ text }: { text: string }) {
  const cut = text.indexOf(" — ");
  if (cut < 0) return <>{text}</>;
  return (
    <>
      <span className="font-medium">
        <SymText text={text.slice(0, cut)} />
      </span>
      {text.slice(cut)}
    </>
  );
}

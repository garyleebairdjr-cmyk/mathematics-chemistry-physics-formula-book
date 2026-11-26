import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Calculator,
  Check,
  ChevronsDown,
  Clock,
  Eye,
  EyeOff,
  Lightbulb,
  RotateCcw,
  Spline,
  ThumbsUp,
  TriangleAlert,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Ring, Shell } from "@/components/shell";
import { SymbolTex } from "@/components/symbol-tex";
import { SequenceStudio } from "@/components/sequence-studio";
import { SymText } from "@/components/sym-text";
import { Said } from "@/components/said";
import { LessonBar, LessonLauncher, ListenButton } from "@/components/lesson-player";
import { chapterBySlug, chapters, neighbors } from "@/data";
import { levelLabel, volumeTitle, type Chapter, type Formula, type Worked } from "@/data/types";
import { presets } from "@/lib/plot/presets";
import { mastery, useProgress, type Verdict } from "@/lib/progress";
import { formulaSpeech } from "@/lib/speech/lesson";
import { sentenceState, useLesson } from "@/lib/speech/lesson-store";
import { subject } from "@/lib/subjects";
import { useTitle } from "@/lib/use-title";

export const Route = createFileRoute("/read/$slug")({
  component: Reader,
});

function Reader() {
  const { slug } = Route.useParams();
  const chapter = chapterBySlug.get(slug);
  const visit = useProgress((state) => state.visit);
  const lessonOpen = useLesson((state) => state.slug === slug && state.segments.length > 0);
  useTitle(chapter?.title ?? "Chapter not found");

  useEffect(() => {
    visit(slug);
    const id = window.location.hash.replace("#", "");
    if (!id) return;
    const node = document.getElementById(id);
    if (node) node.scrollIntoView({ block: "start" });
  }, [slug, visit]);

  if (!chapter) {
    return (
      <Shell>
        <h1 className="font-display text-3xl font-semibold">This chapter is not in the book.</h1>
        <Link to="/" className="mt-4 inline-flex min-h-11 items-center text-accent">
          Back to the library
        </Link>
      </Shell>
    );
  }

  const { prev, next, index } = neighbors(slug);
  const mark = subject[chapter.volume];
  const models = presets.filter((preset) => preset.chapter === slug);

  return (
    <Shell active={slug}>
      <article
        className={"mx-auto max-w-3xl " + (lessonOpen ? "reading pb-40" : "")}
        style={{ "--hue": mark.hue } as React.CSSProperties}
      >
        <header className="fade-up">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="chip"
              style={{
                color: mark.hue,
                borderColor: "color-mix(in srgb, var(--hue) 40%, transparent)",
              }}
            >
              <mark.icon className="size-3.5" aria-hidden />
              {volumeTitle(chapter.volume)}
            </span>
            <span className="chip">{levelLabel[chapter.level]}</span>
            <span className="chip">
              <Clock className="size-3" aria-hidden />
              {chapter.minutes} min
            </span>
            <span className="chip mono">
              {String(index + 1).padStart(2, "0")} / {chapters.length}
            </span>
          </div>
          <div data-lesson="lesson-intro">
            <h1 className="mt-5 font-display text-4xl leading-[1.08] font-semibold tracking-tight sm:text-5xl">
              <Said target="lesson-title" text={chapter.title} />
            </h1>
            <p className="mt-4 font-serif text-xl leading-relaxed text-ink/90">
              <Said target="lesson-summary" text={chapter.summary} />
            </p>
          </div>
          <ChapterStats chapter={chapter} />
        </header>

        <LessonLauncher chapter={chapter} />

        <nav aria-label="On this page" className="mt-6 flex flex-wrap gap-2">
          {[
            ["idea", "The idea"],
            ["formulas", `Formulas · ${chapter.formulas.length}`],
            ["examples", `Examples · ${chapter.examples.length}`],
            ["practice", `Practice · ${chapter.practice.length}`],
            ["mistakes", "Mistakes"],
          ].map(([id, label]) => (
            <a key={id} href={`#${id}`} className="chip hover:border-accent hover:!text-ink">
              {label}
            </a>
          ))}
        </nav>

        {chapter.prereqs.length > 0 ? (
          <p className="mt-5 text-sm text-muted">
            Read first:{" "}
            {chapter.prereqs.map((item, i) => {
              const prior = chapterBySlug.get(item);
              if (!prior) return null;
              return (
                <span key={item}>
                  {i > 0 ? ", " : ""}
                  <Link
                    to="/read/$slug"
                    params={{ slug: item }}
                    className="text-accent hover:underline"
                  >
                    {prior.title}
                  </Link>
                </span>
              );
            })}
          </p>
        ) : null}

        <SectionTitle id="idea" kicker="01" title="The idea" />
        <div className="mt-4 flex flex-col gap-5">
          {chapter.body.map((paragraph, i) => (
            <p
              key={paragraph.slice(0, 48)}
              data-lesson={`lesson-body-${i}`}
              className="font-serif text-[1.15rem] leading-[1.8] text-ink/90"
            >
              <Said target={`lesson-body-${i}`} text={paragraph} />
            </p>
          ))}
        </div>

        <div className="panel mt-8 p-5">
          <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.14em] text-accent uppercase">
            <Lightbulb className="size-4" aria-hidden />
            Hold onto this
          </p>
          <ol className="mt-3 flex flex-col gap-3">
            {chapter.ideas.map((idea, i) => (
              <li key={idea} data-lesson={`lesson-idea-${i}`} className="flex gap-3">
                <span className="mono mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-accent-soft text-xs font-semibold text-accent">
                  {i + 1}
                </span>
                <span className="font-serif text-lg leading-relaxed">
                  <Said target={`lesson-idea-${i}`} text={idea} />
                </span>
              </li>
            ))}
          </ol>
        </div>

        {slug === "sequences" ? <SequenceStudio /> : null}

        {models.length > 0 ? (
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {models.map((model) => (
              <Link
                key={model.id}
                to="/lab"
                search={{ model: model.id }}
                className="lift panel group flex items-center gap-4 p-4"
              >
                <span className="bg-gradient flex size-11 shrink-0 items-center justify-center rounded-xl text-on-accent">
                  <Spline className="size-5" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-semibold tracking-wide text-accent uppercase">
                    Try it in the graph lab
                  </span>
                  <span className="block font-display font-semibold">{model.title}</span>
                </span>
                <ArrowRight className="size-4 shrink-0 transition-transform group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        ) : null}

        <SectionTitle id="formulas" kicker="02" title="Formulas" />
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Hover or tap an equation for what it says and what each variable means; hover a single
          symbol for just that symbol. A letter means what it means <em>here</em>: V is volume in
          one chapter and voltage in another.
        </p>
        <div className="mt-5 flex flex-col gap-5">
          {chapter.formulas.map((formula, formulaIndex) => (
            <FormulaCard key={formula.id} slug={slug} formula={formula} number={formulaIndex + 1} />
          ))}
        </div>

        <p className="mt-5 flex items-center gap-2 text-sm text-muted">
          <Calculator className="size-4 text-accent" aria-hidden />
          <Link to="/calculators" className="text-accent hover:underline">
            Open the calculators
          </Link>
          to compute any of these, or convert a unit.
        </p>

        <SectionTitle id="examples" kicker="03" title="Worked examples" />
        <div className="mt-5 flex flex-col gap-5">
          {chapter.examples.map((example, exampleIndex) => (
            <Example key={example.title} example={example} index={exampleIndex} />
          ))}
        </div>

        <SectionTitle id="practice" kicker="04" title="Your turn" />
        <p className="mt-2 text-sm text-muted">
          Try each one on paper before you look. Then be honest with yourself: your answers fill the
          mastery ring for this chapter.
        </p>
        <div className="mt-5 flex flex-col gap-4">
          {chapter.practice.map((item, i) => (
            <Practice key={item.q} index={i} slug={slug} question={item.q} answer={item.a} />
          ))}
        </div>

        <SectionTitle id="mistakes" kicker="05" title="Common mistakes" />
        <ul className="mt-5 flex flex-col gap-3">
          {chapter.pitfalls.map((pitfall, i) => (
            <li
              key={pitfall}
              data-lesson={`lesson-pitfall-${i}`}
              className="flex gap-3 rounded-xl border border-line bg-card/60 p-4"
            >
              <TriangleAlert
                className="mt-1 size-4 shrink-0 text-[var(--color-biology)]"
                aria-hidden
              />
              <span className="font-serif leading-relaxed">
                <Said target={`lesson-pitfall-${i}`} text={pitfall} />
              </span>
            </li>
          ))}
        </ul>

        <div data-lesson="lesson-outro">
          <MarkRead slug={slug} />
        </div>

        <nav className="mt-10 grid gap-3 border-t border-line pt-6 sm:grid-cols-2">
          {prev ? (
            <Link
              to="/read/$slug"
              params={{ slug: prev.slug }}
              className="lift panel flex items-center gap-3 p-4"
            >
              <ArrowLeft className="size-4 shrink-0 text-muted" />
              <span>
                <span className="block text-xs text-muted">Previous</span>
                <span className="font-display font-semibold">{prev.title}</span>
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              to="/read/$slug"
              params={{ slug: next.slug }}
              className="lift panel flex items-center justify-end gap-3 p-4 text-right"
            >
              <span>
                <span className="block text-xs text-muted">Next</span>
                <span className="font-display font-semibold">{next.title}</span>
              </span>
              <ArrowRight className="size-4 shrink-0 text-accent" />
            </Link>
          ) : null}
        </nav>
      </article>
      <LessonBar slug={slug} />
    </Shell>
  );
}

function SectionTitle({ id, kicker, title }: { id: string; kicker: string; title: string }) {
  return (
    <h2
      id={id}
      className="mt-16 flex scroll-mt-24 items-baseline gap-3 font-display text-3xl font-semibold tracking-tight"
    >
      <span className="mono text-sm font-medium text-gradient">{kicker}</span>
      {title}
    </h2>
  );
}

function ChapterStats({ chapter }: { chapter: Chapter }) {
  const read = useProgress((state) => state.read);
  const practice = useProgress((state) => state.practice);
  const known = mastery(chapter, read, practice);
  const got = chapter.practice.filter((_, i) => practice[`${chapter.slug}:${i}`] === "got").length;
  return (
    <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted">
      <span className="flex items-center gap-2">
        <Ring value={known} size={28} stroke={3.5} color={subject[chapter.volume].hue} />
        <span>
          <span className="font-semibold text-ink">{Math.round(known * 100)}%</span> mastered
        </span>
      </span>
      <span>
        <span className="font-semibold text-ink">{chapter.formulas.length}</span> formulas
      </span>
      <span>
        <span className="font-semibold text-ink">
          {got}/{chapter.practice.length}
        </span>{" "}
        practice solved
      </span>
    </div>
  );
}

/** Lesson state for a target that is a single spoken part (a symbol row, an example step). */
function useSaidState(target: string) {
  return useLesson((state) => sentenceState(state, target, 0));
}

function FormulaCard({
  slug,
  formula,
  number,
}: {
  slug: string;
  formula: Formula;
  number: number;
}) {
  // The symbol the lesson is explaining right now, so it can light up in the formula.
  const live = useLesson((state) => {
    const segment = state.segments[state.index];
    if (segment?.anchor !== formula.id) return undefined;
    const part = segment.parts[state.part];
    return part?.kind === "symbol" ? part.means : undefined;
  });
  const texLive = useLesson(
    (state) =>
      state.segments[state.index]?.anchor === formula.id &&
      state.segments[state.index]?.parts[state.part]?.kind === "tex",
  );

  return (
    <section id={formula.id} className="panel formula-card scroll-mt-24 p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="flex items-baseline gap-2 font-display text-lg font-semibold">
          <span className="mono text-xs text-accent">F{number}</span>
          <Said target={`${formula.id}-name`} text={formula.name} />
        </h3>
        <ListenButton
          id={`${slug}:${formula.id}`}
          text={formulaSpeech(formula, number)}
          label={formula.name}
        />
      </div>
      <div
        className={
          "mt-3 rounded-xl px-2 py-3 transition-all duration-300 " +
          (texLive ? "bg-accent-soft/70 shadow-[0_0_40px_-12px_var(--color-glow)]" : "bg-raise/40")
        }
      >
        <SymbolTex
          tex={formula.tex}
          symbols={formula.symbols}
          summary={{ name: formula.name, meaning: formula.meaning }}
          live={live}
          display
        />
      </div>
      <p className="mt-4 font-serif text-[1.05rem] leading-relaxed">
        <Said target={`${formula.id}-meaning`} text={formula.meaning} />
      </p>
      <dl className="mt-4 grid gap-1.5 sm:grid-cols-2">
        {formula.symbols.map((symbol, k) => (
          <SymbolRow
            key={symbol.sym}
            target={`${formula.id}-sym-${k}`}
            sym={symbol.sym}
            means={symbol.means}
          />
        ))}
      </dl>
    </section>
  );
}

function SymbolRow({ target, sym, means }: { target: string; sym: string; means: string }) {
  const state = useSaidState(target);
  return (
    <div
      className="say flex items-baseline gap-3 rounded-lg border border-line/70 px-3 py-2 text-sm"
      data-state={state}
    >
      <dt className="min-w-10 shrink-0 font-serif text-base font-semibold text-accent">
        <SymText text={sym} />
      </dt>
      <dd className="leading-snug">{means}</dd>
    </div>
  );
}

function Example({ example, index }: { example: Worked; index: number }) {
  const [shown, setShown] = useState(1);
  // While the lesson reads the steps, reveal them as it goes.
  const lessonStep = useLesson((state) => {
    const anchor = state.segments[state.index]?.anchor ?? "";
    const match = anchor.match(/^lesson-example-(\d+)-(step-(\d+)|answer)$/);
    if (!match || Number(match[1]) !== index) return -1;
    return match[3] !== undefined ? Number(match[3]) + 1 : example.steps.length + 1;
  });
  const visible = Math.max(shown, lessonStep);
  const all = visible > example.steps.length;

  return (
    <section className="panel overflow-hidden">
      <div data-lesson={`lesson-example-${index}`} className="p-5 pb-3">
        <p className="text-xs font-semibold tracking-[0.14em] text-accent uppercase">
          Example {index + 1}
        </p>
        <h3 className="mt-1 font-display text-xl font-semibold">
          <Said target={`lesson-example-${index}-title`} text={example.title} />
        </h3>
        <p className="mt-2 font-serif text-[1.05rem] leading-relaxed">
          <Said target={`lesson-example-${index}-prompt`} text={example.prompt} />
        </p>
      </div>
      <ol className="relative mx-5 flex flex-col gap-3 border-l border-line pl-5">
        {example.steps.map((step, stepIndex) =>
          stepIndex < visible ? (
            <li
              key={step}
              data-lesson={`lesson-example-${index}-step-${stepIndex}`}
              className="fade-up relative text-[0.95rem] leading-relaxed"
            >
              <span className="mono absolute top-0.5 -left-[2.05rem] flex size-6 items-center justify-center rounded-full border border-line bg-card text-[11px] text-accent">
                {stepIndex + 1}
              </span>
              <Said target={`lesson-example-${index}-step-${stepIndex}`} text={step} />
            </li>
          ) : null,
        )}
      </ol>
      {all ? (
        <p
          data-lesson={`lesson-example-${index}-answer`}
          className="fade-up m-5 mt-4 flex gap-3 rounded-xl border border-accent/40 bg-accent-soft/50 p-4 font-serif leading-relaxed"
        >
          <Check className="mt-1 size-4 shrink-0 text-accent" aria-hidden />
          <span>
            <Said target={`lesson-example-${index}-answer`} text={example.answer} />
          </span>
        </p>
      ) : (
        <div className="m-5 mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            className="btn-primary !min-h-10"
            onClick={() => setShown(visible + 1)}
          >
            <ChevronsDown className="size-4" aria-hidden />
            {visible >= example.steps.length ? "Show the answer" : "Next step"}
          </button>
          <button
            type="button"
            className="btn-ghost !min-h-10"
            onClick={() => setShown(example.steps.length + 1)}
          >
            Show all
          </button>
        </div>
      )}
    </section>
  );
}

function Practice({
  index,
  slug,
  question,
  answer,
}: {
  index: number;
  slug: string;
  question: string;
  answer: string;
}) {
  const [toggled, setToggled] = useState(false);
  const revealed = useLesson((state) => state.slug === slug && state.revealed.includes(index));
  const verdict = useProgress((state) => state.practice[`${slug}:${index}`]);
  const grade = useProgress((state) => state.grade);
  const open = toggled || revealed;

  const verdictButton = (value: Verdict, label: string, Icon: typeof ThumbsUp) => (
    <button
      type="button"
      aria-pressed={verdict === value}
      onClick={() => grade(slug, index, verdict === value ? null : value)}
      className={
        "inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition-colors " +
        (verdict === value
          ? value === "got"
            ? "border-[var(--color-chemistry)] bg-[color-mix(in_srgb,var(--color-chemistry)_18%,transparent)] text-ink"
            : "border-[var(--color-biology)] bg-[color-mix(in_srgb,var(--color-biology)_18%,transparent)] text-ink"
          : "border-line text-muted hover:text-ink")
      }
    >
      <Icon className="size-3.5" aria-hidden />
      {label}
    </button>
  );

  return (
    <div
      data-lesson={`lesson-practice-${index}`}
      className={
        "panel p-5 " +
        (verdict === "got"
          ? "!border-[color-mix(in_srgb,var(--color-chemistry)_50%,var(--color-line))]"
          : "")
      }
    >
      <div className="flex gap-3">
        <span className="mono flex size-7 shrink-0 items-center justify-center rounded-full bg-accent-soft text-xs font-semibold text-accent">
          {verdict === "got" ? <Check className="size-4" /> : `Q${index + 1}`}
        </span>
        <p className="font-serif text-[1.05rem] leading-relaxed">
          <Said target={`lesson-practice-${index}-q`} text={question} />
        </p>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2 pl-10">
        <button
          type="button"
          className="btn-ghost !min-h-9 !text-xs"
          onClick={() => setToggled(!open)}
        >
          {open ? (
            <EyeOff className="size-3.5" aria-hidden />
          ) : (
            <Eye className="size-3.5" aria-hidden />
          )}
          {open ? "Hide solution" : "Show solution"}
        </button>
        {open || verdict ? (
          <>
            <span className="text-xs text-muted">How did it go?</span>
            {verdictButton("got", "Got it", ThumbsUp)}
            {verdictButton("again", "Not yet", RotateCcw)}
          </>
        ) : null}
      </div>
      {open ? (
        <p className="fade-up mt-4 ml-10 rounded-xl border-l-2 border-accent bg-raise/50 p-4 text-[0.95rem] leading-relaxed">
          <Said target={`lesson-practice-${index}-a`} text={answer} />
        </p>
      ) : null}
    </div>
  );
}

function MarkRead({ slug }: { slug: string }) {
  const read = useProgress((state) => state.read);
  const toggle = useProgress((state) => state.toggle);
  const done = read.includes(slug);

  return (
    <button
      type="button"
      className={"mt-12 " + (done ? "btn-ghost !border-accent" : "btn-primary")}
      onClick={() => toggle(slug)}
    >
      <Check className="size-4" />
      {done ? "Marked as read" : "Mark this chapter read"}
    </button>
  );
}

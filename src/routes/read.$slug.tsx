import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { Shell } from "@/components/shell";
import { SymbolTex } from "@/components/symbol-tex";
import { SequenceStudio } from "@/components/sequence-studio";
import { Def } from "@/components/def";
import { chapterBySlug, chapters, neighbors } from "@/data";
import { levelLabel, volumeTitle } from "@/data/types";
import { useProgress } from "@/lib/progress";
import { useTitle } from "@/lib/use-title";

export const Route = createFileRoute("/read/$slug")({
  component: Reader,
});

function Reader() {
  const { slug } = Route.useParams();
  const chapter = chapterBySlug.get(slug);
  const visit = useProgress((state) => state.visit);
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
        <h1 className="font-serif text-3xl">This chapter is not in the book.</h1>
        <Link to="/" className="mt-4 inline-flex min-h-11 items-center text-accent">
          Back to the library
        </Link>
      </Shell>
    );
  }

  const { prev, next, index } = neighbors(slug);

  return (
    <Shell active={slug}>
      <article className="mx-auto max-w-2xl">
        <p className="text-sm text-muted">
          {volumeTitle(chapter.volume)} · {levelLabel[chapter.level]} · {chapter.minutes} min ·{" "}
          Chapter {index + 1} of {chapters.length}
        </p>
        <h1 className="mt-2 font-serif text-4xl leading-tight">{chapter.title}</h1>
        <p className="mt-4 font-serif text-lg leading-relaxed">{chapter.summary}</p>
        <p className="mt-4 text-sm">
          <Link to="/calculators" className="text-accent">
            Open the calculators
          </Link>
          <span className="text-muted"> to compute a formula, or to convert a unit.</span>
        </p>

        {chapter.prereqs.length > 0 ? (
          <p className="mt-4 text-sm text-muted">
            Read first:{" "}
            {chapter.prereqs.map((item, i) => {
              const prior = chapterBySlug.get(item);
              if (!prior) return null;
              return (
                <span key={item}>
                  {i > 0 ? ", " : ""}
                  <Link to="/read/$slug" params={{ slug: item }} className="text-accent">
                    {prior.title}
                  </Link>
                </span>
              );
            })}
          </p>
        ) : null}

        <h2 className="mt-10 font-serif text-2xl">The idea</h2>
        <div className="mt-3 flex flex-col gap-4">
          {chapter.body.map((paragraph) => (
            <p key={paragraph.slice(0, 48)} className="font-serif text-lg leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        <h2 className="mt-10 font-serif text-2xl">Hold onto this</h2>
        <ol className="mt-3 flex list-decimal flex-col gap-2 pl-5 font-serif text-lg leading-relaxed">
          {chapter.ideas.map((idea) => (
            <li key={idea}>{idea}</li>
          ))}
        </ol>

        {slug === "sequences" ? <SequenceStudio /> : null}

        <h2 className="mt-10 font-serif text-2xl">Formulas</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Hover or focus a symbol in an equation. The note says what that letter stands for in this
          formula, not in every formula. V is volume in one chapter and not velocity in another.
        </p>
        <div className="mt-4 flex flex-col gap-4">
          {chapter.formulas.map((formula) => (
            <section
              key={formula.id}
              id={formula.id}
              className="scroll-mt-20 rounded-lg border border-line bg-card p-4"
            >
              <h3 className="text-sm font-medium tracking-wide text-accent uppercase">
                {formula.name}
              </h3>
              <div className="mt-3 text-ink">
                <SymbolTex tex={formula.tex} symbols={formula.symbols} display />
              </div>
              <p className="mt-3 font-serif leading-relaxed">{formula.meaning}</p>
              <dl className="mt-3 flex flex-col gap-1">
                {formula.symbols.map((symbol) => (
                  <div
                    key={symbol.sym}
                    className="flex flex-col gap-1 text-sm sm:flex-row sm:gap-4"
                  >
                    <dt className="shrink-0 text-muted sm:w-40">
                      <Def term={symbol.sym} definition={symbol.means} />
                    </dt>
                    <dd>{symbol.means}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>

        <h2 className="mt-10 font-serif text-2xl">Worked examples</h2>
        <div className="mt-4 flex flex-col gap-6">
          {chapter.examples.map((example, exampleIndex) => (
            <section key={example.title}>
              <h3 className="font-serif text-xl">
                {exampleIndex + 1}. {example.title}
              </h3>
              <p className="mt-2 font-serif leading-relaxed">{example.prompt}</p>
              <ol className="mt-3 flex list-decimal flex-col gap-2 pl-5 text-sm leading-relaxed">
                {example.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              <p className="mt-3 border-l-2 border-accent pl-3 font-serif leading-relaxed">
                {example.answer}
              </p>
            </section>
          ))}
        </div>

        <h2 className="mt-10 font-serif text-2xl">Try these</h2>
        <div className="mt-4 flex flex-col gap-4">
          {chapter.practice.map((item) => (
            <Practice key={item.q} question={item.q} answer={item.a} />
          ))}
        </div>

        <h2 className="mt-10 font-serif text-2xl">Common mistakes</h2>
        <ul className="mt-3 flex list-disc flex-col gap-2 pl-5 font-serif leading-relaxed">
          {chapter.pitfalls.map((pitfall) => (
            <li key={pitfall}>{pitfall}</li>
          ))}
        </ul>

        <MarkRead slug={slug} />

        <nav className="mt-10 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:justify-between">
          {prev ? (
            <Link
              to="/read/$slug"
              params={{ slug: prev.slug }}
              className="inline-flex min-h-11 items-center gap-2 text-sm"
            >
              <ArrowLeft className="size-4" />
              {prev.title}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              to="/read/$slug"
              params={{ slug: next.slug }}
              className="inline-flex min-h-11 items-center gap-2 text-sm sm:text-right"
            >
              {next.title}
              <ArrowRight className="size-4" />
            </Link>
          ) : null}
        </nav>
      </article>
    </Shell>
  );
}

function Practice({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-lg border border-line p-4">
      <p className="font-serif leading-relaxed">{question}</p>
      <button
        type="button"
        className="mt-3 inline-flex min-h-11 items-center text-sm font-medium text-accent"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? "Hide solution" : "Show solution"}
      </button>
      {open ? <p className="mt-2 text-sm leading-relaxed text-ink">{answer}</p> : null}
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
      className="mt-10 inline-flex min-h-11 items-center gap-2 rounded-lg border border-line bg-card px-4 text-sm font-medium"
      onClick={() => toggle(slug)}
    >
      <Check className={"size-4 " + (done ? "text-accent" : "text-muted")} />
      {done ? "Marked as read" : "Mark this chapter read"}
    </button>
  );
}

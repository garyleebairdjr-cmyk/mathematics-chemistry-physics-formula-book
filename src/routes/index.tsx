import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useMemo, useState } from "react";
import { SearchField } from "@/components/search-field";
import { Shell } from "@/components/shell";
import { chapterBySlug, chapters, formulaCount, paths } from "@/data";
import { levelLabel, volumes, volumeTitle } from "@/data/types";
import { useProgress } from "@/lib/progress";
import { useTitle } from "@/lib/use-title";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const [query, setQuery] = useState("");
  useTitle();
  const read = useProgress((state) => state.read);
  const last = useProgress((state) => state.last);
  const needle = query.trim().toLowerCase();

  const hits = useMemo(() => {
    if (!needle) return [];
    return chapters.flatMap((chapter) => {
      const chapterHit =
        chapter.title.toLowerCase().includes(needle) ||
        chapter.summary.toLowerCase().includes(needle);
      const formulas = chapter.formulas.filter(
        (formula) =>
          formula.name.toLowerCase().includes(needle) ||
          formula.meaning.toLowerCase().includes(needle),
      );
      if (!chapterHit && formulas.length === 0) return [];
      return [{ chapter, formulas, chapterHit }];
    });
  }, [needle]);

  const continueChapter = last ? chapterBySlug.get(last) : undefined;
  const readCount = chapters.filter((chapter) => read.includes(chapter.slug)).length;

  return (
    <Shell>
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-medium tracking-wide text-accent uppercase">Field book</p>
        <h1 className="mt-3 font-serif text-4xl leading-tight text-ink sm:text-5xl">
          From counting to categories.
        </h1>
        <p className="mt-4 max-w-2xl font-serif text-lg leading-relaxed text-ink">
          Mathematics in the order it is actually learned, from arithmetic through the frontier,
          then the formulas physics, chemistry, and biology compute with. Each chapter explains the
          idea, states the formulas with their symbols, and works an example.
        </p>
        <p className="mt-3 text-sm text-muted">
          {chapters.length} chapters · {formulaCount} formulas · progress stays in this browser
          {readCount > 0 ? ` · ${readCount} read` : ""}
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/read/$slug"
            params={{ slug: "arithmetic" }}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-accent px-4 text-sm font-medium text-on-accent"
          >
            Start with arithmetic
            <ArrowRight className="size-4" />
          </Link>
          <Link
            to="/calculators"
            className="inline-flex min-h-11 items-center rounded-lg border border-line bg-card px-4 text-sm font-medium text-ink"
          >
            Open the calculators
          </Link>
          <Link
            to="/atlas"
            className="inline-flex min-h-11 items-center rounded-lg border border-line bg-card px-4 text-sm font-medium text-ink"
          >
            Open the formula atlas
          </Link>
        </div>

        {continueChapter ? (
          <Link
            to="/read/$slug"
            params={{ slug: continueChapter.slug }}
            className="lift mt-6 flex items-center justify-between gap-4 rounded-lg border border-line bg-card px-4 py-3"
          >
            <span>
              <span className="block text-xs text-muted">Continue</span>
              <span className="font-serif text-lg">{continueChapter.title}</span>
            </span>
            <ArrowRight className="size-4 shrink-0" />
          </Link>
        ) : null}

        <SearchField
          value={query}
          onChange={setQuery}
          placeholder="Search a formula, a subject, a word"
          label="Search chapters and formulas"
        />

        {needle ? (
          <section className="mt-6">
            <h2 className="font-serif text-2xl">Results</h2>
            {hits.length === 0 ? (
              <p className="mt-3 text-sm text-muted">Nothing matches that search.</p>
            ) : (
              <ul className="mt-4 flex flex-col gap-4">
                {hits.map(({ chapter, formulas }) => (
                  <li key={chapter.slug} className="rounded-lg border border-line bg-card p-4">
                    <Link
                      to="/read/$slug"
                      params={{ slug: chapter.slug }}
                      className="font-serif text-xl"
                    >
                      {chapter.title}
                    </Link>
                    <p className="mt-1 text-sm text-muted">
                      {volumeTitle(chapter.volume)} · {levelLabel[chapter.level]}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed">{chapter.summary}</p>
                    {formulas.length > 0 ? (
                      <ul className="mt-3 flex flex-col gap-2">
                        {formulas.map((formula) => (
                          <li key={formula.id}>
                            <Link
                              to="/read/$slug"
                              params={{ slug: chapter.slug }}
                              hash={formula.id}
                              className="text-sm text-accent"
                            >
                              {formula.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </section>
        ) : (
          <>
            <section className="mt-10">
              <h2 className="font-serif text-2xl">Five ways through</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {paths.map((path) => {
                  const first = path.slugs[0];
                  return (
                    <Link
                      key={path.title}
                      to="/read/$slug"
                      params={{ slug: first }}
                      className="lift rounded-lg border border-line bg-card p-4"
                    >
                      <span className="font-serif text-xl">{path.title}</span>
                      <span className="mt-1 block text-sm leading-relaxed text-muted">
                        {path.blurb}
                      </span>
                      <span className="mt-3 block text-sm text-accent">
                        {path.slugs.length} chapters
                      </span>
                    </Link>
                  );
                })}
              </div>
            </section>

            {volumes.map((volume) => (
              <section key={volume.id} className="mt-10">
                <h2 className="font-serif text-2xl">{volume.title}</h2>
                <p className="mt-1 text-sm text-muted">{volume.lede}</p>
                <ol className="mt-4 flex flex-col">
                  {chapters
                    .filter((chapter) => chapter.volume === volume.id)
                    .map((chapter, index) => {
                      const done = read.includes(chapter.slug);
                      return (
                        <li key={chapter.slug} className="border-b border-line">
                          <Link
                            to="/read/$slug"
                            params={{ slug: chapter.slug }}
                            className="flex min-h-11 items-baseline gap-3 py-3 transition-colors hover:text-accent"
                          >
                            <span className="w-6 shrink-0 text-sm text-muted tabular-nums">
                              {index + 1}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block font-serif text-lg leading-snug">
                                {chapter.title}
                              </span>
                              <span className="mt-1 block text-sm text-muted">
                                {chapter.summary}
                              </span>
                            </span>
                            <span className="hidden shrink-0 text-xs text-muted sm:block">
                              {done ? "Read" : levelLabel[chapter.level]}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                </ol>
              </section>
            ))}
          </>
        )}
      </div>
    </Shell>
  );
}

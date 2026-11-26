import { Link, createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SearchField } from "@/components/search-field";
import { Shell } from "@/components/shell";
import { volumeTitle } from "@/data/types";
import { SymbolTex } from "@/components/symbol-tex";
import { chapters, constants } from "@/data";
import { useTitle } from "@/lib/use-title";

export const Route = createFileRoute("/atlas")({
  component: Atlas,
});

function Atlas() {
  useTitle("Formula atlas");
  const [query, setQuery] = useState("");
  const needle = query.trim().toLowerCase();

  const groups = useMemo(() => {
    return chapters
      .map((chapter) => ({
        chapter,
        formulas: chapter.formulas.filter((formula) => {
          if (!needle) return true;
          return (
            formula.name.toLowerCase().includes(needle) ||
            formula.meaning.toLowerCase().includes(needle) ||
            chapter.title.toLowerCase().includes(needle)
          );
        }),
      }))
      .filter((group) => group.formulas.length > 0);
  }, [needle]);

  const shown = groups.reduce((count, group) => count + group.formulas.length, 0);

  return (
    <Shell>
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-medium tracking-wide text-accent uppercase">Reference</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Formula atlas
        </h1>
        <p className="mt-3 font-serif text-lg leading-relaxed">
          Every formula in the book, with the sentence that says what it is for. Open one to see the
          symbols, the worked example, and the mistakes around it.
        </p>

        <SearchField
          value={query}
          onChange={setQuery}
          placeholder="Filter by name or idea"
          label="Filter formulas"
        />
        <p className="mt-2 text-sm text-muted">{shown} formulas</p>

        <section className="mt-8">
          <h2 className="font-display text-2xl font-semibold">Constants used in this book</h2>
          <dl className="mt-3 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2">
            {constants.map((item) => (
              <div key={item.symbol} className="bg-card px-4 py-3">
                <dt className="text-sm font-medium">{item.symbol}</dt>
                <dd className="text-sm text-muted">{item.name}</dd>
                <dd className="text-sm tabular-nums">{item.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="mt-10 flex flex-col gap-10">
          {groups.map(({ chapter, formulas }) => (
            <section key={chapter.slug}>
              <h2 className="font-display text-2xl font-semibold">
                <Link to="/read/$slug" params={{ slug: chapter.slug }}>
                  {chapter.title}
                </Link>
              </h2>
              <p className="text-sm text-muted">{volumeTitle(chapter.volume)}</p>
              <ul className="mt-3 flex flex-col gap-3">
                {formulas.map((formula) => (
                  <li key={formula.id} className="panel p-4">
                    <Link
                      to="/read/$slug"
                      params={{ slug: chapter.slug }}
                      hash={formula.id}
                      className="text-sm font-medium text-accent"
                    >
                      {formula.name}
                    </Link>
                    <div className="mt-2">
                      <SymbolTex
                        tex={formula.tex}
                        symbols={formula.symbols}
                        summary={{ name: formula.name, meaning: formula.meaning }}
                        display
                      />
                    </div>
                    <p className="mt-2 text-sm leading-relaxed">{formula.meaning}</p>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </Shell>
  );
}

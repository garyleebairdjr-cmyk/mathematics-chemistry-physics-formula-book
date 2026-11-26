import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpenCheck,
  Calculator,
  Flame,
  Headphones,
  Map as MapIcon,
  Search,
  Sparkles,
  Spline,
  Target,
} from "lucide-react";
import { useMemo, useState } from "react";
import { SearchField } from "@/components/search-field";
import { Ring, Shell } from "@/components/shell";
import { Tex } from "@/components/tex";
import { chapterBySlug, chapters, formulaCount, paths } from "@/data";
import { levelLabel, volumes, volumeTitle } from "@/data/types";
import { presets } from "@/lib/plot/presets";
import { usePalette } from "@/lib/palette";
import { mastery, streak, useProgress } from "@/lib/progress";
import { subject } from "@/lib/subjects";
import { useTitle } from "@/lib/use-title";

export const Route = createFileRoute("/")({
  component: Home,
});

const FLOATING = [
  { tex: String.raw`e^{i\pi} + 1 = 0`, cls: "left-[4%] top-[6%]", delay: "0s" },
  { tex: String.raw`\vec F = m\vec a`, cls: "right-[6%] top-[2%]", delay: "-4s" },
  { tex: String.raw`\int_a^b f(x)\,dx`, cls: "left-[18%] top-[40%]", delay: "-8s" },
  { tex: String.raw`E = mc^2`, cls: "right-[2%] top-[34%]", delay: "-2s" },
  { tex: String.raw`PV = nRT`, cls: "left-[2%] bottom-[14%]", delay: "-6s" },
  {
    tex: String.raw`\nabla\cdot\vec E = \frac{\rho}{\varepsilon_0}`,
    cls: "right-[10%] bottom-[8%]",
    delay: "-10s",
  },
  { tex: String.raw`\bar x = \frac{1}{n}\sum x_i`, cls: "left-[30%] bottom-[0%]", delay: "-12s" },
];

function Home() {
  const [query, setQuery] = useState("");
  useTitle();
  const read = useProgress((state) => state.read);
  const last = useProgress((state) => state.last);
  const practice = useProgress((state) => state.practice);
  const days = useProgress((state) => state.days);
  const openPalette = usePalette((state) => state.set);
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
  const solved = Object.values(practice).filter((verdict) => verdict === "got").length;
  const totalPractice = chapters.reduce((sum, chapter) => sum + chapter.practice.length, 0);
  const overall =
    chapters.reduce((sum, chapter) => sum + mastery(chapter, read, practice), 0) / chapters.length;
  const days_ = streak(days);

  return (
    <Shell>
      <div className="mx-auto max-w-5xl">
        {/* Hero */}
        <section className="relative grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="fade-up relative z-10">
            <span className="chip !text-ink">
              <Sparkles className="size-3.5 text-accent" aria-hidden />
              Free · open source · no account
            </span>
            <h1 className="mt-5 font-display text-5xl leading-[1.02] font-semibold tracking-tight sm:text-6xl">
              The language
              <br />
              of the <span className="font-flair font-normal italic text-gradient">universe</span>,
              <br />
              read aloud.
            </h1>
            <p className="mt-5 max-w-xl font-serif text-lg leading-relaxed text-ink/85">
              Mathematics from counting to the research frontier, then the formulas physics,
              chemistry, and biology run on. Every chapter can be read to you sentence by sentence,
              every formula explained symbol by symbol, and every idea pulled and stretched in the
              graph lab.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              {continueChapter ? (
                <Link
                  to="/read/$slug"
                  params={{ slug: continueChapter.slug }}
                  className="btn-primary"
                >
                  Continue: {continueChapter.title}
                  <ArrowRight className="size-4" />
                </Link>
              ) : (
                <Link to="/read/$slug" params={{ slug: "arithmetic" }} className="btn-primary">
                  Start with arithmetic
                  <ArrowRight className="size-4" />
                </Link>
              )}
              <Link to="/lab" className="btn-ghost">
                <Spline className="size-4" />
                Open the graph lab
              </Link>
            </div>
            <button
              type="button"
              onClick={() => openPalette(true)}
              className="mt-6 flex h-12 w-full max-w-md items-center gap-3 rounded-full border border-line bg-card/70 px-4 text-left text-sm text-muted shadow-[0_10px_40px_-24px_var(--color-accent)] transition-colors hover:border-accent"
            >
              <Search className="size-4 text-accent" />
              <span className="flex-1">Jump to any chapter, formula, or model…</span>
              <kbd className="mono rounded border border-line px-1.5 text-[11px]">Ctrl K</kbd>
            </button>
          </div>

          <div className="relative hidden h-[420px] lg:block" aria-hidden>
            <div
              className="absolute inset-10 rounded-full opacity-40 blur-3xl"
              style={{
                background:
                  "radial-gradient(circle, var(--color-accent), transparent 60%), radial-gradient(circle at 70% 70%, var(--color-glow), transparent 55%)",
              }}
            />
            {FLOATING.map((item) => (
              <div
                key={item.tex}
                className={`drift glass absolute rounded-2xl border border-line/80 px-4 py-3 text-lg shadow-[0_12px_40px_-20px_rgba(0,0,0,0.5)] ${item.cls}`}
                style={{ animationDelay: item.delay }}
              >
                <Tex tex={item.tex} />
              </div>
            ))}
          </div>
        </section>

        {/* Your progress */}
        <section className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat icon={<Flame className="size-5" />} value={`${days_}`} label="day streak" />
          <Stat
            icon={<BookOpenCheck className="size-5" />}
            value={`${readCount}/${chapters.length}`}
            label="chapters read"
          />
          <Stat
            icon={<Target className="size-5" />}
            value={`${solved}/${totalPractice}`}
            label="practice solved"
          />
          <div className="panel flex items-center gap-3 p-4">
            <Ring value={overall} size={44} stroke={5} />
            <div>
              <p className="font-display text-2xl font-semibold">{Math.round(overall * 100)}%</p>
              <p className="text-xs text-muted">of the book mastered</p>
            </div>
          </div>
        </section>
        <p className="mt-2 text-xs text-muted">
          {chapters.length} chapters · {formulaCount} formulas · {presets.length} live models · your
          progress stays in this browser.
        </p>

        {/* Subjects */}
        <section className="mt-14">
          <SectionHead kicker="Subjects" title="Pick a world" />
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {volumes.map((volume) => {
              const mark = subject[volume.id];
              const list = chapters.filter((chapter) => chapter.volume === volume.id);
              const known =
                list.reduce((sum, c) => sum + mastery(c, read, practice), 0) / list.length;
              return (
                <a
                  key={volume.id}
                  href={`#vol-${volume.id}`}
                  className="lift panel group relative flex flex-col overflow-hidden p-4"
                >
                  <span
                    className="absolute -top-10 -right-10 size-28 rounded-full opacity-20 blur-2xl transition-opacity group-hover:opacity-40"
                    style={{ background: mark.hue }}
                  />
                  <span className="flex items-center justify-between">
                    <span
                      className="flex size-10 items-center justify-center rounded-xl"
                      style={{
                        background: `color-mix(in srgb, ${mark.hue} 16%, transparent)`,
                        color: mark.hue,
                      }}
                    >
                      <mark.icon className="size-5" />
                    </span>
                    <Ring value={known} size={26} stroke={3} color={mark.hue} />
                  </span>
                  <span className="mt-4 font-display text-lg font-semibold">{volume.title}</span>
                  <span className="mt-1 text-xs leading-relaxed text-muted">{volume.lede}</span>
                  <span className="mt-3 text-xs font-medium" style={{ color: mark.hue }}>
                    {list.length} chapters
                  </span>
                </a>
              );
            })}
          </div>
        </section>

        {/* Features */}
        <section className="mt-14 grid gap-3 md:grid-cols-3">
          <Feature
            icon={<Headphones className="size-5" />}
            title="Read-along lessons"
            body="A voice reads every sentence as it lights up, says each formula aloud, and points to each symbol as it explains it. Focus mode clears everything else away."
          />
          <Feature
            icon={<Spline className="size-5" />}
            title="A lab to play in"
            body="Projectiles, waves, tangents, Riemann sums, the bell curve, and your own functions, with sliders that change the graph and the numbers together."
            to="/lab"
          />
          <Feature
            icon={<Calculator className="size-5" />}
            title="Calculators and an atlas"
            body="Over a hundred calculators that show their steps and convert units, plus every formula in the book on one searchable page."
            to="/calculators"
          />
        </section>

        {/* Search */}
        <SearchField
          value={query}
          onChange={setQuery}
          placeholder="Search a formula, a subject, a word"
          label="Search chapters and formulas"
        />

        {needle ? (
          <section className="mt-6">
            <h2 className="font-display text-2xl font-semibold">Results</h2>
            {hits.length === 0 ? (
              <p className="mt-3 text-sm text-muted">Nothing matches that search.</p>
            ) : (
              <ul className="mt-4 flex flex-col gap-3">
                {hits.map(({ chapter, formulas }) => (
                  <li key={chapter.slug} className="panel p-4">
                    <Link
                      to="/read/$slug"
                      params={{ slug: chapter.slug }}
                      className="font-display text-xl font-semibold hover:text-accent"
                    >
                      {chapter.title}
                    </Link>
                    <p className="mt-1 text-sm text-muted">
                      {volumeTitle(chapter.volume)} · {levelLabel[chapter.level]}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed">{chapter.summary}</p>
                    {formulas.length > 0 ? (
                      <ul className="mt-3 flex flex-wrap gap-2">
                        {formulas.map((formula) => (
                          <li key={formula.id}>
                            <Link
                              to="/read/$slug"
                              params={{ slug: chapter.slug }}
                              hash={formula.id}
                              className="chip hover:border-accent hover:!text-ink"
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
            {/* Paths */}
            <section className="mt-14">
              <SectionHead kicker="Paths" title={`${paths.length} ways through`} />
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {paths.map((path) => {
                  const next = path.slugs.find((slug) => !read.includes(slug)) ?? path.slugs[0];
                  const done = path.slugs.filter((slug) => read.includes(slug)).length;
                  return (
                    <Link
                      key={path.title}
                      to="/read/$slug"
                      params={{ slug: next }}
                      className="lift panel group p-5"
                    >
                      <span className="flex items-center justify-between gap-3">
                        <span className="font-display text-xl font-semibold">{path.title}</span>
                        <ArrowRight className="size-4 shrink-0 text-accent transition-transform group-hover:translate-x-1" />
                      </span>
                      <span className="mt-1 block text-sm leading-relaxed text-muted">
                        {path.blurb}
                      </span>
                      <span
                        className="mt-4 flex items-center gap-1.5"
                        aria-label={`${done} of ${path.slugs.length} read`}
                      >
                        {path.slugs.map((slug) => {
                          const c = chapterBySlug.get(slug)!;
                          const isRead = read.includes(slug);
                          return (
                            <span
                              key={slug}
                              title={c.title}
                              className="h-1.5 flex-1 rounded-full"
                              style={{
                                background: isRead ? subject[c.volume].hue : "var(--color-line)",
                              }}
                            />
                          );
                        })}
                      </span>
                      <span className="mt-2 block text-xs text-muted">
                        {done}/{path.slugs.length} read · next: {chapterBySlug.get(next)?.title}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </section>

            {/* Lab teaser */}
            <section className="mt-14">
              <SectionHead kicker="Graph lab" title="Pull on an idea and watch it move" />
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {presets.slice(0, 6).map((preset) => (
                  <Link
                    key={preset.id}
                    to="/lab"
                    search={{ model: preset.id }}
                    className="lift panel formula-card group p-4"
                  >
                    <span className="text-xs font-semibold tracking-wide text-accent uppercase">
                      {preset.group}
                    </span>
                    <span className="mt-1 block font-display text-lg font-semibold">
                      {preset.title}
                    </span>
                    <span className="mt-2 block overflow-hidden text-sm text-muted">
                      <Tex tex={preset.tex} />
                    </span>
                  </Link>
                ))}
              </div>
            </section>

            {/* Chapters */}
            {volumes.map((volume) => {
              const mark = subject[volume.id];
              return (
                <section key={volume.id} id={`vol-${volume.id}`} className="mt-14 scroll-mt-24">
                  <div className="flex items-center gap-3">
                    <span
                      className="flex size-9 items-center justify-center rounded-xl"
                      style={{
                        background: `color-mix(in srgb, ${mark.hue} 16%, transparent)`,
                        color: mark.hue,
                      }}
                    >
                      <mark.icon className="size-5" />
                    </span>
                    <div>
                      <h2 className="font-display text-2xl font-semibold">{volume.title}</h2>
                      <p className="text-sm text-muted">{volume.lede}</p>
                    </div>
                  </div>
                  <ol className="mt-5 grid gap-2 sm:grid-cols-2">
                    {chapters
                      .filter((chapter) => chapter.volume === volume.id)
                      .map((chapter, index) => {
                        const known = mastery(chapter, read, practice);
                        return (
                          <li key={chapter.slug}>
                            <Link
                              to="/read/$slug"
                              params={{ slug: chapter.slug }}
                              className="lift panel flex h-full items-start gap-3 p-4"
                            >
                              <span className="mono mt-0.5 w-6 shrink-0 text-xs text-muted">
                                {String(index + 1).padStart(2, "0")}
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block font-display font-semibold leading-snug">
                                  {chapter.title}
                                </span>
                                <span className="mt-1 line-clamp-2 block text-sm text-muted">
                                  {chapter.summary}
                                </span>
                                <span className="mt-2 flex gap-2 text-[11px] text-muted">
                                  <span>{levelLabel[chapter.level]}</span>·
                                  <span>{chapter.minutes} min</span>
                                </span>
                              </span>
                              <Ring value={known} size={22} stroke={3} color={mark.hue} />
                            </Link>
                          </li>
                        );
                      })}
                  </ol>
                </section>
              );
            })}

            <section className="panel mt-14 flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center">
              <MapIcon className="size-8 shrink-0 text-accent" aria-hidden />
              <div className="flex-1">
                <h2 className="font-display text-xl font-semibold">Every formula on one page</h2>
                <p className="text-sm text-muted">
                  The atlas lists all {formulaCount} formulas with what each one is for, and the
                  constants they use.
                </p>
              </div>
              <Link to="/atlas" className="btn-ghost">
                Open the atlas
                <ArrowRight className="size-4" />
              </Link>
            </section>
          </>
        )}
      </div>
    </Shell>
  );
}

function SectionHead({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div>
      <p className="text-xs font-semibold tracking-[0.16em] text-accent uppercase">{kicker}</p>
      <h2 className="mt-1 font-display text-3xl font-semibold tracking-tight">{title}</h2>
    </div>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="panel flex items-center gap-3 p-4">
      <span className="flex size-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
        {icon}
      </span>
      <div>
        <p className="font-display text-2xl font-semibold tabular-nums">{value}</p>
        <p className="text-xs text-muted">{label}</p>
      </div>
    </div>
  );
}

function Feature({
  icon,
  title,
  body,
  to,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  to?: "/lab" | "/calculators";
}) {
  const inner = (
    <>
      <span className="bg-gradient flex size-10 items-center justify-center rounded-xl text-on-accent">
        {icon}
      </span>
      <span className="mt-4 block font-display text-lg font-semibold">{title}</span>
      <span className="mt-1 block text-sm leading-relaxed text-muted">{body}</span>
    </>
  );
  return to ? (
    <Link to={to} className="lift panel block p-5">
      {inner}
    </Link>
  ) : (
    <div className="panel p-5">{inner}</div>
  );
}

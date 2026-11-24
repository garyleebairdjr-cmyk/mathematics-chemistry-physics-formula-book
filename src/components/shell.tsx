import { Link, useRouterState } from "@tanstack/react-router";
import { Github, Menu, Moon, Sun, X } from "lucide-react";
import { useEffect, useState } from "react";
import { chapters } from "@/data";
import { levelLabel, volumes } from "@/data/types";
import { useProgress } from "@/lib/progress";
import { useTheme } from "@/lib/theme";

const REPO_URL =
  "https://github.com/garyleebairdjr-cmyk/mathematics-chemistry-physics-formula-book";

export function Shell({ children, active }: { children: React.ReactNode; active?: string }) {
  const [open, setOpen] = useState(false);
  const { theme, toggle } = useTheme();
  const path = useRouterState({ select: (state) => state.location.pathname });
  const onCalc = path.endsWith("/calculators");
  const onAtlas = path.endsWith("/atlas");
  const onLibrary = !onCalc && !onAtlas && !path.includes("/read/");

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="min-h-screen bg-paper text-ink">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-3 focus:bg-card focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <header className="sticky top-0 z-30 border-b border-line bg-paper/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4">
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-lg border border-line lg:hidden"
            aria-label="Open contents"
            onClick={() => setOpen(true)}
          >
            <Menu className="size-5" />
          </button>
          <Link to="/" className="flex items-center gap-2 font-serif text-xl tracking-tight">
            <img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="" className="size-6 rounded" />
            <span className="hidden min-[400px]:inline">Formula Book</span>
          </Link>
          <nav className="ml-auto flex items-center gap-1">
            <Link
              to="/"
              className={
                "inline-flex h-11 items-center rounded-lg px-2 text-sm sm:px-3 " +
                (onLibrary ? "text-accent" : "text-ink")
              }
            >
              Library
            </Link>
            <Link
              to="/atlas"
              className={
                "inline-flex h-11 items-center rounded-lg px-2 text-sm sm:px-3 " +
                (onAtlas ? "text-accent" : "text-ink")
              }
            >
              Atlas
            </Link>
            <Link
              to="/calculators"
              className={
                "inline-flex h-11 items-center rounded-lg px-2 text-sm sm:px-3 " +
                (onCalc ? "text-accent" : "text-ink")
              }
            >
              Calculators
            </Link>
            <button
              type="button"
              onClick={toggle}
              className="inline-flex size-11 items-center justify-center rounded-lg text-ink hover:text-accent"
              aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
              title={theme === "dark" ? "Light theme" : "Dark theme"}
            >
              {theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
            </button>
          </nav>
        </div>
      </header>

      {open ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-ink/40"
            aria-label="Close contents"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-72 flex-col bg-paper">
            <div className="flex h-14 items-center justify-between border-b border-line px-4">
              <p className="font-serif text-lg">Contents</p>
              <button
                type="button"
                className="inline-flex size-11 items-center justify-center"
                aria-label="Close"
                onClick={() => setOpen(false)}
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="overflow-y-auto p-3">
              <Contents active={active} onNavigate={() => setOpen(false)} />
            </div>
          </div>
        </div>
      ) : null}

      <div className="mx-auto flex w-full max-w-6xl">
        <aside className="sticky top-14 hidden max-h-screen w-64 shrink-0 overflow-y-auto border-r border-line p-4 pb-16 lg:block">
          <Contents active={active} />
        </aside>
        <main id="content" className="min-w-0 flex-1 px-4 py-8 sm:px-6 lg:px-10">
          {children}
          <footer className="mx-auto mt-20 flex max-w-3xl flex-col gap-2 border-t border-line pt-6 pb-4 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
            <p>Free and open source under the MIT license.</p>
            <a
              href={REPO_URL}
              className="inline-flex min-h-11 items-center gap-2 hover:text-accent"
              target="_blank"
              rel="noreferrer"
            >
              <Github className="size-4" />
              Contribute on GitHub
            </a>
          </footer>
        </main>
      </div>
    </div>
  );
}

function Contents({ active, onNavigate }: { active?: string; onNavigate?: () => void }) {
  const read = useProgress((state) => state.read);

  return (
    <div className="flex flex-col gap-6">
      {volumes.map((volume) => (
        <div key={volume.id}>
          <p className="mb-2 text-xs font-medium tracking-wide text-muted uppercase">
            {volume.title}
          </p>
          <ul className="flex flex-col">
            {chapters
              .filter((chapter) => chapter.volume === volume.id)
              .map((chapter) => {
                const current = chapter.slug === active;
                const done = read.includes(chapter.slug);
                return (
                  <li key={chapter.slug}>
                    <Link
                      to="/read/$slug"
                      params={{ slug: chapter.slug }}
                      onClick={onNavigate}
                      className={
                        "flex min-h-11 items-start gap-2 rounded-lg px-2 py-2 text-sm " +
                        (current ? "bg-accent-soft text-accent" : "text-ink")
                      }
                    >
                      <span
                        className={
                          "mt-1 size-1.5 shrink-0 rounded-full " + (done ? "bg-accent" : "bg-line")
                        }
                        aria-hidden
                      />
                      <span>
                        <span className="block leading-snug">{chapter.title}</span>
                        <span className="block text-xs text-muted">
                          {levelLabel[chapter.level]}
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
          </ul>
        </div>
      ))}
    </div>
  );
}

import { Link, useRouterState } from "@tanstack/react-router";
import { Check, Github, Menu, Search, X } from "lucide-react";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { chapters } from "@/data";
import { levelLabel, volumes } from "@/data/types";
import { usePalette, usePaletteHotkey } from "@/lib/palette";
import { mastery, useProgress } from "@/lib/progress";
import { subject } from "@/lib/subjects";
import { useApplyAppearance } from "@/lib/theme";
import { SettingsButton, SettingsPanel } from "@/components/settings-panel";

const REPO_URL =
  "https://github.com/garyleebairdjr-cmyk/mathematics-chemistry-physics-formula-book";

const CommandPalette = lazy(() => import("@/components/command-palette"));

const NAV = [
  { to: "/", label: "Library" },
  { to: "/lab", label: "Lab" },
  { to: "/atlas", label: "Atlas" },
  { to: "/calculators", label: "Calculators" },
] as const;

export function Shell({
  children,
  active,
  wide = false,
}: {
  children: React.ReactNode;
  active?: string;
  /** Leave out the contents rail, for pages that need the full width (the lab). */
  wide?: boolean;
}) {
  const [open, setOpen] = useState(false);
  useApplyAppearance();
  usePaletteHotkey();
  const paletteOpen = usePalette((state) => state.open);
  const path = useRouterState({ select: (state) => state.location.pathname });
  const openPalette = usePalette((state) => state.set);
  const section = path.includes("/read/")
    ? "/read"
    : (NAV.find((item) => item.to !== "/" && path.endsWith(item.to))?.to ?? "/");

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="relative min-h-screen bg-paper text-ink">
      <div className="backdrop" aria-hidden />
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-3 focus:rounded-lg focus:bg-card focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <header className="glass sticky top-0 z-30 border-b border-line/70">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-2 px-4">
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-full border border-line lg:hidden"
            aria-label="Open contents"
            onClick={() => setOpen(true)}
          >
            <Menu className="size-5" />
          </button>
          <Link to="/" className="flex items-center gap-2.5">
            <Logo />
            <span className="hidden font-display text-lg font-semibold tracking-tight min-[420px]:inline">
              Formula
              <span className="font-flair text-xl font-normal italic text-gradient"> Book</span>
            </span>
          </Link>
          <nav className="ml-auto hidden items-center gap-1 rounded-full border border-line/70 bg-card/50 p-1 md:flex">
            {NAV.map((item) => {
              const on = section === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={
                    "inline-flex h-9 items-center rounded-full px-4 text-sm font-medium transition-colors " +
                    (on ? "bg-accent text-on-accent" : "text-muted hover:text-ink")
                  }
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="ml-auto flex items-center gap-1 md:ml-2">
            <button
              type="button"
              onClick={() => openPalette(true)}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-card/50 px-3 text-sm text-muted hover:text-ink"
              aria-label="Search (Ctrl K)"
            >
              <Search className="size-4" />
              <kbd className="mono hidden text-[11px] lg:inline">Ctrl K</kbd>
            </button>
            <SettingsButton />
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-4 pb-2 md:hidden">
          {NAV.map((item) => {
            const on = section === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={
                  "inline-flex h-8 shrink-0 items-center rounded-full px-3 text-sm font-medium " +
                  (on ? "bg-accent text-on-accent" : "text-muted")
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        {active ? <ReadingProgress /> : null}
      </header>

      {open ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/45 backdrop-blur-sm"
            aria-label="Close contents"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-80 max-w-[88vw] flex-col border-r border-line bg-card">
            <div className="flex h-16 items-center justify-between border-b border-line px-4">
              <p className="font-display text-lg font-semibold">Contents</p>
              <button
                type="button"
                className="inline-flex size-10 items-center justify-center rounded-full"
                aria-label="Close"
                onClick={() => setOpen(false)}
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="thin-scroll overflow-y-auto p-3">
              <Contents active={active} onNavigate={() => setOpen(false)} />
            </div>
          </div>
        </div>
      ) : null}

      <div className="relative z-10 mx-auto flex w-full max-w-7xl">
        {wide ? null : (
          <aside className="thin-scroll sticky top-16 hidden h-[calc(100vh-4rem)] w-72 shrink-0 overflow-y-auto border-r border-line/70 p-4 pb-16 lg:block">
            <Contents active={active} />
          </aside>
        )}
        <main id="content" className="min-w-0 flex-1 px-4 py-8 sm:px-6 lg:px-10">
          {children}
          <footer className="mx-auto mt-24 flex max-w-3xl flex-col gap-2 border-t border-line pt-6 pb-4 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
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
      <SettingsPanel />
      {paletteOpen ? (
        <Suspense fallback={null}>
          <CommandPalette />
        </Suspense>
      ) : null}
    </div>
  );
}

/** The mark: a lit tile with a sigma. */
export function Logo({ size = 36 }: { size?: number }) {
  return (
    <span
      className="bg-gradient inline-flex items-center justify-center rounded-xl text-on-accent shadow-[0_6px_24px_-8px_var(--color-glow)]"
      style={{ width: size, height: size }}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" width={size * 0.56} height={size * 0.56} fill="none">
        <path
          d="M18 4H6l6.5 8L6 20h12"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

/** A thin bar under the header that fills as the chapter is read. */
function ReadingProgress() {
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <div className="absolute inset-x-0 -bottom-px h-0.5">
      <div
        ref={bar}
        className="bg-gradient h-full origin-left"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}

/** A small progress ring. */
export function Ring({
  value,
  size = 18,
  stroke = 2.5,
  color = "var(--color-accent)",
}: {
  value: number;
  size?: number;
  stroke?: number;
  color?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="-rotate-90"
      aria-hidden
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="var(--color-line)"
        strokeWidth={stroke}
      />
      {value > 0 ? (
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${c * Math.min(1, value)} ${c}`}
        />
      ) : null}
    </svg>
  );
}

function Contents({ active, onNavigate }: { active?: string; onNavigate?: () => void }) {
  const read = useProgress((state) => state.read);
  const practice = useProgress((state) => state.practice);

  return (
    <div className="flex flex-col gap-6">
      {volumes.map((volume) => {
        const mark = subject[volume.id];
        return (
          <div key={volume.id}>
            <p className="mb-2 flex items-center gap-2 px-2 text-[11px] font-semibold tracking-[0.12em] text-muted uppercase">
              <mark.icon className="size-3.5" style={{ color: mark.hue }} aria-hidden />
              {volume.title}
            </p>
            <ul className="flex flex-col gap-0.5">
              {chapters
                .filter((chapter) => chapter.volume === volume.id)
                .map((chapter) => {
                  const current = chapter.slug === active;
                  const known = mastery(chapter, read, practice);
                  return (
                    <li key={chapter.slug}>
                      <Link
                        to="/read/$slug"
                        params={{ slug: chapter.slug }}
                        onClick={onNavigate}
                        className={
                          "flex min-h-10 items-center gap-2.5 rounded-xl px-2 py-1.5 text-sm transition-colors " +
                          (current
                            ? "bg-accent-soft text-ink shadow-[inset_2px_0_0_var(--color-accent)]"
                            : "text-ink/85 hover:bg-raise/60")
                        }
                      >
                        <span className="relative flex shrink-0 items-center justify-center">
                          <Ring value={known} color={mark.hue} />
                          {known >= 1 ? (
                            <Check className="absolute size-2.5" style={{ color: mark.hue }} />
                          ) : null}
                        </span>
                        <span className="min-w-0">
                          <span className="block leading-snug">{chapter.title}</span>
                          <span className="block text-[11px] text-muted">
                            {levelLabel[chapter.level]}
                          </span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

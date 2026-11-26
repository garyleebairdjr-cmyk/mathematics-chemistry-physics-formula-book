import { useNavigate } from "@tanstack/react-router";
import {
  BookOpen,
  Calculator,
  CornerDownLeft,
  FunctionSquare,
  LibraryBig,
  Map as MapIcon,
  Moon,
  Search,
  Settings2,
  Spline,
  Sun,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Tex } from "@/components/tex";
import { chapters } from "@/data";
import { levelLabel, volumeTitle } from "@/data/types";
import { presets } from "@/lib/plot/presets";
import { usePalette } from "@/lib/palette";
import { useSettings } from "@/lib/settings";
import { useAppearance } from "@/lib/theme";

type Item = {
  id: string;
  group: string;
  title: string;
  hint: string;
  icon: ReactNode;
  tex?: string;
  keywords: string;
  run: () => void;
};

/** A jump-to box for every chapter, formula, model, and page. */
export default function CommandPalette() {
  const open = usePalette((state) => state.open);
  const setOpen = usePalette((state) => state.set);
  const navigate = useNavigate();
  const setTheme = useAppearance((state) => state.setTheme);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const list = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
    }
  }, [open]);

  const items = useMemo<Item[]>(() => {
    const close = () => setOpen(false);
    const pages: Item[] = [
      {
        id: "p-home",
        group: "Pages",
        title: "Library",
        hint: "Every chapter",
        icon: <LibraryBig className="size-4" />,
        keywords: "home library chapters",
        run: () => void navigate({ to: "/" }),
      },
      {
        id: "p-lab",
        group: "Pages",
        title: "Graph lab",
        hint: "Live models and your own functions",
        icon: <Spline className="size-4" />,
        keywords: "graph plot lab model simulate",
        run: () => void navigate({ to: "/lab" }),
      },
      {
        id: "p-atlas",
        group: "Pages",
        title: "Formula atlas",
        hint: "All formulas on one page",
        icon: <MapIcon className="size-4" />,
        keywords: "atlas formulas constants",
        run: () => void navigate({ to: "/atlas" }),
      },
      {
        id: "p-calc",
        group: "Pages",
        title: "Calculators",
        hint: "Compute a formula, convert a unit",
        icon: <Calculator className="size-4" />,
        keywords: "calculators compute units convert",
        run: () => void navigate({ to: "/calculators" }),
      },
      {
        id: "p-settings",
        group: "Pages",
        title: "Settings",
        hint: "Voices, characters, theme, progress",
        icon: <Settings2 className="size-4" />,
        keywords: "settings voice voices install download characters kokoro neural theme",
        run: () => useSettings.getState().show("voice"),
      },
      {
        id: "t-dark",
        group: "Appearance",
        title: "Dark theme",
        hint: "Aurora on graphite",
        icon: <Moon className="size-4" />,
        keywords: "dark theme night",
        run: () => setTheme("dark"),
      },
      {
        id: "t-light",
        group: "Appearance",
        title: "Light theme",
        hint: "Paper white",
        icon: <Sun className="size-4" />,
        keywords: "light theme day",
        run: () => setTheme("light"),
      },
    ];
    const chapterItems: Item[] = chapters.map((chapter) => ({
      id: `c-${chapter.slug}`,
      group: "Chapters",
      title: chapter.title,
      hint: `${volumeTitle(chapter.volume)} · ${levelLabel[chapter.level]}`,
      icon: <BookOpen className="size-4" />,
      keywords: `${chapter.title} ${chapter.summary} ${chapter.volume}`.toLowerCase(),
      run: () => void navigate({ to: "/read/$slug", params: { slug: chapter.slug } }),
    }));
    const models: Item[] = presets.map((preset) => ({
      id: `m-${preset.id}`,
      group: "Graph lab",
      title: preset.title,
      hint: preset.blurb,
      icon: <Spline className="size-4" />,
      keywords: `${preset.title} ${preset.blurb} ${preset.group} graph`.toLowerCase(),
      run: () => void navigate({ to: "/lab", search: { model: preset.id } }),
    }));
    const formulas: Item[] = chapters.flatMap((chapter) =>
      chapter.formulas.map((formula) => ({
        id: `f-${chapter.slug}-${formula.id}`,
        group: "Formulas",
        title: formula.name,
        hint: chapter.title,
        tex: formula.tex,
        icon: <FunctionSquare className="size-4" />,
        keywords: `${formula.name} ${formula.meaning} ${chapter.title}`.toLowerCase(),
        run: () =>
          void navigate({ to: "/read/$slug", params: { slug: chapter.slug }, hash: formula.id }),
      })),
    );
    return [...pages, ...chapterItems, ...models, ...formulas].map((item) => ({
      ...item,
      run: () => {
        close();
        item.run();
      },
    }));
  }, [navigate, setOpen, setTheme]);

  const needle = query.trim().toLowerCase();
  const shown = useMemo(() => {
    if (!needle)
      return items
        .filter((item) => item.group === "Pages" || item.group === "Chapters")
        .slice(0, 14);
    const words = needle.split(/\s+/);
    return items
      .map((item) => {
        const title = item.title.toLowerCase();
        if (!words.every((word) => title.includes(word) || item.keywords.includes(word)))
          return null;
        const score =
          (title.startsWith(needle) ? 0 : title.includes(needle) ? 1 : 2) +
          (item.group === "Formulas" ? 0.5 : 0);
        return { item, score };
      })
      .filter((hit): hit is { item: Item; score: number } => hit !== null)
      .sort((a, b) => a.score - b.score)
      .slice(0, 40)
      .map((hit) => hit.item);
  }, [items, needle]);

  useEffect(() => {
    list.current
      ?.querySelector<HTMLElement>(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-start justify-center px-3 pt-[12vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Search the book"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/45 backdrop-blur-sm"
        aria-label="Close search"
        onClick={() => setOpen(false)}
      />
      <div className="fade-up relative w-full max-w-xl overflow-hidden rounded-2xl border border-line bg-card shadow-[0_30px_100px_-20px_rgba(0,0,0,0.7)]">
        <label className="flex items-center gap-3 border-b border-line px-4">
          <Search className="size-5 text-accent" aria-hidden />
          <span className="sr-only">Search</span>
          <input
            autoFocus
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActive(0);
            }}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown") {
                event.preventDefault();
                setActive((i) => Math.min(shown.length - 1, i + 1));
              } else if (event.key === "ArrowUp") {
                event.preventDefault();
                setActive((i) => Math.max(0, i - 1));
              } else if (event.key === "Enter") {
                event.preventDefault();
                shown[active]?.run();
              } else if (event.key === "Escape") {
                setOpen(false);
              }
            }}
            placeholder="Jump to a chapter, formula, or model…"
            className="h-14 w-full bg-transparent text-base outline-none placeholder:text-muted"
            role="combobox"
            aria-expanded
            aria-controls="palette-list"
            aria-activedescendant={shown[active] ? `palette-${shown[active].id}` : undefined}
          />
          <kbd className="mono rounded border border-line px-1.5 text-[11px] text-muted">Esc</kbd>
        </label>
        <ul
          ref={list}
          id="palette-list"
          role="listbox"
          className="thin-scroll max-h-[55vh] overflow-y-auto p-2"
        >
          {shown.length === 0 ? (
            <li className="px-3 py-6 text-center text-sm text-muted">Nothing matches.</li>
          ) : null}
          {shown.map((item, i) => {
            const groupStart = i === 0 || shown[i - 1].group !== item.group;
            return (
              <li key={item.id} role="presentation">
                {groupStart ? (
                  <p className="px-3 pt-2 pb-1 text-[11px] font-semibold tracking-[0.12em] text-muted uppercase">
                    {item.group}
                  </p>
                ) : null}
                <button
                  type="button"
                  id={`palette-${item.id}`}
                  data-index={i}
                  role="option"
                  aria-selected={i === active}
                  onMouseMove={() => setActive(i)}
                  onClick={item.run}
                  className={
                    "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left " +
                    (i === active ? "bg-accent-soft" : "")
                  }
                >
                  <span className={"shrink-0 " + (i === active ? "text-accent" : "text-muted")}>
                    {item.icon}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{item.title}</span>
                    <span className="block truncate text-xs text-muted">{item.hint}</span>
                  </span>
                  {item.tex ? (
                    <span className="hidden max-w-48 shrink-0 truncate text-sm text-muted sm:block">
                      <Tex tex={item.tex} />
                    </span>
                  ) : null}
                  {i === active ? (
                    <CornerDownLeft className="size-4 shrink-0 text-muted" aria-hidden />
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

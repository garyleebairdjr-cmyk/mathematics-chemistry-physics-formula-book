import { useEffect } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemePref = "light" | "dark" | "system";
export type Ink = "amber" | "sky" | "sage" | "violet";

/** Accent names borrowed from Natural Voice Reader. The ids stay stable so saved choices carry over. */
export const INKS: { id: Ink; label: string; swatch: [string, string] }[] = [
  { id: "amber", label: "Solar", swatch: ["#ffb547", "#ff5f8f"] },
  { id: "sky", label: "Cyan", swatch: ["#5cd3ff", "#7c6cff"] },
  { id: "sage", label: "Mint", swatch: ["#4ee6a6", "#36c8ff"] },
  { id: "violet", label: "Violet", swatch: ["#b69cff", "#ff7ad9"] },
];

const THEME_COLOR = { light: "#f4f5f9", dark: "#07080d" } as const;

type Appearance = {
  theme: ThemePref;
  ink: Ink;
  setTheme: (theme: ThemePref) => void;
  setInk: (ink: Ink) => void;
};

/** Saved under the same key index.html reads before first paint. */
export const useAppearance = create<Appearance>()(
  persist(
    (set) => ({
      theme: "system",
      ink: "amber",
      setTheme: (theme) => set({ theme }),
      setInk: (ink) => set({ ink }),
    }),
    { name: "formula-book-appearance" },
  ),
);

export function resolveTheme(pref: ThemePref): "light" | "dark" {
  if (pref !== "system") return pref;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function apply(pref: ThemePref, ink: Ink) {
  const resolved = resolveTheme(pref);
  const root = document.documentElement;
  root.dataset.theme = resolved;
  root.dataset.ink = ink;
  root.classList.toggle("dark", resolved === "dark");
  root.style.colorScheme = resolved;
  for (const meta of document.querySelectorAll('meta[name="theme-color"]')) {
    meta.setAttribute("content", THEME_COLOR[resolved]);
  }
}

/** Keep <html> in sync with the saved appearance, and follow the system when asked. */
export function useApplyAppearance() {
  const theme = useAppearance((state) => state.theme);
  const ink = useAppearance((state) => state.ink);

  useEffect(() => {
    apply(theme, ink);
    if (theme !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => apply(theme, ink);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [theme, ink]);
}

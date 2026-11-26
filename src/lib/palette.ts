import { useEffect } from "react";
import { create } from "zustand";

/** Whether the jump-to box is open. Kept apart from the palette so the palette can load lazily. */
export const usePalette = create<{ open: boolean; set: (open: boolean) => void }>()((set) => ({
  open: false,
  set: (open) => set({ open }),
}));

/** Ctrl/⌘ K, or / when not typing, toggles the palette. */
export function usePaletteHotkey() {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      const typing = target?.closest("input, textarea, select");
      if (
        (event.key === "k" && (event.metaKey || event.ctrlKey)) ||
        (event.key === "/" && !typing)
      ) {
        event.preventDefault();
        usePalette.getState().set(!usePalette.getState().open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
}

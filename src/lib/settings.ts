import { create } from "zustand";

export type SettingsTab = "voice" | "appearance" | "progress";

/** The settings drawer: shown and hidden by the gear button in the header. */
export const useSettings = create<{
  open: boolean;
  tab: SettingsTab;
  toggle: () => void;
  show: (tab?: SettingsTab) => void;
  hide: () => void;
  setTab: (tab: SettingsTab) => void;
}>()((set) => ({
  open: false,
  tab: "voice",
  toggle: () => set((state) => ({ open: !state.open })),
  show: (tab) => set((state) => ({ open: true, tab: tab ?? state.tab })),
  hide: () => set({ open: false }),
  setTab: (tab) => set({ tab }),
}));

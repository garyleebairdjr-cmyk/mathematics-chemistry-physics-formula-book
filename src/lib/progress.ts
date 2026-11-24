import { create } from "zustand";
import { persist } from "zustand/middleware";

type ProgressState = {
  read: string[];
  last: string | null;
  toggle: (slug: string) => void;
  visit: (slug: string) => void;
};

export const useProgress = create<ProgressState>()(
  persist(
    (set, get) => ({
      read: [],
      last: null,
      toggle: (slug) => {
        const has = get().read.includes(slug);
        set({
          read: has ? get().read.filter((item) => item !== slug) : [...get().read, slug],
        });
      },
      visit: (slug) => set({ last: slug }),
    }),
    { name: "axioma-progress" },
  ),
);

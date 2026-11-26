import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Chapter } from "@/data/types";

export type Verdict = "got" | "again";

type ProgressState = {
  read: string[];
  last: string | null;
  /** Self-checks on practice questions, keyed "slug:index". */
  practice: Record<string, Verdict>;
  /** Days (YYYY-MM-DD, local time) with any study activity, newest last. */
  days: string[];
  toggle: (slug: string) => void;
  visit: (slug: string) => void;
  grade: (slug: string, index: number, verdict: Verdict | null) => void;
};

function today(): string {
  const now = new Date();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${m}-${d}`;
}

function withToday(days: string[]): string[] {
  const day = today();
  if (days[days.length - 1] === day) return days;
  // Keep about a year of history.
  return [...days.filter((item) => item !== day), day].slice(-400);
}

export const useProgress = create<ProgressState>()(
  persist(
    (set, get) => ({
      read: [],
      last: null,
      practice: {},
      days: [],
      toggle: (slug) => {
        const has = get().read.includes(slug);
        set({
          read: has ? get().read.filter((item) => item !== slug) : [...get().read, slug],
          days: withToday(get().days),
        });
      },
      visit: (slug) => set({ last: slug, days: withToday(get().days) }),
      grade: (slug, index, verdict) => {
        const practice = { ...get().practice };
        const key = `${slug}:${index}`;
        if (verdict) practice[key] = verdict;
        else delete practice[key];
        set({ practice, days: withToday(get().days) });
      },
    }),
    { name: "axioma-progress" },
  ),
);

/** Consecutive days of study ending today (or yesterday, so the streak survives until tonight). */
export function streak(days: string[]): number {
  if (days.length === 0) return 0;
  const set = new Set(days);
  const cursor = new Date();
  const key = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  if (!set.has(key(cursor))) cursor.setDate(cursor.getDate() - 1);
  let count = 0;
  while (set.has(key(cursor))) {
    count += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return count;
}

/**
 * How well a chapter is known, from 0 to 1: reading it counts for 40%, and the
 * practice questions answered "got it" for the rest.
 */
export function mastery(
  chapter: Chapter,
  read: string[],
  practice: Record<string, Verdict>,
): number {
  const isRead = read.includes(chapter.slug) ? 1 : 0;
  const total = chapter.practice.length;
  if (total === 0) return isRead;
  let got = 0;
  for (let i = 0; i < total; i += 1) if (practice[`${chapter.slug}:${i}`] === "got") got += 1;
  return 0.4 * isRead + 0.6 * (got / total);
}

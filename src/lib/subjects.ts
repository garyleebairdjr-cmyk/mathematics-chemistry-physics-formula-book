import { Atom, ChartNoAxesColumn, Dna, FlaskConical, Sigma, type LucideIcon } from "lucide-react";
import type { VolumeId } from "@/data/types";

/** Each subject's mark: an icon and a hue (a CSS variable defined for both themes). */
export const subject: Record<VolumeId, { icon: LucideIcon; hue: string; short: string }> = {
  mathematics: { icon: Sigma, hue: "var(--color-math)", short: "Math" },
  statistics: { icon: ChartNoAxesColumn, hue: "var(--color-stats)", short: "Stats" },
  physics: { icon: Atom, hue: "var(--color-physics)", short: "Physics" },
  chemistry: { icon: FlaskConical, hue: "var(--color-chemistry)", short: "Chemistry" },
  biology: { icon: Dna, hue: "var(--color-biology)", short: "Biology" },
};

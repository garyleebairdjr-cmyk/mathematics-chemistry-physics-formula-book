import { biologyTools } from "./bio-tools.ts";
import { chemistryTools } from "./chem-tools.ts";
import { lawTools } from "./law-tools.ts";
import { mathTools } from "./math-tools.ts";
import { physicsTools } from "./physics-tools.ts";
import type { Tool, ToolGroup } from "./types.ts";

export const tools: Tool[] = [
  ...mathTools,
  ...physicsTools,
  ...lawTools,
  ...chemistryTools,
  ...biologyTools,
];

export const toolGroups: { id: ToolGroup; title: string }[] = [
  { id: "math", title: "Mathematics" },
  { id: "physics", title: "Physics" },
  { id: "chemistry", title: "Chemistry" },
  { id: "biology", title: "Biology" },
];

export function toolsIn(group: ToolGroup): Tool[] {
  return tools.filter((tool) => tool.group === group);
}

export function defaults(tool: Tool): Record<string, string> {
  const values: Record<string, string> = {};
  for (const field of tool.fields) {
    values[field.key] = field.kind === "select" ? field.defaultValue : (field.defaultValue ?? "");
  }
  return values;
}

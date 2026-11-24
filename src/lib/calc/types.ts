export type CalcLine = { label: string; value: string };

export type CalcOut = {
  lines: CalcLine[];
  steps?: string[];
  note?: string;
};

export type Field =
  | {
      kind: "number";
      key: string;
      label: string;
      unit?: string;
      defaultValue?: string;
    }
  | {
      kind: "text";
      key: string;
      label: string;
      placeholder?: string;
      defaultValue?: string;
      wide?: boolean;
    }
  | {
      kind: "select";
      key: string;
      label: string;
      defaultValue: string;
      options: { value: string; label: string }[];
    };

export type ToolGroup = "math" | "physics" | "chemistry" | "biology";

export type Tool = {
  id: string;
  group: ToolGroup;
  title: string;
  formula: string;
  blurb: string;
  fields: Field[];
  run: (values: Record<string, string>) => CalcOut | { error: string };
};

export function num(key: string, label: string, defaultValue = "", unit?: string): Field {
  return { kind: "number", key, label, unit, defaultValue };
}

export function text(
  key: string,
  label: string,
  defaultValue = "",
  placeholder?: string,
  wide?: boolean,
): Field {
  return { kind: "text", key, label, defaultValue, placeholder, wide };
}

export function sel(
  key: string,
  label: string,
  defaultValue: string,
  options: { value: string; label: string }[],
): Field {
  return { kind: "select", key, label, defaultValue, options };
}

export function lines(items: CalcLine[], steps?: string[], note?: string): CalcOut {
  return { lines: items, steps, note };
}

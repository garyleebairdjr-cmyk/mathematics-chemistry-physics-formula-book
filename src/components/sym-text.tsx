import { Fragment, type ReactNode } from "react";

const SCRIPT = /([_^])(?:\{([^}]*)\}|(\([^)]*\))|(\*)|([A-Za-z0-9α-ωΑ-Ω]+))/g;

/** Show a symbol name such as "x_i", "F_{n+1}", or "t^*" with real sub- and superscripts. */
export function SymText({ text }: { text: string }) {
  const parts: ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(SCRIPT)) {
    const index = match.index ?? 0;
    if (index > last) parts.push(text.slice(last, index));
    const body = match[2] ?? match[3] ?? match[4] ?? match[5] ?? "";
    parts.push(match[1] === "_" ? <sub key={index}>{body}</sub> : <sup key={index}>{body}</sup>);
    last = index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <Fragment>{parts}</Fragment>;
}

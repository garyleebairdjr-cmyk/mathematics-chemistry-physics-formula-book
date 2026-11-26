/**
 * Split prose into sentences for read-along highlighting. The page and the
 * lesson both call this, so sentence N on screen is always part N in the
 * lesson. Joining the pieces with single spaces gives back the text.
 */

// Words that end in a period without ending the sentence.
const ABBREVIATIONS = new Set([
  "e.g",
  "i.e",
  "etc",
  "vs",
  "approx",
  "fig",
  "eq",
  "eqs",
  "no",
  "dr",
  "mr",
  "mrs",
  "ms",
  "st",
  "cf",
  "al",
  "ca",
  "resp",
]);

export function splitSentences(text: string): string[] {
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return [];
  const out: string[] = [];
  let start = 0;
  // A sentence ends at . ! or ? (optionally followed by closing quotes or brackets),
  // then a space, then something that can start a sentence.
  const boundary = /[.!?]["”’)\]]*\s+(?=["“‘(]?[A-Z0-9ΑΒΓΔΘΛΠΣΦΨΩ])/g;
  for (const match of clean.matchAll(boundary)) {
    const end = (match.index ?? 0) + match[0].length;
    const before = clean.slice(start, (match.index ?? 0) + 1);
    const lastWord = (before.match(/(\S+)\.$/)?.[1] ?? "").toLowerCase();
    // "e.g." and "Fig." keep going. A lone letter ("the mass is m.") still ends a sentence.
    if (ABBREVIATIONS.has(lastWord.replace(/\.$/, ""))) continue;
    out.push(clean.slice(start, end).trim());
    start = end;
  }
  const rest = clean.slice(start).trim();
  if (rest) out.push(rest);
  return out;
}

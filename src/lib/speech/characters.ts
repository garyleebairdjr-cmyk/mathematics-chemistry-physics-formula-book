/**
 * Voice characters for the neural engines. Each is a Kokoro-82M voice
 * (Apache-2.0), so the same character sounds the same whether it runs in the
 * browser or on the local voice server.
 */
export type VoiceCharacter = {
  /** Kokoro voice id. */
  id: string;
  name: string;
  accent: "US" | "UK";
  /** One line on how it sounds and what it suits. */
  style: string;
  /** What the preview button says. */
  line: string;
  /** Two colours for the avatar. */
  hues: [string, string];
};

export const CHARACTERS: VoiceCharacter[] = [
  {
    id: "af_heart",
    name: "Heart",
    accent: "US",
    style: "Warm and clear. The best all-round narrator.",
    line: "Hi, I'm Heart. Let's find out why the derivative of x squared is two x.",
    hues: ["#ff8a65", "#ff5f8f"],
  },
  {
    id: "bm_george",
    name: "Professor George",
    accent: "UK",
    style: "Measured British lecturer. Good for proofs and physics.",
    line: "Good afternoon. Today we shall see why every action has an equal and opposite reaction.",
    hues: ["#5cd3ff", "#7c6cff"],
  },
  {
    id: "af_bella",
    name: "Bella",
    accent: "US",
    style: "Bright and lively. Keeps a long lesson moving.",
    line: "Hey there! Ready to turn a messy equation into something beautiful?",
    hues: ["#ffb547", "#ff7ad9"],
  },
  {
    id: "bf_emma",
    name: "Emma",
    accent: "UK",
    style: "Crisp British tutor. Great for practice questions.",
    line: "Your turn. If a car doubles its speed, what happens to its kinetic energy?",
    hues: ["#4ee6a6", "#36c8ff"],
  },
  {
    id: "am_michael",
    name: "Michael",
    accent: "US",
    style: "Calm, low, unhurried. Easy to listen to for a long time.",
    line: "Take a breath. Integration is just adding up very thin slices.",
    hues: ["#b69cff", "#5c7cff"],
  },
  {
    id: "af_nicole",
    name: "Nicole",
    accent: "US",
    style: "Soft and close, almost a whisper. Good for late-night study.",
    line: "Quietly now. The square root of two cannot be written as a fraction.",
    hues: ["#ff9ec4", "#b69cff"],
  },
  {
    id: "bm_fable",
    name: "Fable",
    accent: "UK",
    style: "A storyteller. Makes the history of an idea come alive.",
    line: "Long ago, Euclid proved there is no largest prime. Here is how he did it.",
    hues: ["#ffc56e", "#ff8a65"],
  },
  {
    id: "am_fenrir",
    name: "Fenrir",
    accent: "US",
    style: "Deep and confident. Gives formulas some weight.",
    line: "Force equals mass times acceleration. Remember it.",
    hues: ["#6b7186", "#5cd3ff"],
  },
  {
    id: "af_sky",
    name: "Sky",
    accent: "US",
    style: "Light and friendly. A gentle start for beginners.",
    line: "Fractions are just sharing. Let's share a pizza into eighths.",
    hues: ["#85dfff", "#4ee6a6"],
  },
  {
    id: "bf_isabella",
    name: "Isabella",
    accent: "UK",
    style: "Polished and precise. Suits statistics and definitions.",
    line: "A p-value is not the probability that the hypothesis is true.",
    hues: ["#ff7ad9", "#7c6cff"],
  },
];

export const characterById = new Map(CHARACTERS.map((c) => [c.id, c]));

export function characterName(id: string): string {
  return characterById.get(id)?.name ?? id;
}

# Contributing

Thanks for helping make this book better. Accuracy and clarity come first.

## Getting set up

```bash
npm install
npm run dev
```

Before opening a pull request, run:

```bash
npm run lint && npm test && npm run build
```

The same checks run automatically on every pull request.

## Fixing or improving a chapter

Chapters live in `src/data/`:

| File | Contents |
|---|---|
| `math-foundations.ts` | Arithmetic through probability |
| `math-higher.ts` | Discrete math through the frontier |
| `sequences.ts` | Sequences (with the interactive sequence studio) |
| `sciences.ts` | Physics, chemistry, and biology chapters |
| `laws.ts` | The named laws of physics |

Each chapter follows the `Chapter` type in `src/data/types.ts`: a summary, body paragraphs, key ideas,
formulas, worked examples, practice problems, and common mistakes.

**Writing LaTeX:** wrap formulas in the `L` tag so backslashes are written once:

```ts
tex: L`\frac{a}{b}+\frac{c}{d}=\frac{ad+bc}{bd}`,
```

List every symbol in the formula's `symbols` array — readers see these when they hover the equation.

## Adding a chapter

1. Add the chapter object to the right file in `src/data/` (give it a unique `slug`).
2. Add the slug to the `order` list in `src/data/index.ts` — and to a reading path in `paths` if it fits one.
3. Run `npm run dev` and open `/read/<your-slug>`.

## Adding a calculator

Calculators live in `src/lib/calc/<subject>-tools.ts`. Each is a `Tool` (see `src/lib/calc/types.ts`)
with input `fields` and a `run` function that returns result `lines` (and optional `steps`) or an `error`.
Add a known-answer check to `tests/calc-check.ts` for anything non-trivial.

## Style

- Plain, precise language. Explain *why*, not just *what*.
- Use SI units and state them.
- Code is formatted with Prettier (`npm run format`).

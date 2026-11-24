import type { Chapter } from "./types.ts";
import { L } from "./types.ts";

export const sequencesChapter: Chapter = {
  slug: "sequences",
  volume: "mathematics",
  level: "intermediate",
  title: "Sequences",
  minutes: 30,
  summary:
    "A sequence is a list ruled by a pattern: a constant difference, a constant ratio, or a rule that builds the next term from the ones before it. Fibonacci is the famous case of that last kind.",
  prereqs: ["algebra", "functions"],
  ideas: [
    "Name the index. aₙ is the nth term, and the difference between aₙ and aₙ₊₁ is where off-by-one errors hide.",
    "An arithmetic sequence adds a constant. A geometric sequence multiplies by a constant.",
    "Fibonacci adds the previous two terms. The ratios of neighbors settle on the golden ratio, but no finite ratio equals it.",
    "A sum of terms is a new sequence. The formulas for those sums fail in stated special cases: ratio 1, and an infinite sum with ratio outside (−1, 1).",
  ],
  body: [
    "A sequence is a function whose inputs are the positive integers, or sometimes the nonnegative integers. Writing a₁, a₂, a₃, … is the same information as writing a formula aₙ, when a formula exists. Arithmetic sequences are the straight lines of this world: each step adds the same difference d, so aₙ = a + (n − 1)d. Geometric sequences are the exponential functions sampled at integers: each step multiplies by the same ratio r, so aₙ = a rⁿ⁻¹. The first term is a₁, not a₀, in the formulas used here. Say which convention you are using before you compute the tenth term.",
    "The Fibonacci sequence is defined by a recurrence, not by a multiplication table. This book takes F₀ = 0, F₁ = 1, and Fₙ = Fₙ₋₁ + Fₙ₋₂. The list that people recite, 1, 1, 2, 3, 5, 8, 13, …, is F₁ onward. The Lucas sequence obeys the same addition rule with a different start, L₀ = 2, L₁ = 1, so it runs 2, 1, 3, 4, 7, 11, 18, …. Neighboring ratios in both sequences approach the golden ratio φ = (1 + √5)/2 ≈ 1.61803, and they approach it from opposite sides in turn. Binet’s formula writes Fₙ with powers of φ and of its conjugate ψ = (1 − √5)/2. The ψ term is smaller than 1/2, so Fₙ is the integer closest to φⁿ / √5.",
    "Other lists you should recognize on sight are built the same way. The triangular numbers 1, 3, 6, 10, 15, … are the partial sums of the positive integers, and Tₙ = n(n + 1)/2. The squares are n². The powers of two, 1, 2, 4, 8, …, are a geometric sequence with ratio 2. Factorials, 1, 2, 6, 24, 120, …, multiply by the next integer rather than by a constant. The harmonic sequence is 1, 1/2, 1/3, 1/4, …. Its partial sums, the harmonic numbers, grow about as fast as the natural logarithm and never settle to a finite limit.",
    "The model below draws the terms, the running sum, and — for Fibonacci — the squares whose sides are the terms, with a quarter-circle in each square. The sum formulas are proved by induction, which the discrete chapter treats as a method. A limit of a sequence, in the sense of getting and staying within ε, is the subject of real analysis. Hover any symbol in a formula here, and in the rest of the book, to read what it stands for in that formula. The same letter is not the same object in every chapter.",
  ],
  formulas: [
    {
      id: "seq-arith-term",
      name: "Arithmetic term",
      tex: L`a_n=a+(n-1)d`,
      meaning: "Start at a and add d, exactly n − 1 times, to reach the nth term.",
      symbols: [
        { sym: "a", means: "First term, a₁" },
        { sym: "d", means: "Common difference, aₙ₊₁ − aₙ" },
        { sym: "n", means: "Index of the term, starting at 1" },
      ],
    },
    {
      id: "seq-arith-sum",
      name: "Arithmetic sum",
      tex: L`S_n=\frac{n}{2}\bigl(2a+(n-1)d\bigr)=\frac{n}{2}(a_1+a_n)`,
      meaning:
        "Add the first and last term, multiply by the number of terms, and divide by 2. Pairing the ends is why.",
      symbols: [
        { sym: "S_n", means: "Sum of the first n terms" },
        { sym: "a_1", means: "First term" },
        { sym: "a_n", means: "Last term included in the sum" },
      ],
    },
    {
      id: "seq-geom-term",
      name: "Geometric term",
      tex: L`a_n=ar^{n-1}`,
      meaning: "Start at a and multiply by r, exactly n − 1 times.",
      symbols: [
        { sym: "a", means: "First term" },
        { sym: "r", means: "Common ratio, aₙ₊₁ / aₙ, provided aₙ ≠ 0" },
      ],
    },
    {
      id: "seq-geom-sum",
      name: "Geometric sum",
      tex: L`S_n=a\frac{1-r^n}{1-r}\quad(r\neq 1)`,
      meaning:
        "The closed sum of the first n terms. If r = 1, every term equals a and the sum is na.",
      symbols: [
        { sym: "S_n", means: "Sum of the first n terms" },
        { sym: "r", means: "Common ratio, not 1 in this formula" },
      ],
    },
    {
      id: "seq-geom-inf",
      name: "Infinite geometric sum",
      tex: L`S=\frac{a}{1-r}\quad(|r|<1)`,
      meaning:
        "Only when the ratio is strictly inside −1 and 1 do the terms shrink to 0 fast enough for the infinite sum to be a finite number.",
      symbols: [
        { sym: "S", means: "Sum of every term, not a partial sum" },
        { sym: "a", means: "First term" },
        { sym: "r", means: "Common ratio, with absolute value less than 1" },
      ],
    },
    {
      id: "seq-fib",
      name: "Fibonacci recurrence",
      tex: L`F_n=F_{n-1}+F_{n-2},\quad F_0=0,\ F_1=1`,
      meaning:
        "Each term is the sum of the two before it. F₂ = 1, F₃ = 2, F₄ = 3, F₅ = 5, F₆ = 8, F₇ = 13.",
      symbols: [
        { sym: "F_n", means: "The nth Fibonacci number" },
        { sym: "F_0", means: "The term before the recited list; it is 0" },
        { sym: "F_1", means: "The first 1 in 1, 1, 2, 3, 5, …" },
      ],
    },
    {
      id: "seq-binet",
      name: "Binet’s formula",
      tex: L`F_n=\frac{\varphi^n-\psi^n}{\sqrt{5}},\quad \varphi=\frac{1+\sqrt{5}}{2},\ \psi=\frac{1-\sqrt{5}}{2}`,
      meaning: "An exact closed form. Because |ψ| < 1, Fₙ is the integer nearest to φⁿ / √5.",
      symbols: [
        { sym: "φ", means: "Golden ratio, (1 + √5)/2 ≈ 1.61803" },
        { sym: "ψ", means: "The other root of x² − x − 1 = 0, about −0.61803" },
        { sym: "F_n", means: "The nth Fibonacci number, with F₀ = 0 and F₁ = 1" },
      ],
    },
    {
      id: "seq-fib-sum",
      name: "Sum of Fibonacci numbers",
      tex: L`\sum_{k=1}^{n} F_k=F_{n+2}-1`,
      meaning:
        "The sum of the recited terms through Fₙ is the term two steps past the end, minus 1.",
      symbols: [
        { sym: "F_k", means: "Fibonacci number at index k" },
        { sym: "n", means: "How many terms, starting at F₁" },
      ],
    },
    {
      id: "seq-phi",
      name: "Golden-ratio limit",
      tex: L`\lim_{n\to\infty}\frac{F_{n+1}}{F_n}=\varphi`,
      meaning:
        "The ratio of neighbors gets arbitrarily close to φ and never lands on it for a finite n.",
      symbols: [
        { sym: "F_{n+1}/F_n", means: "Ratio of two consecutive Fibonacci numbers" },
        { sym: "φ", means: "Golden ratio, (1 + √5)/2" },
      ],
    },
    {
      id: "seq-triangular",
      name: "Triangular numbers",
      tex: L`T_n=\frac{n(n+1)}{2}`,
      meaning: "The sum of the first n positive integers. T₁ = 1, T₂ = 3, T₃ = 6, T₄ = 10.",
      symbols: [
        { sym: "T_n", means: "The nth triangular number" },
        { sym: "n", means: "How many integers are added, from 1 through n" },
      ],
    },
    {
      id: "seq-cassini",
      name: "Cassini’s identity",
      tex: L`F_{n+1}F_{n-1}-F_n^2=(-1)^n`,
      meaning:
        "A check on any three consecutive Fibonacci numbers, for n ≥ 1. At n = 1 it uses F₀ = 0.",
      symbols: [
        { sym: "F_n", means: "Fibonacci number at index n" },
        { sym: "(-1)^n", means: "Plus one when n is even, minus one when n is odd" },
      ],
    },
  ],
  examples: [
    {
      title: "The tenth arithmetic term",
      prompt: "The sequence 5, 8, 11, 14, … Find the 10th term.",
      steps: [
        "The first term is a = 5 and the difference is d = 3.",
        "The 10th term adds the difference 9 times: 5 + 9 × 3.",
        "5 + 27 = 32.",
      ],
      answer: "32. The index starts at 1, so the exponent on the step count is n − 1, not n.",
    },
    {
      title: "Sum the same ten terms",
      prompt: "Add the first 10 terms of 5, 8, 11, …",
      steps: [
        "The 10th term is 32, from the previous example.",
        "S₁₀ = 10/2 × (first + last) = 5 × (5 + 32).",
        "5 × 37 = 185.",
      ],
      answer: "185.",
    },
    {
      title: "A geometric sixth term",
      prompt: "Find the 6th term of 3, 6, 12, 24, …",
      steps: [
        "a = 3 and r = 2.",
        "The 6th term multiplies by 2 five times: 3 × 2⁵.",
        "2⁵ = 32, and 3 × 32 = 96.",
      ],
      answer: "96.",
    },
    {
      title: "Sum those six terms",
      prompt: "Add the first 6 terms of 3, 6, 12, 24, 48, 96.",
      steps: [
        "r = 2, which is not 1, so S₆ = 3 × (1 − 2⁶) / (1 − 2).",
        "2⁶ = 64, so the numerator is 3 × (1 − 64) = −189 and the denominator is −1.",
        "S₆ = 189. Adding by hand: 3 + 6 + 12 + 24 + 48 + 96 = 189.",
      ],
      answer: "189.",
    },
    {
      title: "An infinite shrinking sum",
      prompt: "Sum 12 + 6 + 3 + 3/2 + 3/4 + …",
      steps: [
        "a = 12 and r = 1/2. The absolute value of r is less than 1, so the infinite sum exists.",
        "S = 12 / (1 − 1/2) = 12 / (1/2).",
        "12 × 2 = 24.",
      ],
      answer: "24. The same formula is false for 12 + 24 + 48 + …, because that ratio is 2.",
    },
    {
      title: "Build F₁₀ from the rule",
      prompt: "Compute the Fibonacci number F₁₀ from F₀ = 0 and F₁ = 1.",
      steps: [
        "F₂ = 0 + 1 = 1.",
        "F₃ = 1 + 1 = 2, F₄ = 2 + 1 = 3, F₅ = 3 + 2 = 5, F₆ = 5 + 3 = 8.",
        "F₇ = 13, F₈ = 21, F₉ = 34, F₁₀ = 34 + 21 = 55.",
      ],
      answer: "55.",
    },
    {
      title: "Binet, checked against 55",
      prompt: "Use the nearest-integer form of Binet’s formula to recover F₁₀.",
      steps: [
        "φ = (1 + √5)/2 ≈ 1.618034.",
        "φ¹⁰ / √5 ≈ 55.0036.",
        "The nearest integer is 55, which matches the recurrence.",
      ],
      answer: "55. The full formula with ψ¹⁰ makes the value exact, not merely nearby.",
    },
    {
      title: "Add the first ten Fibonacci numbers",
      prompt: "Sum F₁ through F₁₀.",
      steps: [
        "The identity says the sum is F₁₂ − 1.",
        "F₁₁ = 55 + 34 = 89, and F₁₂ = 89 + 55 = 144.",
        "144 − 1 = 143.",
      ],
      answer:
        "143. Direct addition of 1 + 1 + 2 + 3 + 5 + 8 + 13 + 21 + 34 + 55 gives the same 143.",
    },
    {
      title: "How close is 13/8 to φ?",
      prompt: "Compare F₇ / F₆ with the golden ratio.",
      steps: [
        "F₇ = 13 and F₆ = 8, so the ratio is 13/8 = 1.625.",
        "φ ≈ 1.618034.",
        "The difference is about 0.00697. The next ratio, 21/13 ≈ 1.61538, falls short of φ by a similar amount.",
      ],
      answer: "13/8 is about 0.007 above φ. The ratios alternate around φ and close in.",
    },
    {
      title: "The hundredth triangular number",
      prompt: "Find the sum of the integers from 1 through 100.",
      steps: [
        "This is T₁₀₀ = 100 × 101 / 2.",
        "100/2 = 50, and 50 × 101 = 5050.",
        "The arithmetic-sum formula gives the same number: 100/2 × (1 + 100) = 5050.",
      ],
      answer: "5050.",
    },
    {
      title: "Cassini at n = 6",
      prompt: "Check F₇ F₅ − F₆².",
      steps: [
        "F₅ = 5, F₆ = 8, F₇ = 13.",
        "13 × 5 − 8² = 65 − 64 = 1.",
        "n = 6 is even, and (−1)⁶ = 1.",
      ],
      answer: "1, which equals (−1)⁶. At n = 5 the same identity gives 8 × 3 − 5² = −1.",
    },
  ],
  practice: [
    {
      q: "The sequence 3, 8, 13, 18, … is arithmetic. Find the 20th term and the sum of the first 20 terms.",
      a: "d = 5 and a = 3, so a₂₀ = 3 + 19 × 5 = 98. S₂₀ = 20/2 × (3 + 98) = 1010.",
    },
    {
      q: "Sum 1 + 1/3 + 1/9 + 1/27 + … to infinity.",
      a: "a = 1 and r = 1/3, and |r| < 1, so S = 1 / (1 − 1/3) = 3/2.",
    },
    {
      q: "F₁₂ is 144. What is F₁₃, and what is the sum of F₁ through F₁₂?",
      a: "F₁₁ = 89, so F₁₃ = 144 + 89 = 233. The sum through F₁₂ is F₁₄ − 1. F₁₄ = 233 + 144 = 377, and 377 − 1 = 376.",
    },
  ],
  pitfalls: [
    "Using n instead of n − 1 in aₙ = a + (n − 1)d or aₙ = a rⁿ⁻¹. The first term must come back out when n = 1.",
    "Dividing by 1 − r when r = 1. The geometric-sum formula does not apply; the sum is na.",
    "Summing an infinite geometric series whose ratio is 1 or larger, or equal to −1. The terms do not shrink to 0, so there is no finite sum.",
    "Forgetting F₀ = 0, or starting the recited list at F₀. F₅ is 5 either way only if you know which index you assigned to which 1.",
    "Treating a Fibonacci ratio as equal to φ. 13/8 is close. It is not φ, and φ is irrational, so no ratio of integers equals it.",
  ],
};

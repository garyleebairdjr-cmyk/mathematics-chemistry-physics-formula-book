import type { Chapter } from "./types.ts";
import { L } from "./types.ts";

export const foundations: Chapter[] = [
  {
    slug: "arithmetic",
    volume: "mathematics",
    level: "foundational",
    title: "Arithmetic and number sense",
    minutes: 25,
    summary:
      "Numbers, the four operations, fractions, percent, factors, and the idea that every integer has a unique prime recipe.",
    prereqs: [],
    ideas: [
      "Place value is what makes a digit mean ten, a hundred, or a tenth.",
      "Fractions and decimals name the same quantities; percent is a fraction with denominator 100.",
      "Every integer greater than 1 factors into primes in exactly one way, up to order.",
      "The Euclidean algorithm finds a greatest common divisor without listing factors.",
    ],
    body: [
      "Arithmetic is not a pile of facts to memorize. It is the study of quantity: how numbers combine, and which properties survive the combining. The commutative law says a + b = b + a and a × b = b × a. The associative law says grouping does not matter for a single operation. The distributive law is the one that actually mixes them: a(b + c) = ab + ac. Almost every later simplification is one of these three laws in disguise.",
      "A fraction a/b means a pieces of size 1/b, with b not zero. Two fractions name the same number when their cross products agree: a/b = c/d exactly when ad = bc. Adding them needs a common size of piece, which is why the general rule uses the products ad and bc over the common denominator bd. You can always cancel a common factor afterward; cancelling before multiplying is the same fact, used earlier.",
      "A prime is an integer greater than 1 whose only positive divisors are 1 and itself. The fundamental theorem of arithmetic says the prime factorization of an integer is unique. That uniqueness is why greatest common divisors and least common multiples can be read off from the smaller and larger powers of each prime. Euclid’s algorithm is faster: gcd(a, b) = gcd(b, a mod b), and it ends when the remainder is 0.",
    ],
    formulas: [
      {
        id: "fraction-add",
        name: "Sum of fractions",
        tex: L`\frac{a}{b}+\frac{c}{d}=\frac{ad+bc}{bd}`,
        meaning:
          "Add by writing both fractions over a common denominator, then add the numerators.",
        symbols: [{ sym: "a/b, c/d", means: "Fractions, with b and d not zero" }],
      },
      {
        id: "percent",
        name: "Percent of a whole",
        tex: L`\text{part}=\frac{\text{percent}}{100}\times\text{whole}`,
        meaning: "Percent means per hundred. A rate of p percent is the fraction p/100.",
        symbols: [
          { sym: "part", means: "The piece you want" },
          { sym: "whole", means: "The reference amount" },
        ],
      },
      {
        id: "euclid",
        name: "Euclidean algorithm",
        tex: L`\gcd(a,b)=\gcd(b,\, a \bmod b)`,
        meaning:
          "Replace the larger number by the remainder until the remainder is zero. The last nonzero remainder is the greatest common divisor.",
        symbols: [{ sym: "a mod b", means: "Remainder when a is divided by b" }],
      },
      {
        id: "sci",
        name: "Scientific notation",
        tex: L`n=m\times 10^{k},\quad 1\le |m|<10`,
        meaning:
          "Write a number as a significand between 1 and 10 times a power of ten. Adding the exponents multiplies the numbers.",
        symbols: [
          { sym: "m", means: "Significand" },
          { sym: "k", means: "Integer exponent; negative means a small number" },
        ],
      },
    ],
    examples: [
      {
        title: "Add unlike fractions",
        prompt: "Compute 3/4 + 5/6.",
        steps: [
          "Cross-multiply for the numerators: 3×6 = 18 and 5×4 = 20.",
          "Common denominator: 4×6 = 24.",
          "Sum: (18 + 20)/24 = 38/24.",
          "Cancel a factor of 2: 19/12.",
        ],
        answer: "19/12, which is 1 and 7/12.",
      },
      {
        title: "A discount is a multiplication",
        prompt: "A coat costs $80 and is reduced by 15%. What do you pay?",
        steps: [
          "15% of 80 is 0.15 × 80 = 12.",
          "Paying 15% less means paying 85% of the price: 0.85 × 80 = 68.",
          "Either route is the same: 80 − 12 = 68.",
        ],
        answer: "You pay 68.",
      },
      {
        title: "Euclid, in four lines",
        prompt: "Find gcd(48, 18).",
        steps: [
          "48 = 2×18 + 12.",
          "18 = 1×12 + 6.",
          "12 = 2×6 + 0.",
          "The last nonzero remainder is the greatest common divisor.",
        ],
        answer:
          "gcd(48, 18) = 6. Check: 48 = 8×6 and 18 = 3×6, and no larger integer divides both.",
      },
      {
        title: "Multiply in scientific notation",
        prompt: "Compute (3.2 × 10⁴) × (5.0 × 10⁻²).",
        steps: [
          "Multiply the significands: 3.2 × 5.0 = 16.",
          "Add the exponents: 4 + (−2) = 2.",
          "16 × 10² is not yet in scientific form, because 16 is at least 10.",
          "16 = 1.6 × 10¹, so the product is 1.6 × 10³.",
        ],
        answer: "1.6 × 10³, which is 1600.",
      },
    ],
    practice: [
      {
        q: "Use Euclid to find gcd(252, 198).",
        a: "252 = 1×198 + 54, 198 = 3×54 + 36, 54 = 1×36 + 18, 36 = 2×18 + 0. The gcd is 18.",
      },
      {
        q: "Write 0.00047 in scientific notation.",
        a: "4.7 × 10^(−4). Move the decimal point four places to the right to land between 1 and 10.",
      },
    ],
    pitfalls: [
      "Adding numerators and denominators separately: 1/2 + 1/3 is not 2/5.",
      "A percent of a percent multiplies. A 10% reduction followed by a 10% reduction is not a 20% reduction; it is 0.9 × 0.9 = 0.81, a 19% reduction.",
      "Division by zero is undefined. A denominator is never a placeholder you can ignore.",
    ],
  },
  {
    slug: "algebra",
    volume: "mathematics",
    level: "foundational",
    title: "Algebra",
    minutes: 35,
    summary:
      "Letters stand for numbers. Equations are balances. The quadratic formula closes the story of every second-degree polynomial.",
    prereqs: ["arithmetic"],
    ideas: [
      "Solving an equation means producing an equivalent equation until the unknown stands alone.",
      "A linear equation has at most one solution. A line is its graph.",
      "Every quadratic ax² + bx + c factors in the complexes, and the quadratic formula finds the roots.",
      "Logarithms turn products into sums because they are the inverses of exponential functions.",
    ],
    body: [
      "Algebra begins the moment a symbol is allowed to stand for a number you do not yet know. The rules do not change: you may add the same thing to both sides, multiply both sides by the same nonzero number, and expand with the distributive law. What changes is the goal. You are rearranging until the unknown is isolated, and every step is reversible so you have not added or lost solutions.",
      "A linear equation ax + b = 0, with a ≠ 0, has the single solution x = −b/a. Two such equations, in two unknowns, usually meet at one point. They fail to meet when the lines are parallel (same slope, different intercept) and they coincide when the equations are scalar multiples of each other. That trichotomy — one solution, none, or infinitely many — is the preview of linear algebra.",
      "A quadratic ax² + bx + c = 0 is the first equation whose solution is not a finite combination of the coefficients with plus, minus, times, and divide. Completing the square produces the quadratic formula. The discriminant D = b² − 4ac tells the character of the roots over the reals: two distinct when D > 0, one repeated when D = 0, and none when D < 0. Over the complex numbers those last two roots exist and are conjugates.",
    ],
    formulas: [
      {
        id: "linear-solve",
        name: "Linear equation",
        tex: L`ax+b=0 \implies x=-\frac{b}{a}\quad(a\neq 0)`,
        meaning: "One step: move the constant, then divide by the coefficient of x.",
        symbols: [
          { sym: "a", means: "Coefficient of the unknown, not zero" },
          { sym: "b", means: "Constant term" },
        ],
      },
      {
        id: "slope",
        name: "Slope of a line",
        tex: L`m=\frac{y_2-y_1}{x_2-x_1}`,
        meaning: "Rise over run. Positive slope climbs as x grows; zero slope is horizontal.",
        symbols: [{ sym: "(x₁, y₁), (x₂, y₂)", means: "Two distinct points on the line" }],
      },
      {
        id: "quadratic",
        name: "Quadratic formula",
        tex: L`x=\frac{-b\pm\sqrt{b^2-4ac}}{2a}`,
        meaning:
          "The two roots of ax² + bx + c = 0. The expression under the radical is the discriminant.",
        symbols: [
          { sym: "a, b, c", means: "Coefficients, a ≠ 0" },
          { sym: "±", means: "Compute both the plus and the minus" },
        ],
      },
      {
        id: "log-product",
        name: "Logarithm of a product",
        tex: L`\log_b(xy)=\log_b x+\log_b y`,
        meaning: "A logarithm converts multiplication into addition. It is the inverse of bˣ.",
        symbols: [
          { sym: "b", means: "Base, positive and not 1" },
          { sym: "x, y", means: "Positive real numbers" },
        ],
      },
      {
        id: "binomial-square",
        name: "Square of a sum",
        tex: L`(a+b)^2=a^2+2ab+b^2`,
        meaning:
          "The middle term is easy to forget and is the whole reason completing the square works.",
        symbols: [{ sym: "2ab", means: "Twice the product of the two terms" }],
      },
    ],
    examples: [
      {
        title: "Two roots, both integers",
        prompt: "Solve x² − 5x + 6 = 0.",
        steps: [
          "Here a = 1, b = −5, c = 6.",
          "Discriminant: (−5)² − 4(1)(6) = 25 − 24 = 1.",
          "Roots: (5 ± 1) / 2.",
          "Plus gives 6/2 = 3. Minus gives 4/2 = 2.",
        ],
        answer: "x = 3 or x = 2. Check: (x − 2)(x − 3) = x² − 5x + 6.",
      },
      {
        title: "A logarithm undoes a power",
        prompt: "Solve 2ˣ = 40. Leave the answer as a logarithm, then approximate.",
        steps: [
          "Apply log base 2, or any common log, to both sides.",
          "x = log₂(40) = ln 40 / ln 2.",
          "ln 40 ≈ 3.689 and ln 2 ≈ 0.693, so x ≈ 5.32.",
          "Check: 2⁵ = 32 and 2⁶ = 64, so a value a little above 5 is reasonable.",
        ],
        answer: "x = ln 40 / ln 2 ≈ 5.32.",
      },
      {
        title: "A linear equation",
        prompt: "Solve 4x − 7 = 9.",
        steps: [
          "Add 7 to both sides: 4x = 16.",
          "Divide by 4: x = 4.",
          "Check: 4×4 − 7 = 16 − 7 = 9.",
        ],
        answer: "x = 4. In the form ax + b = 0 this was 4x − 16 = 0, so x = 16/4.",
      },
      {
        title: "Slope between two points",
        prompt: "A line passes through (1, 2) and (4, 8). What is its slope, and does it rise?",
        steps: [
          "m = (8 − 2) / (4 − 1) = 6/3.",
          "m = 2.",
          "The slope is positive, so the line rises as x grows: two units up for each unit to the right.",
        ],
        answer: "Slope 2.",
      },
      {
        title: "Do not drop the cross term",
        prompt: "Expand (x + 3)².",
        steps: [
          "(a + b)² = a² + 2ab + b² with a = x and b = 3.",
          "x² + 2·x·3 + 3².",
          "x² + 6x + 9.",
        ],
        answer: "x² + 6x + 9. It is not x² + 9.",
      },
    ],
    practice: [
      {
        q: "Solve 3(x − 2) = 2x + 5.",
        a: "3x − 6 = 2x + 5, so x = 11. Check: 3(9) = 27 and 22 + 5 = 27.",
      },
      {
        q: "For which c does x² + 2x + c = 0 have exactly one real root?",
        a: "Discriminant 4 − 4c = 0, so c = 1. The root is x = −1, a repeated root.",
      },
    ],
    pitfalls: [
      "Dividing both sides by an expression that might be zero can delete a root. Factor instead.",
      "√(b² − 4ac) is a single nonnegative number. The ± outside it is what produces two roots.",
      "(a + b)² is not a² + b². The cross term 2ab is not optional.",
    ],
  },
  {
    slug: "geometry",
    volume: "mathematics",
    level: "foundational",
    title: "Geometry",
    minutes: 30,
    summary:
      "Shape, measurement, and the first real proofs: congruence, similarity, and the Pythagorean theorem.",
    prereqs: ["algebra"],
    ideas: [
      "Congruent figures match by rigid motion. Similar figures match up to a uniform scale.",
      "In a right triangle, the square on the hypotenuse equals the sum of the squares on the legs.",
      "Area scales with the square of length; volume scales with the cube.",
      "A circle is the set of points at a fixed distance from a center, and π is the constant in both its circumference and its area.",
    ],
    body: [
      "Euclid’s geometry is a theory of space built from a few postulates. You do not need the whole axiomatic machine to use it, but you should feel the difference between a measurement and a reason. Two triangles are congruent when a correspondence of vertices makes corresponding sides and angles equal — SAS, ASA, SSS, and the right-triangle case HL are the standard warrants. Similarity is the same idea after a scale factor: corresponding angles equal, and corresponding sides proportional.",
      "The Pythagorean theorem is the workhorse. If a right angle sits between legs a and b, the hypotenuse c satisfies a² + b² = c². The converse is also true and is how you test a triangle for a right angle. Scaling matters more than people expect: if every length in a figure is multiplied by k, areas multiply by k² and volumes by k³. Doubling a recipe of linear size multiplies the paint by four and the clay by eight.",
      "Circles introduce π, the ratio of circumference to diameter, the same number for every circle. Area is πr², not πd, and not 2πr. A sphere’s surface is 4πr² and its volume is (4/3)πr³. Those two formulas are consistent with the scaling rule: surface is an area, volume is a volume.",
    ],
    formulas: [
      {
        id: "pythagoras",
        name: "Pythagorean theorem",
        tex: L`a^2+b^2=c^2`,
        meaning: "For a right triangle only. c is the side opposite the right angle.",
        symbols: [
          { sym: "a, b", means: "Legs" },
          { sym: "c", means: "Hypotenuse" },
        ],
      },
      {
        id: "triangle-area",
        name: "Area of a triangle",
        tex: L`A=\frac12 bh`,
        meaning:
          "Any side may be the base. The height is the perpendicular distance from the opposite vertex to the line of that base.",
        symbols: [
          { sym: "b", means: "Base length" },
          { sym: "h", means: "Corresponding height" },
        ],
      },
      {
        id: "circle",
        name: "Circle",
        tex: L`C=2\pi r,\qquad A=\pi r^2`,
        meaning: "Circumference grows like the radius; area grows like the radius squared.",
        symbols: [
          { sym: "r", means: "Radius" },
          { sym: "π", means: "About 3.14159, exactly the circle constant" },
        ],
      },
      {
        id: "sphere",
        name: "Sphere",
        tex: L`V=\frac43\pi r^3,\qquad S=4\pi r^2`,
        meaning: "Volume and surface area. Notice S = dV/dr, a preview of calculus.",
        symbols: [
          { sym: "V", means: "Volume" },
          { sym: "S", means: "Surface area" },
        ],
      },
      {
        id: "similar",
        name: "Similar triangles",
        tex: L`\frac{a_1}{a_2}=\frac{b_1}{b_2}=\frac{c_1}{c_2}=k`,
        meaning: "Corresponding sides stand in one common ratio k. Corresponding angles are equal.",
        symbols: [{ sym: "k", means: "Scale factor" }],
      },
    ],
    examples: [
      {
        title: "A ladder against a wall",
        prompt:
          "A 5 m ladder rests against a wall, with its foot 3 m from the wall. How high does it reach?",
        steps: [
          "The wall is perpendicular to the ground, so the triangle is right-angled.",
          "3² + h² = 5².",
          "h² = 25 − 9 = 16.",
          "h = 4, taking the positive length.",
        ],
        answer: "4 meters. This is the 3–4–5 triangle.",
      },
      {
        title: "Scale the area, not the length",
        prompt:
          "A circular patio of radius 2 m is replaced by one of radius 3 m. By what factor does the area grow?",
        steps: [
          "Area is πr², so the ratio is (π·3²)/(π·2²) = 9/4.",
          "The linear scale factor is 3/2, and (3/2)² = 9/4.",
          "Numerically, about 12.57 m² becomes about 28.27 m².",
        ],
        answer: "The area grows by a factor of 9/4 = 2.25, not by 3/2.",
      },
      {
        title: "Area of a triangle",
        prompt: "A triangle has base 10 and corresponding height 4. What is its area?",
        steps: [
          "A = (1/2) × base × height.",
          "(1/2) × 10 × 4 = 20.",
          "The height must be perpendicular to the base you chose. A slanted side of length 4 would not do.",
        ],
        answer: "20 square units.",
      },
      {
        title: "Volume of a sphere",
        prompt: "A sphere has radius 3. Find its volume and its surface area.",
        steps: [
          "V = (4/3)πr³ = (4/3)π·27 = 36π.",
          "S = 4πr² = 4π·9 = 36π.",
          "The numbers match, the meanings do not: one is volume, one is area. Numerically V ≈ 113.1 and S ≈ 113.1 only because r = 3 makes r³/r² = r cancel the extra factors.",
        ],
        answer:
          "Volume 36π (about 113), surface area 36π (about 113). Same number here, different units.",
      },
      {
        title: "A similar copy",
        prompt:
          "A triangle has sides 3, 4, and 5. A similar triangle is twice as large in every length. What are its sides, and by what factor did the area grow?",
        steps: [
          "Multiply each side by the scale factor 2: 6, 8, and 10.",
          "It is still a right triangle, because (3, 4, 5) was and similarity preserves angles.",
          "Area scales by k² = 4.",
        ],
        answer: "Sides 6, 8, 10. The area is 4 times the original, not twice.",
      },
    ],
    practice: [
      {
        q: "A triangle has sides 7, 8, and 10. Is the angle opposite 10 a right angle?",
        a: "7² + 8² = 113 and 10² = 100. They are not equal, so the triangle is not right-angled. Because 7² + 8² > 10², the angle opposite the side of length 10 is acute.",
      },
      {
        q: "Similar triangles have a scale factor of 3. The smaller has area 6. What is the larger area?",
        a: "Areas scale by 3² = 9, so the larger area is 54.",
      },
    ],
    pitfalls: [
      "The Pythagorean theorem needs a right angle. On an acute or obtuse triangle it is false; the law of cosines is the replacement.",
      "Height must be perpendicular to the chosen base. A slanted side is not automatically the height.",
      "Doubling the radius doubles the circumference but quadruples the area.",
    ],
  },
  {
    slug: "trigonometry",
    volume: "mathematics",
    level: "foundational",
    title: "Trigonometry",
    minutes: 35,
    summary:
      "Sine and cosine as coordinates on the unit circle, the identities that follow, and the laws that solve any triangle.",
    prereqs: ["geometry", "algebra"],
    ideas: [
      "On the unit circle, cos θ is the x-coordinate and sin θ is the y-coordinate of the point at angle θ.",
      "The identity sin²θ + cos²θ = 1 is Pythagoras in that circle.",
      "Right triangles give the first definitions; the laws of sines and cosines extend them to every triangle.",
      "Angle sum formulas are how you turn a shift of angle into algebra.",
    ],
    body: [
      "In a right triangle, sin θ is opposite over hypotenuse, cos θ is adjacent over hypotenuse, and tan θ is opposite over adjacent. Those ratios depend only on the angle, not on the size of the triangle, which is why they are functions of θ alone. The unit-circle definition keeps the same values and extends them to every angle, including those that do not fit inside a right triangle: negative angles, reflex angles, and angles beyond a full turn.",
      "Once sine and cosine are coordinates, identities are geometry. The point (cos θ, sin θ) lies on x² + y² = 1, so sin²θ + cos²θ = 1. Dividing by cos²θ produces the companion 1 + tan²θ = sec²θ. Adding angles corresponds to multiplying complex numbers on the unit circle, or to a rotation matrix; either route yields sin(α + β) = sin α cos β + cos α sin β and cos(α + β) = cos α cos β − sin α sin β.",
      "For a general triangle, label sides a, b, c opposite angles A, B, C. The law of sines says the sides are proportional to the sines of the opposite angles, with common ratio equal to the diameter of the circumscribed circle. The law of cosines is the Pythagorean theorem with a correction −2bc cos A. Use sines when you know an angle and its opposite side; use cosines when you know three sides, or two sides and the included angle.",
    ],
    formulas: [
      {
        id: "sohcahtoa",
        name: "Right-triangle ratios",
        tex: L`\sin\theta=\frac{\mathrm{opp}}{\mathrm{hyp}},\ \cos\theta=\frac{\mathrm{adj}}{\mathrm{hyp}},\ \tan\theta=\frac{\mathrm{opp}}{\mathrm{adj}}`,
        meaning:
          "Definitions in a right triangle. The angle θ is one of the acute angles, not the right angle.",
        symbols: [
          { sym: "opp, adj", means: "Sides relative to the chosen acute angle" },
          { sym: "hyp", means: "Side opposite the right angle" },
        ],
      },
      {
        id: "pyth-id",
        name: "Pythagorean identity",
        tex: L`\sin^2\theta+\cos^2\theta=1`,
        meaning: "True for every angle. It is the unit circle written in function notation.",
        symbols: [{ sym: "θ", means: "Any real angle" }],
      },
      {
        id: "law-sines",
        name: "Law of sines",
        tex: L`\frac{a}{\sin A}=\frac{b}{\sin B}=\frac{c}{\sin C}`,
        meaning: "Sides are proportional to the sines of the opposite angles.",
        symbols: [
          { sym: "a, b, c", means: "Side lengths" },
          { sym: "A, B, C", means: "Opposite angles" },
        ],
      },
      {
        id: "law-cosines",
        name: "Law of cosines",
        tex: L`c^2=a^2+b^2-2ab\cos C`,
        meaning:
          "Pythagoras, corrected by the included angle. If C = 90°, cos C = 0 and the correction vanishes.",
        symbols: [
          { sym: "C", means: "The angle between sides a and b" },
          { sym: "c", means: "The side opposite C" },
        ],
      },
      {
        id: "angle-sum",
        name: "Angle sum",
        tex: L`\sin(\alpha+\beta)=\sin\alpha\cos\beta+\cos\alpha\sin\beta`,
        meaning: "Sine of a sum is not the sum of sines. The expansion mixes both functions.",
        symbols: [{ sym: "α, β", means: "Any two angles" }],
      },
    ],
    examples: [
      {
        title: "A height from an angle",
        prompt:
          "From 40 m away, the top of a mast makes a 28° angle with the horizontal. How tall is the mast, ignoring eye height?",
        steps: [
          "Opposite side is the height h. Adjacent side is 40 m.",
          "tan 28° = h / 40.",
          "h = 40 tan 28°.",
          "tan 28° ≈ 0.5317, so h ≈ 21.3 m.",
        ],
        answer: "About 21.3 meters.",
      },
      {
        title: "A side from the law of cosines",
        prompt: "A triangle has sides 7 and 9 with included angle 40°. Find the third side.",
        steps: [
          "c² = 7² + 9² − 2·7·9·cos 40°.",
          "c² = 49 + 81 − 126 cos 40°.",
          "cos 40° ≈ 0.7660, so 126 × 0.7660 ≈ 96.5.",
          "c² ≈ 130 − 96.5 = 33.5, so c ≈ 5.79.",
        ],
        answer: "The third side is about 5.79.",
      },
      {
        title: "The identity finishes a triangle",
        prompt: "In a right triangle, sin θ = 5/13 and θ is acute. Find cos θ and tan θ.",
        steps: [
          "sin²θ + cos²θ = 1, so cos²θ = 1 − 25/169 = 144/169.",
          "θ acute means cosine is positive: cos θ = 12/13.",
          "tan θ = sin/cos = 5/12.",
        ],
        answer: "cos θ = 12/13 and tan θ = 5/12. This is the 5–12–13 triangle.",
      },
      {
        title: "Law of sines",
        prompt:
          "In a triangle, angle A is 30°, the opposite side a is 5, and angle B is 45°. Find side b.",
        steps: [
          "a / sin A = b / sin B.",
          "5 / sin 30° = b / sin 45°.",
          "sin 30° = 1/2 and sin 45° = √2/2 ≈ 0.7071.",
          "5 / 0.5 = 10, so b = 10 × 0.7071 ≈ 7.07.",
        ],
        answer: "b = 5√2 ≈ 7.07.",
      },
      {
        title: "Sine of a sum",
        prompt: "Compute sin(75°) from the angle-sum formula, using 75° = 45° + 30°.",
        steps: [
          "sin(α + β) = sin α cos β + cos α sin β.",
          "sin 45° = cos 45° = √2/2, sin 30° = 1/2, cos 30° = √3/2.",
          "sin 75° = (√2/2)(√3/2) + (√2/2)(1/2) = √2 (√3 + 1) / 4.",
        ],
        answer: "sin 75° = √2 (√3 + 1) / 4 ≈ 0.9659. It is not sin 45° + sin 30°.",
      },
    ],
    practice: [
      {
        q: "If sin θ = 3/5 and θ is acute, what is cos θ?",
        a: "cos²θ = 1 − (9/25) = 16/25, and cosine is positive in the first quadrant, so cos θ = 4/5.",
      },
      {
        q: "Why does the law of cosines become Pythagoras when the included angle is a right angle?",
        a: "cos 90° = 0, so the term −2ab cos C is zero and c² = a² + b².",
      },
    ],
    pitfalls: [
      "Calculators in degree mode and radian mode answer different questions. Match the mode to the unit of the angle.",
      "The law of sines can be ambiguous (SSA): a given sine corresponds to two supplementary angles. Check that the angles sum to 180°.",
      "sin(α + β) is not sin α + sin β.",
    ],
  },
  {
    slug: "functions",
    volume: "mathematics",
    level: "intermediate",
    title: "Functions, exponentials, and logarithms",
    minutes: 30,
    summary:
      "A function is a rule with one output per input. Composition, inverses, and the exponential–logarithm pair are the machinery calculus will differentiate.",
    prereqs: ["algebra"],
    ideas: [
      "The graph of a function meets each vertical line at most once.",
      "Composition g∘f means do f first, then g. Order matters.",
      "An inverse undoes a function, and it exists on a domain where the function is one-to-one.",
      "Exponential growth is multiplication by a constant per unit time. Logarithms measure the time, or the exponent.",
    ],
    body: [
      "A function f assigns to each input x in its domain exactly one output f(x). The set of outputs that actually occur is the range. Equality of functions means they agree on the whole domain, not merely that their formulas look similar before simplification. Piecewise functions are still functions: the absolute value |x| is one rule described by two formulas.",
      "Composition is substitution. (g ∘ f)(x) = g(f(x)). It is associative and not commutative. An inverse f⁻¹ satisfies f⁻¹(f(x)) = x and f(f⁻¹(y)) = y on the appropriate sets. Graphically, the inverse is the reflection of the graph across the line y = x. You find a formula by writing y = f(x), swapping names, and solving for y — provided that solve step is single-valued.",
      "The exponential function aˣ, with a > 0, converts addition in the exponent into multiplication: aˣ⁺ʸ = aˣ aʸ. The natural base e ≈ 2.71828 is the unique base whose tangent line at 0 has slope 1, which is why calculus prefers eˣ. The logarithm log_a is the inverse: log_a(aˣ) = x. Change of base says log_a x = ln x / ln a, so every logarithm is a scaled natural logarithm. Continuous compounding A = P e^{rt} is the limit of compounding n times a year as n grows.",
    ],
    formulas: [
      {
        id: "composition",
        name: "Composition",
        tex: L`(g\circ f)(x)=g(f(x))`,
        meaning:
          "Apply f, then feed the result to g. The domain is those x where f(x) lands in the domain of g.",
        symbols: [{ sym: "f, g", means: "Functions" }],
      },
      {
        id: "inverse",
        name: "Inverse",
        tex: L`f^{-1}(f(x))=x`,
        meaning:
          "The inverse undoes f. It exists when f is one-to-one on the domain you care about.",
        symbols: [{ sym: "f⁻¹", means: "Inverse function, not 1/f" }],
      },
      {
        id: "exp-rules",
        name: "Exponent rules",
        tex: L`a^{x+y}=a^x a^y,\qquad (a^x)^y=a^{xy}`,
        meaning: "Adding exponents multiplies; multiplying exponents raises a power to a power.",
        symbols: [{ sym: "a", means: "Positive base" }],
      },
      {
        id: "change-base",
        name: "Change of base",
        tex: L`\log_a x=\frac{\ln x}{\ln a}`,
        meaning: "Compute any logarithm from the natural logarithm, or from log base 10.",
        symbols: [{ sym: "ln", means: "Logarithm base e" }],
      },
      {
        id: "continuous-growth",
        name: "Continuous growth",
        tex: L`A=Pe^{rt}`,
        meaning:
          "Amount after time t when a principal P grows at continuous rate r. If r is negative, this is decay.",
        symbols: [
          { sym: "P", means: "Initial amount" },
          { sym: "r", means: "Continuous rate, as a decimal" },
          { sym: "t", means: "Time in the same units as the rate" },
        ],
      },
    ],
    examples: [
      {
        title: "Compose, and notice the order",
        prompt: "Let f(x) = x + 1 and g(x) = x². Compute (g ∘ f)(3) and (f ∘ g)(3).",
        steps: [
          "g(f(3)) = g(4) = 16.",
          "f(g(3)) = f(9) = 10.",
          "The numbers differ, so composition is not commutative.",
        ],
        answer: "(g ∘ f)(3) = 16 and (f ∘ g)(3) = 10.",
      },
      {
        title: "Doubling time",
        prompt: "A culture grows continuously at 8% per hour. How long until it doubles?",
        steps: [
          "Set P e^{0.08 t} = 2P and cancel P (assuming P ≠ 0).",
          "e^{0.08 t} = 2.",
          "0.08 t = ln 2 ≈ 0.693.",
          "t ≈ 0.693 / 0.08 ≈ 8.66 hours.",
        ],
        answer:
          "About 8.66 hours. The rule of 72 estimates 72/8 = 9 hours, close enough for a check.",
      },
      {
        title: "Exponent arithmetic",
        prompt: "Simplify 2³ × 2⁴ and (2³)⁴.",
        steps: [
          "Same base, product: add exponents. 2³ × 2⁴ = 2⁷ = 128.",
          "A power of a power: multiply exponents. (2³)⁴ = 2¹² = 4096.",
          "These are not the same operation. 2⁷ is 128; 2¹² is much larger.",
        ],
        answer: "128 and 4096.",
      },
      {
        title: "Change of base",
        prompt: "Compute log₂(32) using the natural logarithm, then check it directly.",
        steps: [
          "log₂(32) = ln 32 / ln 2.",
          "32 = 2⁵, so the value must be 5 if the formula is right.",
          "ln 32 ≈ 3.466 and ln 2 ≈ 0.693, and 3.466 / 0.693 ≈ 5.00.",
        ],
        answer:
          "Exactly 5. Change of base does not change the number, only the calculator button you press.",
      },
      {
        title: "An inverse, written out",
        prompt: "Find a formula for the inverse of f(x) = 2x + 5, and check it at x = 3.",
        steps: [
          "Write y = 2x + 5 and swap names: x = 2y + 5.",
          "Solve: y = (x − 5)/2. That is f⁻¹(x).",
          "f(3) = 11, and f⁻¹(11) = (11 − 5)/2 = 3.",
        ],
        answer: "f⁻¹(x) = (x − 5)/2. The superscript is an inverse function, not a reciprocal.",
      },
    ],
    practice: [
      {
        q: "Find the inverse of f(x) = 3x − 6.",
        a: "y = 3x − 6, swap: x = 3y − 6, so y = (x + 6)/3. Check: f(f⁻¹(x)) = x.",
      },
      {
        q: "Solve log₂(x − 1) = 5.",
        a: "x − 1 = 2⁵ = 32, so x = 33. The argument x − 1 must be positive, and 32 is, so the solution is valid.",
      },
    ],
    pitfalls: [
      "f⁻¹ means the inverse function. The reciprocal 1/f(x) is a different object, sometimes written [f(x)]⁻¹.",
      "You cannot take a logarithm of zero or a negative number, in the reals.",
      "A half-life or doubling time depends on the rate, not on the starting amount. P cancels.",
    ],
  },
  {
    slug: "differential-calculus",
    volume: "mathematics",
    level: "intermediate",
    title: "Differential calculus",
    minutes: 40,
    summary:
      "The derivative is the instantaneous rate of change: a limit of slopes. The rules let you compute it without returning to the limit each time.",
    prereqs: ["functions", "trigonometry"],
    ideas: [
      "The derivative f′(a) is the slope of the tangent line at x = a.",
      "Differentiability implies continuity, but not the other way around.",
      "Power, product, quotient, and chain rules reduce derivatives of formulas to algebra.",
      "Critical points, where f′ is zero or undefined, are the candidates for local maxima and minima.",
    ],
    body: [
      "The average rate of change of f between a and a + h is the slope of the secant: [f(a + h) − f(a)] / h. The derivative is the limit of that quotient as h approaches 0, when the limit exists. Geometrically it is the slope of the tangent. Physically, if f is position, f′ is velocity and f″ is acceleration. The units of a derivative are the units of the output per unit of the input.",
      "You almost never compute that limit by hand after the first week. The power rule says the derivative of xⁿ is n xⁿ⁻¹. The product rule is (fg)′ = f′g + fg′, not f′g′. The quotient rule is the product rule applied to f · g⁻¹. The chain rule handles composition: (g ∘ f)′(x) = g′(f(x)) · f′(x). In words, differentiate the outside, leave the inside alone, then multiply by the derivative of the inside.",
      "A function can change direction only where the derivative is zero or fails to exist. Those are the critical points. The first-derivative test looks at the sign of f′ on either side. The second-derivative test uses concavity: if f′(a) = 0 and f″(a) > 0, the curve is concave up and a is a local minimum. None of this locates a global maximum on an open interval; you still compare values, and on a closed interval you also check the endpoints.",
    ],
    formulas: [
      {
        id: "derivative-def",
        name: "Definition of the derivative",
        tex: L`f'(a)=\lim_{h\to 0}\frac{f(a+h)-f(a)}{h}`,
        meaning: "Instantaneous rate of change at x = a, when this limit exists.",
        symbols: [
          { sym: "h", means: "A small increment in the input" },
          { sym: "f′(a)", means: "Derivative of f at a" },
        ],
      },
      {
        id: "power-rule",
        name: "Power rule",
        tex: L`\frac{d}{dx}x^{n}=nx^{n-1}`,
        meaning:
          "Bring down the exponent and reduce it by one. It holds for any real n where the expression makes sense.",
        symbols: [{ sym: "n", means: "A constant exponent" }],
      },
      {
        id: "product-rule",
        name: "Product rule",
        tex: L`(fg)'=f'g+fg'`,
        meaning: "Differentiate one factor at a time and add the two results.",
        symbols: [{ sym: "f, g", means: "Differentiable functions" }],
      },
      {
        id: "chain-rule",
        name: "Chain rule",
        tex: L`\frac{d}{dx}g(f(x))=g'(f(x))\,f'(x)`,
        meaning:
          "Differentiate the outer function, then multiply by the derivative of the inner function.",
        symbols: [{ sym: "g′(f(x))", means: "Derivative of g, evaluated at f(x)" }],
      },
      {
        id: "exp-deriv",
        name: "Exponential and logarithm",
        tex: L`\frac{d}{dx}e^{x}=e^{x},\qquad \frac{d}{dx}\ln x=\frac{1}{x}`,
        meaning:
          "The natural exponential is its own derivative. The logarithm’s derivative is the reciprocal, for x > 0.",
        symbols: [{ sym: "eˣ", means: "Exponential base e" }],
      },
    ],
    examples: [
      {
        title: "From the definition, once",
        prompt: "Use the definition to differentiate f(x) = x² at a general x.",
        steps: [
          "Difference quotient: [(x + h)² − x²] / h = (x² + 2xh + h² − x²) / h.",
          "Simplify: (2xh + h²) / h = 2x + h, for h ≠ 0.",
          "Limit as h → 0: 2x.",
        ],
        answer: "f′(x) = 2x, which matches the power rule.",
      },
      {
        title: "Chain rule with a power",
        prompt: "Differentiate y = (3x² − 1)⁴.",
        steps: [
          "Outer function: u⁴, whose derivative is 4u³.",
          "Inner function: u = 3x² − 1, whose derivative is 6x.",
          "Multiply: 4(3x² − 1)³ · 6x = 24x(3x² − 1)³.",
        ],
        answer: "dy/dx = 24x (3x² − 1)³.",
      },
      {
        title: "Power rule, three times",
        prompt: "Differentiate x⁵, then x⁻², then √x.",
        steps: [
          "x⁵ has derivative 5x⁴.",
          "x⁻² has derivative −2x⁻³.",
          "√x = x^{1/2} has derivative (1/2) x^{−1/2} = 1/(2√x).",
        ],
        answer: "5x⁴, −2/x³, and 1/(2√x). The rule is the same for each exponent.",
      },
      {
        title: "Product rule",
        prompt: "Differentiate y = x² eˣ.",
        steps: [
          "Take f = x² and g = eˣ.",
          "f′ = 2x and g′ = eˣ.",
          "(fg)′ = 2x eˣ + x² eˣ = eˣ(x² + 2x).",
        ],
        answer: "eˣ(x² + 2x). The derivative of a product is not the product of the derivatives.",
      },
      {
        title: "The logarithm’s derivative",
        prompt: "Differentiate ln(x² + 1).",
        steps: [
          "This is a composition. Outer derivative of ln u is 1/u.",
          "Inner derivative of x² + 1 is 2x.",
          "Chain rule: 1/(x² + 1) times 2x.",
        ],
        answer:
          "2x / (x² + 1), for every real x. The inside never hits zero, so the logarithm is defined on the whole line.",
      },
    ],
    practice: [
      {
        q: "Find the critical points of f(x) = x³ − 3x.",
        a: "f′(x) = 3x² − 3 = 3(x² − 1) = 0 when x = 1 or x = −1. f″(x) = 6x, so x = 1 is a local minimum (f″ > 0) and x = −1 is a local maximum.",
      },
      {
        q: "Differentiate x eˣ.",
        a: "Product rule: 1 · eˣ + x eˣ = eˣ(x + 1).",
      },
    ],
    pitfalls: [
      "The derivative of a product is not the product of the derivatives.",
      "A corner, such as |x| at 0, can be continuous and still not differentiable.",
      "A critical point is only a candidate. f(x) = x³ has f′(0) = 0 and is neither a max nor a min.",
    ],
  },
  {
    slug: "integral-calculus",
    volume: "mathematics",
    level: "intermediate",
    title: "Integral calculus",
    minutes: 40,
    summary:
      "The integral accumulates. The fundamental theorem says differentiation and integration are inverse operations.",
    prereqs: ["differential-calculus"],
    ideas: [
      "A definite integral is the signed area under a curve, defined as a limit of Riemann sums.",
      "The fundamental theorem recovers that area from any antiderivative.",
      "Substitution is the chain rule run backwards.",
      "Signed area counts region below the axis as negative.",
    ],
    body: [
      "Cut the interval [a, b] into thin pieces of width Δx. On each piece pick a sample height f(xᵢ) and add f(xᵢ) Δx. That sum is a Riemann sum. The definite integral ∫ from a to b of f(x) dx is the limit of these sums as the mesh goes to zero, when the limit exists. Continuous functions on a closed interval always qualify. Area below the axis contributes negatively, so the integral is signed area, not paint.",
      "An antiderivative of f is any function F with F′ = f. Antiderivatives differ by a constant, because the derivative of a constant is zero. The fundamental theorem has two faces. If you define G(x) as the integral of f from a to x, then G′ = f. And if F is any antiderivative, the definite integral from a to b equals F(b) − F(a). Differentiation and definite integration undo each other.",
      "Technique is pattern matching against the derivative rules. The power rule backwards says the integral of xⁿ is xⁿ⁺¹/(n + 1) for n ≠ −1, and the integral of 1/x is ln|x|. Substitution handles the chain rule: if you see g′(x) multiplied by something made of g(x), set u = g(x). Integration by parts undoes the product rule and is the tool for products the substitution will not eat. None of this is required to understand what the integral means.",
    ],
    formulas: [
      {
        id: "ftc",
        name: "Fundamental theorem",
        tex: L`\int_a^b f(x)\,dx=F(b)-F(a)\quad\text{where }F'=f`,
        meaning:
          "Evaluate any antiderivative at the ends and subtract. This is the working rule for definite integrals.",
        symbols: [
          { sym: "F", means: "Any antiderivative of f" },
          { sym: "a, b", means: "Endpoints" },
        ],
      },
      {
        id: "power-int",
        name: "Power rule for integrals",
        tex: L`\int x^{n}\,dx=\frac{x^{n+1}}{n+1}+C,\quad n\neq -1`,
        meaning:
          "Raise the exponent by one and divide by the new exponent. The +C records the family of antiderivatives.",
        symbols: [{ sym: "C", means: "An arbitrary constant" }],
      },
      {
        id: "log-int",
        name: "Integral of the reciprocal",
        tex: L`\int \frac{1}{x}\,dx=\ln|x|+C`,
        meaning:
          "The missing case n = −1. The absolute value keeps the formula valid for negative x.",
        symbols: [{ sym: "|x|", means: "Absolute value" }],
      },
      {
        id: "substitution",
        name: "Substitution",
        tex: L`\int f(g(x))\,g'(x)\,dx=\int f(u)\,du`,
        meaning: "Set u = g(x), so du = g′(x) dx. The integral becomes one in the variable u.",
        symbols: [{ sym: "u", means: "The inner function" }],
      },
      {
        id: "area-between",
        name: "Area between curves",
        tex: L`A=\int_a^b\bigl(f(x)-g(x)\bigr)\,dx`,
        meaning:
          "When f stays above g, the integrand is the vertical gap and the integral is the enclosed area.",
        symbols: [{ sym: "f − g", means: "Upper minus lower" }],
      },
    ],
    examples: [
      {
        title: "A definite integral by antiderivative",
        prompt: "Compute the integral of x² from 0 to 2.",
        steps: [
          "An antiderivative of x² is x³/3.",
          "Evaluate: (2)³/3 − (0)³/3 = 8/3.",
          "The region lies above the axis, so 8/3 is also the geometric area.",
        ],
        answer: "8/3.",
      },
      {
        title: "Substitution",
        prompt: "Compute the integral of 2x(x² + 1)³ dx.",
        steps: [
          "Let u = x² + 1. Then du = 2x dx, which is exactly the remaining factor.",
          "The integral becomes ∫ u³ du = u⁴/4 + C.",
          "Substitute back: (x² + 1)⁴ / 4 + C.",
        ],
        answer: "(x² + 1)⁴ / 4 + C.",
      },
      {
        title: "The missing power",
        prompt: "Compute the integral of 1/x from 1 to e.",
        steps: [
          "The antiderivative of 1/x is ln|x|, not a power.",
          "Evaluate ln e − ln 1.",
          "ln e = 1 and ln 1 = 0.",
        ],
        answer: "1. The area under 1/x from 1 to e is exactly 1.",
      },
      {
        title: "Area between two curves",
        prompt: "Find the area between y = x and y = x² from x = 0 to x = 1.",
        steps: [
          "On [0, 1], the line y = x sits above the parabola y = x².",
          "Integrand: x − x².",
          "Antiderivative: x²/2 − x³/3.",
          "At 1: 1/2 − 1/3 = 1/6. At 0: 0.",
        ],
        answer: "1/6.",
      },
      {
        title: "The power rule, backwards",
        prompt: "Find the indefinite integral of x⁴, and of 7.",
        steps: [
          "∫ x⁴ dx = x⁵/5 + C.",
          "A constant is x⁰. ∫ 7 dx = 7x + C.",
          "Differentiate each answer to recover the integrand: 5x⁴/5 = x⁴, and the derivative of 7x is 7.",
        ],
        answer:
          "x⁵/5 + C and 7x + C. The +C is required until a limit or an initial condition kills it.",
      },
    ],
    practice: [
      {
        q: "Find the area under y = sin x from 0 to π.",
        a: "An antiderivative is −cos x. Evaluate −cos π − (−cos 0) = −(−1) − (−1) = 1 + 1 = 2.",
      },
      {
        q: "Why does the integral of an odd function over [−a, a] often vanish?",
        a: "Odd means f(−x) = −f(x), so signed area on the left cancels signed area on the right, when the integral exists. For example, ∫ of x³ from −1 to 1 is 0.",
      },
    ],
    pitfalls: [
      "Forgetting to convert the limits when a substitution is used on a definite integral. Either switch the limits to u-values or substitute back before evaluating.",
      "The integral from a to b of a function that dips below the axis is not the geometric area. Take the absolute value, or split the interval, if you want paint.",
      "An antiderivative is a family. Definite integrals kill the +C because it subtracts away; indefinite integrals must keep it.",
    ],
  },
];

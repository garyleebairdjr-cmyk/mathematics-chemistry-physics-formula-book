import type { Chapter } from "./types.ts";
import { L } from "./types.ts";

export const higher: Chapter[] = [
  {
    slug: "multivariable",
    volume: "mathematics",
    level: "advanced",
    title: "Multivariable calculus",
    minutes: 35,
    summary:
      "Functions of several variables, partial derivatives, the gradient, and integrals over regions of the plane and space.",
    prereqs: ["integral-calculus", "linear-algebra"],
    ideas: [
      "A partial derivative holds every variable but one fixed, then differentiates.",
      "The gradient points in the direction of steepest increase, and its magnitude is that slope.",
      "A double integral adds values over an area; a triple integral, over a volume.",
      "Divergence measures source, curl measures local rotation.",
    ],
    body: [
      "When a quantity depends on several inputs, the derivative splits. The partial derivative ∂f/∂x is the ordinary derivative in x while y, z, and the rest are treated as constants. Geometrically, for z = f(x, y), it is the slope of the surface in the x-direction. Mixed partials ∂²f/∂y∂x and ∂²f/∂x∂y agree whenever they are continuous, which is Clairaut’s theorem and the reason you can usually differentiate in either order.",
      "The gradient ∇f is the vector of all first partials. It is perpendicular to the level set of f, and the directional derivative in a unit direction u is the dot product ∇f · u. That product is largest when u points along ∇f, which is the precise meaning of steepest ascent. Setting the gradient to zero locates the critical points of a function of several variables; the Hessian, the matrix of second partials, plays the role of the second derivative test.",
      "Integration adds a dimension of bookkeeping. ∬_D f(x, y) dA is the limit of sums f(xᵢ, yᵢ) ΔA over a region D. Iterated integrals compute it by sweeping one variable, then the other, and the limits on the inner integral may depend on the outer variable. In polar coordinates the area element is r dr dθ, not dr dθ — the factor r is the Jacobian, and forgetting it is the classic error. Divergence ∇ · F and curl ∇ × F package the derivatives of a vector field; the divergence theorem and Stokes’ theorem are the fundamental theorem in higher dimensions.",
    ],
    formulas: [
      {
        id: "partial",
        name: "Partial derivative",
        tex: L`\frac{\partial}{\partial x}f(x,y)`,
        meaning: "Differentiate with respect to x, holding y fixed.",
        symbols: [{ sym: "∂", means: "Partial derivative, not a fraction you cancel casually" }],
      },
      {
        id: "gradient",
        name: "Gradient",
        tex: L`\nabla f=\left(\frac{\partial f}{\partial x},\frac{\partial f}{\partial y},\frac{\partial f}{\partial z}\right)`,
        meaning: "The vector of first partials. It points uphill most steeply.",
        symbols: [{ sym: "∇", means: "Del, or nabla" }],
      },
      {
        id: "directional",
        name: "Directional derivative",
        tex: L`D_{\mathbf{u}}f=\nabla f\cdot\mathbf{u}`,
        meaning: "Rate of change in the direction of a unit vector u.",
        symbols: [{ sym: "u", means: "A unit vector" }],
      },
      {
        id: "double",
        name: "Double integral",
        tex: L`\iint_D f(x,y)\,dA`,
        meaning:
          "Signed volume under the surface z = f over the region D, or accumulated density if f is a density.",
        symbols: [{ sym: "dA", means: "Area element: dx dy, or r dr dθ in polar" }],
      },
      {
        id: "div-curl",
        name: "Divergence and curl",
        tex: L`\nabla\cdot\mathbf{F},\qquad \nabla\times\mathbf{F}`,
        meaning:
          "Divergence is a scalar measuring net outflow. Curl is a vector measuring local rotation.",
        symbols: [{ sym: "F", means: "A vector field" }],
      },
    ],
    examples: [
      {
        title: "Partials of a product surface",
        prompt: "Let f(x, y) = x²y + sin y. Find both first partials and the gradient at (1, 0).",
        steps: [
          "∂f/∂x = 2xy. At (1, 0) this is 0.",
          "∂f/∂y = x² + cos y. At (1, 0) this is 1 + 1 = 2.",
          "Gradient at (1, 0) is the vector (0, 2).",
        ],
        answer:
          "∇f(1, 0) = (0, 2). The surface climbs in the y-direction and is instantaneously flat in x.",
      },
      {
        title: "Area in polar coordinates",
        prompt: "Find the area of the disk x² + y² ≤ 4 using a double integral.",
        steps: [
          "In polar, the disk is 0 ≤ r ≤ 2 and 0 ≤ θ ≤ 2π, and dA = r dr dθ.",
          "∫ from 0 to 2π of ∫ from 0 to 2 of r dr dθ.",
          "Inner integral: r²/2 from 0 to 2 = 2.",
          "Outer: 2 × 2π = 4π.",
        ],
        answer: "4π, matching πR² with R = 2.",
      },
      {
        title: "A directional derivative",
        prompt:
          "Let f(x, y) = x² + y². How fast does f change at (1, 0) in the direction of the unit vector (0, 1)?",
        steps: [
          "Gradient: ∇f = (2x, 2y). At (1, 0) it is (2, 0).",
          "The direction u = (0, 1) is already a unit vector.",
          "Directional derivative: ∇f · u = (2, 0) · (0, 1) = 0.",
        ],
        answer:
          "0. You are walking along the level direction, perpendicular to the uphill vector (2, 0).",
      },
      {
        title: "Divergence and curl of one field",
        prompt: "Let F = (−y, x, 0). Compute the divergence and the curl.",
        steps: [
          "Divergence: ∂/∂x(−y) + ∂/∂y(x) + ∂/∂z(0) = 0 + 0 + 0.",
          "Curl: the k component is ∂/∂x(x) − ∂/∂y(−y) = 1 − (−1) = 2. The i and j components are 0.",
          "So the field has no source and a constant rotation about the z-axis.",
        ],
        answer:
          "∇ · F = 0 and ∇ × F = (0, 0, 2). This is the velocity field of rotation in the plane.",
      },
      {
        title: "Steepest ascent is the gradient",
        prompt:
          "f(x, y) = 4x + y. At the origin, in which direction does f increase fastest, and how fast?",
        steps: [
          "Partial derivatives: ∂f/∂x = 4 and ∂f/∂y = 1, both constant.",
          "Gradient: (4, 1). Its length is √(16 + 1) = √17.",
          "The unit vector in that direction is (4, 1)/√17, and the directional derivative along it is the length itself.",
        ],
        answer:
          "Fastest increase is in the direction (4, 1), at rate √17 ≈ 4.12 per unit distance. Any other direction is slower.",
      },
    ],
    practice: [
      {
        q: "For f(x, y) = eˣʸ, compute ∂f/∂x.",
        a: "Chain rule: the exponent xy has ∂/∂x equal to y, so ∂f/∂x = y eˣʸ.",
      },
      {
        q: "In which direction from (1, 1) does f(x, y) = x² + 2y² increase fastest?",
        a: "∇f = (2x, 4y) = (2, 4) at (1, 1). The direction is that vector, or the unit vector (1, 2)/√5.",
      },
    ],
    pitfalls: [
      "In polar and spherical coordinates the volume element carries a Jacobian. dA is not always dx dy.",
      "A partial derivative symbol is not an instruction to cancel ∂ against something else.",
      "Critical points of functions of several variables include saddles. A zero gradient is not automatically a peak.",
    ],
  },
  {
    slug: "linear-algebra",
    volume: "mathematics",
    level: "intermediate",
    title: "Linear algebra",
    minutes: 40,
    summary:
      "Vectors, matrices, and the one question they all answer: when does a linear equation have a solution, and what does the solution space look like?",
    prereqs: ["algebra", "geometry"],
    ideas: [
      "A linear map sends sums to sums and respects scaling. Matrices are linear maps written in coordinates.",
      "Solving Ax = b is asking which vectors b lie in the column space of A.",
      "The determinant is zero exactly when a square matrix collapses volume, i.e., is not invertible.",
      "Eigenvectors are directions a matrix merely stretches, by the factor λ.",
    ],
    body: [
      "A vector in Rⁿ is an ordered list of n real numbers, pictured as an arrow when n is 2 or 3. Vector addition and scalar multiplication are componentwise. A set of vectors spans a subspace if every vector in it is a linear combination of them. They are linearly independent if the only combination that gives the zero vector has all coefficients zero. A basis is a linearly independent spanning set, and every basis of a given subspace has the same number of vectors: the dimension.",
      "An m × n matrix A represents a linear map from Rⁿ to Rᵐ. The equation Ax = b asks for the preimage of b. It has a solution precisely when b is in the column space. When there is one solution and the null space is only the zero vector, the solution is unique. For square matrices that is equivalent to det A ≠ 0, and to the existence of an inverse matrix A⁻¹ with AA⁻¹ = I. The 2 × 2 case is small enough to write by hand: the determinant is ad − bc, and the inverse is (1/(ad − bc)) times the matrix of swapped diagonals and negated off-diagonals.",
      "Eigenvalues answer a geometric question. Av = λv means the map sends the line through v back onto itself, stretched by λ. You find λ from the characteristic polynomial det(A − λI) = 0, then find v by solving (A − λI)v = 0. Symmetric real matrices have real eigenvalues and an orthonormal basis of eigenvectors, which is why they diagonalize cleanly and dominate statistics, mechanics, and quantum observables.",
    ],
    formulas: [
      {
        id: "dot",
        name: "Dot product",
        tex: L`\mathbf{u}\cdot\mathbf{v}=|\mathbf{u}|\,|\mathbf{v}|\cos\theta`,
        meaning:
          "Zero when the vectors are perpendicular. Also equal to the sum of componentwise products.",
        symbols: [{ sym: "θ", means: "Angle between the vectors" }],
      },
      {
        id: "det2",
        name: "Determinant, 2 × 2",
        tex: L`\det\begin{pmatrix}a&b\\c&d\end{pmatrix}=ad-bc`,
        meaning:
          "Signed area of the parallelogram spanned by the columns. Zero means the columns are parallel.",
        symbols: [{ sym: "ad − bc", means: "Difference of the diagonal products" }],
      },
      {
        id: "inverse2",
        name: "Inverse, 2 × 2",
        tex: L`\begin{pmatrix}a&b\\c&d\end{pmatrix}^{-1}=\frac{1}{ad-bc}\begin{pmatrix}d&-b\\-c&a\end{pmatrix}`,
        meaning: "Exists exactly when ad − bc ≠ 0.",
        symbols: [{ sym: "ad − bc", means: "The determinant" }],
      },
      {
        id: "eigen",
        name: "Eigenvalue equation",
        tex: L`A\mathbf{v}=\lambda\mathbf{v},\qquad \det(A-\lambda I)=0`,
        meaning:
          "v is a direction A only stretches. The second equation finds the possible stretches λ.",
        symbols: [
          { sym: "λ", means: "Eigenvalue" },
          { sym: "v", means: "A nonzero eigenvector" },
        ],
      },
      {
        id: "projection",
        name: "Projection onto a vector",
        tex: L`\mathrm{proj}_{\mathbf{u}}\mathbf{v}=\frac{\mathbf{u}\cdot\mathbf{v}}{\mathbf{u}\cdot\mathbf{u}}\mathbf{u}`,
        meaning:
          "The shadow of v on the line through u. Subtract it from v to get the perpendicular piece.",
        symbols: [
          { sym: "u", means: "The direction you project onto, not necessarily a unit vector" },
        ],
      },
    ],
    examples: [
      {
        title: "A 2 × 2 system",
        prompt: "Solve 2x + y = 5 and x − y = 1.",
        steps: [
          "In matrix form, columns (2, 1) and (1, −1), right-hand side (5, 1).",
          "Determinant: 2(−1) − (1)(1) = −3, nonzero, so there is a unique solution.",
          "Add the equations: 3x = 6, so x = 2. Then 2 − y = 1, so y = 1.",
        ],
        answer: "x = 2, y = 1. Check: 4 + 1 = 5 and 2 − 1 = 1.",
      },
      {
        title: "Eigenvalues of a stretch",
        prompt: "Find the eigenvalues of the matrix with rows (3, 0) and (0, −1).",
        steps: [
          "This matrix stretches the x-axis by 3 and the y-axis by −1.",
          "det(A − λI) = (3 − λ)(−1 − λ) = 0.",
          "So λ = 3 or λ = −1.",
        ],
        answer: "Eigenvalues 3 and −1, with eigenvectors along (1, 0) and (0, 1).",
      },
      {
        title: "A dot product decides a right angle",
        prompt:
          "Are (1, 2) and (2, −1) perpendicular? What is the angle between (1, 0) and (1, 1)?",
        steps: [
          "(1, 2) · (2, −1) = 2 − 2 = 0, so those two are perpendicular.",
          "(1, 0) · (1, 1) = 1. Lengths are 1 and √2.",
          "cos θ = 1 / √2, so θ = 45°.",
        ],
        answer: "Yes, the first pair is perpendicular. The second pair meets at 45°.",
      },
      {
        title: "Invert a 2 × 2 matrix",
        prompt: "Invert the matrix with rows (1, 2) and (3, 4), then check the product.",
        steps: [
          "Determinant: 1·4 − 2·3 = −2.",
          "Swap the diagonal, negate the off-diagonal, divide by the determinant.",
          "Inverse is (−1/2) times the matrix with rows (4, −2) and (−3, 1), which is the matrix with rows (−2, 1) and (3/2, −1/2).",
          "Multiply the original by that inverse and you get the identity.",
        ],
        answer: "The inverse has rows (−2, 1) and (3/2, −1/2).",
      },
      {
        title: "Project onto a line",
        prompt: "Project the vector (3, 1) onto u = (2, 0).",
        steps: [
          "proj_u v = ((u · v) / (u · u)) u.",
          "u · v = 6 and u · u = 4, so the coefficient is 6/4 = 3/2.",
          "(3/2) × (2, 0) = (3, 0).",
        ],
        answer: "(3, 0). The leftover (3, 1) − (3, 0) = (0, 1) is perpendicular to u.",
      },
    ],
    practice: [
      {
        q: "Are the vectors (1, 2) and (2, 4) linearly independent?",
        a: "No. The second is 2 times the first, so a nontrivial combination gives zero: 2(1, 2) + (−1)(2, 4) = 0.",
      },
      {
        q: "Compute the determinant of the matrix with rows (1, 4) and (2, 8).",
        a: "1·8 − 4·2 = 0. The second row is twice the first, so the matrix is not invertible.",
      },
    ],
    pitfalls: [
      "Matrix multiplication is not commutative. AB and BA are different maps, when both even exist.",
      "A row of zeros, or two proportional rows, means the determinant is zero. Do not keep row-reducing past an obvious dependence and then invent an inverse.",
      "Eigenvectors are defined only up to scale, and the zero vector is never an eigenvector.",
    ],
  },
  {
    slug: "probability",
    volume: "mathematics",
    level: "intermediate",
    title: "Probability and statistics",
    minutes: 40,
    summary:
      "Probability is the mathematics of uncertainty. Statistics is the reverse: data in hand, what can you say about the process that made it?",
    prereqs: ["algebra", "functions"],
    ideas: [
      "A probability is a number from 0 to 1 assigned to events, additive over events that cannot happen together.",
      "Conditional probability updates a belief when you learn that another event occurred.",
      "Expectation is the long-run average. Variance measures spread around it.",
      "The central limit theorem is why averages so often look bell-shaped.",
    ],
    body: [
      "An outcome is a possible result. An event is a set of outcomes. Probability assigns each event a number between 0 and 1 so that the whole sample space has probability 1 and disjoint events add. If outcomes are equally likely, probability is a count: favorable over total. That model is a special case, not the definition. A biased coin is still a perfectly good probability space.",
      "Conditional probability P(A | B) = P(A and B) / P(B) is the probability of A once you know B happened. Independence means learning B changes nothing: P(A | B) = P(A), equivalently P(A and B) = P(A)P(B). Bayes’ theorem runs the conditioning backwards, from the probability of the evidence given a cause to the probability of the cause given the evidence. It is arithmetic, not a philosophy, and it is the reason a positive test for a rare condition can still leave the condition unlikely.",
      "A random variable is a number attached to each outcome. Its expectation E[X] is the probability-weighted average of its values. For an indicator of an event, expectation equals the probability. Variance is E[(X − μ)²], the expected squared distance from the mean; the standard deviation is its square root, back in the original units. The sample mean of many independent draws concentrates around the true mean, and the distribution of that sample mean approaches a normal curve as the sample grows. That is the central limit theorem, and it is why the bell curve appears even when the underlying measurements are not themselves bell-shaped.",
    ],
    formulas: [
      {
        id: "conditional",
        name: "Conditional probability",
        tex: L`P(A\mid B)=\frac{P(A\cap B)}{P(B)}`,
        meaning: "The probability of A given that B occurred. Requires P(B) > 0.",
        symbols: [{ sym: "A ∩ B", means: "Both A and B" }],
      },
      {
        id: "bayes",
        name: "Bayes’ theorem",
        tex: L`P(A\mid B)=\frac{P(B\mid A)\,P(A)}{P(B)}`,
        meaning:
          "Swap cause and evidence. The denominator is the total probability of the evidence.",
        symbols: [
          { sym: "P(A)", means: "Prior probability of the cause" },
          { sym: "P(B | A)", means: "Likelihood of the evidence if the cause is true" },
        ],
      },
      {
        id: "binomial",
        name: "Binomial probability",
        tex: L`P(X=k)=\binom{n}{k}p^{k}(1-p)^{n-k}`,
        meaning:
          "Probability of k successes in n independent trials, each with success probability p.",
        symbols: [{ sym: "C(n, k)", means: "The binomial coefficient n! / (k!(n − k)!)" }],
      },
      {
        id: "expectation",
        name: "Expectation and variance",
        tex: L`\mu=E[X],\qquad \mathrm{Var}(X)=E[(X-\mu)^2]`,
        meaning: "Mean, and expected squared deviation from the mean.",
        symbols: [{ sym: "μ", means: "Population mean" }],
      },
      {
        id: "normal",
        name: "Standard normal density",
        tex: L`\phi(z)=\frac{1}{\sqrt{2\pi}}e^{-z^2/2}`,
        meaning:
          "The bell curve with mean 0 and standard deviation 1. General normals are shifts and scales of this one.",
        symbols: [{ sym: "z", means: "A standardized value: (x − μ) / σ" }],
      },
    ],
    examples: [
      {
        title: "A rare disease and a good test",
        prompt:
          "A condition affects 1% of people. A test is positive for 99% of people who have it, and for 5% of people who do not. You test positive. What is the chance you have it?",
        steps: [
          "P(D) = 0.01, P(+ | D) = 0.99, P(+ | not D) = 0.05.",
          "Total P(+) = 0.99(0.01) + 0.05(0.99) = 0.0099 + 0.0495 = 0.0594.",
          "P(D | +) = 0.0099 / 0.0594 ≈ 0.167.",
        ],
        answer:
          "About 16.7%. Most positive tests are false, because the condition is rare and the false-positive rate, though small, applies to almost everyone.",
      },
      {
        title: "A fair binomial",
        prompt: "You flip a fair coin 4 times. What is the probability of exactly 3 heads?",
        steps: ["n = 4, k = 3, p = 1/2.", "C(4, 3) = 4.", "4 × (1/2)³ × (1/2)¹ = 4/16 = 1/4."],
        answer: "1/4. The four sequences are HHHT, HHTH, HTHH, THHH.",
      },
      {
        title: "Expectation of a small bet",
        prompt:
          "A fair coin pays you 3 if heads and costs you 1 if tails. What is the expected gain, and what is the variance?",
        steps: [
          "Outcomes +3 and −1, each with probability 1/2.",
          "Mean μ = (1/2)(3) + (1/2)(−1) = 1.",
          "Variance: (1/2)(3 − 1)² + (1/2)(−1 − 1)² = (1/2)(4) + (1/2)(4) = 4.",
        ],
        answer:
          "Expected gain 1. Variance 4, so the standard deviation is 2. You win on average, but a single play swings by more than the average.",
      },
      {
        title: "A z-score",
        prompt:
          "Heights in a group have mean 170 cm and standard deviation 8 cm. How many standard deviations above the mean is 186 cm, and where does that sit on the standard normal?",
        steps: [
          "z = (x − μ) / σ = (186 − 170) / 8 = 2.",
          "The standard normal density at z = 2 is (1/√(2π)) e^{−2}, about 0.054.",
          "About 2.5% of a normal population lies above z = 2. The density value is not itself that probability.",
        ],
        answer: "z = 2. A height of 186 cm is two standard deviations above this mean.",
      },
      {
        title: "Conditional probability, nothing else",
        prompt:
          "A card is drawn from a standard deck. What is the probability it is a heart, given that it is red?",
        steps: [
          "There are 26 red cards, and 13 of them are hearts.",
          "P(heart and red) = P(heart) = 13/52, since every heart is red.",
          "P(heart | red) = (13/52) / (26/52) = 13/26 = 1/2.",
        ],
        answer: "1/2. Knowing the card is red doubles the chance it is a heart, from 1/4 to 1/2.",
      },
    ],
    practice: [
      {
        q: "A die is rolled. Let A be “even” and B be “greater than 4.” Are A and B independent?",
        a: "P(A) = 1/2, P(B) = 1/3, P(A and B) = P({6}) = 1/6. And (1/2)×(1/3) = 1/6, so yes, they are independent on a fair six-sided die. This is a calculation, not a vibe.",
      },
      {
        q: "Expected value of one roll of a fair six-sided die?",
        a: "(1+2+3+4+5+6)/6 = 21/6 = 3.5. The long-run average, not a value you can roll.",
      },
    ],
    pitfalls: [
      "P(A | B) is not P(B | A). The disease example exists to make that difference numerical.",
      "Independent is not the same as disjoint. Disjoint events with positive probability are dependent: if one happens, the other cannot.",
      "A small p-value is not the probability that the hypothesis is true. It is the probability of data at least this extreme if the hypothesis is true.",
    ],
  },
  {
    slug: "discrete",
    volume: "mathematics",
    level: "intermediate",
    title: "Discrete mathematics",
    minutes: 30,
    summary:
      "The mathematics of separate things: sets, counting, graphs, and the first careful proofs by induction.",
    prereqs: ["algebra"],
    ideas: [
      "A set is determined by its elements. Order and repetition do not matter.",
      "Combinations count unordered selections; permutations count ordered ones.",
      "A graph is vertices joined by edges. The handshaking lemma doubles the edge count.",
      "Induction proves a statement for every positive integer by a base step and a successor step.",
    ],
    body: [
      "Discrete mathematics studies objects that come in distinct pieces: integers, sets, strings, graphs, logical statements. The operations on sets are union, intersection, and complement, and they obey laws that look exactly like the laws of logic if you read union as or, intersection as and, and complement as not. Inclusion-exclusion repairs the overcount when you add the sizes of overlapping sets.",
      "Counting is organized division of labor. If a task splits into independent choices, multiply. If it splits into exclusive cases, add. A permutation of k items out of n is n! / (n − k)!, because order matters. A combination divides by the k! orders of the chosen items, leaving C(n, k) = n! / (k!(n − k)!). The binomial theorem says (x + y)ⁿ expands into those coefficients.",
      "A graph G = (V, E) has a finite set of vertices and a set of edges joining pairs of them. The degree of a vertex is the number of edges that touch it. Summing degrees counts each edge twice, so the sum of degrees is 2|E|, and the number of odd-degree vertices is even. Induction is the proof technique that matches the structure of the positive integers: prove the claim at n = 1, and prove that if it holds at n then it holds at n + 1. The inductive hypothesis is a gift you are allowed to use, not a conclusion you have already fully earned.",
    ],
    formulas: [
      {
        id: "inclusion",
        name: "Inclusion-exclusion, two sets",
        tex: L`|A\cup B|=|A|+|B|-|A\cap B|`,
        meaning: "Adding sizes double-counts the overlap. Subtract it once.",
        symbols: [{ sym: "|A|", means: "Number of elements in A" }],
      },
      {
        id: "combination",
        name: "Combinations",
        tex: L`\binom{n}{k}=\frac{n!}{k!\,(n-k)!}`,
        meaning: "Ways to choose k items from n when order does not matter.",
        symbols: [{ sym: "n!", means: "n × (n − 1) × … × 1" }],
      },
      {
        id: "permutation",
        name: "Permutations",
        tex: L`P(n,k)=\frac{n!}{(n-k)!}`,
        meaning: "Ways to choose k items from n when order matters.",
        symbols: [{ sym: "P(n, k)", means: "n × (n − 1) × … × (n − k + 1)" }],
      },
      {
        id: "handshake",
        name: "Handshaking lemma",
        tex: L`\sum_{v\in V}\deg(v)=2|E|`,
        meaning: "The sum of all degrees is twice the number of edges.",
        symbols: [{ sym: "deg(v)", means: "Number of edges incident to v" }],
      },
      {
        id: "binomial-thm",
        name: "Binomial theorem",
        tex: L`(x+y)^n=\sum_{k=0}^{n}\binom{n}{k}x^{n-k}y^{k}`,
        meaning: "Each term picks y from k of the n factors and x from the rest.",
        symbols: [{ sym: "n", means: "A nonnegative integer" }],
      },
    ],
    examples: [
      {
        title: "Committees versus slates",
        prompt:
          "From 10 people, how many ways can you choose a committee of 3? How many ways can you assign president, secretary, and treasurer, with no person holding two offices?",
        steps: [
          "Committee: order does not matter, so C(10, 3) = (10×9×8) / (3×2×1) = 720/6 = 120.",
          "Offices: order matters, so P(10, 3) = 10 × 9 × 8 = 720.",
          "The ratio is 3! = 6, the number of ways to rank a given trio.",
        ],
        answer: "120 committees, 720 slates.",
      },
      {
        title: "Induction for the sum of the first n integers",
        prompt: "Prove that 1 + 2 + … + n = n(n + 1)/2.",
        steps: [
          "Base: n = 1 gives 1 = 1×2/2.",
          "Assume the formula holds for n = m: the sum to m is m(m + 1)/2.",
          "Sum to m + 1 is that quantity plus (m + 1) = (m + 1)(m/2 + 1) = (m + 1)(m + 2)/2.",
          "The formula holds for m + 1. By induction it holds for every positive integer.",
        ],
        answer: "The closed form is n(n + 1)/2.",
      },
      {
        title: "Inclusion-exclusion",
        prompt:
          "In a class of 30, 18 play soccer, 12 play chess, and 7 play both. How many play at least one, and how many play neither?",
        steps: [
          "|A ∪ B| = |A| + |B| − |A ∩ B| = 18 + 12 − 7.",
          "That is 23.",
          "Neither: 30 − 23 = 7.",
        ],
        answer:
          "23 play at least one. 7 play neither. Adding 18 and 12 double-counted the 7 who play both.",
      },
      {
        title: "The binomial theorem, small",
        prompt: "Expand (x + y)³.",
        steps: [
          "Coefficients C(3, 0), C(3, 1), C(3, 2), C(3, 3) are 1, 3, 3, 1.",
          "Terms: x³, 3x²y, 3xy², y³.",
        ],
        answer:
          "(x + y)³ = x³ + 3x²y + 3xy² + y³. The coefficients are a row of Pascal’s triangle.",
      },
      {
        title: "Handshaking",
        prompt:
          "Five people are at a party. Is it possible that the numbers of people they have shaken hands with are 1, 1, 1, 1, and 1?",
        steps: [
          "The sum of degrees would be 5, which is odd.",
          "The handshaking lemma says the sum of degrees is twice the number of edges, hence even.",
          "An odd sum is impossible. At least one person must have shaken hands a different number of times.",
        ],
        answer:
          "Impossible. Any graph has an even number of odd-degree vertices, and here all five degrees are odd.",
      },
    ],
    practice: [
      {
        q: "A graph has 6 vertices, all of degree 3. How many edges?",
        a: "Sum of degrees is 6 × 3 = 18 = 2|E|, so |E| = 9.",
      },
      {
        q: "How many subsets does an n-element set have?",
        a: "2ⁿ. Each element is either in or out, independently. This is the binomial theorem with x = y = 1: the sum of C(n, k) is 2ⁿ.",
      },
    ],
    pitfalls: [
      "Combinations and permutations answer different questions. If the seats are labeled, you wanted permutations.",
      "The inductive step must work for an arbitrary m, not for a single example you tried.",
      "In graphs, a loop contributes 2 to the degree in the usual convention, because it meets the vertex twice. Know which convention a text is using.",
    ],
  },
  {
    slug: "proof",
    volume: "mathematics",
    level: "advanced",
    title: "The language of proof",
    minutes: 30,
    summary:
      "Definitions, quantifiers, and the handful of proof shapes — direct, contrapositive, contradiction, counterexample — that every later course assumes.",
    prereqs: ["discrete", "algebra"],
    ideas: [
      "A definition is a biconditional you are allowed to use in both directions.",
      "“For all” and “there exists” do not commute. Their order is the meaning.",
      "To disprove a universal claim, one counterexample is enough.",
      "Contradiction assumes the negation and derives an impossibility.",
    ],
    body: [
      "From here on, mathematics is less about getting a number and more about showing that a statement holds for every object of a certain kind. A statement is a sentence that is true or false. An open sentence has a variable; a quantifier closes it. “For every real x, x² ≥ 0” is a statement. “x² ≥ 0” is not, until you say for which x. The negation of “for all x, P(x)” is “there exists an x such that not P(x).” The negation of “there exists” is “for all, not.” Getting this wrong invalidates the proof before it starts.",
      "A direct proof assumes the hypothesis and walks, by definitions and previously proved facts, to the conclusion. A proof by contrapositive proves “if not Q, then not P” instead of “if P, then Q”; the two implications are equivalent. A proof by contradiction assumes the hypothesis and the negation of the conclusion, then reaches a statement that is false, such as 1 = 0. A counterexample is the honest way to kill a universal claim: you do not argue that it feels unlikely, you exhibit one object that fails it.",
      "Two habits matter more than vocabulary. First, when you say “let x be arbitrary,” you must not smuggle in extra properties. Second, an example can suggest a theorem and can never replace one, unless the claim was existential — in which case the example is the proof. The phrase “it is obvious” is allowed only when you could, if asked, fill in the step. Readers of analysis and algebra will ask.",
    ],
    formulas: [
      {
        id: "contrapositive",
        name: "Contrapositive",
        tex: L`(P\Rightarrow Q)\iff(\neg Q\Rightarrow\neg P)`,
        meaning:
          "An implication and its contrapositive are the same statement. The converse is a different statement.",
        symbols: [
          { sym: "⇒", means: "Implies" },
          { sym: "¬", means: "Not" },
        ],
      },
      {
        id: "negation-quantifiers",
        name: "Negating quantifiers",
        tex: L`\neg\forall x\, P(x)\iff\exists x\, \neg P(x)`,
        meaning: "The negation of a universal claim is an existence claim about a failure.",
        symbols: [
          { sym: "∀", means: "For all" },
          { sym: "∃", means: "There exists" },
        ],
      },
      {
        id: "de-morgan",
        name: "De Morgan",
        tex: L`\neg(P\wedge Q)\iff(\neg P)\vee(\neg Q)`,
        meaning:
          "The negation of an and is the or of the negations. There is a twin with and and or swapped.",
        symbols: [{ sym: "∧, ∨", means: "And, or" }],
      },
    ],
    examples: [
      {
        title: "A direct proof",
        prompt: "Prove: if n is an even integer, then n² is even.",
        steps: [
          "Assume n is even. By definition, n = 2k for some integer k.",
          "Then n² = 4k² = 2(2k²), which is 2 times an integer.",
          "So n² is even.",
        ],
        answer: "Evenness of n forces evenness of n², by the definition of even.",
      },
      {
        title: "A counterexample",
        prompt: "Disprove the claim that |x + y| = |x| + |y| for all real x and y.",
        steps: [
          "The claim is universal. One pair that fails is enough.",
          "Take x = 1 and y = −1.",
          "|1 + (−1)| = 0, while |1| + |−1| = 2.",
        ],
        answer:
          "The equality is false in general. It holds when x and y have the same sign, which is a different theorem.",
      },
      {
        title: "The contrapositive, used on purpose",
        prompt: "Prove: if n² is odd, then n is odd.",
        steps: [
          "The contrapositive is: if n is even, then n² is even.",
          "An even n is 2k, and n² = 4k² = 2(2k²), which is even.",
          "The contrapositive is proved, so the original implication is proved.",
        ],
        answer:
          "Odd squares come only from odd integers. The converse of a different statement is not what you proved.",
      },
      {
        title: "De Morgan on a concrete pair",
        prompt:
          "Let P be “the number is even” and Q be “the number is greater than 10.” Negate “P and Q,” and test it on 8 and on 12.",
        steps: [
          "¬(P ∧ Q) is equivalent to (¬P) ∨ (¬Q): odd, or at most 10.",
          "8 is even and not greater than 10, so “P and Q” is false and the negation is true.",
          "12 is even and greater than 10, so “P and Q” is true and the negation is false.",
        ],
        answer: "The negation is “odd or at most 10.” It holds for 8 and fails for 12.",
      },
      {
        title: "Negate the quantifiers, in order",
        prompt: "Negate: for every real x there exists a real y such that y² = x.",
        steps: [
          "Negation pushes in and flips each quantifier.",
          "“For every x, there exists y, P” becomes “there exists x such that for every y, not P.”",
          "So: there exists a real x such that for every real y, y² ≠ x.",
          "x = −1 is a witness. No real square is negative.",
        ],
        answer:
          "The negated statement is true. The original is false over the reals and true over the complexes, which is why the field matters.",
      },
    ],
    practice: [
      {
        q: "Write the negation of: for every ε > 0 there exists N such that for every n > N, |aₙ| < ε.",
        a: "There exists ε > 0 such that for every N there exists n > N with |aₙ| ≥ ε. This is exactly the statement that aₙ does not tend to 0.",
      },
      {
        q: "Prove by contrapositive: if n² is even, then n is even.",
        a: "The contrapositive says: if n is odd, then n² is odd. An odd n is 2k + 1, and n² = 4k² + 4k + 1 = 2(2k² + 2k) + 1, which is odd.",
      },
    ],
    pitfalls: [
      "The converse of a true implication can be false. “If it is raining, the ground is wet” does not mean a wet ground implies rain.",
      "Proving a statement for n = 1, 2, and 3 is not a proof for all n.",
      "“For all x there exists y” lets y depend on x. “There exists y for all x” demands one y that works for every x.",
    ],
  },
  {
    slug: "differential-equations",
    volume: "mathematics",
    level: "advanced",
    title: "Differential equations",
    minutes: 35,
    summary:
      "An equation relating a function to its derivatives. Separable equations, first-order linear equations, and the harmonic oscillator.",
    prereqs: ["integral-calculus"],
    ideas: [
      "The unknown is a function, not a number. A solution is any function that satisfies the equation on an interval.",
      "A first-order equation plus a point determines a unique solution, under a Lipschitz condition.",
      "Separable equations yield to algebra and one integral. Linear equations yield to an integrating factor.",
      "The oscillator x″ + ω²x = 0 is the source of sine and cosine in physics.",
    ],
    body: [
      "A differential equation constrains the way a quantity can change. The order is the highest derivative that appears. An ordinary differential equation has one independent variable; a partial differential equation has several. A general solution of a first-order equation contains one arbitrary constant; initial conditions pin the constant down. Existence is not automatic from writing the equation, but for y′ = f(t, y) with f reasonably smooth, Picard’s theorem supplies a unique solution through a given point.",
      "If the equation has the form dy/dx = g(x) h(y), separate: dy/h(y) = g(x) dx, and integrate both sides. You must watch where h(y) = 0; those constant solutions can be lost in the division. A first-order linear equation y′ + p(t) y = q(t) looks harder and is mechanical: multiply by the integrating factor μ = exp(∫ p dt). The left side becomes the derivative of μ y, and one more integration finishes the job.",
      "Second-order linear equations with constant coefficients are solved by trying e^{rt} and solving the resulting polynomial. For x″ + ω² x = 0 the characteristic roots are ±iω, and the real solutions are A cos(ωt) + B sin(ωt). That is simple harmonic motion: oscillation at angular frequency ω, forever, because no damping was put in the equation. Add a first-derivative term and the motion decays.",
    ],
    formulas: [
      {
        id: "separable",
        name: "Separable equation",
        tex: L`\frac{dy}{dx}=g(x)\,h(y)`,
        meaning:
          "Divide by h(y), multiply by dx, and integrate both sides. Check constant solutions h(y) = 0 separately.",
        symbols: [{ sym: "g, h", means: "Functions of one variable each" }],
      },
      {
        id: "integrating-factor",
        name: "Integrating factor",
        tex: L`\mu(t)=\exp\!\left(\int p(t)\,dt\right)`,
        meaning: "For y′ + p(t) y = q(t), multiply through by μ. Then (μ y)′ = μ q.",
        symbols: [{ sym: "p(t)", means: "The coefficient of y" }],
      },
      {
        id: "sho",
        name: "Simple harmonic oscillator",
        tex: L`x''+\omega^2 x=0`,
        meaning:
          "Acceleration is proportional to displacement, toward the origin. Solutions oscillate at angular frequency ω.",
        symbols: [{ sym: "ω", means: "Angular frequency, in radians per time" }],
      },
      {
        id: "sho-solution",
        name: "Oscillator solution",
        tex: L`x(t)=A\cos(\omega t)+B\sin(\omega t)`,
        meaning:
          "The general solution. A and B are fixed by two initial conditions, position and velocity.",
        symbols: [{ sym: "A, B", means: "Constants" }],
      },
      {
        id: "logistic-de",
        name: "Logistic equation",
        tex: L`\frac{dN}{dt}=rN\left(1-\frac{N}{K}\right)`,
        meaning: "Growth rate r when scarce, shutting off as N approaches the carrying capacity K.",
        symbols: [
          { sym: "K", means: "Carrying capacity" },
          { sym: "r", means: "Low-density growth rate" },
        ],
      },
    ],
    examples: [
      {
        title: "Separate and solve",
        prompt: "Solve dy/dx = 2x / y, with y(0) = 3. Take the positive branch.",
        steps: [
          "y dy = 2x dx.",
          "Integrate: y²/2 = x² + C.",
          "y(0) = 3 gives 9/2 = C, so y² = 2x² + 9.",
          "y = √(2x² + 9), the positive root, since y(0) is positive.",
        ],
        answer: "y = √(2x² + 9).",
      },
      {
        title: "A spring",
        prompt: "Solve x″ + 4x = 0 with x(0) = 1 and x′(0) = 0.",
        steps: [
          "Here ω² = 4, so ω = 2.",
          "x(t) = A cos(2t) + B sin(2t).",
          "x(0) = A = 1.",
          "x′(t) = −2A sin(2t) + 2B cos(2t), so x′(0) = 2B = 0. Thus B = 0.",
        ],
        answer: "x(t) = cos(2t). It starts at 1 with zero velocity and oscillates with period π.",
      },
      {
        title: "An integrating factor",
        prompt: "Solve y′ + 2y = 6, with y(0) = 1.",
        steps: [
          "p(t) = 2, so the integrating factor is e^{∫2 dt} = e^{2t}.",
          "Multiply through: (e^{2t} y)′ = 6 e^{2t}.",
          "Integrate: e^{2t} y = 3 e^{2t} + C, so y = 3 + C e^{−2t}.",
          "y(0) = 1 gives 3 + C = 1, so C = −2.",
        ],
        answer: "y = 3 − 2e^{−2t}. It starts at 1 and settles at the equilibrium 3.",
      },
      {
        title: "One step of logistic growth",
        prompt:
          "A population follows dN/dt = 0.5 N (1 − N/100), and right now N = 20. How fast is it growing?",
        steps: ["1 − N/K = 1 − 20/100 = 0.8.", "dN/dt = 0.5 × 20 × 0.8.", "That is 8."],
        answer:
          "8 individuals per unit time. The two constant solutions of the same equation are N = 0 and N = 100, where the rate is zero.",
      },
      {
        title: "Read the constants off the general solution",
        prompt: "Solve x″ + x = 0 with x(0) = 0 and x′(0) = 3.",
        steps: [
          "Here ω = 1, so the general solution is x(t) = A cos t + B sin t.",
          "x(0) = A = 0.",
          "x′(t) = −A sin t + B cos t, so x′(0) = B = 3.",
        ],
        answer:
          "x(t) = 3 sin t. The two constants in the oscillator solution are exactly the two initial conditions.",
      },
    ],
    practice: [
      {
        q: "Find the integrating factor for y′ + 3y = eˣ.",
        a: "μ = exp(∫ 3 dt) = e^{3t}. Multiplying through, (e^{3t} y)′ = e^{4t}, so e^{3t} y = e^{4t}/4 + C and y = eˣ/4 + C e^{−3t}.",
      },
      {
        q: "What constant solutions does the logistic equation have?",
        a: "dN/dt = 0 when N = 0 or N = K. Zero is unstable if r > 0; K is the stable equilibrium the population approaches.",
      },
    ],
    pitfalls: [
      "Dividing by y, or by h(y), silently drops the solution y = 0 when that solution exists.",
      "The general solution of a second-order equation needs two constants. One initial condition does not determine it.",
      "ω in the oscillator is angular frequency, not the frequency in cycles. The period is 2π/ω.",
    ],
  },
  {
    slug: "number-theory",
    volume: "mathematics",
    level: "advanced",
    title: "Number theory",
    minutes: 30,
    summary:
      "The integers, studied for their own structure: divisibility, congruences, and the first theorems about primes.",
    prereqs: ["arithmetic", "proof"],
    ideas: [
      "Congruence a ≡ b (mod m) means m divides a − b. It is an equivalence relation compatible with addition and multiplication.",
      "If a prime divides a product, it divides one of the factors.",
      "Fermat’s little theorem constrains powers modulo a prime.",
      "The integers modulo a prime form a field: every nonzero residue has a multiplicative inverse.",
    ],
    body: [
      "Number theory starts from divisibility. We write m | a when a = m q for some integer q. The relation a ≡ b (mod m) means m | (a − b). It splits the integers into m residue classes, and both addition and multiplication descend to those classes. That is modular arithmetic: clocks are arithmetic modulo 12, and bit operations often live modulo 2.",
      "Euclid’s lemma says that if a prime p divides ab, then p divides a or p divides b. Combined with existence of factorizations, it yields uniqueness: the fundamental theorem, already used in arithmetic, is really this lemma. The same circle of ideas produces the fact that there are infinitely many primes. Euclid’s proof still works: if p₁, …, pₖ were all of them, then N = p₁⋯pₖ + 1 would be divisible by none of them, so it would have a new prime factor.",
      "Fermat’s little theorem: if p is prime and p does not divide a, then a^{p−1} ≡ 1 (mod p). Equivalently aᵖ ≡ a (mod p) for every integer a. The generalization is Euler’s theorem, a^{φ(n)} ≡ 1 (mod n) when a and n are coprime, where φ(n) counts integers from 1 to n that are coprime to n. These are the arithmetic engine inside the RSA cryptosystem, which is number theory that happens to encrypt.",
    ],
    formulas: [
      {
        id: "congruence",
        name: "Congruence",
        tex: L`a\equiv b\pmod{m}\iff m\mid (a-b)`,
        meaning: "a and b leave the same remainder when divided by m.",
        symbols: [{ sym: "m", means: "The modulus, a positive integer" }],
      },
      {
        id: "fermat",
        name: "Fermat’s little theorem",
        tex: L`a^{p-1}\equiv 1\pmod{p}`,
        meaning: "When p is prime and p does not divide a. Powers repeat quickly modulo a prime.",
        symbols: [
          { sym: "p", means: "A prime" },
          { sym: "a", means: "An integer not divisible by p" },
        ],
      },
      {
        id: "euler-theorem",
        name: "Euler’s theorem",
        tex: L`a^{\varphi(n)}\equiv 1\pmod{n}`,
        meaning: "When gcd(a, n) = 1. Fermat is the special case n = p, where φ(p) = p − 1.",
        symbols: [{ sym: "φ(n)", means: "Euler’s totient" }],
      },
      {
        id: "inverse-mod",
        name: "Modular inverse",
        tex: L`ax\equiv 1\pmod{m}`,
        meaning:
          "Has a solution x exactly when gcd(a, m) = 1. Then x is the inverse of a modulo m.",
        symbols: [{ sym: "x", means: "An integer class modulo m" }],
      },
    ],
    examples: [
      {
        title: "A remainder without a huge power",
        prompt: "Find 2¹⁰ (mod 11).",
        steps: [
          "11 is prime and does not divide 2, so Fermat says 2¹⁰ ≡ 1 (mod 11).",
          "Directly: 2⁵ = 32 ≡ −1, so 2¹⁰ ≡ 1. Same answer.",
        ],
        answer: "1. The last digits of the division by 11 leave remainder 1.",
      },
      {
        title: "An inverse",
        prompt: "Find the inverse of 3 modulo 10.",
        steps: ["gcd(3, 10) = 1, so an inverse exists.", "Try: 3 × 7 = 21 ≡ 1 (mod 10)."],
        answer: "7. Check: 3 × 7 = 21, which is one more than a multiple of 10.",
      },
      {
        title: "Same remainder",
        prompt: "Show that 17 ≡ 5 (mod 12), and reduce 100 modulo 12.",
        steps: [
          "17 − 5 = 12, and 12 divides 12, so 17 ≡ 5 (mod 12).",
          "100 = 8×12 + 4, so 100 ≡ 4 (mod 12).",
          "Clocks: 17 hours after midnight is the same hour-hand place as 5 hours after midnight.",
        ],
        answer: "17 and 5 are the same class modulo 12. 100 leaves remainder 4.",
      },
      {
        title: "Euler, when the modulus is composite",
        prompt: "Compute 3⁴ modulo 10, and say why Euler applies.",
        steps: [
          "gcd(3, 10) = 1, so Euler’s theorem applies.",
          "φ(10) = φ(2·5) = 10 × (1 − 1/2) × (1 − 1/5) = 4.",
          "Therefore 3⁴ ≡ 1 (mod 10). Directly: 81 ends in 1.",
        ],
        answer: "3⁴ ≡ 1 (mod 10). Fermat would not apply, because 10 is not prime.",
      },
    ],
    practice: [
      {
        q: "Compute 7⁴ (mod 5) using Fermat.",
        a: "φ-style: 7 ≡ 2, and 2⁴ ≡ 1 (mod 5) because p − 1 = 4. So 7⁴ ≡ 1 (mod 5).",
      },
      {
        q: "Does 4 have an inverse modulo 6?",
        a: "gcd(4, 6) = 2 ≠ 1, so no. There is no integer x with 4x ≡ 1 (mod 6), because the left side is always even and 1 is odd modulo... more carefully, 4x − 1 would be divisible by 6 hence by 2, but 4x is even and even minus 1 is odd, never divisible by 2. Impossible.",
      },
    ],
    pitfalls: [
      "Fermat requires a prime modulus and a base not divisible by that prime. Composite moduli need Euler, and only when the base is coprime to the modulus.",
      "a ≡ b (mod m) does not mean a = b. It means they differ by a multiple of m.",
      "Cancellation modulo m is legal only when you divide by a unit, i.e., a number coprime to m.",
    ],
  },
  {
    slug: "real-analysis",
    volume: "mathematics",
    level: "advanced",
    title: "Real analysis",
    minutes: 40,
    summary:
      "The calculus, rebuilt on definitions. Limits, completeness of the reals, continuity, and what a derivative really is.",
    prereqs: ["proof", "differential-calculus", "integral-calculus"],
    ideas: [
      "A sequence converges to L when the terms eventually stay as close to L as anyone demands.",
      "The real numbers are complete: every nonempty set that is bounded above has a least upper bound.",
      "Continuity at a point is an ε–δ statement about inputs controlling outputs.",
      "On a closed bounded interval, a continuous function attains its maximum and its minimum.",
    ],
    body: [
      "Analysis is what you get when you refuse to say “approaches” without a definition. A sequence (aₙ) converges to L if for every ε > 0 there exists an integer N such that n > N implies |aₙ − L| < ε. The quantifier order is the whole content: you must answer every tolerance, and you may use a later starting index for a tighter tolerance. A limit of a function is the same idea with x → a instead of n → ∞, and with x ≠ a so the value f(a) is irrelevant.",
      "The rational numbers have holes. The set of rationals whose square is less than 2 is bounded above and has no least upper bound inside the rationals. The real numbers are defined, or axiomatized, so that every nonempty set bounded above has a least upper bound. From that single completeness axiom you get that monotone bounded sequences converge, that Cauchy sequences converge, and that the intermediate value theorem is true. Without it, calculus is a collection of formal tricks that sometimes fail.",
      "f is continuous at a if for every ε > 0 there exists δ > 0 such that |x − a| < δ implies |f(x) − f(a)| < ε. Uniform continuity demands one δ that works for the whole domain, for a given ε. On a closed bounded interval every continuous function is uniformly continuous, attains its bounds, and is Riemann integrable. The mean value theorem says that between a and b there is a point where the instantaneous rate equals the average rate. It is the bridge from local information, the derivative, to global information, the function.",
    ],
    formulas: [
      {
        id: "seq-limit",
        name: "Limit of a sequence",
        tex: L`\forall\varepsilon>0\ \exists N\ \forall n>N:\ |a_n-L|<\varepsilon`,
        meaning: "The definition of aₙ → L. Every tolerance ε is eventually met and stays met.",
        symbols: [
          { sym: "ε", means: "A positive tolerance you do not choose; you answer it" },
          { sym: "N", means: "A starting index that may depend on ε" },
        ],
      },
      {
        id: "eps-delta",
        name: "Continuity at a point",
        tex: L`\forall\varepsilon>0\ \exists\delta>0:\ |x-a|<\delta\Rightarrow|f(x)-f(a)|<\varepsilon`,
        meaning: "Inputs close enough to a force outputs close to f(a).",
        symbols: [
          { sym: "δ", means: "A positive allowance in the input, allowed to depend on ε and on a" },
        ],
      },
      {
        id: "mvt",
        name: "Mean value theorem",
        tex: L`f'(c)=\frac{f(b)-f(a)}{b-a}`,
        meaning:
          "For f continuous on [a, b] and differentiable on (a, b), some c strictly between a and b has derivative equal to the average slope.",
        symbols: [
          { sym: "c", means: "Some point in the open interval, not one you usually compute" },
        ],
      },
      {
        id: "lub",
        name: "Completeness",
        tex: L`\sup S\in\mathbb{R}`,
        meaning:
          "Every nonempty set S of reals that is bounded above has a least upper bound in the reals.",
        symbols: [{ sym: "sup S", means: "Least upper bound of S" }],
      },
    ],
    examples: [
      {
        title: "An ε–N proof",
        prompt: "Prove that 1/n → 0.",
        steps: [
          "Let ε > 0 be given.",
          "Choose an integer N > 1/ε, which exists by the Archimedean property.",
          "If n > N, then |1/n − 0| = 1/n < 1/N < ε.",
        ],
        answer:
          "The sequence converges to 0. The N you chose depends on ε, as the definition allows.",
      },
      {
        title: "Continuity of a linear function",
        prompt: "Prove that f(x) = 2x is continuous at x = 3.",
        steps: [
          "You need |2x − 6| < ε whenever |x − 3| is small.",
          "|2x − 6| = 2|x − 3|.",
          "Choose δ = ε/2. Then |x − 3| < δ implies |2x − 6| < ε.",
        ],
        answer:
          "Continuous at 3, and the same δ works at every point, so the function is uniformly continuous on the whole line.",
      },
      {
        title: "The mean value theorem, located",
        prompt: "For f(x) = x² on [1, 3], find the point c promised by the mean value theorem.",
        steps: [
          "Average slope: (f(3) − f(1)) / (3 − 1) = (9 − 1) / 2 = 4.",
          "f′(x) = 2x, so 2c = 4.",
          "c = 2, which lies strictly between 1 and 3.",
        ],
        answer: "c = 2. The tangent there is parallel to the secant from (1, 1) to (3, 9).",
      },
      {
        title: "A least upper bound the rationals miss",
        prompt:
          "Let S be the set of positive rationals whose square is less than 2. What is sup S, and why is it not rational?",
        steps: [
          "Every element of S is less than 2, so S is bounded above. Completeness says a least upper bound exists in the reals.",
          "That least upper bound is √2, because squares below 2 are exactly the positives below √2.",
          "√2 is not rational: if it were p/q in lowest terms, p² = 2q², so p is even, then q is even, contradicting lowest terms.",
        ],
        answer:
          "sup S = √2, which is real and not rational. This is the hole completeness is there to fill.",
      },
    ],
    practice: [
      {
        q: "Show that (−1)ⁿ does not converge.",
        a: "Suppose it converged to L. Take ε = 1. Eventually all terms would lie in (L − 1, L + 1), an interval of length 2. But consecutive terms are 2 apart (−1 and 1), so they cannot both fit in an open interval of length 2. Contradiction.",
      },
      {
        q: "Why is “f is continuous because you can draw it without lifting the pen” not a proof?",
        a: "It is an intuition about connected images of intervals, related to the intermediate value theorem, and it fails for several variables and for some pathological functions. The definition that can be used in a proof is ε–δ.",
      },
    ],
    pitfalls: [
      "Writing the quantifiers in the wrong order turns convergence into a different, usually false, statement.",
      "Boundedness of a sequence does not imply convergence. (−1)ⁿ is the witness.",
      "Differentiability is strictly stronger than continuity. Continuity does not give you a derivative.",
    ],
  },
  {
    slug: "complex-analysis",
    volume: "mathematics",
    level: "frontier",
    title: "Complex analysis",
    minutes: 30,
    summary:
      "Calculus over the complex numbers. Differentiability once, in the complex sense, is so strong that it creates infinite smoothness and the residue calculus.",
    prereqs: ["real-analysis", "trigonometry"],
    ideas: [
      "A complex number x + iy is a point in the plane, and multiplying by i rotates a quarter turn.",
      "Euler’s formula identifies e^{iθ} with the point (cos θ, sin θ) on the unit circle.",
      "Complex differentiability on a region implies a power series expansion there.",
      "The residue theorem evaluates real integrals by summing coefficients of 1/(z − a).",
    ],
    body: [
      "Write z = x + iy with x, y real and i² = −1. Addition is vector addition. Multiplication has the rule i² = −1, and geometrically it multiplies lengths and adds arguments. The conjugate x − iy reflects across the real axis, and |z|² = z times its conjugate. Every nonzero complex number has an inverse, namely the conjugate divided by the squared modulus. The complex numbers are a field that cannot be ordered in a way compatible with the arithmetic, because squares can be negative.",
      "Euler’s formula e^{iθ} = cos θ + i sin θ is the statement that the exponential map sends the imaginary axis onto the unit circle. It packages the angle-sum formulas: e^{i(α+β)} = e^{iα} e^{iβ}. De Moivre’s formula (cos θ + i sin θ)ⁿ = cos(nθ) + i sin(nθ) is the same fact.",
      "A function is holomorphic at a point when the complex derivative exists in a neighborhood. That single requirement, a limit of [f(z + h) − f(z)] / h as the complex increment h → 0, is far stronger than two real partial derivatives. Holomorphic functions are analytic: they equal their Taylor series. Cauchy's integral formula recovers the value inside a contour from the values on the contour, f(a) = (1 / 2πi) ∮ f(z)/(z − a) dz. If a function has isolated singularities, the integral around a large contour equals 2πi times the sum of residues, the coefficients of 1/(z − a) in the local Laurent series. That is a practical machine for definite integrals.",
    ],
    formulas: [
      {
        id: "euler-formula",
        name: "Euler’s formula",
        tex: L`e^{i\theta}=\cos\theta+i\sin\theta`,
        meaning: "The exponential of a pure imaginary number lies on the unit circle.",
        symbols: [{ sym: "θ", means: "A real angle, in radians" }],
      },
      {
        id: "modulus",
        name: "Modulus",
        tex: L`|z|=\sqrt{x^2+y^2},\qquad z=x+iy`,
        meaning: "Distance from the origin in the complex plane.",
        symbols: [{ sym: "x, y", means: "Real and imaginary parts" }],
      },
      {
        id: "cauchy",
        name: "Cauchy’s integral formula",
        tex: L`f(a)=\frac{1}{2\pi i}\oint_{\gamma}\frac{f(z)}{z-a}\,dz`,
        meaning:
          "A holomorphic function inside and on a simple closed curve is determined by its boundary values.",
        symbols: [{ sym: "γ", means: "A simple closed curve, positively oriented, with a inside" }],
      },
      {
        id: "residue",
        name: "Residue theorem",
        tex: L`\oint_{\gamma} f(z)\,dz=2\pi i\sum_k \mathrm{Res}(f,a_k)`,
        meaning:
          "The integral is 2πi times the sum of residues at singularities inside the contour.",
        symbols: [
          { sym: "Res(f, a)", means: "Coefficient of 1/(z − a) in the Laurent series at a" },
        ],
      },
    ],
    examples: [
      {
        title: "A power on the unit circle",
        prompt: "Compute (1 + i)² in two ways.",
        steps: [
          "Algebra: 1 + 2i + i² = 1 + 2i − 1 = 2i.",
          "Polar: 1 + i has modulus √2 and argument π/4. Squaring doubles the argument and squares the modulus: modulus 2, argument π/2, which is the point 2i.",
        ],
        answer: "2i. The two calculations agree.",
      },
      {
        title: "Euler at a right angle",
        prompt: "What is e^{iπ/2}?",
        steps: ["cos(π/2) + i sin(π/2) = 0 + i·1."],
        answer: "i. And e^{iπ} = −1, which is Euler’s identity e^{iπ} + 1 = 0.",
      },
      {
        title: "Cauchy’s formula on a polynomial",
        prompt:
          "Let f(z) = z² + 1, and let γ be the unit circle, counterclockwise. Use Cauchy’s formula to evaluate the integral of f(z)/z around γ.",
        steps: [
          "f is entire, and a = 0 is inside the unit circle.",
          "Cauchy says f(0) = (1/(2πi)) ∮ f(z)/z dz.",
          "f(0) = 1, so the integral is 2πi × 1.",
        ],
        answer: "2πi. You did not need to parametrize the circle.",
      },
      {
        title: "A residue you can see",
        prompt:
          "Find the residue of 1/(z(z − 1)) at z = 0, and the integral of that function around a small circle about 0.",
        steps: [
          "Partial fractions: 1/(z(z − 1)) = A/z + B/(z − 1).",
          "A = 1/(0 − 1) = −1, and B = 1.",
          "The residue at 0 is the coefficient of 1/z, which is −1.",
          "A small circle about 0, counterclockwise, encloses only that singularity, so the integral is 2πi × (−1).",
        ],
        answer: "Residue −1. Integral −2πi.",
      },
    ],
    practice: [
      {
        q: "Find the residue of 1/z at 0, and the integral of 1/z around the unit circle.",
        a: "1/z is already its Laurent series. The coefficient of 1/z is 1, so the residue is 1. The integral is 2πi.",
      },
      {
        q: "Express cos θ using complex exponentials.",
        a: "cos θ = (e^{iθ} + e^{−iθ}) / 2. Sine is (e^{iθ} − e^{−iθ}) / (2i).",
      },
    ],
    pitfalls: [
      "Complex differentiability is not the same as differentiability of the two real component functions. The Cauchy–Riemann equations must hold.",
      "A branch of the logarithm, or of a square root, cannot be holomorphic on the whole punctured plane. You have to cut the plane.",
      "The orientation of the contour matters. Clockwise reverses the sign of the integral.",
    ],
  },
  {
    slug: "abstract-algebra",
    volume: "mathematics",
    level: "frontier",
    title: "Abstract algebra",
    minutes: 35,
    summary:
      "Groups, rings, and fields: the study of operations by the axioms they satisfy, not by what the elements happen to be.",
    prereqs: ["proof", "linear-algebra", "number-theory"],
    ideas: [
      "A group is a set with one associative operation, an identity, and inverses.",
      "Lagrange’s theorem: the order of a subgroup divides the order of a finite group.",
      "A ring has addition and multiplication. A field is a ring where every nonzero element has a multiplicative inverse.",
      "Homomorphisms are the structure-preserving maps, and their kernels measure how much they collapse.",
    ],
    body: [
      "Abstract algebra extracts the pattern and throws away the costume. The integers under addition, the nonzero reals under multiplication, the symmetries of a square, and the invertible matrices under multiplication all satisfy the same four group axioms: a binary operation that is associative, a two-sided identity, and a two-sided inverse for every element. You prove a theorem once, from the axioms, and it applies to all of them. Commutativity is extra. When it holds, the group is called abelian.",
      "A subgroup is a subset that is itself a group under the same operation. Lagrange’s theorem says that if G is finite and H is a subgroup, then |H| divides |G|. The converse is false: a divisor of the order need not be the order of a subgroup, though it is for cyclic groups, and by Cauchy's theorem a prime divisor is always the order of some element. The symmetric group on 3 letters, with 6 elements, has subgroups of order 1, 2, 3, and 6, and no subgroup of... it does have those. A4, order 12, has no subgroup of order 6. That is the standard witness that the converse of Lagrange fails.",
      "Rings add a second operation. The integers are the motivating example: addition makes an abelian group, multiplication is associative and distributes over addition. A field also requires that the nonzero elements form a group under multiplication. The rationals, the reals, the complexes, and the integers modulo a prime are fields. The integers modulo a composite number are not. A homomorphism is a map that preserves the operations. For groups, the kernel, the set of elements sent to the identity, is a normal subgroup, and the first isomorphism theorem says the image is isomorphic to the group modulo the kernel.",
    ],
    formulas: [
      {
        id: "group-axioms",
        name: "Group axioms",
        tex: L`(ab)c=a(bc),\quad ae=a,\quad aa^{-1}=e`,
        meaning:
          "Associativity, identity, inverses. Closure is part of saying the operation maps the set to itself.",
        symbols: [
          { sym: "e", means: "The identity element" },
          { sym: "a⁻¹", means: "The inverse of a" },
        ],
      },
      {
        id: "lagrange",
        name: "Lagrange’s theorem",
        tex: L`|H|\ \text{divides}\ |G|`,
        meaning:
          "For a subgroup H of a finite group G. The index |G|/|H| counts the distinct cosets.",
        symbols: [{ sym: "|G|", means: "Number of elements, the order of G" }],
      },
      {
        id: "kernel",
        name: "Kernel of a homomorphism",
        tex: L`\ker\varphi=\{g\in G:\varphi(g)=e\}`,
        meaning:
          "Elements collapsed to the identity. Trivial kernel means the homomorphism is injective.",
        symbols: [{ sym: "φ", means: "A group homomorphism" }],
      },
      {
        id: "field",
        name: "Field",
        tex: L`\mathbb{Z}/p\mathbb{Z}\ \text{is a field}\iff p\ \text{is prime}`,
        meaning: "Modular arithmetic gives a field exactly for prime moduli.",
        symbols: [{ sym: "Z/pZ", means: "Residue classes modulo p" }],
      },
    ],
    examples: [
      {
        title: "A small group",
        prompt: "Show that the residues {1, 2, 3, 4} modulo 5 form a group under multiplication.",
        steps: [
          "The product of two of them is never divisible by 5, so the set is closed up to residues.",
          "Multiplication is associative, and 1 is the identity.",
          "Inverses: 1·1, 2·3 = 6 ≡ 1, 4·4 = 16 ≡ 1. Every element has an inverse.",
        ],
        answer:
          "It is a group of order 4. In fact it is cyclic, generated by 2: the powers of 2 mod 5 are 2, 4, 3, 1.",
      },
      {
        title: "Lagrange in action",
        prompt: "In a group of order 15, what are the possible orders of an element?",
        steps: [
          "The order of an element is the order of the cyclic subgroup it generates.",
          "That order divides 15, by Lagrange.",
          "Possible orders: 1, 3, 5, 15.",
        ],
        answer: "1, 3, 5, or 15. There is no element of order 2, 4, 6, 7, and so on.",
      },
      {
        title: "A kernel",
        prompt:
          "Let φ: ℤ → ℤ/2ℤ send n to its residue modulo 2. What is the kernel, and what does the first isomorphism theorem say here?",
        steps: [
          "The identity of the codomain is the class of even numbers, 0 mod 2.",
          "ker φ is the even integers, 2ℤ.",
          "The image is all of ℤ/2ℤ, and ℤ / 2ℤ is isomorphic to that image. The kernel measured exactly the collapse.",
        ],
        answer:
          "The kernel is 2ℤ. Trivial kernel would have meant φ is injective, and this one is not.",
      },
      {
        title: "A field, and a near miss",
        prompt:
          "In ℤ/5ℤ, find the multiplicative inverse of 2. Why does the same request fail for 2 in ℤ/4ℤ?",
        steps: [
          "Modulo 5: 2 × 3 = 6 ≡ 1. So 3 is the inverse.",
          "5 is prime, so every nonzero residue has an inverse and ℤ/5ℤ is a field.",
          "Modulo 4, 2 × 0, 2 × 1, 2 × 2, 2 × 3 are 0, 2, 0, 2. None is 1.",
        ],
        answer: "Inverse of 2 mod 5 is 3. There is no inverse of 2 mod 4, so ℤ/4ℤ is not a field.",
      },
    ],
    practice: [
      {
        q: "Is the set of integers under subtraction a group?",
        a: "No. Subtraction is not associative: (1 − 2) − 3 = −4, while 1 − (2 − 3) = 2.",
      },
      {
        q: "Why do the residues modulo 4 fail to be a field?",
        a: "2 has no multiplicative inverse: 2x is always even, hence 0 or 2 mod 4, never 1. Zero divisors appear: 2·2 ≡ 0.",
      },
    ],
    pitfalls: [
      "The converse of Lagrange is false. Do not assume a subgroup of every dividing order.",
      "In a nonabelian group, ab = ba is a special event, not a default. The symmetries of a square do not all commute.",
      "Kernel is a subgroup of the domain, not of the codomain. The image is the subgroup of the codomain.",
    ],
  },
  {
    slug: "topology",
    volume: "mathematics",
    level: "frontier",
    title: "Topology",
    minutes: 30,
    summary:
      "What remains of geometry when you may bend and stretch but not tear: open sets, continuity, compactness, and connectedness.",
    prereqs: ["real-analysis", "proof"],
    ideas: [
      "A topology is a family of open sets closed under arbitrary unions and finite intersections.",
      "A function is continuous exactly when the preimage of every open set is open.",
      "Compact sets are those for which every open cover has a finite subcover. In Rⁿ they are the closed bounded sets.",
      "Connected means the set is not the union of two nonempty disjoint open pieces.",
    ],
    body: [
      "Topology keeps continuity and throws away distance, or rather, it notices that continuity can be stated without numbers. You declare which sets are open. The declaration must include the empty set and the whole space, and it must survive arbitrary unions and finite intersections. In the real line the open sets are unions of open intervals, and that choice reproduces the ε–δ notion of continuity. Other choices of open sets give other geometries: the discrete topology makes every function continuous, the indiscrete topology makes only constants continuous into a Hausdorff space.",
      "With open sets in hand, continuity is a single sentence: f is continuous when f⁻¹(U) is open whenever U is open. Sequences are no longer the definition, though in metric spaces they still detect the same closed sets. A homeomorphism is a continuous bijection with continuous inverse. It is the notion of “the same shape” for a topologist. A coffee cup with a handle and a doughnut are homeomorphic; a coffee cup and a ball are not, because removing a circle can disconnect one and not the other in a way no homeomorphism can repair. That invariant is the start of algebraic topology.",
      "Two properties do most of the work that closed intervals did in analysis. A space is compact when every cover by open sets has a finite subcover. A continuous image of a compact space is compact, so a continuous real function on a compact set attains its bounds — the extreme value theorem, with the interval hypothesis replaced by the property that made the proof work. A space is connected when it is not the union of two nonempty disjoint open sets. Continuous images of connected sets are connected, which is the intermediate value theorem in its natural habitat.",
    ],
    formulas: [
      {
        id: "continuity-open",
        name: "Continuity",
        tex: L`U\ \text{open}\implies f^{-1}(U)\ \text{open}`,
        meaning: "The definition of a continuous map between topological spaces.",
        symbols: [
          { sym: "f⁻¹(U)", means: "The set of points sent into U, not an inverse function" },
        ],
      },
      {
        id: "compact",
        name: "Compactness",
        tex: L`X=\bigcup_{\alpha}U_{\alpha}\implies X=\bigcup_{i=1}^{n}U_{\alpha_i}`,
        meaning: "Every open cover has a finite subcover. In Rⁿ, equivalent to closed and bounded.",
        symbols: [{ sym: "Uα", means: "Open sets whose union is the whole space" }],
      },
      {
        id: "connected",
        name: "Connectedness",
        tex: L`X=A\cup B,\ A\cap B=\emptyset,\ A,B\ \text{open}\implies A=\emptyset\ \text{or}\ B=\emptyset`,
        meaning: "The space cannot be split into two nonempty disjoint open pieces.",
        symbols: [{ sym: "A, B", means: "Open subsets of X" }],
      },
      {
        id: "homeomorphism",
        name: "Homeomorphism",
        tex: L`f\ \text{bijective},\quad f\ \text{and}\ f^{-1}\ \text{continuous}`,
        meaning: "A reversible continuous deformation. The two spaces are topologically the same.",
        symbols: [{ sym: "f⁻¹", means: "The inverse function, which must also be continuous" }],
      },
    ],
    examples: [
      {
        title: "Open, closed, neither",
        prompt: "In the real line with the standard topology, classify (0, 1), [0, 1], and (0, 1].",
        steps: [
          "(0, 1) is a basic open interval, hence open. It is not closed: its complement is not open, since 0 is a boundary point.",
          "[0, 1] is closed and bounded, hence compact. It is not open.",
          "(0, 1] is neither. Any neighborhood of 1 leaves the set, so it is not open; 0 is a missing limit point, so it is not closed.",
        ],
        answer: "Open; closed (and compact); neither.",
      },
      {
        title: "Why 1/x has no maximum on (0, 1]",
        prompt: "f(x) = 1/x on (0, 1] is continuous. Why does the extreme value theorem not apply?",
        steps: [
          "The theorem needs a compact domain.",
          "(0, 1] is not closed, hence not compact in R.",
          "Indeed f is unbounded: as x approaches 0, f exceeds every candidate maximum.",
        ],
        answer:
          "The hypothesis fails, and so does the conclusion. On [δ, 1] for any δ > 0 the maximum exists and equals 1/δ.",
      },
      {
        title: "A space split in two",
        prompt:
          "Show that X = (0, 1) ∪ (2, 3), with the subspace topology from the real line, is disconnected.",
        steps: [
          "Let A = (0, 1) and B = (2, 3).",
          "Both are open in X, because each is the intersection of X with an open set of the line.",
          "They are nonempty, disjoint, and their union is X.",
        ],
        answer:
          "X is disconnected. A connected subset of the line is an interval, and this is two of them.",
      },
      {
        title: "A homeomorphism, not just a bijection",
        prompt: "Show that f(x) = tan(π(x − 1/2)) is a homeomorphism from (0, 1) onto ℝ.",
        steps: [
          "As x runs through (0, 1), the argument π(x − 1/2) runs through (−π/2, π/2).",
          "Tangent is a continuous bijection from that interval onto the reals, and its inverse arctan is continuous.",
          "So f is a continuous bijection with continuous inverse.",
        ],
        answer:
          "(0, 1) and the whole real line are the same shape topologically. They are not the same metrically: one is bounded.",
      },
    ],
    practice: [
      {
        q: "The map t ↦ (cos 2πt, sin 2πt) sends [0, 1) continuously onto the unit circle, and it is one-to-one. Is it a homeomorphism?",
        a: "No. It is a continuous bijection, but the inverse is not continuous: angles just below a full turn come from t near 1, while angles just above 0 come from t near 0, and those inputs are far apart in [0, 1). Equivalently, the circle is compact and [0, 1) is not, so they are not homeomorphic.",
      },
      {
        q: "Are the rationals connected in the subspace topology?",
        a: "No. For example, rationals less than √2 and rationals greater than √2 form a separation. Any two nonempty pieces of Q with a gap between them work.",
      },
    ],
    pitfalls: [
      "“Open” is relative to the space you are in. (0, 1] is not open in R, but it is open in the space (0, 1].",
      "A continuous bijection need not have a continuous inverse. Compactness of the domain plus a Hausdorff codomain repairs this.",
      "Closed and bounded is compactness only in Rⁿ with the standard metric. In infinite-dimensional spaces it fails.",
    ],
  },
  {
    slug: "frontier",
    volume: "mathematics",
    level: "frontier",
    title: "The frontier: analysis, geometry, and categories",
    minutes: 35,
    summary:
      "Three doors past the undergraduate core — functional analysis, algebraic geometry, and category theory — stated honestly as definitions and one theorem each.",
    prereqs: ["real-analysis", "abstract-algebra", "topology", "linear-algebra"],
    ideas: [
      "Functional analysis is linear algebra in infinite dimensions, with limits.",
      "A Banach space is a complete normed vector space. A Hilbert space also has an inner product.",
      "Algebraic geometry studies shapes cut out by polynomial equations, and it lets those equations live over any field.",
      "A category is objects and arrows with composition. Functors are the maps between categories.",
    ],
    body: [
      "Finite-dimensional linear algebra ends too soon for analysis. Functions themselves form vector spaces: the set of continuous functions on [0, 1], the set of square-integrable functions, the set of bounded sequences. A norm is a length ||x|| satisfying the usual rules, and a space is Banach when every Cauchy sequence converges inside it. Completeness is what lets you take limits of approximations and stay in the space. A Hilbert space adds an inner product whose norm is ||x|| = √⟨x, x⟩. Orthonormal bases, orthogonal projection, and the spectral theorem for compact self-adjoint operators all survive, with hypotheses you must now state. The spectral theorem is why quantum mechanics can talk about observables as operators and measurement values as eigenvalues, including continuous spectra.",
      "Algebraic geometry begins with a polynomial, or a list of them. The variety V(f₁, …, fₖ) is the set of points where they all vanish. Over the reals, x² + y² + 1 = 0 defines the empty set; over the complexes it defines a curve. Hilbert’s nullstellensatz says that over an algebraically closed field, the ideal of polynomials vanishing on V(I) is the radical of I. Geometry and ideal theory become the same subject. Modern algebraic geometry replaces the variety by a scheme, so the equations can remember multiplicity and can live in families. You do not need schemes to use the idea that a shape defined by equations has an algebraic description of its functions.",
      "Category theory is the language that notices the same diagram in all of the above. A category has objects, morphisms between them, an identity morphism on each object, and an associative composition. Sets and functions form a category. Groups and homomorphisms form a category. Topological spaces and continuous maps form a category. A functor sends objects to objects and morphisms to morphisms, preserving identities and composition. The fundamental group is a functor from pointed spaces to groups. Yoneda’s lemma says an object is determined, up to isomorphism, by the morphisms into or out of it: to know the object, know how the rest of the category sees it. That sentence is the whole spirit of the subject, and it is a precise theorem, not a slogan, once the functor category is defined.",
    ],
    formulas: [
      {
        id: "norm",
        name: "Norm",
        tex: L`\|x\|\ge 0,\quad \|cx\|=|c|\,\|x\|,\quad \|x+y\|\le\|x\|+\|y\|`,
        meaning:
          "Length: positive, scales, and satisfies the triangle inequality. Zero only at the zero vector.",
        symbols: [{ sym: "||x||", means: "The norm of a vector" }],
      },
      {
        id: "inner",
        name: "Inner product",
        tex: L`\langle ax+by,z\rangle=a\langle x,z\rangle+b\langle y,z\rangle,\quad \langle x,x\rangle\ge 0`,
        meaning: "A generalization of the dot product. It defines a norm by ||x|| = √⟨x, x⟩.",
        symbols: [
          {
            sym: "⟨ , ⟩",
            means: "Inner product, linear in the first slot in the convention used here",
          },
        ],
      },
      {
        id: "variety",
        name: "Affine variety",
        tex: L`V(f)=\{(x_1,\ldots,x_n): f(x_1,\ldots,x_n)=0\}`,
        meaning:
          "The shape cut out by one polynomial equation. Several polynomials give an intersection of such shapes.",
        symbols: [{ sym: "f", means: "A polynomial" }],
      },
      {
        id: "functor",
        name: "Functor",
        tex: L`F(\mathrm{id}_A)=\mathrm{id}_{F(A)},\qquad F(g\circ f)=F(g)\circ F(f)`,
        meaning:
          "A functor preserves identities and composition. It is a homomorphism of categories.",
        symbols: [{ sym: "F", means: "A (covariant) functor" }],
      },
      {
        id: "banach-fixed",
        name: "Banach fixed-point theorem",
        tex: L`d(Tx,Ty)\le k\, d(x,y),\quad 0\le k<1`,
        meaning:
          "A contraction on a nonempty complete metric space has a unique fixed point, and iteration converges to it from anywhere.",
        symbols: [
          { sym: "T", means: "The map" },
          { sym: "k", means: "A uniform contraction constant strictly less than 1" },
        ],
      },
    ],
    examples: [
      {
        title: "A contraction finds a root",
        prompt: "On the reals, consider T(x) = cos x. Why does iteration converge?",
        steps: [
          "By the mean value theorem, |cos x − cos y| = |sin c| |x − y| ≤ k |x − y| is not quite global, because |sin c| can be 1.",
          "On the interval [0, 1], the derivative of cos is −sin, and |sin x| ≤ sin 1 < 0.85, so T maps a neighborhood of its fixed point to itself and is a contraction there.",
          "Starting at 0 and iterating cosine converges to the unique solution of cos x = x, the Dottie number, about 0.739.",
        ],
        answer:
          "Iteration converges to the unique fixed point of cosine near 0.739. The theorem supplies existence, uniqueness, and the algorithm.",
      },
      {
        title: "A variety you already know",
        prompt: "What is V(x² + y² − 1) over the reals?",
        steps: [
          "The equation x² + y² = 1 is the unit circle.",
          "Over the complexes the same equation defines a complex curve, a different and larger object.",
        ],
        answer:
          "The unit circle in the plane. Algebraic geometry’s first examples are the curves of high-school analytic geometry.",
      },
      {
        title: "A norm you already trust",
        prompt:
          "On ℝ² with the Euclidean norm, find ||(3, 4)|| and check the triangle inequality on (3, 4) and (−3, 0).",
        steps: [
          "||(3, 4)|| = √(9 + 16) = 5.",
          "||(−3, 0)|| = 3.",
          "Their sum is (0, 4), with length 4, and 4 ≤ 5 + 3.",
        ],
        answer:
          "Length 5. The triangle inequality holds, as it must for any norm: the straight path is never longer than the broken one.",
      },
      {
        title: "An inner product",
        prompt:
          "With the standard dot product, compute ⟨(1, 2), (3, 4)⟩ and the norm it induces on (1, 2).",
        steps: [
          "⟨(1, 2), (3, 4)⟩ = 1·3 + 2·4 = 11.",
          "⟨(1, 2), (1, 2)⟩ = 1 + 4 = 5.",
          "The induced norm is √5.",
        ],
        answer: "The inner product is 11. The length of (1, 2) is √5.",
      },
      {
        title: "A functor you have used",
        prompt:
          "The forgetful map sends a group to its underlying set, and a homomorphism to the same function of elements. Why is that a functor?",
        steps: [
          "It sends objects of the category of groups to objects of the category of sets.",
          "It sends a homomorphism to a function, and the identity homomorphism goes to the identity function.",
          "Composition is preserved because composing homomorphisms and then forgetting is the same as forgetting and then composing the functions.",
        ],
        answer:
          "Forgetting the operation is a functor from groups to sets. It keeps the arrows and drops the algebra.",
      },
    ],
    practice: [
      {
        q: "Why is the set of polynomials not a Banach space under the usual “size of coefficients” attempts people first try, and what is the real obstruction people mean?",
        a: "The space of polynomials is a vector space, but under the norm ||p|| = sup on [0, 1] of |p|, it is not complete: there are Cauchy sequences of polynomials converging uniformly to functions that are not polynomials, such as a partial-sum sequence for a nonpolynomial continuous function, by Stone–Weierstrass ideas, or simply the partial sums of a geometric series converging to 1/(1 − x/2) on [0, 1], which is not a polynomial. The completion is a larger space of functions. That is the point of Banach spaces: you complete.",
      },
      {
        q: "Name three categories you have already used in this book.",
        a: "Sets and functions. Vector spaces and linear maps. Groups and homomorphisms. Topological spaces and continuous maps. Any three of these.",
      },
    ],
    pitfalls: [
      "Infinite-dimensional spaces do not have the theorem “a linear injection from V to V is a surjection.” That equivalence is finite-dimensional.",
      "The real and complex points of the same equations can be wildly different. Always say which field you are working over.",
      "Category theory does not replace the earlier subjects. It organizes them. A functor you cannot compute on a single example is a definition you have not understood.",
    ],
  },
];

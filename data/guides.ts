export type GuideSection = {
  heading: string;
  paragraphs: readonly string[];
  formula?: string;
};

export type GuideExample = {
  problem: string;
  steps: readonly string[];
  answer: string;
};

export type Guide = {
  slug: string;
  title: string;
  shortTitle: string;
  category: "Calculus" | "Algebra" | "Linear Algebra";
  description: string;
  difficulty: "Beginner" | "Intermediate";
  readingMinutes: number;
  updatedAt: string;
  calculator: { label: string; href: string };
  objectives: readonly string[];
  sections: readonly GuideSection[];
  example: GuideExample;
  mistakes: readonly string[];
};

export const guides: readonly Guide[] = [
  {
    slug: "derivative-rules",
    title: "Derivative Rules: Power, Product, Quotient, and Chain Rules",
    shortTitle: "Derivative rules",
    category: "Calculus",
    description: "Learn the four differentiation rules that solve most introductory derivative problems, with a complete worked example.",
    difficulty: "Beginner",
    readingMinutes: 8,
    updatedAt: "2026-07-12",
    calculator: { label: "Derivative Calculator", href: "/derivative-calculator" },
    objectives: ["Differentiate powers and sums", "Recognize product and quotient structures", "Apply the chain rule to composite functions"],
    sections: [
      { heading: "Start with the power rule", paragraphs: ["For a real exponent n, multiply by the exponent and reduce the exponent by one. Constants differentiate to zero, and sums can be differentiated term by term."], formula: "\\frac{d}{dx}x^n=nx^{n-1}" },
      { heading: "Products and quotients need their own rules", paragraphs: ["Do not differentiate a product by multiplying the two derivatives. Keep one factor unchanged while differentiating the other, then reverse their roles.", "For a quotient, square the denominator and preserve the order in the numerator."], formula: "(uv)'=u'v+uv',\\qquad \\left(\\frac{u}{v}\\right)'=\\frac{u'v-uv'}{v^2}" },
      { heading: "Use the chain rule for functions inside functions", paragraphs: ["Differentiate the outside function first, leave the inside unchanged, and multiply by the derivative of the inside. Work from the outside inward when several layers are nested."], formula: "\\frac{d}{dx}f(g(x))=f'(g(x))g'(x)" }
    ],
    example: { problem: "Differentiate x² sin(x)", steps: ["Identify a product: u=x² and v=sin(x).", "Compute u'=2x and v'=cos(x).", "Apply u'v+uv' and simplify."], answer: "2x\\sin(x)+x^2\\cos(x)" },
    mistakes: ["Multiplying u' and v' instead of using the product rule", "Forgetting the inner derivative in the chain rule", "Changing the order u'v−uv' in the quotient rule"]
  },
  {
    slug: "integration-basics",
    title: "Integration Basics: Antiderivatives and Definite Integrals",
    shortTitle: "Integration basics",
    category: "Calculus",
    description: "Understand antiderivatives, constants of integration, and how definite integrals measure signed accumulation.",
    difficulty: "Beginner",
    readingMinutes: 9,
    updatedAt: "2026-07-12",
    calculator: { label: "Integral Calculator", href: "/integral-calculator" },
    objectives: ["Reverse the power rule", "Include the constant of integration", "Evaluate a definite integral with the Fundamental Theorem"],
    sections: [
      { heading: "An indefinite integral is a family of functions", paragraphs: ["An antiderivative F satisfies F'(x)=f(x). Because every constant disappears when differentiated, an indefinite integral must include +C."], formula: "\\int f(x)\\,dx=F(x)+C" },
      { heading: "Reverse the power rule", paragraphs: ["Increase the exponent by one and divide by the new exponent. The special case n=−1 produces a logarithm rather than the power formula."], formula: "\\int x^n\\,dx=\\frac{x^{n+1}}{n+1}+C,\\quad n\\ne-1" },
      { heading: "Definite integrals use endpoint values", paragraphs: ["Find an antiderivative and subtract its value at the lower endpoint from its value at the upper endpoint. The result is signed area: regions below the axis contribute negatively."], formula: "\\int_a^b f(x)\\,dx=F(b)-F(a)" }
    ],
    example: { problem: "Evaluate ∫₀¹ x² dx", steps: ["Use the power rule to find x³/3.", "Evaluate at x=1 and x=0.", "Subtract the lower value from the upper value."], answer: "\\frac{1^3}{3}-\\frac{0^3}{3}=\\frac13" },
    mistakes: ["Leaving out +C for an indefinite integral", "Using the power rule when n=−1", "Adding endpoint values instead of subtracting F(a) from F(b)"]
  },
  {
    slug: "understanding-limits",
    title: "Understanding Limits and Indeterminate Forms",
    shortTitle: "Understanding limits",
    category: "Calculus",
    description: "Evaluate limits with substitution, algebraic simplification, one-sided reasoning, and standard trigonometric limits.",
    difficulty: "Beginner",
    readingMinutes: 8,
    updatedAt: "2026-07-12",
    calculator: { label: "Limit Calculator", href: "/limit-calculator" },
    objectives: ["Try direct substitution first", "Simplify 0/0 forms", "Distinguish one-sided and two-sided limits"],
    sections: [
      { heading: "A limit describes nearby behavior", paragraphs: ["The value of a function at a point and its limit at that point are different ideas. A limit only asks what values the function approaches nearby."], formula: "\\lim_{x\\to a}f(x)=L" },
      { heading: "Substitute before using a more advanced method", paragraphs: ["If substitution produces an ordinary real number, the limit is usually finished. An expression such as 0/0 is indeterminate: it signals that the expression should be simplified, not that the limit is zero."], formula: "\\frac{x^2-1}{x-1}=x+1\\quad(x\\ne1)" },
      { heading: "Both one-sided limits must agree", paragraphs: ["A two-sided limit exists only when the left-hand and right-hand limits exist and are equal. This matters near jumps, vertical asymptotes, and piecewise boundaries."], formula: "\\lim_{x\\to a^-}f(x)=\\lim_{x\\to a^+}f(x)=L" }
    ],
    example: { problem: "Evaluate limₓ→₁ (x²−1)/(x−1)", steps: ["Direct substitution gives 0/0.", "Factor x²−1=(x−1)(x+1).", "Cancel x−1 for nearby x and evaluate x+1 at x=1."], answer: "2" },
    mistakes: ["Treating 0/0 as the answer", "Canceling terms that are added rather than multiplied", "Ignoring different left-hand and right-hand behavior"]
  },
  {
    slug: "graphing-functions",
    title: "Graphing Functions: Intercepts, Shape, and Transformations",
    shortTitle: "Graphing functions",
    category: "Calculus",
    description: "Build a reliable graph from domain, intercepts, transformations, symmetry, and end behavior before plotting points.",
    difficulty: "Beginner",
    readingMinutes: 7,
    updatedAt: "2026-07-12",
    calculator: { label: "Graphing Calculator", href: "/graphing-calculator" },
    objectives: ["Find intercepts and domain restrictions", "Read transformations from a formula", "Check end behavior and symmetry"],
    sections: [
      { heading: "Start with the domain and intercepts", paragraphs: ["Domain restrictions identify gaps and asymptotes. Set x=0 for the y-intercept and solve f(x)=0 for x-intercepts."], formula: "y=f(0),\\qquad f(x)=0" },
      { heading: "Transform a familiar parent graph", paragraphs: ["In y=a f(b(x−h))+k, h and k shift the graph, a scales it vertically, and b changes the horizontal scale. Negative values can reflect the graph."], formula: "y=a f(b(x-h))+k" },
      { heading: "Use behavior to check the sketch", paragraphs: ["Even functions are symmetric about the y-axis and odd functions are symmetric about the origin. Leading terms often reveal polynomial end behavior."], formula: "f(-x)=f(x)\\;\\text{(even)},\\qquad f(-x)=-f(x)\\;\\text{(odd)}" }
    ],
    example: { problem: "Sketch y=(x−2)²−1", steps: ["Begin with the parent y=x².", "Shift right 2 and down 1, giving vertex (2,−1).", "Solve (x−2)²=1 to find x-intercepts 1 and 3."], answer: "\\text{Upward parabola with vertex }(2,-1)" },
    mistakes: ["Reversing the direction of the horizontal shift", "Plotting before checking the domain", "Using too narrow a viewing window"]
  },
  {
    slug: "series-and-sequences",
    title: "Series and Sequences: Convergence Essentials",
    shortTitle: "Series and sequences",
    category: "Calculus",
    description: "Distinguish sequences from series, recognize geometric and p-series, and choose a first convergence test.",
    difficulty: "Intermediate",
    readingMinutes: 10,
    updatedAt: "2026-07-12",
    calculator: { label: "Calculus Calculator", href: "/calculus-calculator" },
    objectives: ["Separate sequence and series questions", "Sum a convergent geometric series", "Use the nth-term and p-series tests"],
    sections: [
      { heading: "Sequences list terms; series add them", paragraphs: ["A sequence asks how aₙ behaves as n grows. A series asks whether the partial sums approach a finite value."], formula: "S_N=\\sum_{n=1}^{N}a_n" },
      { heading: "Geometric series depend on the common ratio", paragraphs: ["An infinite geometric series converges only when |r|<1. Its sum is the first term divided by 1−r."], formula: "a+ar+ar^2+\\cdots=\\frac{a}{1-r}" },
      { heading: "The term test is necessary, not sufficient", paragraphs: ["If aₙ does not approach zero, the series diverges. If aₙ approaches zero, another test is still required. For p-series, convergence occurs exactly when p>1."], formula: "\\sum_{n=1}^{\\infty}\\frac1{n^p}\\text{ converges iff }p>1" }
    ],
    example: { problem: "Sum 1 + 1/2 + 1/4 + ⋯", steps: ["Identify a geometric series with a=1 and r=1/2.", "Check |r|<1, so the series converges.", "Use a/(1−r)."], answer: "\\frac{1}{1-1/2}=2" },
    mistakes: ["Assuming aₙ→0 guarantees convergence", "Using the finite geometric formula for an infinite sum", "Confusing the sequence aₙ with its partial sums"]
  },
  {
    slug: "gradients-and-multivariable-calculus",
    title: "Gradients and Multivariable Calculus",
    shortTitle: "Gradients and multivariable calculus",
    category: "Calculus",
    description: "Compute partial derivatives, assemble the gradient vector, and interpret the direction of fastest increase.",
    difficulty: "Intermediate",
    readingMinutes: 9,
    updatedAt: "2026-07-12",
    calculator: { label: "Gradient Calculator", href: "/gradient-calculator" },
    objectives: ["Hold other variables constant in a partial derivative", "Build a gradient vector", "Interpret gradient direction and magnitude"],
    sections: [
      { heading: "Partial derivatives change one variable at a time", paragraphs: ["When differentiating with respect to x, treat y and z as constants. Repeat for each independent variable."], formula: "f_x=\\frac{\\partial f}{\\partial x},\\qquad f_y=\\frac{\\partial f}{\\partial y}" },
      { heading: "The gradient collects all first partials", paragraphs: ["The gradient is a vector field. At a point where it is nonzero, it points in the direction of greatest local increase."], formula: "\\nabla f=\\langle f_x,f_y\\rangle" },
      { heading: "Directional derivatives use a unit direction", paragraphs: ["Project the gradient onto a unit vector u. The largest possible directional derivative is the gradient magnitude."], formula: "D_{\\mathbf u}f=\\nabla f\\cdot\\mathbf u" }
    ],
    example: { problem: "Find ∇f for f(x,y)=x²+y²", steps: ["Differentiate with respect to x while holding y constant: fₓ=2x.", "Differentiate with respect to y while holding x constant: fᵧ=2y.", "Place the partial derivatives into a vector."], answer: "\\nabla f=\\langle2x,2y\\rangle" },
    mistakes: ["Differentiating every variable at once", "Writing a scalar when a gradient vector is required", "Using a direction vector without normalizing it"]
  },
  {
    slug: "solving-equations",
    title: "Solving Linear, Quadratic, and Polynomial Equations",
    shortTitle: "Solving equations",
    category: "Algebra",
    description: "Use inverse operations, factoring, and the quadratic formula while checking every proposed solution.",
    difficulty: "Beginner",
    readingMinutes: 9,
    updatedAt: "2026-07-12",
    calculator: { label: "Equation Solver", href: "/equation-solver" },
    objectives: ["Isolate a variable with equivalent operations", "Choose a quadratic method", "Check solutions in the original equation"],
    sections: [
      { heading: "Keep an equation balanced", paragraphs: ["Apply the same reversible operation to both sides. Combine like terms before moving terms, and delay division when it would introduce fractions unnecessarily."], formula: "ax+b=c\\quad\\Rightarrow\\quad x=\\frac{c-b}{a}" },
      { heading: "Put quadratics in standard form", paragraphs: ["Move every term to one side so the equation equals zero. Then factor, complete the square, or use the quadratic formula."], formula: "ax^2+bx+c=0" },
      { heading: "The discriminant predicts the roots", paragraphs: ["The value b²−4ac tells whether a real quadratic has two, one, or no real roots."], formula: "x=\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}" }
    ],
    example: { problem: "Solve x²−5x+6=0", steps: ["Find two numbers that multiply to 6 and add to −5: −2 and −3.", "Factor as (x−2)(x−3)=0.", "Set each factor equal to zero."], answer: "x=2\\text{ or }x=3" },
    mistakes: ["Changing only one side of the equation", "Dividing by an expression that might be zero", "Failing to check extraneous solutions"]
  },
  {
    slug: "factoring-polynomials",
    title: "Factoring Polynomials Step by Step",
    shortTitle: "Factoring polynomials",
    category: "Algebra",
    description: "Factor out the GCF, recognize standard identities, and break quadratic trinomials into linear factors.",
    difficulty: "Beginner",
    readingMinutes: 8,
    updatedAt: "2026-07-12",
    calculator: { label: "Factoring Calculator", href: "/factoring-calculator" },
    objectives: ["Extract the greatest common factor", "Recognize a difference of squares", "Factor monic quadratic trinomials"],
    sections: [
      { heading: "Always check for a common factor first", paragraphs: ["The greatest common factor includes both the numerical GCF and every variable power shared by all terms."], formula: "6x^3+9x^2=3x^2(2x+3)" },
      { heading: "Learn the standard identities", paragraphs: ["A difference of squares factors into conjugates. Perfect-square trinomials come from squaring a binomial."], formula: "a^2-b^2=(a-b)(a+b)" },
      { heading: "For x²+bx+c, search by product and sum", paragraphs: ["Find numbers m and n with mn=c and m+n=b. Then the factors are (x+m)(x+n)."], formula: "x^2+(m+n)x+mn=(x+m)(x+n)" }
    ],
    example: { problem: "Factor x²−5x+6", steps: ["The GCF is 1.", "Find factors of 6 whose sum is −5: −2 and −3.", "Write the corresponding binomial factors."], answer: "(x-2)(x-3)" },
    mistakes: ["Skipping the greatest common factor", "Forgetting that signs must match both the product and the sum", "Stopping before checking whether factors can be factored again"]
  },
  {
    slug: "simplifying-expressions",
    title: "Simplifying Algebraic Expressions",
    shortTitle: "Simplifying expressions",
    category: "Algebra",
    description: "Combine like terms, distribute carefully, cancel factors legally, and state restrictions on rational expressions.",
    difficulty: "Beginner",
    readingMinutes: 7,
    updatedAt: "2026-07-12",
    calculator: { label: "Simplify Calculator", href: "/simplify-calculator" },
    objectives: ["Identify like terms", "Use distribution and factoring", "Preserve domain restrictions when canceling"],
    sections: [
      { heading: "Only like terms combine", paragraphs: ["Terms are like terms when their variable parts, including exponents, match exactly. Add or subtract only their coefficients."], formula: "3x+2x-4=5x-4" },
      { heading: "Distribution removes grouped multiplication", paragraphs: ["Multiply every term inside the parentheses. A negative sign outside parentheses changes every sign inside."], formula: "a(b+c)=ab+ac" },
      { heading: "Cancel factors, not terms", paragraphs: ["Factor a rational expression before canceling. Keep the restrictions from the original denominator even if a factor disappears from the simplified form."], formula: "\\frac{x^2-1}{x-1}=x+1,\\quad x\\ne1" }
    ],
    example: { problem: "Simplify 2(x+3)−x", steps: ["Distribute 2 to obtain 2x+6−x.", "Combine the like x terms.", "No further factoring or cancellation is needed."], answer: "x+6" },
    mistakes: ["Combining terms with different exponents", "Distributing to only the first term", "Canceling across addition or losing denominator restrictions"]
  },
  {
    slug: "matrices-and-linear-algebra",
    title: "Matrices and Linear Algebra Basics",
    shortTitle: "Matrices and linear algebra",
    category: "Linear Algebra",
    description: "Learn matrix dimensions, addition, multiplication, determinants, and the conditions required for an inverse.",
    difficulty: "Intermediate",
    readingMinutes: 10,
    updatedAt: "2026-07-12",
    calculator: { label: "Matrix Calculator", href: "/matrix-calculator" },
    objectives: ["Check matrix dimension compatibility", "Multiply rows by columns", "Interpret determinants and inverses"],
    sections: [
      { heading: "Dimensions control valid operations", paragraphs: ["Matrices can be added only when their dimensions match. The product AB is defined when the number of columns of A equals the number of rows of B."], formula: "(m\\times n)(n\\times p)=m\\times p" },
      { heading: "Matrix multiplication uses row-column dot products", paragraphs: ["Each output entry is the dot product of one row from the left matrix and one column from the right matrix. In general, AB is not equal to BA."], formula: "(AB)_{ij}=\\sum_k a_{ik}b_{kj}" },
      { heading: "A nonzero determinant permits an inverse", paragraphs: ["A square matrix is invertible exactly when its determinant is nonzero. Solving Ax=b can then be written as x=A⁻¹b."], formula: "A^{-1}=\\frac1{ad-bc}\\begin{pmatrix}d&-b\\\\-c&a\\end{pmatrix}" }
    ],
    example: { problem: "Find det([[1,2],[3,4]])", steps: ["For a 2×2 matrix, compute ad−bc.", "Multiply the main diagonal: 1·4=4.", "Subtract the other diagonal product: 4−2·3."], answer: "-2" },
    mistakes: ["Adding matrices with different dimensions", "Multiplying entries position by position", "Assuming every square matrix has an inverse"]
  }
];

export function getGuide(slug: string): Guide | undefined {
  return guides.find((guide) => guide.slug === slug);
}

export const guideCategories = ["Calculus", "Algebra", "Linear Algebra"] as const;

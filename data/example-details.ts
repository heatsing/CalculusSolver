import type { Difficulty, ExampleCategory } from "@/data/examples";

export type ExampleDetail = {
  slug: string;
  title: string;
  description: string;
  category: Exclude<ExampleCategory, "All">;
  difficulty: Difficulty;
  problem: string;
  input: string;
  method: string;
  steps: readonly { title: string; explanation: string; math?: string }[];
  answer: string;
  explanation: string;
  commonMistake: string;
  calculator: { label: string; href: string };
  guide: { label: string; href: string };
  updatedAt: string;
};

export const exampleDetails: readonly ExampleDetail[] = [
  {
    slug: "integral-by-parts", title: "Integrate x² sin(x) by Parts", description: "Work through repeated integration by parts for the integral of x squared times sine x.", category: "Integrals", difficulty: "Advanced", problem: "∫ x² sin(x) dx", input: "x^2 * sin(x)", method: "Repeated integration by parts", updatedAt: "2026-08-10",
    steps: [
      { title: "Choose u and dv", explanation: "Let u=x² and dv=sin(x)dx so that differentiating u lowers its degree.", math: "u=x^2,\quad dv=\sin(x)dx" },
      { title: "Apply integration by parts", explanation: "With du=2x dx and v=-cos(x), the first application leaves an integral of x cos(x).", math: "-x^2\cos(x)+2\int x\cos(x)dx" },
      { title: "Integrate the remaining product", explanation: "Apply integration by parts again with u=x and dv=cos(x)dx.", math: "\int x\cos(x)dx=x\sin(x)+\cos(x)" },
      { title: "Combine the terms", explanation: "Substitute the second result and include the constant of integration." }
    ], answer: "-x^2\cos(x)+2x\sin(x)+2\cos(x)+C", explanation: "Differentiating the final expression returns x² sin(x), which verifies the antiderivative.", commonMistake: "Stopping after the first integration by parts leaves another product integral unresolved.", calculator: { label: "Integral Calculator", href: "/integral-calculator" }, guide: { label: "Integration basics", href: "/guides/integration-basics" }
  },
  {
    slug: "derivative-polynomial", title: "Derivative of x³ + 2x", description: "Apply the power rule term by term to differentiate a polynomial.", category: "Derivatives", difficulty: "Easy", problem: "d/dx (x³ + 2x)", input: "x^3 + 2*x", method: "Power rule and linearity", updatedAt: "2026-08-10",
    steps: [
      { title: "Separate the sum", explanation: "The derivative of a sum is the sum of the derivatives." },
      { title: "Differentiate x³", explanation: "Multiply by the exponent and reduce the exponent by one.", math: "\frac{d}{dx}x^3=3x^2" },
      { title: "Differentiate 2x", explanation: "The derivative of ax is the constant a.", math: "\frac{d}{dx}(2x)=2" },
      { title: "Combine", explanation: "Add the two derivative terms." }
    ], answer: "3x^2+2", explanation: "The result can be checked by applying the power rule independently to both terms.", commonMistake: "Do not reduce the coefficient 2 when differentiating 2x; its derivative is 2, not 1.", calculator: { label: "Derivative Calculator", href: "/derivative-calculator" }, guide: { label: "Derivative rules", href: "/guides/derivative-rules" }
  },
  {
    slug: "limit-sinc", title: "Limit of sin(x)/x as x Approaches 0", description: "Evaluate the fundamental trigonometric limit and understand why direct substitution is inconclusive.", category: "Limits", difficulty: "Medium", problem: "lim x→0 sin(x)/x", input: "sin(x)/x as x approaches 0", method: "Fundamental trigonometric limit", updatedAt: "2026-08-10",
    steps: [
      { title: "Try substitution", explanation: "Substituting x=0 produces 0/0, an indeterminate form rather than an answer." },
      { title: "Use the standard limit", explanation: "For angles measured in radians, the sine ratio approaches one.", math: "\lim_{x\to0}\frac{\sin x}{x}=1" },
      { title: "Check both sides", explanation: "The left-hand and right-hand values approach the same number." }
    ], answer: "1", explanation: "A geometric squeeze argument or a local series expansion establishes this limit; it is also the basis for differentiating sine.", commonMistake: "Treating 0/0 as zero skips the limiting process and gives the wrong conclusion.", calculator: { label: "Limit Calculator", href: "/limit-calculator" }, guide: { label: "Understanding limits", href: "/guides/understanding-limits" }
  },
  {
    slug: "linear-equation", title: "Solve 2x + 5 = 17", description: "Solve a linear equation using balanced inverse operations and verify the result.", category: "Algebra", difficulty: "Easy", problem: "2x + 5 = 17", input: "2*x + 5 = 17", method: "Inverse operations", updatedAt: "2026-08-10",
    steps: [
      { title: "Remove the constant", explanation: "Subtract 5 from both sides to preserve equality.", math: "2x=12" },
      { title: "Isolate x", explanation: "Divide both sides by 2.", math: "x=6" },
      { title: "Verify", explanation: "Substitute 6 into the original left side: 2(6)+5=17." }
    ], answer: "x=6", explanation: "Every operation was applied to both sides, so the transformed equations remain equivalent.", commonMistake: "Subtracting 5 on only one side breaks the equality.", calculator: { label: "Equation Solver", href: "/equation-solver" }, guide: { label: "Solving equations", href: "/guides/solving-equations" }
  },
  {
    slug: "factor-difference-squares", title: "Factor x² − 9", description: "Recognize and factor a difference of two perfect squares.", category: "Algebra", difficulty: "Easy", problem: "Factor x² − 9", input: "x^2 - 9", method: "Difference of squares", updatedAt: "2026-08-10",
    steps: [
      { title: "Identify both squares", explanation: "x² is the square of x and 9 is the square of 3." },
      { title: "Apply the identity", explanation: "Use a²−b²=(a−b)(a+b).", math: "x^2-3^2=(x-3)(x+3)" },
      { title: "Check by expansion", explanation: "The middle terms cancel and the product returns x²−9." }
    ], answer: "(x-3)(x+3)", explanation: "Conjugate factors produce a difference of squares because their opposite middle terms cancel.", commonMistake: "A sum of squares does not factor with the same real-number identity.", calculator: { label: "Factoring Calculator", href: "/factoring-calculator" }, guide: { label: "Factoring polynomials", href: "/guides/factoring-polynomials" }
  },
  {
    slug: "expand-binomial", title: "Expand (x + 3)²", description: "Expand a squared binomial without losing its middle term.", category: "Algebra", difficulty: "Easy", problem: "Expand (x + 3)²", input: "(x + 3)^2", method: "Square-of-a-sum identity", updatedAt: "2026-08-10",
    steps: [
      { title: "Write the product", explanation: "A square means multiplying the binomial by itself.", math: "(x+3)(x+3)" },
      { title: "Distribute", explanation: "Multiply each term in the first binomial by each term in the second." },
      { title: "Combine like terms", explanation: "The two 3x terms add to 6x.", math: "x^2+6x+9" }
    ], answer: "x^2+6x+9", explanation: "This is the identity (a+b)²=a²+2ab+b² with a=x and b=3.", commonMistake: "Writing x²+9 omits the middle term 2·x·3.", calculator: { label: "Algebra Solver", href: "/algebra-solver" }, guide: { label: "Simplifying expressions", href: "/guides/simplifying-expressions" }
  },
  {
    slug: "simplify-rational", title: "Simplify (x² − 1)/(x − 1)", description: "Factor and simplify a rational expression while preserving its original domain restriction.", category: "Algebra", difficulty: "Medium", problem: "Simplify (x² − 1)/(x − 1)", input: "(x^2 - 1)/(x - 1)", method: "Factor and cancel common factors", updatedAt: "2026-08-10",
    steps: [
      { title: "Record the restriction", explanation: "The original denominator is zero at x=1, so x=1 is excluded." },
      { title: "Factor the numerator", explanation: "Use the difference-of-squares identity.", math: "x^2-1=(x-1)(x+1)" },
      { title: "Cancel the common factor", explanation: "For x not equal to 1, cancel x−1 and keep x+1." }
    ], answer: "x+1,\quad x\ne1", explanation: "The simplified formula agrees everywhere in the original domain, but it does not fill the removable hole at x=1.", commonMistake: "Canceling x terms across subtraction is invalid; only complete factors can cancel.", calculator: { label: "Simplify Calculator", href: "/simplify-calculator" }, guide: { label: "Simplifying expressions", href: "/guides/simplifying-expressions" }
  },
  {
    slug: "graph-parabola", title: "Graph y = x² − 4x + 3", description: "Find the intercepts, vertex, and axis of symmetry before graphing a quadratic.", category: "Graphs", difficulty: "Easy", problem: "Graph y = x² − 4x + 3", input: "x^2 - 4*x + 3", method: "Factoring and vertex form", updatedAt: "2026-08-10",
    steps: [
      { title: "Find the x-intercepts", explanation: "Factor the quadratic as (x−1)(x−3), so the roots are 1 and 3." },
      { title: "Find the vertex", explanation: "Complete the square to write y=(x−2)²−1.", math: "y=(x-2)^2-1" },
      { title: "Use symmetry", explanation: "The axis is x=2 and the positive leading coefficient makes the parabola open upward." }
    ], answer: "\text{vertex }(2,-1),\quad x\text{-intercepts }1,3", explanation: "The intercepts and vertex determine the main shape and provide exact checkpoints for the plot.", commonMistake: "Reading x−2 as a shift left reverses the horizontal transformation.", calculator: { label: "Graphing Calculator", href: "/graphing-calculator" }, guide: { label: "Graphing functions", href: "/guides/graphing-functions" }
  },
  {
    slug: "definite-integral", title: "Evaluate ∫₀¹ x² dx", description: "Use an antiderivative and the Fundamental Theorem of Calculus to evaluate a definite integral.", category: "Integrals", difficulty: "Medium", problem: "∫₀¹ x² dx", input: "x^2 from 0 to 1", method: "Fundamental Theorem of Calculus", updatedAt: "2026-08-10",
    steps: [
      { title: "Find an antiderivative", explanation: "Reverse the power rule.", math: "F(x)=\frac{x^3}{3}" },
      { title: "Evaluate the endpoints", explanation: "Compute F(1)=1/3 and F(0)=0." },
      { title: "Subtract", explanation: "Use F(1)−F(0).", math: "\frac13-0=\frac13" }
    ], answer: "\frac13", explanation: "Because x² is nonnegative on [0,1], the signed integral also equals the geometric area under the curve.", commonMistake: "A definite integral does not need +C because the constant cancels in the endpoint subtraction.", calculator: { label: "Definite Integral Calculator", href: "/definite-integral-calculator" }, guide: { label: "Integration basics", href: "/guides/integration-basics" }
  },
  {
    slug: "quadratic-equation", title: "Solve x² − 5x + 6 = 0", description: "Factor a quadratic equation, apply the zero-product property, and verify both roots.", category: "Algebra", difficulty: "Medium", problem: "Solve x² − 5x + 6 = 0", input: "x^2 - 5*x + 6 = 0", method: "Factoring and zero-product property", updatedAt: "2026-08-10",
    steps: [
      { title: "Find a factor pair", explanation: "The numbers −2 and −3 multiply to 6 and add to −5." },
      { title: "Factor", explanation: "Rewrite the equation as a product equal to zero.", math: "(x-2)(x-3)=0" },
      { title: "Solve each factor", explanation: "A product is zero when at least one factor is zero." },
      { title: "Verify", explanation: "Substituting 2 or 3 into the original quadratic gives zero." }
    ], answer: "x=2\text{ or }x=3", explanation: "Both roots are valid and the discriminant is positive, consistent with two distinct real solutions.", commonMistake: "Finding only one factor misses the second solution.", calculator: { label: "Quadratic Solver", href: "/quadratic-solver" }, guide: { label: "Solving equations", href: "/guides/solving-equations" }
  },
  {
    slug: "second-derivative", title: "Second Derivative of x⁴", description: "Differentiate twice to find the second derivative of a power function.", category: "Derivatives", difficulty: "Medium", problem: "d²/dx² (x⁴)", input: "x^4", method: "Apply the power rule twice", updatedAt: "2026-08-10",
    steps: [
      { title: "Find the first derivative", explanation: "Apply the power rule to x⁴.", math: "f'(x)=4x^3" },
      { title: "Differentiate again", explanation: "Apply the power rule to 4x³.", math: "f''(x)=12x^2" },
      { title: "Interpret", explanation: "The second derivative describes how the first derivative changes and is nonnegative here." }
    ], answer: "12x^2", explanation: "For x not equal to zero the function is concave up; at zero the second derivative is zero but concavity does not switch.", commonMistake: "The notation d²/dx² means two successive derivatives, not squaring the first derivative.", calculator: { label: "Derivative Calculator", href: "/derivative-calculator" }, guide: { label: "Derivative rules", href: "/guides/derivative-rules" }
  },
  {
    slug: "system-equations", title: "Solve x + y = 5 and x − y = 1", description: "Solve a two-variable linear system by elimination and verify the ordered pair.", category: "Algebra", difficulty: "Medium", problem: "x + y = 5, x − y = 1", input: "x + y = 5 and x - y = 1", method: "Elimination", updatedAt: "2026-08-10",
    steps: [
      { title: "Add the equations", explanation: "The y and −y terms cancel.", math: "2x=6" },
      { title: "Solve for x", explanation: "Divide by 2 to obtain x=3." },
      { title: "Substitute back", explanation: "Use x+y=5 to get y=2." },
      { title: "Verify both equations", explanation: "The pair (3,2) makes both original equations true." }
    ], answer: "(x,y)=(3,2)", explanation: "Elimination works efficiently because the y coefficients are opposites.", commonMistake: "Adding only one side of the equations or losing a sign produces an inconsistent pair.", calculator: { label: "System of Equations Calculator", href: "/system-of-equations-calculator" }, guide: { label: "Solving equations", href: "/guides/solving-equations" }
  }
];

export function getExampleDetail(slug: string): ExampleDetail | undefined {
  return exampleDetails.find((example) => example.slug === slug);
}

export function getExampleStaticParams(): { slug: string }[] {
  return exampleDetails.map((example) => ({ slug: example.slug }));
}

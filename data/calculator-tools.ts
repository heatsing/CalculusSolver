export type CalculatorTool = { label: string; href: string };
export type CalculatorGroup = { label: string; tools: readonly CalculatorTool[] };

export const calculatorGroups: readonly CalculatorGroup[] = [
  {
    label: "Calculus",
    tools: [
      { label: "Calculus Calculator", href: "/calculus-calculator" },
      { label: "Derivative Calculator", href: "/derivative-calculator" },
      { label: "Integral Calculator", href: "/integral-calculator" },
      { label: "Definite Integral Calculator", href: "/definite-integral-calculator" },
      { label: "Limit Calculator", href: "/limit-calculator" },
      { label: "Asymptote Calculator", href: "/asymptote-calculator" },
      { label: "Gradient Calculator", href: "/gradient-calculator" },
      { label: "Graphing Calculator", href: "/graphing-calculator" }
    ]
  },
  {
    label: "Algebra",
    tools: [
      { label: "Algebra Solver", href: "/algebra-solver" },
      { label: "Equation Solver", href: "/equation-solver" },
      { label: "Quadratic Formula Calculator", href: "/quadratic-solver" },
      { label: "Factoring Calculator", href: "/factoring-calculator" },
      { label: "Simplify Calculator", href: "/simplify-calculator" },
      { label: "Inequality Calculator", href: "/inequality-calculator" },
      { label: "System of Equations Calculator", href: "/system-of-equations-calculator" },
      { label: "Logarithm Calculator", href: "/log-calculator" },
      { label: "Exponential Function Calculator", href: "/exponent-calculator" },
      { label: "Complex Numbers Calculator", href: "/complex-numbers-calculator" }
    ]
  },
  {
    label: "Everyday Math",
    tools: [
      { label: "Math Calculator", href: "/math-calculator" },
      { label: "Fraction Calculator", href: "/fraction-calculator" },
      { label: "Matrix Calculator", href: "/matrix-calculator" },
      { label: "Average Calculator", href: "/average-calculator" },
      { label: "Percentage Calculator", href: "/percentage-calculator" },
      { label: "Probability Calculator", href: "/probability-calculator" },
      { label: "Square Root Calculator", href: "/root-calculator" },
      { label: "Long Division Calculator", href: "/long-division-calculator" },
      { label: "LCM Calculator", href: "/lcm-calculator" }
    ]
  },
  {
    label: "Geometry and Sequences",
    tools: [
      { label: "Pythagorean Theorem Calculator", href: "/pythagorean-theorem-calculator" },
      { label: "Sequence Calculator", href: "/sequence-calculator" },
      { label: "Sum of Series Calculator", href: "/sum-of-series-calculator" }
    ]
  }
] as const;

export const allCalculatorTools: readonly CalculatorTool[] = calculatorGroups.flatMap((group) => group.tools);

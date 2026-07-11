export type CalculatorTool = { label: string; href: string };
export type CalculatorGroup = { label: string; tools: readonly CalculatorTool[] };

export const calculatorGroups: readonly CalculatorGroup[] = [
  {
    label: "Calculus",
    tools: [
      { label: "Calculus Calculator", href: "/calculus-calculator" },
      { label: "Derivative Calculator", href: "/derivative-calculator" },
      { label: "Integral Calculator", href: "/integral-calculator" },
      { label: "Limit Calculator", href: "/limit-calculator" },
      { label: "Gradient Calculator", href: "/gradient-calculator" },
      { label: "Graphing Calculator", href: "/graphing-calculator" }
    ]
  },
  {
    label: "Algebra",
    tools: [
      { label: "Algebra Solver", href: "/algebra-solver" },
      { label: "Equation Solver", href: "/equation-solver" },
      { label: "Quadratic Solver", href: "/quadratic-solver" },
      { label: "Factoring Calculator", href: "/factoring-calculator" },
      { label: "Simplify Calculator", href: "/simplify-calculator" },
      { label: "Exponent Calculator", href: "/exponent-calculator" }
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
      { label: "Root Calculator", href: "/root-calculator" },
      { label: "Log Calculator", href: "/log-calculator" },
      { label: "LCM Calculator", href: "/lcm-calculator" }
    ]
  }
] as const;

export const allCalculatorTools: readonly CalculatorTool[] = calculatorGroups.flatMap((group) => group.tools);

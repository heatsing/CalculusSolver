import { calculatorCategories, calculatorPages } from "@/data/calculator-pages";

export type CalculatorTool = { label: string; href: string };
export type CalculatorGroup = { label: string; tools: readonly CalculatorTool[] };

const preferredOrder: readonly string[] = [
  "derivative-calculator", "integral-calculator", "definite-integral-calculator", "limit-calculator", "asymptote-calculator", "gradient-calculator", "graphing-calculator",
  "algebra-solver", "equation-solver", "quadratic-solver", "factoring-calculator", "simplify-calculator", "inequality-calculator", "system-of-equations-calculator", "log-calculator", "exponent-calculator", "complex-numbers-calculator",
  "math-calculator", "fraction-calculator", "matrix-calculator", "average-calculator", "percentage-calculator", "probability-calculator", "root-calculator", "long-division-calculator", "lcm-calculator",
  "pythagorean-theorem-calculator", "sequence-calculator", "sum-of-series-calculator"
];

const orderIndex = new Map(preferredOrder.map((slug, index) => [slug, index]));

export const calculatorGroups: readonly CalculatorGroup[] = calculatorCategories.map((category) => {
  const tools = calculatorPages
    .filter((calculator) => calculator.category === category)
    .sort((a, b) => (orderIndex.get(a.slug) ?? 999) - (orderIndex.get(b.slug) ?? 999))
    .map((calculator) => ({ label: calculator.page.title, href: `/${calculator.slug}` }));

  return {
    label: category,
    tools: category === "Calculus"
      ? [{ label: "Calculus Calculator", href: "/calculus-calculator" }, ...tools]
      : tools
  };
});

export const allCalculatorTools: readonly CalculatorTool[] = calculatorGroups.flatMap((group) => group.tools);

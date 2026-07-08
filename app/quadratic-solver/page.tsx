import { CalculatorPage } from "@/components/calculator/calculator-page";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Quadratic Solver | Free Step-by-Step Equation Solver",
  description:
    "Free quadratic equation solver with step-by-step solutions. Solve ax² + bx + c = 0 by factoring, completing the square, or the quadratic formula.",
  path: "/quadratic-solver",
  keywords: [
    "quadratic solver",
    "quadratic equation solver",
    "solve ax2 + bx + c",
    "quadratic formula calculator",
    "discriminant calculator",
    "free math solver"
  ]
});

export default function QuadraticSolverPage(): React.JSX.Element {
  return (
    <CalculatorPage
      title="Quadratic Solver"
      description="Free quadratic equation solver with step-by-step solutions."
      path="/quadratic-solver"
      mode="algebra"
      h1="Quadratic Equation Solver"
      subtitle="Solve any quadratic equation ax² + bx + c = 0 using factoring, completing the square, or the quadratic formula."
      exampleLatex="x^2 - 5x + 6 = 0 \\Rightarrow x = \\frac{5 \\pm \\sqrt{1}}{2} \\Rightarrow x = 2 \\text{ or } x = 3"
      howItWorks={[
        { step: "Enter the quadratic", description: "Type ax² + bx + c = 0 in any form." },
        { step: "Choose a method", description: "We factor when possible; otherwise we use the quadratic formula." },
        { step: "See the roots", description: "Get real or complex roots with verification." }
      ]}
      faqs={[
        {
          question: "Can it handle complex roots?",
          answer: "Yes. If the discriminant is negative, the solver returns complex roots in a + bi form."
        },
        {
          question: "Does it show the discriminant?",
          answer: "Yes. The solver computes and explains the discriminant and what it means for the number of roots."
        }
      ]}
      relatedTools={[
        { label: "Equation Solver", href: "/equation-solver" },
        { label: "Factoring Calculator", href: "/factoring-calculator" },
        { label: "Derivative Calculator", href: "/derivative-calculator" }
      ]}
    />
  );
}

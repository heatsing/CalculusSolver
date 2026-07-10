import { CalculatorPage } from "@/components/calculator/calculator-page";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Free Online Equation Solver | Calculus Solver",
  description:
    "Free equation solver with step-by-step solutions. Solve linear, quadratic, polynomial, and systems of equations.",
  path: "/equation-solver",
  keywords: [
    "equation solver",
    "solve for x",
    "algebra solver",
    "quadratic equation solver",
    "system of equations",
    "free math solver"
  ]
});

export default function EquationSolverPage(): React.JSX.Element {
  return (
    <CalculatorPage
      title="Equation Solver"
      description="Free equation solver with step-by-step solutions."
      path="/equation-solver"
      mode="algebra"
      h1="Equation Solver"
      subtitle="Solve linear, quadratic, polynomial, and systems of equations with step-by-step explanations and verification."
      exampleLatex="x^2 - 5x + 6 = 0 \\Rightarrow x = 2 \\text{ or } x = 3"
      howItWorks={[
        { step: "Enter the equation", description: "Type an equation or system of equations." },
        { step: "Identify the strategy", description: "We choose factoring, quadratic formula, substitution, or elimination." },
        { step: "Verify solutions", description: "Each solution is checked against the original equation." }
      ]}
      faqs={[
        {
          question: "Can this solve systems of equations?",
          answer: "Yes. Enter multiple equations separated by 'and' to solve systems."
        },
        {
          question: "Does it show the quadratic formula?",
          answer: "When applicable, the solver shows the quadratic formula and substitution steps."
        }
      ]}
      relatedTools={[
        { label: "Quadratic Solver", href: "/quadratic-solver" },
        { label: "Factoring Calculator", href: "/factoring-calculator" },
        { label: "Derivative Calculator", href: "/derivative-calculator" }
      ]}
    />
  );
}

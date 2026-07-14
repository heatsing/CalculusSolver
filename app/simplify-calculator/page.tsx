import { CalculatorPage } from "@/components/calculator/calculator-page";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Calculus Solver – Free Online Simplify Calculator",
  description: "Free simplify calculator. Reduce algebraic expressions, combine like terms, and simplify fractions step by step.",
  path: "/simplify-calculator",
  keywords: [
    "simplify calculator",
    "simplify expression",
    "reduce algebraic expression",
    "combine like terms",
    "free math solver"
  ]
});

export default function SimplifyCalculatorPage(): React.JSX.Element {
  return (
    <CalculatorPage
      title="Simplify Calculator"
      description="Free simplify calculator. Reduce algebraic expressions, combine like terms, and simplify fractions step by step."
      path="/simplify-calculator"
      mode="simplify"
      h1="Simplify Calculator"
      subtitle="Simplify algebraic expressions by combining like terms, canceling common factors, and applying algebraic identities."
      exampleLatex="\\frac{x^2 - 1}{x - 1} = x + 1"
      howItWorks={[
        { step: "Enter the expression", description: "Type the algebraic expression you want to simplify." },
      { step: "Apply rules", description: "We combine like terms and cancel common factors." },
      { step: "Show the result", description: "Get the simplified form with each step explained." }
      ]}
      faqs={[
        {
          question: "Can it simplify rational expressions?",
          answer: "Yes. The calculator factors numerators and denominators and cancels common factors when possible."
        },
      {
          question: "Does it expand or just simplify?",
          answer: "It focuses on simplification — reducing to the most compact equivalent form. Use the Factoring Calculator for factorization."
        }
      ]}
      relatedTools={[
        { label: "Derivative Calculator", href: "/derivative-calculator" },
        { label: "Equation Solver", href: "/equation-solver" },
        { label: "Integral Calculator", href: "/integral-calculator" }
      ]}
    />
  );
}

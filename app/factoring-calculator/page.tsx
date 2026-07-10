import { CalculatorPage } from "@/components/calculator/calculator-page";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Free Online Factor Calculator | Calculus Solver",
  description:
    "Free factoring calculator with step-by-step solutions. Factor polynomials, quadratics, and expressions using GCF, grouping, and special product rules.",
  path: "/factoring-calculator",
  keywords: [
    "factoring calculator",
    "factor polynomial",
    "factor quadratic",
    "GCF calculator",
    "factor by grouping",
    "free math solver"
  ]
});

export default function FactoringCalculatorPage(): React.JSX.Element {
  return (
    <CalculatorPage
      title="Factoring Calculator"
      description="Free factoring calculator with step-by-step solutions."
      path="/factoring-calculator"
      mode="algebra"
      h1="Factoring Calculator"
      subtitle="Factor polynomials, quadratics, and expressions using GCF, grouping, difference of squares, and other methods."
      exampleLatex="x^2 - 5x + 6 = (x - 2)(x - 3)"
      howItWorks={[
        { step: "Enter the expression", description: "Type the polynomial you want to factor." },
        { step: "Identify the method", description: "We detect GCF, grouping, or special-product patterns." },
        { step: "Verify by expanding", description: "The result is checked by expanding back to the original expression." }
      ]}
      faqs={[
        {
          question: "Can it factor by grouping?",
          answer: "Yes. The calculator recognizes grouping patterns and shows the intermediate groups."
        },
        {
          question: "Does it handle special products?",
          answer: "Yes. Difference of squares, perfect-square trinomials, and sum/difference of cubes are all supported."
        }
      ]}
      relatedTools={[
        { label: "Equation Solver", href: "/equation-solver" },
        { label: "Quadratic Solver", href: "/quadratic-solver" },
        { label: "Derivative Calculator", href: "/derivative-calculator" }
      ]}
    />
  );
}

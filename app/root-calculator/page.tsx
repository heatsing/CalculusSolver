import { CalculatorPage } from "@/components/calculator/calculator-page";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Free Online Square Root Calculator | Calculus Solver",
  description: "Free root calculator. Compute square roots, cube roots, and nth roots of any number with step-by-step solutions.",
  path: "/root-calculator",
  keywords: [
    "root calculator",
    "square root calculator",
    "cube root calculator",
    "nth root",
    "radical calculator"
  ]
});

export default function RootCalculatorPage(): React.JSX.Element {
  return (
    <CalculatorPage
      title="Square Root Calculator"
      description="Free root calculator. Compute square roots, cube roots, and nth roots of any number with step-by-step solutions."
      path="/root-calculator"
      mode="roots"
      h1="Square Root Calculator"
      subtitle="Find square roots, cube roots, and nth roots of any real number. Handle negative inputs for odd roots and simplify radicals."
      exampleLatex="\\sqrt[3]{27} = 3"
      howItWorks={[
        { step: "Enter the number", description: "Type the value and optionally the root degree (default: square root)." },
      { step: "Compute the root", description: "We find the real nth root, handling signs correctly." },
      { step: "Simplify radicals", description: "When possible, the result is shown in simplified radical form." }
      ]}
      faqs={[
        {
          question: "Can it compute cube roots of negative numbers?",
          answer: "Yes. The cube root of a negative number is negative: ∛(-8) = -2."
        },
      {
          question: "What about even roots of negative numbers?",
          answer: "Even roots (square, 4th, etc.) of negative numbers are not real. The calculator will indicate this."
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

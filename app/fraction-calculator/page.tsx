import { CalculatorPage } from "@/components/calculator/calculator-page";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Free Online Fraction Calculator | Calculus Solver",
  description: "Free fraction calculator. Add, subtract, multiply, and divide fractions with step-by-step solutions and simplification.",
  path: "/fraction-calculator",
  keywords: [
    "fraction calculator",
    "add fractions",
    "subtract fractions",
    "multiply fractions",
    "divide fractions"
  ]
});

export default function FractionCalculatorPage(): React.JSX.Element {
  return (
    <CalculatorPage
      title="Fraction Calculator"
      description="Free fraction calculator. Add, subtract, multiply, and divide fractions with step-by-step solutions and simplification."
      path="/fraction-calculator"
      mode="fractions"
      h1="Fraction Calculator"
      subtitle="Perform arithmetic on fractions — add, subtract, multiply, and divide — with automatic simplification and mixed-number output."
      exampleLatex="\\frac{1}{2} + \\frac{1}{3} = \\frac{5}{6}"
      howItWorks={[
        { step: "Enter fractions", description: "Type your fractions using / notation, e.g. 1/2 + 1/3." },
      { step: "Find common denominators", description: "For add/subtract, we compute the LCD and convert." },
      { step: "Simplify the result", description: "The answer is reduced to lowest terms automatically." }
      ]}
      faqs={[
        {
          question: "Does it output mixed numbers?",
          answer: "Yes. Improper fractions are also shown as mixed numbers when applicable."
        },
      {
          question: "Can I use negative fractions?",
          answer: "Yes. Negative numerators or denominators are handled correctly throughout."
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

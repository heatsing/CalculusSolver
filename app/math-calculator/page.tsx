import { CalculatorPage } from "@/components/calculator/calculator-page";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Calculus Solver – Free Online Math Calculator",
  description: "Free online math calculator. Evaluate arithmetic, algebraic, and trigonometric expressions with instant results and step-by-step work.",
  path: "/math-calculator",
  keywords: [
    "math calculator",
    "online calculator",
    "expression evaluator",
    "arithmetic calculator",
    "free math solver"
  ]
});

export default function MathCalculatorPage(): React.JSX.Element {
  return (
    <CalculatorPage
      title="Math Calculator"
      description="Free online math calculator. Evaluate arithmetic, algebraic, and trigonometric expressions with instant results and step-by-step work."
      path="/math-calculator"
      mode="numeric"
      h1="Math Calculator"
      subtitle="Evaluate any mathematical expression — arithmetic, exponents, roots, trigonometry, and more. Get an instant answer with a breakdown of each step."
      exampleLatex="2 + 3 \\times 4 = 14"
      howItWorks={[
        { step: "Type an expression", description: "Enter any valid math expression using +, −, ×, ÷, ^, and functions." },
      { step: "We parse and evaluate", description: "The calculator applies the correct order of operations." },
      { step: "See the result", description: "Get the final value along with a step-by-step breakdown." }
      ]}
      faqs={[
        {
          question: "What functions are supported?",
          answer: "Sin, cos, tan, log, ln, sqrt, abs, factorial, and more — plus constants like π and e."
        },
      {
          question: "Does it follow the order of operations?",
          answer: "Yes. PEMDAS rules are applied automatically: parentheses, exponents, multiplication/division, then addition/subtraction."
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

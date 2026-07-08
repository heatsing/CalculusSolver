import { CalculatorPage } from "@/components/calculator/calculator-page";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Derivative Calculator | Free Step-by-Step Math Solver",
  description:
    "Free derivative calculator with step-by-step solutions. Compute derivatives of polynomials, trigonometric, exponential, and logarithmic functions instantly.",
  path: "/derivative-calculator",
  keywords: [
    "derivative calculator",
    "differentiation calculator",
    "find derivative",
    "step by step derivative",
    "free math solver",
    "calculus help"
  ]
});

export default function DerivativeCalculatorPage(): React.JSX.Element {
  return (
    <CalculatorPage
      title="Derivative Calculator"
      description="Free derivative calculator with step-by-step solutions."
      path="/derivative-calculator"
      mode="derivative"
      h1="Derivative Calculator"
      subtitle="Compute derivatives of polynomials, trigonometric, exponential, and logarithmic functions with detailed steps."
      exampleLatex="\\frac{d}{dx}(x^3 - 2x^2 + x) = 3x^2 - 4x + 1"
      howItWorks={[
        {
          step: "Enter your function",
          description: "Type any expression you want to differentiate."
        },
        {
          step: "AI recognizes the problem",
          description: "We identify the operation and the independent variable."
        },
        {
          step: "Get the derivative",
          description: "Receive the final answer plus a rule-by-rule explanation."
        }
      ]}
      faqs={[
        {
          question: "Is this derivative calculator free?",
          answer: "Yes. You can compute derivatives and view step-by-step explanations at no cost."
        },
        {
          question: "Can I see the differentiation rules used?",
          answer: "Each step lists the rule applied, such as power rule, product rule, or chain rule."
        }
      ]}
      relatedTools={[
        { label: "Integral Calculator", href: "/integral-calculator" },
        { label: "Limit Calculator", href: "/limit-calculator" },
        { label: "Equation Solver", href: "/equation-solver" }
      ]}
    />
  );
}

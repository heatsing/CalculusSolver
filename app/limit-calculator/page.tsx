import { CalculatorPage } from "@/components/calculator/calculator-page";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Calculus Solver – Free Online Limit Calculator",
  description:
    "Free limit calculator with step-by-step solutions. Evaluate one-sided and two-sided limits of functions as x approaches any value.",
  path: "/limit-calculator",
  keywords: [
    "limit calculator",
    "evaluate limit",
    "limit solver",
    "as x approaches",
    "step by step limits",
    "free math solver"
  ]
});

export default function LimitCalculatorPage(): React.JSX.Element {
  return (
    <CalculatorPage
      title="Limit Calculator"
      description="Free limit calculator with step-by-step solutions."
      path="/limit-calculator"
      mode="limit"
      h1="Limit Calculator"
      subtitle="Evaluate one-sided and two-sided limits with detailed reasoning about behavior near the target point."
      exampleLatex="\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1"
      howItWorks={[
        { step: "Enter the limit", description: "Type the function and the value x is approaching." },
        { step: "Analyze behavior", description: "We examine the function from both sides of the point." },
        { step: "Get the result", description: "Receive the limit value or a clear statement that it does not exist." }
      ]}
      faqs={[
        {
          question: "Can I compute one-sided limits?",
          answer: "Yes. Specify left or right in your input and the solver will compute the one-sided limit."
        },
        {
          question: "What if the limit does not exist?",
          answer: "The solver will state that the limit does not exist and explain why, such as divergence or unequal one-sided limits."
        }
      ]}
      relatedTools={[
        { label: "Derivative Calculator", href: "/derivative-calculator" },
        { label: "Integral Calculator", href: "/integral-calculator" },
        { label: "Equation Solver", href: "/equation-solver" }
      ]}
    />
  );
}

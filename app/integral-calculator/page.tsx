import { CalculatorPage } from "@/components/calculator/calculator-page";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Free Online Integral Calculator | Calculus Solver",
  description:
    "Free integral calculator with step-by-step solutions. Solve indefinite and definite integrals of polynomials, trigonometric, exponential, and logarithmic functions.",
  path: "/integral-calculator",
  keywords: [
    "integral calculator",
    "integration calculator",
    "find integral",
    "antiderivative calculator",
    "step by step integral",
    "free math solver"
  ]
});

export default function IntegralCalculatorPage(): React.JSX.Element {
  return (
    <CalculatorPage
      title="Integral Calculator"
      description="Free integral calculator with step-by-step solutions."
      path="/integral-calculator"
      mode="integral"
      h1="Integral Calculator"
      subtitle="Find antiderivatives and definite integrals with detailed explanations of each integration rule."
      exampleLatex="\\int (2x + \\cos x) \\, dx = x^2 + \\sin x + C"
      howItWorks={[
        { step: "Enter the integrand", description: "Type the expression you want to integrate." },
        { step: "Choose the variable", description: "We detect the integration variable automatically." },
        { step: "Get the antiderivative", description: "See the final answer and each integration step." }
      ]}
      faqs={[
        {
          question: "Does the integral calculator show +C?",
          answer: "Yes. Indefinite integrals include the constant of integration and explain why it is needed."
        },
        {
          question: "Can I integrate trigonometric functions?",
          answer: "Yes. sin, cos, tan, and their inverses are all supported."
        }
      ]}
      relatedTools={[
        { label: "Derivative Calculator", href: "/derivative-calculator" },
        { label: "Limit Calculator", href: "/limit-calculator" },
        { label: "Equation Solver", href: "/equation-solver" }
      ]}
    />
  );
}

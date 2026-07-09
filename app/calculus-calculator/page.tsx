import { CalculatorPage } from "@/components/calculator/calculator-page";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Calculus Calculator | Free Derivatives, Integrals & Limits Solver",
  description:
    "Free online calculus calculator. Solve derivatives, integrals, limits, and series with step-by-step explanations and interactive graphs. No sign-up required.",
  path: "/calculus-calculator",
  keywords: [
    "calculus calculator",
    "online calculus solver",
    "derivative calculator",
    "integral calculator",
    "limit calculator",
    "step by step calculus",
    "free math solver"
  ]
});

export default function CalculusCalculatorPage(): React.JSX.Element {
  return (
    <CalculatorPage
      title="Calculus Calculator"
      description="Free online calculus calculator with step-by-step solutions."
      path="/calculus-calculator"
      mode="auto"
      h1="Calculus Calculator"
      subtitle="Solve derivatives, integrals, limits, and series with detailed step-by-step explanations and interactive graphs."
      exampleLatex="\\frac{d}{dx}\\left(x^2 \\sin(x)\\right) = 2x\\sin(x) + x^2\\cos(x)"
      howItWorks={[
        {
          step: "Enter your problem",
          description: "Type any calculus expression — derivative, integral, limit, or series."
        },
        {
          step: "AI identifies the operation",
          description: "The solver detects whether you need differentiation, integration, or a limit."
        },
        {
          step: "Get step-by-step solution",
          description: "Receive the answer with a rule-by-rule breakdown and an interactive graph."
        }
      ]}
      faqs={[
        {
          question: "What can the Calculus Calculator solve?",
          answer:
            "It handles derivatives (including chain rule, product rule, quotient rule), indefinite and definite integrals, limits (including L'Hôpital's rule), Taylor series, and related rates problems."
        },
        {
          question: "Is this calculus calculator free?",
          answer:
            "Yes. You can solve calculus problems and view full step-by-step explanations at no cost, with no account required."
        },
        {
          question: "Does it show the rules used in each step?",
          answer:
            "Each step lists the calculus rule applied, such as power rule, product rule, chain rule, substitution, or integration by parts."
        },
        {
          question: "Can I graph the result?",
          answer:
            "Yes. When the result is a function, an interactive graph is generated so you can zoom, pan, and download the plot."
        },
        {
          question: "Does it work on mobile?",
          answer:
            "Yes. The calculator is fully responsive and works on phones, tablets, and desktops."
        }
      ]}
      relatedTools={[
        { label: "Derivative Calculator", href: "/derivative-calculator" },
        { label: "Integral Calculator", href: "/integral-calculator" },
        { label: "Limit Calculator", href: "/limit-calculator" },
        { label: "Equation Solver", href: "/equation-solver" }
      ]}
    />
  );
}

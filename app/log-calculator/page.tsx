import { CalculatorPage } from "@/components/calculator/calculator-page";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Free Online Log Calculator | Calculus Solver",
  description: "Free logarithm calculator. Compute log base 10, natural log (ln), and logarithms of any base with step-by-step solutions.",
  path: "/log-calculator",
  keywords: [
    "log calculator",
    "logarithm calculator",
    "natural log",
    "ln calculator",
    "change of base"
  ]
});

export default function LogCalculatorPage(): React.JSX.Element {
  return (
    <CalculatorPage
      title="Log Calculator"
      description="Free logarithm calculator. Compute log base 10, natural log (ln), and logarithms of any base with step-by-step solutions."
      path="/log-calculator"
      mode="logarithms"
      h1="Log Calculator"
      subtitle="Evaluate logarithms in any base — common log (base 10), natural log (base e), and arbitrary bases — with change-of-base steps shown."
      exampleLatex="\\log_{10}(1000) = 3"
      howItWorks={[
        { step: "Enter the value", description: "Type the number and optionally the base (default: base 10)." },
      { step: "Apply logarithm rules", description: "We use change-of-base and power rules as needed." },
      { step: "Show the result", description: "Get the logarithm value with each step explained." }
      ]}
      faqs={[
        {
          question: "What is the difference between log and ln?",
          answer: "log usually means base 10 (common logarithm), while ln means base e (natural logarithm). This calculator supports both."
        },
      {
          question: "Can I use any base?",
          answer: "Yes. Specify the base as a second argument, e.g. log(8, 2) = 3."
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

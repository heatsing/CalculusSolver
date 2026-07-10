import { CalculatorPage } from "@/components/calculator/calculator-page";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Free Online Probability Calculator | Calculus Solver",
  description: "Free probability calculator. Compute single and combined event probabilities, conditional probability, and expected value.",
  path: "/probability-calculator",
  keywords: [
    "probability calculator",
    "probability of events",
    "conditional probability",
    "combined probability",
    "statistics calculator"
  ]
});

export default function ProbabilityCalculatorPage(): React.JSX.Element {
  return (
    <CalculatorPage
      title="Probability Calculator"
      description="Free probability calculator. Compute single and combined event probabilities, conditional probability, and expected value."
      path="/probability-calculator"
      mode="probability"
      h1="Probability Calculator"
      subtitle="Calculate probabilities for single events, combined events (AND/OR), and conditional probability. Get clear step-by-step reasoning."
      exampleLatex="P(A \\cap B) = P(A) \\times P(B)"
      howItWorks={[
        { step: "Enter probabilities", description: "Provide the probability of each event as a decimal or fraction." },
      { step: "Choose the operation", description: "AND (intersection), OR (union), or conditional (given)." },
      { step: "Apply probability rules", description: "We use the multiplication and addition rules correctly." }
      ]}
      faqs={[
        {
          question: "Can it handle dependent events?",
          answer: "Yes. For conditional probability, enter P(A) and P(B|A) and the calculator applies Bayes' rule."
        },
      {
          question: "What about mutually exclusive events?",
          answer: "For OR with mutually exclusive events, the probabilities simply add. The calculator detects this automatically."
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

import { CalculatorPage } from "@/components/calculator/calculator-page";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Free Online Percentage Calculator | Calculus Solver",
  description: "Free percentage calculator. Find a percent of a number, calculate percentage change, and convert between fractions and percentages.",
  path: "/percentage-calculator",
  keywords: [
    "percentage calculator",
    "percent of a number",
    "percentage change",
    "percent increase",
    "percent decrease"
  ]
});

export default function PercentageCalculatorPage(): React.JSX.Element {
  return (
    <CalculatorPage
      title="Percentage Calculator"
      description="Free percentage calculator. Find a percent of a number, calculate percentage change, and convert between fractions and percentages."
      path="/percentage-calculator"
      mode="percentage"
      h1="Percentage Calculator"
      subtitle="Calculate percentages, percentage change, and percent of a number. Handle increase, decrease, and ratio conversions instantly."
      exampleLatex="15\\% \\text{ of } 200 = 30"
      howItWorks={[
        { step: "Enter your values", description: "Type the percentage and the base number, or two values for a change." },
      { step: "Compute the ratio", description: "We convert the percentage to a decimal and multiply." },
      { step: "Show the result", description: "Get the answer along with the formula used." }
      ]}
      faqs={[
        {
          question: "Can it calculate percentage change between two values?",
          answer: "Yes. Enter the original and new values to get the percentage increase or decrease."
        },
      {
          question: "Can I convert a fraction to a percentage?",
          answer: "Yes. Enter a fraction like 3/4 and the calculator returns 75%."
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

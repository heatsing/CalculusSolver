import { CalculatorPage } from "@/components/calculator/calculator-page";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Free Online Average Calculator | Calculus Solver",
  description: "Free average calculator. Find the arithmetic mean of any set of numbers instantly, plus sum, count, and range.",
  path: "/average-calculator",
  keywords: [
    "average calculator",
    "mean calculator",
    "arithmetic mean",
    "average of numbers",
    "statistics calculator"
  ]
});

export default function AverageCalculatorPage(): React.JSX.Element {
  return (
    <CalculatorPage
      title="Average Calculator"
      description="Free average calculator. Find the arithmetic mean of any set of numbers instantly, plus sum, count, and range."
      path="/average-calculator"
      mode="average"
      h1="Average Calculator"
      subtitle="Calculate the arithmetic mean of any list of numbers. Enter your values and get the average, sum, and count instantly."
      exampleLatex="\\bar{x} = \\frac{1}{n}\\sum_{i=1}^{n} x_i"
      howItWorks={[
        { step: "Enter your data", description: "Type numbers separated by commas or spaces." },
      { step: "Sum and divide", description: "We add all values and divide by the count." },
      { step: "Get the result", description: "Receive the mean along with the sum and number of data points." }
      ]}
      faqs={[
        {
          question: "Can it handle decimals and negatives?",
          answer: "Yes. The calculator accepts any real numbers, including decimals and negative values."
        },
      {
          question: "Does it show the sum and count too?",
          answer: "Yes. Along with the average, you get the total sum and the number of values entered."
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

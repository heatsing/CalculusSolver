import { CalculatorPage } from "@/components/calculator/calculator-page";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Free Online LCM Calculator | Calculus Solver",
  description: "Free LCM calculator. Find the least common multiple of two or more numbers instantly with step-by-step prime factorization.",
  path: "/lcm-calculator",
  keywords: [
    "lcm calculator",
    "least common multiple",
    "lcm finder",
    "lcm of numbers",
    "free math solver"
  ]
});

export default function LcmCalculatorPage(): React.JSX.Element {
  return (
    <CalculatorPage
      title="LCM Calculator"
      description="Free LCM calculator. Find the least common multiple of two or more numbers instantly with step-by-step prime factorization."
      path="/lcm-calculator"
      mode="lcm"
      h1="LCM Calculator"
      subtitle="Find the least common multiple of any set of integers. Enter your numbers and get the LCM with a clear prime-factorization breakdown."
      exampleLatex="\\mathrm{lcm}(4,\\ 6) = 12"
      howItWorks={[
        { step: "Enter numbers", description: "Type two or more integers separated by commas." },
      { step: "Prime factorization", description: "We break each number into its prime factors." },
      { step: "Combine factors", description: "The LCM is the product of the highest power of each prime." }
      ]}
      faqs={[
        {
          question: "Can it find the LCM of more than two numbers?",
          answer: "Yes. Enter as many numbers as you need, separated by commas, and the calculator finds the LCM of the entire set."
        },
      {
          question: "Does it work with negative numbers?",
          answer: "Yes. The LCM is always non-negative; the sign of the input does not affect the result."
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

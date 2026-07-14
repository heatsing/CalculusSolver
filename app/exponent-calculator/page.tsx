import { CalculatorPage } from "@/components/calculator/calculator-page";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Calculus Solver – Free Online Exponential Function Calculator",
  description: "Free exponent calculator. Compute powers, handle negative and fractional exponents, and simplify exponential expressions.",
  path: "/exponent-calculator",
  keywords: [
    "exponent calculator",
    "power calculator",
    "exponentiation",
    "negative exponents",
    "fractional exponents"
  ]
});

export default function ExponentCalculatorPage(): React.JSX.Element {
  return (
    <CalculatorPage
      title="Exponential Function Calculator"
      description="Free exponent calculator. Compute powers, handle negative and fractional exponents, and simplify exponential expressions."
      path="/exponent-calculator"
      mode="exponents"
      h1="Exponential Function Calculator"
      subtitle="Calculate any base raised to any power — including negative, fractional, and zero exponents — with step-by-step explanations."
      exampleLatex="2^{10} = 1024"
      howItWorks={[
        { step: "Enter base and exponent", description: "Type an expression like 2^10 or use the xⁿ button." },
      { step: "Apply exponent rules", description: "We handle negative, zero, and fractional exponents correctly." },
      { step: "Get the result", description: "Receive the computed value with applicable exponent rules shown." }
      ]}
      faqs={[
        {
          question: "What is a negative exponent?",
          answer: "A negative exponent means reciprocal: a^(-n) = 1/a^n. The calculator handles this automatically."
        },
      {
          question: "Can it compute fractional exponents like roots?",
          answer: "Yes. x^(1/2) is the square root, x^(1/3) is the cube root, and so on."
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

import { CalculatorPage } from "@/components/calculator/calculator-page";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Calculus Solver – Free Online Gradient Calculator",
  description: "Free gradient calculator. Compute the gradient of a multivariable function, find partial derivatives, and visualize the direction of steepest ascent.",
  path: "/gradient-calculator",
  keywords: [
    "gradient calculator",
    "vector calculus",
    "partial derivatives",
    "gradient of function",
    "multivariable calculus"
  ]
});

export default function GradientCalculatorPage(): React.JSX.Element {
  return (
    <CalculatorPage
      title="Gradient Calculator"
      description="Free gradient calculator. Compute the gradient of a multivariable function, find partial derivatives, and visualize the direction of steepest ascent."
      path="/gradient-calculator"
      mode="gradient"
      h1="Gradient Calculator"
      subtitle="Compute the gradient vector of any scalar function of two or three variables. Get each partial derivative with step-by-step work."
      exampleLatex="\\nabla f = \\left(\\frac{\\partial f}{\\partial x},\\ \\frac{\\partial f}{\\partial y}\\right)"
      howItWorks={[
        { step: "Enter the function", description: "Type f(x, y) or f(x, y, z) using standard notation." },
      { step: "Compute partials", description: "We differentiate with respect to each variable in turn." },
      { step: "Form the gradient", description: "The partial derivatives combine into the gradient vector." }
      ]}
      faqs={[
        {
          question: "How many variables can the function have?",
          answer: "The calculator supports functions of two or three variables. For more variables, enter the expression and we compute each partial."
        },
      {
          question: "Does it show the direction of steepest ascent?",
          answer: "Yes. The gradient vector points in the direction of steepest increase of the function at each point."
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

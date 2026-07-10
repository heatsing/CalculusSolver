import { CalculatorPage } from "@/components/calculator/calculator-page";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Free Online Matrix Calculator | Calculus Solver",
  description: "Free matrix calculator. Compute determinants, inverses, products, sums, and transpose of matrices with step-by-step solutions.",
  path: "/matrix-calculator",
  keywords: [
    "matrix calculator",
    "matrix multiplication",
    "determinant calculator",
    "inverse matrix",
    "linear algebra"
  ]
});

export default function MatrixCalculatorPage(): React.JSX.Element {
  return (
    <CalculatorPage
      title="Matrix Calculator"
      description="Free matrix calculator. Compute determinants, inverses, products, sums, and transpose of matrices with step-by-step solutions."
      path="/matrix-calculator"
      mode="matrix"
      h1="Matrix Calculator"
      subtitle="Perform matrix operations — multiplication, determinant, inverse, transpose, and more — with clear step-by-step explanations."
      exampleLatex="\\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}"
      howItWorks={[
        { step: "Enter matrices", description: "Type matrices row by row, separating entries with spaces or commas." },
      { step: "Choose an operation", description: "Multiply, find the determinant, compute the inverse, and more." },
      { step: "Get step-by-step work", description: "Each operation is shown with intermediate calculations." }
      ]}
      faqs={[
        {
          question: "What sizes of matrices are supported?",
          answer: "Any compatible dimensions — from 1×1 up to large square matrices for determinant and inverse."
        },
      {
          question: "Can it find the inverse of a non-square matrix?",
          answer: "Only square matrices have inverses. For non-square matrices, the calculator can compute the transpose or pseudo-inverse."
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

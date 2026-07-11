import { CalculatorPage } from "@/components/calculator/calculator-page";
import { algebraFaqs } from "@/data/faqs";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({ title: "Free Online Algebra Calculator | Calculus Solver", description: "Solve equations, simplify expressions, factor polynomials, and view clear algebra steps.", path: "/algebra-solver", keywords: ["algebra solver", "equation solver", "factor polynomial", "simplify expressions", "step by step algebra", "free algebra help", "online algebra solver"] });

export default function AlgebraSolverPage(): React.JSX.Element {
  return (
    <CalculatorPage
      title="Algebra Solver"
      description="Solve equations, simplify expressions, factor polynomials, and view clear algebra steps."
      path="/algebra-solver"
      mode="algebra"
      h1="Algebra Solver"
      subtitle="Solve equations, systems, polynomials, and algebraic expressions with clear step-by-step explanations."
      exampleLatex="2x + 5 = 17 \\Rightarrow x = 6"
      howItWorks={[
        { step: "Enter your problem", description: "Type an equation, expression, polynomial, or system." },
        { step: "Choose the method", description: "The solver identifies whether to solve, simplify, expand, or factor." },
        { step: "Review the solution", description: "See the answer, verification status, and each available algebra step." }
      ]}
      faqs={algebraFaqs}
      relatedTools={[
        { label: "Equation Solver", href: "/equation-solver" },
        { label: "Quadratic Solver", href: "/quadratic-solver" },
        { label: "Factoring Calculator", href: "/factoring-calculator" },
        { label: "Simplify Calculator", href: "/simplify-calculator" }
      ]}
    />
  );
}

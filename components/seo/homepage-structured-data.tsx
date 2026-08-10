import { generalFaqs } from "@/data/faqs";
import { StructuredData } from "@/components/seo/structured-data";
import { faqPageStructuredData, howToStructuredData, mathSolverStructuredData, softwareApplicationStructuredData } from "@/lib/seo";

const schemas = [
  mathSolverStructuredData(),
  softwareApplicationStructuredData(),
  faqPageStructuredData(generalFaqs),
  howToStructuredData({
      name: "How to Use Calculus Solver",
      description: "Enter a calculus problem and review a step-by-step solution.",
      steps: [
        { name: "Enter your calculus problem", text: "Type a derivative, integral, limit, equation, or function into the math input." },
        { name: "Click Solve Problem", text: "Submit the expression for mathematical processing and verification." },
        { name: "Review the solution", text: "Read the answer, step-by-step solution, explanation, and final answer." }
      ]
    })
] as const;

export function HomepageStructuredData(): React.JSX.Element {
  return <>{schemas.map((schema, index) => <StructuredData key={index} data={schema} />)}</>;
}

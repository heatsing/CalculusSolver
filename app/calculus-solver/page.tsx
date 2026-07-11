import { SolverLandingPage } from "@/components/marketing/solver-landing-page";
import { StructuredData } from "@/components/seo/structured-data";
import { calculusFaqs } from "@/data/faqs";
import { createMetadata, faqPageStructuredData } from "@/lib/seo";

export const metadata = createMetadata({ title: "Step-by-Step Calculus Solver", description: "Solve derivatives, integrals, limits, and common calculus problems with clear step-by-step explanations.", path: "/calculus-solver", keywords: ["calculus solver", "derivative calculator", "integral calculator", "limit calculator", "step by step calculus"] });

export default function CalculusSolverPage(): React.JSX.Element {
  return <><StructuredData data={faqPageStructuredData(calculusFaqs)} /><SolverLandingPage variant="calculus" /></>;
}

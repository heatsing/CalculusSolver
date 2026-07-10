import { SolverLandingPage } from "@/components/marketing/solver-landing-page";
import { StructuredData } from "@/components/seo/structured-data";
import { algebraFaqs } from "@/data/faqs";
import { createMetadata, faqPageStructuredData } from "@/lib/seo";

export const metadata = createMetadata({ title: "Free Online Algebra Calculator | Calculus Solver", description: "Solve equations, simplify expressions, factor polynomials, and view clear algebra steps.", path: "/algebra-solver", keywords: ["algebra solver", "equation solver", "factor polynomial", "simplify expressions", "step by step algebra", "free algebra help", "online algebra solver"] });

export default function AlgebraSolverPage(): React.JSX.Element { return <><StructuredData data={faqPageStructuredData(algebraFaqs)} /><SolverLandingPage variant="algebra" /></>; }

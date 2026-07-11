import { SolverLandingPage } from "@/components/marketing/solver-landing-page";
import { StructuredData } from "@/components/seo/structured-data";
import { generalFaqs } from "@/data/faqs";
import { createMetadata, faqPageStructuredData } from "@/lib/seo";

export const metadata = createMetadata({ title: "Free Calculus Solver & Algebra Solver Online | CalculusSolver.net", description: "Solve calculus and algebra problems online for free. Get step-by-step solutions for derivatives, integrals, equations, limits, and more with CalculusSolver.net.", path: "/", keywords: ["calculus solver", "math solver", "derivative calculator", "integral calculator", "equation solver", "step by step math"] });

export default function HomePage(): React.JSX.Element { return <><StructuredData data={faqPageStructuredData(generalFaqs)} /><SolverLandingPage variant="calculus" /></>; }

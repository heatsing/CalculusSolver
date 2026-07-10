import { SolverLandingPage } from "@/components/marketing/solver-landing-page";
import { StructuredData } from "@/components/seo/structured-data";
import { generalFaqs } from "@/data/faqs";
import { createMetadata, faqPageStructuredData } from "@/lib/seo";

export const metadata = createMetadata({ title: "Calculus Solver | Step-by-Step Math Problems", description: "Free Calculus Solver & Algebra Solver Online | CalculusSolver.net", path: "/", keywords: ["calculus solver", "math solver", "derivative calculator", "integral calculator", "equation solver", "step by step math"] });

export default function HomePage(): React.JSX.Element { return <><StructuredData data={faqPageStructuredData(generalFaqs)} /><SolverLandingPage variant="calculus" /></>; }

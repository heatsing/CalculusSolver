import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/marketing/hero";
import { FeatureStrip } from "@/components/marketing/feature-strip";
import { AiProcess } from "@/components/marketing/ai-process";
import { ExampleGrid } from "@/components/marketing/example-grid";
import { SolverShell } from "@/components/solver/solver-shell";
import { Faq } from "@/components/marketing/faq";
import { generalFaqs } from "@/data/faqs";
import { StructuredData } from "@/components/seo/structured-data";
import { createMetadata, faqPageStructuredData } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Calculus Solver | Step-by-Step Math Problems",
  description:
    "Solve calculus, algebra, derivatives, integrals, limits, and equations with clear step-by-step explanations and graphs.",
  path: "/",
  keywords: [
    "calculus solver",
    "math solver",
    "derivative calculator",
    "integral calculator",
    "equation solver",
    "step by step math"
  ]
});

export default function HomePage(): React.JSX.Element {
  return (
    <>
      <StructuredData data={faqPageStructuredData(generalFaqs)} />
      <Header />
      <main className="mx-auto w-full max-w-content px-4 sm:px-6 lg:px-8">
        <Hero
          title="Solve math problems step by step"
          subtitle="Type an expression, equation, or word problem. Get the answer and a clear path to it."
        />
        <SolverShell mode="auto" />
        <FeatureStrip />
        <AiProcess />
        <ExampleGrid />
        <Faq items={generalFaqs} />
      </main>
      <Footer />
    </>
  );
}

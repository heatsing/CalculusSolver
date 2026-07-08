import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/marketing/hero";
import { FeatureStrip } from "@/components/marketing/feature-strip";
import { AiProcess } from "@/components/marketing/ai-process";
import { ExampleGrid } from "@/components/marketing/example-grid";
import { SolverShell } from "@/components/solver/solver-shell";
import { Faq } from "@/components/marketing/faq";
import { calculusFaqs } from "@/data/faqs";
import { StructuredData } from "@/components/seo/structured-data";
import { createMetadata, faqPageStructuredData } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Calculus Solver | Step-by-Step Derivatives, Integrals & Limits",
  description:
    "Solve derivatives, integrals, limits, and common calculus problems with step-by-step explanations.",
  path: "/calculus-solver",
  keywords: [
    "calculus solver",
    "derivative calculator",
    "integral calculator",
    "limit calculator",
    "step by step calculus",
    "free calculus help",
    "online calculus solver"
  ]
});

export default function CalculusSolverPage(): React.JSX.Element {
  return (
    <>
      <StructuredData data={faqPageStructuredData(calculusFaqs)} />
      <Header />
      <main className="mx-auto w-full max-w-content px-4 sm:px-6 lg:px-8">
        <Hero
          title="Calculus problems solved clearly"
          subtitle="Derivatives, integrals, limits, and more. Each step explained so you can follow the logic."
        />
        <SolverShell mode="calculus" />
        <FeatureStrip />
        <AiProcess />
        <ExampleGrid />
        <Faq items={calculusFaqs} />
      </main>
      <Footer />
    </>
  );
}

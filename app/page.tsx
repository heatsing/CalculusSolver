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
      <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-content px-4 sm:px-6 lg:px-8 focus-visible:outline-none">
        <Hero
          title="See every step. Understand every result."
          subtitle="Enter an expression, equation, or word problem. Calculus Solver turns it into a clear, verifiable path from question to answer."
        />
        <section className="relative -mt-px border border-border bg-white p-4 sm:p-8 lg:p-12">
          <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
            <div><p className="font-mono text-xs text-body">WORKSPACE / 01</p><h2 className="mt-1 text-xl font-normal">Start a calculation</h2></div>
            <span className="hidden text-sm text-body sm:block">Derivatives · Integrals · Limits · Algebra</span>
          </div>
          <SolverShell mode="auto" />
        </section>
        <FeatureStrip />
        <AiProcess />
        <ExampleGrid />
        <Faq items={generalFaqs} />
      </main>
      <Footer />
    </>
  );
}

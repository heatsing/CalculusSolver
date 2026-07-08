import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/marketing/hero";
import { FeatureStrip } from "@/components/marketing/feature-strip";
import { AiProcess } from "@/components/marketing/ai-process";
import { ExampleGrid } from "@/components/marketing/example-grid";
import { SolverShell } from "@/components/solver/solver-shell";
import { Faq } from "@/components/marketing/faq";
import { algebraFaqs } from "@/data/faqs";
import { StructuredData } from "@/components/seo/structured-data";
import { createMetadata, faqPageStructuredData } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Algebra Solver | Step-by-Step Equations, Factors & Simplification",
  description:
    "Solve equations, simplify expressions, factor polynomials, and view clear algebra steps.",
  path: "/algebra-solver",
  keywords: [
    "algebra solver",
    "equation solver",
    "factor polynomial",
    "simplify expressions",
    "step by step algebra",
    "free algebra help",
    "online algebra solver"
  ]
});

export default function AlgebraSolverPage(): React.JSX.Element {
  return (
    <>
      <StructuredData data={faqPageStructuredData(algebraFaqs)} />
      <Header />
      <main className="relative mx-auto w-full max-w-content overflow-hidden px-4 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute -top-20 left-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
        <div className="pointer-events-none absolute top-60 right-0 -z-10 h-[400px] w-[400px] rounded-full bg-purple-300/20 blur-3xl" />
        <Hero
          title="Algebra Solve Helps You Get Quick Answers"
          highlight="Step-by-Step"
          subtitle="Solve equations, simplify expressions, factor polynomials, and understand every algebra step."
        />
        <SolverShell mode="algebra" />
        <FeatureStrip />
        <AiProcess />
        <ExampleGrid />
        <Faq items={algebraFaqs} />
      </main>
      <Footer />
    </>
  );
}

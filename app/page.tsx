import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/marketing/hero";
import { FeatureStrip } from "@/components/marketing/feature-strip";
import { AiProcess } from "@/components/marketing/ai-process";
import { ExampleGrid } from "@/components/marketing/example-grid";
import { SolverShell } from "@/components/solver/solver-shell";
import { Faq } from "@/components/marketing/faq";
import { generalFaqs } from "@/data/faqs";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Calculus Solver & Algebra Solver | Step-by-Step Math Solutions",
  description:
    "Free AI math solver for calculus and algebra. Solve derivatives, integrals, limits, equations, and expressions with clear explanations and interactive graphs.",
  path: "/",
  keywords: [
    "calculus solver",
    "algebra solver",
    "AI math solver",
    "derivative",
    "integral",
    "limit",
    "step by step math",
    "free math solver",
    "online math help"
  ]
});

export default function HomePage(): React.JSX.Element {
  return (
    <>
      <Header />
      <main className="relative mx-auto w-full max-w-content overflow-hidden px-4 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute -top-20 left-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
        <div className="pointer-events-none absolute top-60 right-0 -z-10 h-[400px] w-[400px] rounded-full bg-purple-300/20 blur-3xl" />
        <Hero
          title="Calculus Solver Helps You Get Quick Answers"
          highlight="Step-by-Step"
          subtitle="Ask in natural language, type formulas, or paste expressions. Powered by AI for step-by-step solutions."
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

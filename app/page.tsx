import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/marketing/hero";
import { FeatureStrip } from "@/components/marketing/feature-strip";
import { AiProcess } from "@/components/marketing/ai-process";
import { ExampleGrid } from "@/components/marketing/example-grid";
import { SolverShell } from "@/components/solver/solver-shell";

export default function HomePage(): React.JSX.Element {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-content px-4 sm:px-6 lg:px-8">
        <Hero />
        <SolverShell mode="auto" />
        <FeatureStrip />
        <AiProcess />
        <ExampleGrid />
      </main>
      <Footer />
    </>
  );
}

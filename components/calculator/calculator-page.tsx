import { SolverShell } from "@/components/solver/solver-shell";
import { StructuredData } from "@/components/seo/structured-data";
import { faqPageStructuredData } from "@/lib/seo";
import { toSolverMode } from "@/lib/calculator-mode";
import {
  CalculatorBenefits,
  CalculatorExample,
  CalculatorFaqs,
  CalculatorFooter,
  CalculatorHeader,
  CalculatorHero,
  CalculatorHowTo,
  CalculatorRelatedTools,
  type CalculatorFaq,
  type CalculatorStep,
  type CalculatorToolLink
} from "@/components/calculator/calculator-layout";

export type CalculatorPageProps = {
  title: string;
  description: string;
  path: string;
  mode: string;
  h1: string;
  subtitle: string;
  exampleLatex: string;
  howItWorks: CalculatorStep[];
  faqs: CalculatorFaq[];
  relatedTools: CalculatorToolLink[];
};

export function CalculatorPage({ title, mode, h1, subtitle, exampleLatex, howItWorks, faqs, relatedTools }: CalculatorPageProps): React.JSX.Element {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f6f9fe] text-[#0a234f]">
      <StructuredData data={faqPageStructuredData(faqs)} />
      <CalculatorHeader />
      <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-[1240px] px-4 py-10 focus-visible:outline-none sm:px-6 lg:px-8">
        <CalculatorHero h1={h1} subtitle={subtitle} />
        <section className="rounded-2xl border border-[#dbe6f6] bg-white p-4 shadow-[0_12px_40px_rgba(42,88,155,.09)] sm:p-6">
          <SolverShell mode={toSolverMode(mode)} operationHint={mode} />
        </section>
        <div className="mt-6"><CalculatorBenefits /></div>
        <CalculatorHowTo title={title} steps={howItWorks} />
        <CalculatorExample latex={exampleLatex} />
        <CalculatorFaqs faqs={faqs} />
        <CalculatorRelatedTools tools={relatedTools} />
      </main>
      <CalculatorFooter />
    </div>
  );
}

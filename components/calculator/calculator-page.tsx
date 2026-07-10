import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { SolverShell } from "@/components/solver/solver-shell";
import { MathDisplay } from "@/components/math/math-display";
import { StructuredData } from "@/components/seo/structured-data";
import { faqPageStructuredData } from "@/lib/seo";
import { toSolverMode } from "@/lib/calculator-mode";
import { CalculatorBenefits, CalculatorFooter, CalculatorHeader, calculatorSection } from "@/components/calculator/calculator-layout";

export type CalculatorPageProps = { title: string; description: string; path: string; mode: string; h1: string; subtitle: string; exampleLatex: string; howItWorks: { step: string; description: string }[]; faqs: { question: string; answer: string }[]; relatedTools: { label: string; href: string }[] };

export function CalculatorPage({ title, mode, h1, subtitle, exampleLatex, howItWorks, faqs, relatedTools }: CalculatorPageProps): React.JSX.Element {
  return <div className="min-h-screen bg-[#f6f9fe] text-[#0a234f]">
    <StructuredData data={faqPageStructuredData(faqs)} /><CalculatorHeader />
    <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-[1240px] px-4 py-10 focus-visible:outline-none sm:px-6 lg:px-8">
      <header className="mx-auto mb-8 max-w-3xl text-center"><p className="mb-3 text-xs font-bold uppercase tracking-[.18em] text-[#0967ed]">Free online calculator</p><h1 className="text-4xl font-bold tracking-tight text-[#0a234f] sm:text-5xl">{h1}</h1><p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-[#637392]">{subtitle}</p></header>
      <section className="rounded-2xl border border-[#dbe6f6] bg-white p-4 shadow-[0_12px_40px_rgba(42,88,155,.09)] sm:p-6"><SolverShell mode={toSolverMode(mode)} operationHint={mode} /></section>
      <div className="mt-6"><CalculatorBenefits /></div>
      <section className={`${calculatorSection} mt-8`}><h2 className="text-2xl font-bold">How to Use the {title}</h2><div className="mt-7 grid gap-5 sm:grid-cols-3">{howItWorks.map((item, index) => <div key={item.step} className="relative text-center"><span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#0967ed] font-bold text-white">{index + 1}</span><h3 className="mt-4 font-bold">{item.step}</h3><p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-[#637392]">{item.description}</p>{index < howItWorks.length - 1 && <ArrowRight className="absolute -right-4 top-3 hidden text-[#9dafcb] sm:block" />}</div>)}</div></section>
      <section className={`${calculatorSection} mt-6`}><h2 className="text-2xl font-bold">Example</h2><div className="mt-5 overflow-x-auto rounded-xl border border-[#dbe6f6] bg-[#f8fbff] p-6 text-center text-xl"><MathDisplay latex={exampleLatex} display="block" /></div></section>
      <section className={`${calculatorSection} mt-6`}><h2 className="text-2xl font-bold">Frequently Asked Questions</h2><div className="mt-5 divide-y divide-[#dbe6f6] rounded-xl border border-[#dbe6f6]">{faqs.map((faq) => <details key={faq.question} className="group px-4 py-3"><summary className="cursor-pointer list-none font-semibold after:float-right after:content-['⌄']">{faq.question}</summary><p className="mt-3 text-sm leading-6 text-[#637392]">{faq.answer}</p></details>)}</div></section>
      <section className="mt-8 text-center"><h2 className="text-2xl font-bold">More Calculators</h2><div className="mt-5 flex flex-wrap justify-center gap-2">{relatedTools.map((tool) => <Link key={tool.href} href={tool.href} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[#cbd9ed] bg-white px-4 text-sm font-semibold text-[#203b67] hover:border-[#0967ed] hover:text-[#0967ed]"><CheckCircle2 className="h-4 w-4 text-[#0967ed]" />{tool.label}</Link>)}</div></section>
    </main><CalculatorFooter />
  </div>;
}

import Link from "next/link";
import { ArrowRight, CheckCircle2, Gift, Zap } from "lucide-react";
import { MathDisplay } from "@/components/math/math-display";
import { Footer } from "@/components/layout/footer";
import { SiteHeader } from "@/components/layout/site-header";
import { allCalculatorTools } from "@/data/calculator-tools";

export type CalculatorStep = { step: string; description: string };
export type CalculatorFaq = { question: string; answer: string };
export type CalculatorToolLink = { label: string; href: string };

export const calculatorSection = "rounded-2xl border border-[#dbe6f6] bg-white p-5 shadow-sm sm:p-7";

export function CalculatorHeader(): React.JSX.Element {
  return <SiteHeader />;
}

export function CalculatorFooter(): React.JSX.Element {
  return <Footer />;
}

export function CalculatorHero({ h1, subtitle }: { h1: string; subtitle: string }): React.JSX.Element {
  return (
    <header className="mx-auto mb-8 max-w-3xl text-center">
      <p className="mb-3 text-xs font-bold uppercase tracking-[.18em] text-[#0967ed]">Free online calculator</p>
      <h1 className="text-4xl font-bold tracking-tight text-[#0a234f] sm:text-5xl">{h1}</h1>
      <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-[#637392]">{subtitle}</p>
    </header>
  );
}

export function CalculatorBenefits(): React.JSX.Element {
  const items = [
    [CheckCircle2, "Step-by-step solutions", "Clear, detailed explanations"],
    [Zap, "Instant results", "Accurate answers in seconds"],
    [Gift, "Free to use", "No sign-up required"]
  ] as const;

  return (
    <section className="grid gap-4 rounded-2xl border border-[#dbe6f6] bg-white px-5 py-4 shadow-sm sm:grid-cols-3">
      {items.map(([Icon, title, text]) => (
        <div key={title} className="flex items-center justify-center gap-4 py-2 sm:justify-start">
          <Icon className="h-7 w-7 shrink-0 text-[#0967ed]" />
          <div><h2 className="text-sm font-bold text-[#0a234f]">{title}</h2><p className="mt-0.5 text-xs text-[#637392]">{text}</p></div>
        </div>
      ))}
    </section>
  );
}

export function CalculatorHowTo({ title, steps }: { title: string; steps: CalculatorStep[] }): React.JSX.Element {
  return (
    <section className={`${calculatorSection} mt-8`}>
      <h2 className="text-2xl font-bold">How to Use the {title}</h2>
      <div className="mt-7 grid gap-5 sm:grid-cols-3">
        {steps.map((item, index) => (
          <div key={item.step} className="relative text-center">
            <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#0967ed] font-bold text-white">{index + 1}</span>
            <h3 className="mt-4 font-bold">{item.step}</h3>
            <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-[#637392]">{item.description}</p>
            {index < steps.length - 1 && <ArrowRight className="absolute -right-4 top-3 hidden text-[#9dafcb] sm:block" />}
          </div>
        ))}
      </div>
    </section>
  );
}

export function CalculatorExample({ latex }: { latex: string }): React.JSX.Element {
  const normalizedLatex = latex.replace(/\\\\/g, "\\");
  return (
    <section className={`${calculatorSection} mt-6`}>
      <h2 className="text-2xl font-bold">Example</h2>
      <div className="mt-5 overflow-x-auto rounded-xl border border-[#dbe6f6] bg-[#f8fbff] p-6 text-center text-xl">
        <MathDisplay latex={normalizedLatex} display="block" />
      </div>
    </section>
  );
}

export function CalculatorFaqs({ faqs }: { faqs: CalculatorFaq[] }): React.JSX.Element {
  return (
    <section className={`${calculatorSection} mt-6`}>
      <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
      <div className="mt-5 divide-y divide-[#dbe6f6] rounded-xl border border-[#dbe6f6]">
        {faqs.map((faq) => (
          <details key={faq.question} className="group px-4 py-3">
            <summary className="cursor-pointer list-none font-semibold after:float-right after:content-['⌄']">{faq.question}</summary>
            <p className="mt-3 text-sm leading-6 text-[#637392]">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function CalculatorRelatedTools({ tools: _tools }: { tools: readonly CalculatorToolLink[] }): React.JSX.Element {
  return (
    <section className={`${calculatorSection} mt-6`}>
      <h2 className="text-2xl font-bold">More Calculators</h2>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {allCalculatorTools.map((tool) => (
          <Link key={tool.href} href={tool.href} className="group flex min-h-20 items-center justify-between rounded-xl border border-[#dbe6f6] bg-white px-5 py-4 text-base font-semibold text-[#0a234f] shadow-sm transition hover:-translate-y-0.5 hover:border-[#82aff5] hover:shadow-md">
            <span>{tool.label}</span><ArrowRight className="h-5 w-5 shrink-0 text-[#0967ed] transition-transform group-hover:translate-x-1" />
          </Link>
        ))}
      </div>
    </section>
  );
}

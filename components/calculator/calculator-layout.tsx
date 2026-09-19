import Link from "next/link";
import { ArrowRight, CheckCircle2, Gift, Zap } from "lucide-react";
import { StaticMath } from "@/components/math/static-math";
import { Footer } from "@/components/layout/footer";
import { SiteHeader } from "@/components/layout/site-header";
import type { CalculatorEducationalContent } from "@/data/calculator-pages";
import type { CalculatorQualityContent } from "@/data/calculator-quality-content";

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

export function CalculatorHero({
  h1,
  subtitle,
  eyebrow = "Free online calculator",
  relatedLinks = []
}: {
  h1: string;
  subtitle: string;
  eyebrow?: string;
  relatedLinks?: readonly CalculatorToolLink[];
}): React.JSX.Element {
  return (
    <header className="mx-auto mb-8 max-w-3xl text-center">
      <p className="mb-3 text-xs font-bold uppercase tracking-[.18em] text-[#0967ed]">{eyebrow}</p>
      <h1 className="text-4xl font-bold tracking-tight text-[#0a234f] sm:text-5xl">{h1}</h1>
      <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-[#637392]">{subtitle}</p>
      {relatedLinks.length > 0 ? (
        <nav aria-label="Related calculators" className="mx-auto mt-5 flex max-w-2xl flex-wrap items-center justify-center gap-2 text-sm">
          {relatedLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full border border-[#dbe6f6] bg-white px-3 py-1.5 font-semibold text-[#0967ed] hover:border-[#82aff5]"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      ) : null}
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
        <StaticMath latex={normalizedLatex} display="block" />
      </div>
    </section>
  );
}

export function CalculatorLearningContent({ title, content }: { title: string; content: CalculatorEducationalContent }): React.JSX.Element {
  return (
    <section className={`${calculatorSection} mt-6`}>
      <h2 className="text-2xl font-bold">What the {title} Helps You Understand</h2>
      <p className="mt-4 max-w-4xl text-sm leading-7 text-[#637392]">{content.concept}</p>
      <div className="mt-6 grid gap-5 md:grid-cols-3">
        {content.useCases.map((useCase, index) => (
          <article key={useCase} className="rounded-xl border border-[#dbe6f6] bg-[#f8fbff] p-4">
            <h3 className="font-bold">Learning focus {index + 1}</h3>
            <p className="mt-2 text-sm leading-6 text-[#637392]">{useCase}</p>
          </article>
        ))}
      </div>
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <div>
          <h3 className="font-bold">Input tips</h3>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-[#637392]">{content.inputTips.map((tip) => <li key={tip}>• {tip}</li>)}</ul>
        </div>
        <div>
          <h3 className="font-bold">Common mistakes to avoid</h3>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-[#637392]">{content.commonMistakes.map((mistake) => <li key={mistake}>• {mistake}</li>)}</ul>
        </div>
      </div>
    </section>
  );
}

export function CalculatorDeepLearningContent({ title, content }: { title: string; content: CalculatorQualityContent }): React.JSX.Element {
  return (
    <>
      <section className={`${calculatorSection} mt-6`}>
        <h2 className="text-2xl font-bold">How the {title} Chooses a Method</h2>
        <p className="mt-4 max-w-4xl text-base leading-7 text-[#526785]">{content.searchIntent}</p>
        <p className="mt-3 max-w-4xl text-sm leading-7 text-[#637392]">{content.methodOverview}</p>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div className="rounded-xl border border-[#dbe6f6] bg-[#f8fbff] p-5">
            <h3 className="font-bold">Supported problem types</h3>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-[#526785]">{content.supportedProblems.map((item) => <li key={item} className="flex gap-2"><span aria-hidden="true" className="text-[#0967ed]">✓</span><span>{item}</span></li>)}</ul>
          </div>
          <div className="rounded-xl border border-[#dbe6f6] bg-[#f8fbff] p-5">
            <h3 className="font-bold">Limits and assumptions</h3>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-[#526785]">{content.limitations.map((item) => <li key={item} className="flex gap-2"><span aria-hidden="true" className="text-amber-600">!</span><span>{item}</span></li>)}</ul>
          </div>
        </div>
      </section>

      <section className={`${calculatorSection} mt-6`}>
        <h2 className="text-2xl font-bold">Worked {title} Examples</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[#637392]">Each example names the method, shows the ordered reasoning, and keeps the final answer separate so you can check your own work.</p>
        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          {content.workedExamples.map((example) => (
            <article key={example.title} className="rounded-xl border border-[#dbe6f6] bg-white p-5">
              <p className="text-xs font-bold uppercase tracking-[.14em] text-[#0967ed]">{example.title}</p>
              <h3 className="mt-2 text-lg font-bold leading-7">{example.problem}</h3>
              <p className="mt-3 text-sm font-semibold text-[#203b67]">Method: {example.method}</p>
              <ol className="mt-4 space-y-3 text-sm leading-6 text-[#526785]">
                {example.steps.map((step, index) => <li key={step} className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#e7f1ff] text-xs font-bold text-[#0967ed]">{index + 1}</span><span>{step}</span></li>)}
              </ol>
              <div className="mt-5 overflow-x-auto rounded-lg bg-[#edf6ff] p-4"><p className="mb-2 text-xs font-bold uppercase tracking-wide text-[#203b67]">Final answer</p><StaticMath latex={example.answer} display="block" /></div>
            </article>
          ))}
        </div>
      </section>

      <section className={`${calculatorSection} mt-6`}>
        <h2 className="text-2xl font-bold">Learn This Topic</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {content.relatedLearning.map((item) => <Link key={item.href} href={item.href} className="group flex min-h-16 items-center justify-between rounded-xl border border-[#dbe6f6] bg-[#f8fbff] px-5 py-4 font-semibold text-[#203b67] hover:border-[#82aff5]"><span>{item.label}</span><ArrowRight className="h-4 w-4 shrink-0 text-[#0967ed] transition-transform group-hover:translate-x-1" /></Link>)}
        </div>
      </section>
    </>
  );
}

export function CalculatorTopicLinks({ links }: { links: readonly { label: string; href: string }[] }): React.JSX.Element | null {
  if (links.length === 0) return null;
  return <section className={`${calculatorSection} mt-6`}><h2 className="text-2xl font-bold">Learn This Topic</h2><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{links.map((item) => <Link key={item.href} href={item.href} className="group flex min-h-16 items-center justify-between rounded-xl border border-[#dbe6f6] bg-[#f8fbff] px-5 py-4 font-semibold text-[#203b67] hover:border-[#82aff5]"><span>{item.label}</span><ArrowRight className="h-4 w-4 shrink-0 text-[#0967ed] transition-transform group-hover:translate-x-1" /></Link>)}</div></section>;
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

export function CalculatorRelatedTools({ tools }: { tools: readonly CalculatorToolLink[] }): React.JSX.Element {
  return (
    <section className={`${calculatorSection} mt-6`}>
      <h2 className="text-2xl font-bold">More Calculators</h2>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Link key={tool.href} href={tool.href} className="group flex min-h-20 items-center justify-between rounded-xl border border-[#dbe6f6] bg-white px-5 py-4 text-base font-semibold text-[#0a234f] shadow-sm transition hover:-translate-y-0.5 hover:border-[#82aff5] hover:shadow-md">
            <span>{tool.label}</span><ArrowRight className="h-5 w-5 shrink-0 text-[#0967ed] transition-transform group-hover:translate-x-1" />
          </Link>
        ))}
      </div>
      <Link href="/calculators" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#0967ed] hover:underline">Browse all calculators <ArrowRight className="h-4 w-4" /></Link>
    </section>
  );
}

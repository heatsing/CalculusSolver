import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { StaticMath } from "@/components/math/static-math";
import { Footer } from "@/components/layout/footer";
import { SiteHeader } from "@/components/layout/site-header";
import type { CalculatorEducationalContent } from "@/data/calculator-pages";
import type { CalculatorQualityContent } from "@/data/calculator-quality-content";

export type CalculatorStep = { step: string; description: string };
export type CalculatorFaq = { question: string; answer: string };
export type CalculatorToolLink = { label: string; href: string };

export const calculatorSection = "border-t border-[#d7e2f0] py-9 sm:py-11";

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
    <header className="mx-auto mb-7 max-w-[980px]">
      <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-sm text-[#637392]">
        <Link href="/calculators" className="font-medium text-[#0967ed] hover:underline">Calculators</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{h1}</span>
      </nav>
      <p className="mb-3 text-xs font-bold uppercase tracking-[.18em] text-[#0967ed]">{eyebrow}</p>
      <h1 className="max-w-4xl text-4xl font-bold tracking-[-.035em] text-[#0a234f] sm:text-5xl">{h1}</h1>
      <p className="mt-3 max-w-3xl text-base leading-7 text-[#526785] sm:text-lg">{subtitle}</p>
      {relatedLinks.length > 0 ? (
        <nav aria-label="Related calculators" className="mt-5 flex max-w-3xl flex-wrap items-center gap-2 text-sm">
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
    ["Step-by-step solutions", "See the working, not only the result"],
    ["Exact and decimal forms", "Use the form that fits your problem"],
    ["No account needed", "Start with the example or enter your own"]
  ] as const;

  return (
    <section aria-label="Calculator details" className="mx-auto max-w-[980px] border-y border-[#d7e2f0] py-4">
      <div className="grid gap-3 sm:grid-cols-3 sm:gap-0">
      {items.map(([title, text], index) => (
        <div key={title} className={`flex gap-3 px-1 py-1 sm:px-5 ${index > 0 ? "sm:border-l sm:border-[#d7e2f0]" : ""}`}>
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#0967ed]" aria-hidden="true" />
          <div><p className="text-sm font-semibold text-[#0a234f]">{title}</p><p className="mt-0.5 text-xs leading-5 text-[#637392]">{text}</p></div>
        </div>
      ))}
      </div>
    </section>
  );
}

export function CalculatorHowTo({ title, steps }: { title: string; steps: CalculatorStep[] }): React.JSX.Element {
  return (
    <section className={`${calculatorSection} mt-8`}>
      <div className="grid gap-7 lg:grid-cols-[minmax(220px,.65fr)_minmax(0,1.8fr)]">
        <div>
          <p className="text-sm font-semibold text-[#0967ed]">Quick start</p>
          <h2 className="mt-2 text-2xl font-bold">How to Use the {title}</h2>
          <p className="mt-3 text-sm leading-6 text-[#637392]">The calculator is ready with a sample problem. Replace it with your own when you are ready.</p>
        </div>
        <ol className="divide-y divide-[#d7e2f0] border-y border-[#d7e2f0]">
        {steps.map((item, index) => (
          <li key={item.step} className="grid gap-2 py-4 sm:grid-cols-[2.5rem_12rem_1fr] sm:items-start">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#e8f2ff] text-sm font-bold text-[#0967ed]">{index + 1}</span>
            <h3 className="font-bold">{item.step}</h3>
            <p className="text-sm leading-6 text-[#637392]">{item.description}</p>
          </li>
        ))}
        </ol>
      </div>
    </section>
  );
}

export function CalculatorExample({ latex }: { latex: string }): React.JSX.Element {
  const normalizedLatex = latex.replace(/\\\\/g, "\\");
  return (
    <section className={`${calculatorSection}`}>
      <div className="grid gap-6 lg:grid-cols-[220px_1fr] lg:items-center">
        <div><p className="text-sm font-semibold text-[#0967ed]">Worked notation</p><h2 className="mt-2 text-2xl font-bold">Example</h2></div>
        <div className="overflow-x-auto border-l-4 border-[#0967ed] bg-[#f3f7fc] px-6 py-7 text-center text-xl">
        <StaticMath latex={normalizedLatex} display="block" />
        </div>
      </div>
    </section>
  );
}

export function CalculatorLearningContent({ title, content }: { title: string; content: CalculatorEducationalContent }): React.JSX.Element {
  return (
    <section className={calculatorSection}>
      <div className="grid gap-8 lg:grid-cols-[1fr_.9fr]">
        <div>
          <h2 className="text-2xl font-bold">What the {title} Helps You Understand</h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[#526785]">{content.concept}</p>
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-[.12em] text-[#203b67]">Useful for</h3>
          <ul className="mt-3 divide-y divide-[#d7e2f0] border-y border-[#d7e2f0]">
            {content.useCases.map((useCase) => (
              <li key={useCase} className="flex gap-3 py-3 text-sm leading-6 text-[#526785]"><span className="text-[#0967ed]" aria-hidden="true">—</span><span>{useCase}</span></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-8 grid gap-8 border-t border-[#d7e2f0] pt-7 md:grid-cols-2">
        <div className="md:pr-6">
          <h3 className="font-bold">Input tips</h3>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-[#637392]">{content.inputTips.map((tip) => <li key={tip} className="flex gap-3"><span className="text-[#0967ed]" aria-hidden="true">→</span><span>{tip}</span></li>)}</ul>
        </div>
        <div className="md:border-l md:border-[#d7e2f0] md:pl-7">
          <h3 className="font-bold">Common mistakes to avoid</h3>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-[#637392]">{content.commonMistakes.map((mistake) => <li key={mistake} className="flex gap-3"><span className="text-amber-700" aria-hidden="true">!</span><span>{mistake}</span></li>)}</ul>
        </div>
      </div>
    </section>
  );
}

export function CalculatorDeepLearningContent({ title, content }: { title: string; content: CalculatorQualityContent }): React.JSX.Element {
  return (
    <>
      <section className={calculatorSection}>
        <div className="grid gap-8 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <p className="text-sm font-semibold text-[#0967ed]">Method notes</p>
            <h2 className="mt-2 text-2xl font-bold">How the {title} Works</h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-[#526785]">{content.searchIntent}</p>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[#637392]">{content.methodOverview}</p>
          </div>
          <div className="border-y border-[#d7e2f0]">
            <div className="py-5">
              <h3 className="font-bold">What it handles</h3>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-[#526785]">{content.supportedProblems.map((item) => <li key={item} className="flex gap-2"><span aria-hidden="true" className="text-[#0967ed]">✓</span><span>{item}</span></li>)}</ul>
            </div>
            <div className="border-t border-[#d7e2f0] py-5">
              <h3 className="font-bold">When to be careful</h3>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-[#526785]">{content.limitations.map((item) => <li key={item} className="flex gap-2"><span aria-hidden="true" className="text-amber-700">!</span><span>{item}</span></li>)}</ul>
            </div>
          </div>
        </div>
      </section>

      <section className={calculatorSection}>
        <h2 className="text-2xl font-bold">Worked {title} Examples</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[#637392]">Compare the method and intermediate steps with your own work before checking the final expression.</p>
        <div className="mt-6 divide-y divide-[#d7e2f0] border-y border-[#d7e2f0]">
          {content.workedExamples.map((example) => (
            <article key={example.title} className="grid gap-5 py-6 lg:grid-cols-[.8fr_1.2fr] lg:gap-10">
              <div>
                <p className="text-sm font-semibold text-[#0967ed]">{example.title}</p>
                <h3 className="mt-2 text-lg font-bold leading-7">{example.problem}</h3>
                <p className="mt-3 text-sm text-[#526785]"><strong className="text-[#203b67]">Method:</strong> {example.method}</p>
              </div>
              <div>
                <ol className="space-y-2 text-sm leading-6 text-[#526785]">
                  {example.steps.map((step, index) => <li key={step} className="grid grid-cols-[1.5rem_1fr] gap-3"><span className="font-semibold text-[#0967ed]">{index + 1}.</span><span>{step}</span></li>)}
                </ol>
                <div className="mt-4 flex flex-col gap-3 border-l-4 border-[#0967ed] bg-[#f3f7fc] px-4 py-3 sm:flex-row sm:items-center sm:justify-between"><p className="text-xs font-bold uppercase tracking-wide text-[#203b67]">Final answer</p><div className="overflow-x-auto"><StaticMath latex={example.answer} display="block" /></div></div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={calculatorSection}>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div><p className="text-sm font-semibold text-[#0967ed]">Continue learning</p><h2 className="mt-2 text-2xl font-bold">Learn This Topic</h2></div>
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            {content.relatedLearning.map((item) => <Link key={item.href} href={item.href} className="group inline-flex items-center gap-2 border-b border-[#9fc0ea] pb-1 font-semibold text-[#203b67] hover:border-[#0967ed] hover:text-[#0967ed]"><span>{item.label}</span><ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" /></Link>)}
          </div>
        </div>
      </section>
    </>
  );
}

export function CalculatorTopicLinks({ links }: { links: readonly { label: string; href: string }[] }): React.JSX.Element | null {
  if (links.length === 0) return null;
  return <section className={calculatorSection}><div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-semibold text-[#0967ed]">Continue learning</p><h2 className="mt-2 text-2xl font-bold">Learn This Topic</h2></div><div className="flex flex-wrap gap-x-6 gap-y-3">{links.map((item) => <Link key={item.href} href={item.href} className="group inline-flex items-center gap-2 border-b border-[#9fc0ea] pb-1 font-semibold text-[#203b67] hover:border-[#0967ed] hover:text-[#0967ed]"><span>{item.label}</span><ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" /></Link>)}</div></div></section>;
}

export function CalculatorFaqs({ faqs }: { faqs: CalculatorFaq[] }): React.JSX.Element {
  return (
    <section className={calculatorSection}>
      <div className="grid gap-6 lg:grid-cols-[.55fr_1.45fr]">
        <div><p className="text-sm font-semibold text-[#0967ed]">Before you calculate</p><h2 className="mt-2 text-2xl font-bold">Frequently Asked Questions</h2></div>
        <div className="divide-y divide-[#d7e2f0] border-y border-[#d7e2f0]">
        {faqs.map((faq) => (
          <details key={faq.question} className="group py-4">
            <summary className="cursor-pointer list-none pr-6 font-semibold after:float-right after:text-[#0967ed] after:content-['+'] group-open:after:content-['−']">{faq.question}</summary>
            <p className="mt-3 max-w-3xl pr-6 text-sm leading-6 text-[#637392]">{faq.answer}</p>
          </details>
        ))}
        </div>
      </div>
    </section>
  );
}

export function CalculatorRelatedTools({ tools }: { tools: readonly CalculatorToolLink[] }): React.JSX.Element {
  return (
    <section className={calculatorSection}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-semibold text-[#0967ed]">Related tools</p><h2 className="mt-2 text-2xl font-bold">More Calculators</h2></div><Link href="/calculators" className="inline-flex items-center gap-2 text-sm font-bold text-[#0967ed] hover:underline">Browse all calculators <ArrowRight className="h-4 w-4" /></Link></div>
      <div className="mt-6 grid border-t border-[#d7e2f0] sm:grid-cols-2">
        {tools.map((tool) => (
          <Link key={tool.href} href={tool.href} className="group flex min-h-16 items-center justify-between border-b border-[#d7e2f0] px-1 py-4 text-base font-semibold text-[#0a234f] hover:text-[#0967ed] sm:odd:pr-6 sm:even:border-l sm:even:pl-6">
            <span>{tool.label}</span><ArrowRight className="h-5 w-5 shrink-0 text-[#0967ed] transition-transform group-hover:translate-x-1" />
          </Link>
        ))}
      </div>
    </section>
  );
}

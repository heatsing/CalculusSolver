import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SolverShell } from "@/components/solver/solver-shell";
import { MathDisplay } from "@/components/math/math-display";
import { StructuredData } from "@/components/seo/structured-data";
import { faqPageStructuredData } from "@/lib/seo";
import { toSolverMode } from "@/lib/calculator-mode";

export type CalculatorPageProps = {
  title: string;
  description: string;
  path: string;
  mode: string;
  h1: string;
  subtitle: string;
  exampleLatex: string;
  howItWorks: { step: string; description: string }[];
  faqs: { question: string; answer: string }[];
  relatedTools: { label: string; href: string }[];
};

export function CalculatorPage({
  title,
  description,
  path,
  mode,
  h1,
  subtitle,
  exampleLatex,
  howItWorks,
  faqs,
  relatedTools
}: CalculatorPageProps): React.JSX.Element {
  return (
    <>
      <StructuredData data={faqPageStructuredData(faqs)} />
      <Header />
      <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-content overflow-hidden px-4 py-10 sm:px-6 lg:px-8 focus-visible:outline-none">
        <nav className="mb-8 border-b border-border pb-4 text-sm text-body">
          <a href="/" className="hover:text-heading">Home</a>
          <span className="mx-2">/</span>
          <span className="text-heading">{title}</span>
        </nav>
        <div className="grid gap-8 border-b border-border pb-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p className="mb-4 font-mono text-xs text-body">CALCULATOR / ONLINE</p>
            <h1 className="text-5xl font-light leading-tight tracking-[-0.025em] text-heading sm:text-6xl">{h1}</h1>
          </div>
          <p className="self-end text-lg leading-relaxed text-body lg:col-span-4">{subtitle}</p>
        </div>

        <div className="mt-10 border border-border bg-white p-4 sm:p-8">
          <SolverShell mode={toSolverMode(mode)} operationHint={mode} />
        </div>

        <section className="mt-16">
          <h2 className="text-3xl font-normal text-heading">How it works</h2>
          <div className="mt-6 border-l border-t border-border sm:grid sm:grid-cols-3">
            {howItWorks.map((item, index) => (
              <div key={index} className="min-h-48 border-b border-r border-border bg-white p-6 transition-colors hover:bg-secondary-background">
                <span className="flex h-8 w-8 items-center justify-center bg-primary font-mono text-sm text-white">
                  {index + 1}
                </span>
                <h3 className="mt-3 font-semibold text-heading">{item.step}</h3>
                <p className="mt-1 text-sm text-body">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-3xl font-normal text-heading">Example</h2>
          <div className="mt-6 rounded-card border border-border bg-white p-5">
            <MathDisplay latex={exampleLatex} display="block" />
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-3xl font-normal text-heading">Frequently asked questions</h2>
          <div className="mt-6 space-y-4">
            {faqs.map((faq, index) => (
              <details key={index} className="rounded-card border border-border bg-white p-4">
                <summary className="cursor-pointer font-medium text-heading">{faq.question}</summary>
                <p className="mt-2 text-sm text-body">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-3xl font-normal text-heading">Related tools</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {relatedTools.map((tool) => (
              <a
                key={tool.href}
                href={tool.href}
                className="border border-border bg-white px-4 py-3 text-sm text-heading transition-colors hover:border-primary hover:bg-primary-soft hover:text-primary"
              >
                {tool.label}
              </a>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

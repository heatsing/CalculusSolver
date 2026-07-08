import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SolverShell } from "@/components/solver/solver-shell";
import { MathDisplay } from "@/components/math/math-display";
import { StructuredData } from "@/components/seo/structured-data";
import { faqPageStructuredData } from "@/lib/seo";

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
        <nav className="mb-6 text-sm text-body">
          <a href="/" className="hover:text-heading">Home</a>
          <span className="mx-2">/</span>
          <span className="text-heading">{title}</span>
        </nav>
        <h1 className="text-4xl font-bold tracking-tight text-heading sm:text-5xl">{h1}</h1>
        <p className="mt-4 max-w-2xl text-lg text-body">{subtitle}</p>

        <div className="mt-10">
          <SolverShell mode={mode} />
        </div>

        <section className="mt-16">
          <h2 className="text-2xl font-bold text-heading">How it works</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {howItWorks.map((item, index) => (
              <div key={index} className="rounded-card border border-border bg-white p-5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                  {index + 1}
                </span>
                <h3 className="mt-3 font-semibold text-heading">{item.step}</h3>
                <p className="mt-1 text-sm text-body">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-2xl font-bold text-heading">Example</h2>
          <div className="mt-6 rounded-card border border-border bg-white p-5">
            <MathDisplay latex={exampleLatex} display="block" />
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-2xl font-bold text-heading">Frequently asked questions</h2>
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
          <h2 className="text-2xl font-bold text-heading">Related tools</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {relatedTools.map((tool) => (
              <a
                key={tool.href}
                href={tool.href}
                className="rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-heading transition-colors hover:border-primary hover:text-primary"
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

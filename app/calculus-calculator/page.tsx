import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { OnlineCalculator } from "@/components/calculator/online-calculator";
import { StructuredData } from "@/components/seo/structured-data";
import { createMetadata, faqPageStructuredData } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Free Online Calculus Calculator | Calculus Solver",
  description:
    "Free online calculus calculator with interactive buttons. Compute derivatives, integrals, limits, and expressions with step-by-step explanations and graphs.",
  path: "/calculus-calculator",
  keywords: [
    "calculus calculator",
    "online calculus calculator",
    "derivative calculator",
    "integral calculator",
    "limit calculator",
    "free math calculator"
  ]
});

const faqs = [
  {
    question: "What can the Calculus Calculator do?",
    answer:
      "It computes derivatives, integrals, limits, and general expressions. Use the button grid to build expressions, then evaluate or solve step-by-step."
  },
  {
    question: "Is this calculus calculator free?",
    answer: "Yes. It is completely free with no account required."
  },
  {
    question: "Can I get step-by-step solutions?",
    answer:
      'Yes. Click "Solve step-by-step" after entering your expression to get a full breakdown with rules and an interactive graph.'
  },
  {
    question: "Does it work on mobile?",
    answer: "Yes. The calculator is fully responsive and works on phones, tablets, and desktops."
  }
];

export default function CalculusCalculatorPage(): React.JSX.Element {
  return (
    <>
      <StructuredData data={faqPageStructuredData(faqs)} />
      <Header />
      <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-content px-4 py-10 sm:px-6 lg:px-8 focus-visible:outline-none">
        <nav className="mb-6 text-sm text-body">
          <a href="/" className="hover:text-heading">Home</a>
          <span className="mx-2">/</span>
          <span className="text-heading">Calculus Calculator</span>
        </nav>

        <h1 className="text-4xl font-bold tracking-tight text-heading sm:text-5xl">Calculus Calculator</h1>
        <p className="mt-4 max-w-2xl text-lg text-body">
          An interactive online calculator for derivatives, integrals, limits, and expressions.
          Tap the buttons to build your problem, then evaluate or get a full step-by-step solution.
        </p>

        <div className="mt-10">
          <OnlineCalculator />
        </div>

        <section className="mt-16">
          <h2 className="text-2xl font-bold text-heading">How to use</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            <div className="rounded-card border border-border bg-white p-5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">1</span>
              <h3 className="mt-3 font-semibold text-heading">Build your expression</h3>
              <p className="mt-1 text-sm text-body">Tap the calculus, function, and number buttons to construct any expression.</p>
            </div>
            <div className="rounded-card border border-border bg-white p-5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">2</span>
              <h3 className="mt-3 font-semibold text-heading">Evaluate or solve</h3>
              <p className="mt-1 text-sm text-body">Quick-evaluate to normalize and detect the operation, or solve step-by-step for a full breakdown.</p>
            </div>
            <div className="rounded-card border border-border bg-white p-5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">3</span>
              <h3 className="mt-3 font-semibold text-heading">Get the answer</h3>
              <p className="mt-1 text-sm text-body">View the LaTeX-rendered result, interactive graph, and rule-by-rule explanation.</p>
            </div>
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
            <a href="/derivative-calculator" className="rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-heading transition-colors hover:border-primary hover:text-primary">Derivative Calculator</a>
            <a href="/integral-calculator" className="rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-heading transition-colors hover:border-primary hover:text-primary">Integral Calculator</a>
            <a href="/limit-calculator" className="rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-heading transition-colors hover:border-primary hover:text-primary">Limit Calculator</a>
            <a href="/equation-solver" className="rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-heading transition-colors hover:border-primary hover:text-primary">Equation Solver</a>
            <a href="/algebra-solver" className="rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-heading transition-colors hover:border-primary hover:text-primary">Algebra Calculator</a>
            <a href="/graphing-calculator" className="rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-heading transition-colors hover:border-primary hover:text-primary">Graphing Calculator</a>
            <a href="/quadratic-solver" className="rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-heading transition-colors hover:border-primary hover:text-primary">Quadratic Calculator</a>
            <a href="/factoring-calculator" className="rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-heading transition-colors hover:border-primary hover:text-primary">Factor Calculator</a>
            <a href="/fraction-calculator" className="rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-heading transition-colors hover:border-primary hover:text-primary">Fraction Calculator</a>
            <a href="/matrix-calculator" className="rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-heading transition-colors hover:border-primary hover:text-primary">Matrix Calculator</a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

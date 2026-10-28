import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  FunctionSquare,
  GraduationCap,
  Infinity,
  Keyboard,
  ListChecks,
  Sigma,
  Sparkles
} from "lucide-react";
import { DeferredDailyChallenge } from "@/components/daily-challenge/deferred-daily-challenge";
import { Footer } from "@/components/layout/footer";
import { SiteHeader } from "@/components/layout/site-header";
import { HomeStartHere, homeStartHereCalculators } from "@/components/marketing/home-start-here";
import { SolverShellBoundary } from "@/components/solver/solver-shell-boundary";
import { generalFaqs } from "@/data/faqs";

const capabilities = ["Mathematical expressions", "Equations", "Derivatives", "Integrals"] as const;

const helpTopics = [
  {
    title: "Derivatives",
    description: "Apply power, product, quotient, and chain rules with each transformation explained.",
    href: "/derivative-calculator",
    icon: FunctionSquare
  },
  {
    title: "Integrals",
    description: "Solve indefinite and definite integrals and keep the constant of integration where needed.",
    href: "/integral-calculator",
    icon: Sigma
  },
  {
    title: "Limits",
    description: "Evaluate limits at a point or infinity, including common one-sided limit notation.",
    href: "/limit-calculator",
    icon: Infinity
  },
  {
    title: "Functions",
    description: "Simplify, evaluate, and graph functions before applying a calculus operation.",
    href: "/graphing-calculator",
    icon: Sparkles
  },
  {
    title: "Algebra & Equations",
    description: "Solve the algebraic equations and simplification steps that appear inside calculus work.",
    href: "/algebra-solver",
    icon: ListChecks
  },
  {
    title: "Calculus Homework",
    description: "Check your method, review the rules used, and practice a similar problem afterward.",
    href: "/examples",
    icon: GraduationCap
  }
] as const;

const examples = [
  {
    type: "Derivative",
    problem: "d/dx (x³ + 2x)",
    latex: "\\frac{d}{dx}(x^3+2x)",
    input: "d/dx (x^3 + 2x)",
    href: "/derivative-calculator",
    detailHref: "/examples/derivative-polynomial"
  },
  {
    type: "Integral",
    problem: "∫₀¹ x² dx",
    latex: "\\int_0^1 x^2\\,dx",
    input: "x^2 from 0 to 1",
    href: "/definite-integral-calculator",
    detailHref: "/examples/definite-integral"
  },
  {
    type: "Limit",
    problem: "lim x→0 sin(x)/x",
    latex: "\\lim_{x\\to0}\\frac{\\sin(x)}{x}",
    input: "limit sin(x)/x as x approaches 0",
    href: "/limit-calculator",
    detailHref: "/examples/limit-sinc"
  }
] as const;

const relatedCalculators = homeStartHereCalculators;

function SectionHeading({
  eyebrow,
  title,
  description
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}): React.JSX.Element {
  return (
    <header className="max-w-3xl">
      {eyebrow && <p className="text-sm font-medium text-[#0967ed]">{eyebrow}</p>}
      <h2 className="mt-2 text-3xl font-bold tracking-[-0.025em] text-[#071f4a] sm:text-4xl">{title}</h2>
      {description && <p className="mt-4 text-base leading-7 text-[#5f6f8d]">{description}</p>}
    </header>
  );
}

export function CalculusHomePage(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_50%_0%,#ffffff_0%,#f8fbff_46%,#f2f7fe_100%)] text-[#071f4a]">
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="calculus-home-main focus-visible:outline-none">
        <section className="mx-auto max-w-[1240px] px-4 pb-12 pt-10 sm:px-6 sm:pt-14 lg:px-8">
          <header className="mx-auto max-w-4xl text-center">
            <h1 className="text-balance text-5xl font-bold tracking-[-0.04em] text-[#071f4a] sm:text-6xl">Calculus Solver</h1>
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg leading-8 text-[#5f6f8d]">
              Solve calculus problems with step-by-step explanations.
            </p>
            <ul className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm font-medium text-[#20385f]" aria-label="Supported input types">
              {capabilities.map((capability) => (
                <li key={capability} className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-[#0967ed]" aria-hidden="true" />
                  {capability}
                </li>
              ))}
            </ul>
            <HomeStartHere />
          </header>

          <div id="calculator" className="mx-auto mt-8 max-w-[1080px] scroll-mt-24 overflow-hidden rounded-2xl border border-[#cfe0f6] bg-white shadow-[0_20px_60px_rgba(35,74,132,.14)]">
            <div className="flex flex-col gap-2 border-b border-[#dbe5f4] bg-[#f8fbff] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0967ed] text-white">
                  <Sigma className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h2 className="text-base font-bold text-[#071f4a]">Enter a Calculus Problem</h2>
                  <p className="text-xs text-[#5f6f8d]">Type with your keyboard or use formula mode and math symbols.</p>
                </div>
              </div>
              <p className="text-xs font-medium text-[#405577]">No account required</p>
            </div>
            <div className="px-3 pb-2 sm:px-6">
              <SolverShellBoundary mode="auto" />
            </div>
          </div>

          <div className="mx-auto mt-6 grid max-w-[1080px] border-y border-[#d7e2f0] py-4 sm:grid-cols-3">
            {[
              [Keyboard, "Flexible Math Input", "Keyboard, symbols, and function notation"],
              [ListChecks, "Step-by-Step Solution", "Rules and transformations in order"],
              [BookOpenCheck, "Learning Guidance", "Explanations, checks, and practice"]
            ].map(([Icon, title, text], index) => {
              const FeatureIcon = Icon as typeof Keyboard;
              return (
                <div key={title as string} className={`flex items-center gap-3 px-4 py-2 ${index > 0 ? "sm:border-l sm:border-[#d7e2f0]" : ""}`}>
                  <FeatureIcon className="h-5 w-5 shrink-0 text-[#0967ed]" aria-hidden="true" />
                  <div className="min-w-0">
                    <h2 className="text-sm font-bold text-[#071f4a]">{title as string}</h2>
                    <p className="mt-0.5 text-xs leading-5 text-[#5f6f8d]">{text as string}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="border-y border-[#dfe9f6] bg-white/80">
          <div className="mx-auto grid max-w-[1120px] gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_.9fr] lg:items-center lg:px-8">
            <div>
              <SectionHeading
                eyebrow="Understand the Tool"
                title="What Is Calculus Solver?"
                description="Calculus Solver is an online learning tool for students, teachers, and independent learners who need to solve a calculus problem and understand the method—not only copy a final answer."
              />
              <p className="mt-5 text-sm leading-7 text-[#405577]">
                It recognizes derivatives, integrals, limits, equations, and common function notation. Each supported problem is interpreted, calculated, and presented with ordered steps so you can check homework, review a rule, or learn how one line changes into the next.
              </p>
            </div>
            <div className="border-l-4 border-[#0967ed] bg-[#f4f8fd] px-6 py-5 sm:px-8 sm:py-7">
              <h3 className="text-lg font-bold text-[#071f4a]">Learning Benefits</h3>
              <ul className="mt-5 space-y-4">
                {[
                  "See which calculus rule applies to the problem.",
                  "Compare your own work with an ordered solution.",
                  "Review the explanation behind each transformation.",
                  "Generate similar practice after solving a problem."
                ].map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-6 text-[#405577]">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#0967ed]" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1120px] px-4 py-14 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="From Input to Explanation"
            title="How Does Calculus Solver Work?"
            description="The solver combines problem recognition, mathematical processing, and explanation generation in one workflow."
          />
          <div className="mt-8 grid gap-7 md:grid-cols-3 md:gap-0">
            {[
              ["Recognize the Input", "The solver reads your notation and identifies the operation, variable, bounds, and expression."],
              ["Process the Mathematics", "A symbolic math engine computes supported operations and independently checks results where possible."],
              ["Generate the Solution", "The answer is organized into readable steps with rules, explanations, verification, and a graph when available."]
            ].map(([title, text], index) => (
              <article key={title} className={`py-2 md:px-7 ${index > 0 ? "md:border-l md:border-[#d7e2f0]" : "md:pl-0"}`}>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eaf3ff] text-sm font-bold text-[#0967ed]">{index + 1}</span>
                <h3 className="mt-5 text-lg font-bold text-[#071f4a]">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#5f6f8d]">{text}</p>
              </article>
            ))}
          </div>
          <section aria-labelledby="home-how-to-title" className="mt-10 grid gap-5 border-t border-[#d7e2f0] pt-7 lg:grid-cols-[.7fr_1.3fr] lg:items-start">
            <div><p className="text-sm font-medium text-[#0967ed]">Using the solver</p><h2 id="home-how-to-title" className="mt-2 text-2xl font-bold text-[#071f4a]">How to Use Calculus Solver</h2></div>
            <ol className="grid gap-4 sm:grid-cols-3">
              {["Enter the complete problem", "Choose Solve Problem", "Check the method and final answer"].map((text, index) => <li key={text} className="flex gap-3 text-sm leading-6 text-[#526785]"><span className="font-bold text-[#0967ed]">{index + 1}.</span><span>{text}</span></li>)}
            </ol>
          </section>
        </section>

        <section className="mx-auto max-w-[1120px] px-4 py-14 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Supported Topics"
            title="What Can Calculus Solver Help With?"
            description="Choose a focused calculator when you already know the topic, or enter the complete problem in the solver above."
          />
          <div className="mt-8 grid border-t border-[#d7e2f0] md:grid-cols-2">
            {helpTopics.map((topic, index) => (
              <Link key={topic.title} href={topic.href} className={`group grid min-h-32 grid-cols-[2.5rem_1fr_auto] gap-4 border-b border-[#d7e2f0] py-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#0967ed] md:px-6 ${index % 2 === 0 ? "md:pl-0" : "md:border-l"}`}>
                <span className="flex h-10 w-10 items-center justify-center bg-[#edf5ff] text-[#0967ed]">
                  <topic.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-lg font-bold text-[#071f4a] group-hover:text-[#0967ed]">{topic.title}</span>
                  <span className="mt-2 block text-sm leading-6 text-[#5f6f8d]">{topic.description}</span>
                </span>
                <ArrowRight className="mt-2 h-4 w-4 text-[#0967ed] transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </section>

        <section className="border-y border-[#dfe9f6] bg-white/75">
          <div className="mx-auto max-w-[1120px] px-4 py-14 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Worked Notation"
              title="Example Calculus Problems"
              description="Open a complete worked solution, then try the same notation in its dedicated calculator."
            />
            <div className="mt-8 divide-y divide-[#d7e2f0] border-y border-[#d7e2f0]">
              {examples.map((example) => (
                <article key={example.type} className="grid gap-5 py-6 md:grid-cols-[10rem_1fr_auto] md:items-center">
                  <div>
                    <p className="text-sm font-semibold text-[#0967ed]">{example.type}</p>
                    <p className="mt-1 text-xs text-[#637392]">Worked example</p>
                  </div>
                  <div className="overflow-x-auto border-l-4 border-[#0967ed] bg-[#f3f7fc] px-5 py-4" tabIndex={0} role="region" aria-label={`${example.type} example expression`}>
                    <span className="whitespace-nowrap font-serif text-xl text-[#071f4a]">{example.problem}</span>
                  </div>
                  <div className="flex flex-wrap gap-x-5 gap-y-2 md:justify-end">
                    <Link href={example.detailHref} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#0967ed] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0967ed]">View steps <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
                    <Link href={example.href} className="inline-flex min-h-11 items-center text-sm font-semibold text-[#405577] hover:text-[#0967ed] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0967ed]">Open calculator</Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1120px] px-4 py-14 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              eyebrow="Build a Study Habit"
              title="Daily Calculus Challenge"
              description="Solve today’s problem, check your answer, reveal a hint when needed, and review the explanation."
            />
            <Link href="/daily-challenge" className="inline-flex min-h-11 shrink-0 items-center gap-2 text-sm font-semibold text-[#0967ed] hover:text-[#0757c9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0967ed]">
              Open Full Challenge <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-8">
            <DeferredDailyChallenge />
          </div>
        </section>

        <section className="border-y border-[#dfe9f6] bg-white/80">
          <div className="mx-auto max-w-[1120px] px-4 py-14 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Choose the Right Learning Tool"
              title="Calculus Solver vs. Calculator"
              description="The difference is not only what result appears, but how much support you receive while learning."
            />
            <div className="mt-8 overflow-x-auto rounded-2xl border border-[#d9e5f4] bg-white">
              <table className="w-full min-w-[620px] border-collapse text-left">
                <thead className="bg-[#f2f7fe]">
                  <tr>
                    <th scope="col" className="px-5 py-4 text-sm font-bold text-[#071f4a]">Tool</th>
                    <th scope="col" className="px-5 py-4 text-sm font-bold text-[#071f4a]">What It Provides</th>
                    <th scope="col" className="px-5 py-4 text-sm font-bold text-[#071f4a]">Best Used For</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d9e5f4]">
                  {[
                    ["Calculator", "Gives an answer or numerical result.", "Fast checking when you already know the method."],
                    ["Solver", "Explains the mathematical steps and rules.", "Learning a method and reviewing homework."],
                    ["Tutor", "Provides learning guidance and adapts to questions.", "Deeper support when a concept is still unclear."]
                  ].map(([tool, difference, use]) => (
                    <tr key={tool}>
                      <th scope="row" className="px-5 py-4 text-sm font-bold text-[#071f4a]">{tool}</th>
                      <td className="px-5 py-4 text-sm leading-6 text-[#405577]">{difference}</td>
                      <td className="px-5 py-4 text-sm leading-6 text-[#405577]">{use}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1120px] px-4 py-14 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Input Help"
            title="Common Calculus Input Problems"
            description="Most errors come from notation that can be corrected before solving again."
          />
          <div className="mt-8 divide-y divide-[#d7e2f0] border-y border-[#d7e2f0]">
            {[
              ["Wrong Input Format", "Use explicit operators when needed: write 2*x instead of an ambiguous expression, and group numerators or denominators with parentheses."],
              ["Unsupported Expressions", "Break a very long problem into smaller operations, or open a focused calculator for bounds, systems, matrices, or special notation."],
              ["Incorrect Mathematical Notation", "Include the variable, integral bounds, or limit point. For example: limit sin(x)/x as x approaches 0."]
            ].map(([title, text], index) => (
              <article key={title} className="grid gap-3 py-5 sm:grid-cols-[3rem_14rem_1fr] sm:items-start">
                <span className="font-serif text-2xl text-[#8aa6ce]">0{index + 1}</span>
                <h3 className="text-base font-bold text-[#071f4a]">{title}</h3>
                <p className="text-sm leading-7 text-[#5f6f8d]">{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-[#dfe9f6] bg-white/75">
          <div className="mx-auto max-w-[1120px] px-4 py-14 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Continue Solving"
              title="Related Calculators"
              description="Use a dedicated tool for a more focused input format and topic-specific examples."
            />
            <div className="mt-8 grid gap-9 lg:grid-cols-[1.2fr_.8fr]">
              <div className="grid border-t border-[#d7e2f0] sm:grid-cols-2">
                {relatedCalculators.map((calculator, index) => (
                  <Link key={calculator.href} href={calculator.href} className={`group flex min-h-16 items-center justify-between border-b border-[#d7e2f0] py-4 text-sm font-bold text-[#071f4a] hover:text-[#0967ed] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#0967ed] sm:px-5 ${index % 2 === 0 ? "sm:pl-0" : "sm:border-l"}`}>
                    {calculator.label}
                    <ArrowRight className="h-4 w-4 text-[#0967ed] transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </Link>
                ))}
              </div>
              <aside className="border-l-4 border-[#0967ed] bg-[#f3f7fc] px-6 py-5">
                <p className="text-sm font-medium text-[#0967ed]">Supporting math resources</p>
                <h2 className="mt-2 text-xl font-bold text-[#071f4a]">Explore Fraction Guides</h2>
                <p className="mt-2 text-sm leading-6 text-[#5f6f8d]">Move between fractions, decimals, percentages, and equivalent forms.</p>
                <div className="mt-5 flex flex-col items-start gap-3">
                  {[["Percent and Decimal", "/percent-and-decimal"], ["Equivalent Fractions", "/equivalent-fractions"]].map(([label, href]) => (
                    <Link key={href} href={href} className="group inline-flex items-center gap-2 border-b border-[#9fc0ea] pb-1 font-semibold text-[#071f4a] hover:border-[#0967ed] hover:text-[#0967ed]">
                      {label}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </Link>
                  ))}
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1120px] px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-7 lg:grid-cols-[.55fr_1.45fr]">
            <SectionHeading eyebrow="Questions & Answers" title="Frequently Asked Questions" />
            <div className="divide-y divide-[#d9e5f4] border-y border-[#d9e5f4]">
              {generalFaqs.map((faq) => (
              <details key={faq.question} className="group py-4">
                <summary className="cursor-pointer list-none pr-8 text-sm font-bold text-[#071f4a] marker:content-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0967ed]">
                  {faq.question}
                  <span className="float-right text-[#0967ed] transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                </summary>
                <p className="mt-3 max-w-4xl text-sm leading-7 text-[#5f6f8d]">{faq.answer}</p>
              </details>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

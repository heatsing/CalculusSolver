import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  FunctionSquare,
  GraduationCap,
  Infinity,
  Keyboard,
  Lightbulb,
  ListChecks,
  Sigma,
  Sparkles
} from "lucide-react";
import { DailyChallengeGame } from "@/components/daily-challenge/daily-challenge-game";
import { Footer } from "@/components/layout/footer";
import { SiteHeader } from "@/components/layout/site-header";
import { MathDisplay } from "@/components/math/math-display";
import { SolverShell } from "@/components/solver/solver-shell";
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
    icon: Sigma
  },
  {
    title: "Differential Equations",
    description: "Interpret common differential-equation notation and work through supported solution methods.",
    href: "/equation-solver",
    icon: Sparkles
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
    problem: "d/dx x²",
    latex: "\\frac{d}{dx}x^2",
    input: "d/dx x^2",
    href: "/derivative-calculator"
  },
  {
    type: "Integral",
    problem: "∫ x² dx",
    latex: "\\int x^2\\,dx",
    input: "integrate x^2",
    href: "/integral-calculator"
  },
  {
    type: "Limit",
    problem: "lim x→0 sin(x)/x",
    latex: "\\lim_{x\\to0}\\frac{\\sin(x)}{x}",
    input: "limit sin(x)/x as x approaches 0",
    href: "/limit-calculator"
  }
] as const;

const relatedCalculators = [
  ["Calculus Calculator", "/calculus-calculator"],
  ["Derivative Calculator", "/derivative-calculator"],
  ["Integral Calculator", "/integral-calculator"],
  ["Limit Calculator", "/limit-calculator"],
  ["Algebra Solver", "/algebra-solver"],
  ["Equation Solver", "/equation-solver"]
] as const;

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
      {eyebrow && <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0967ed]">{eyebrow}</p>}
      <h2 className="mt-2 text-3xl font-bold tracking-[-0.02em] text-[#071f4a] sm:text-4xl">{title}</h2>
      {description && <p className="mt-4 text-base leading-7 text-[#5f6f8d]">{description}</p>}
    </header>
  );
}

export function CalculusHomePage(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_50%_0%,#ffffff_0%,#f8fbff_46%,#f2f7fe_100%)] text-[#071f4a]">
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="focus-visible:outline-none">
        <section className="mx-auto max-w-[1240px] px-4 pb-12 pt-10 sm:px-6 sm:pt-14 lg:px-8">
          <header className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0967ed]">Free online calculus solver</p>
            <h1 className="mt-3 text-balance text-5xl font-bold tracking-[-0.04em] text-[#071f4a] sm:text-6xl">Calculus Solver</h1>
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
              <p className="text-xs font-semibold text-[#0967ed]">Free · No sign-up · Instant results</p>
            </div>
            <div className="px-3 pb-2 sm:px-6">
              <SolverShell mode="auto" />
            </div>
          </div>

          <div className="mx-auto mt-5 grid max-w-[1080px] gap-3 sm:grid-cols-3">
            {[
              [Keyboard, "Flexible Math Input", "Keyboard, symbols, and function notation"],
              [ListChecks, "Step-by-Step Solution", "Rules and transformations in order"],
              [BookOpenCheck, "Learning Guidance", "Explanations, checks, and practice"]
            ].map(([Icon, title, text]) => {
              const FeatureIcon = Icon as typeof Keyboard;
              return (
                <div key={title as string} className="flex items-center gap-3 rounded-xl border border-[#dbe5f4] bg-white/80 px-4 py-3">
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
            <div className="rounded-2xl border border-[#cfe0f6] bg-[#f7faff] p-6 sm:p-8">
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
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              ["Recognize the Input", "The solver reads your notation and identifies the operation, variable, bounds, and expression."],
              ["Process the Mathematics", "A symbolic math engine computes supported operations and independently checks results where possible."],
              ["Generate the Solution", "The answer is organized into readable steps with rules, explanations, verification, and a graph when available."]
            ].map(([title, text], index) => (
              <article key={title} className="rounded-2xl border border-[#d9e5f4] bg-white p-6 shadow-sm">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eaf3ff] text-sm font-bold text-[#0967ed]">{index + 1}</span>
                <h3 className="mt-5 text-lg font-bold text-[#071f4a]">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#5f6f8d]">{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-[#dfe9f6] bg-white/75">
          <div className="mx-auto max-w-[1120px] px-4 py-14 sm:px-6 lg:px-8">
            <SectionHeading eyebrow="3 Simple Steps" title="How to Use Calculus Solver" />
            <ol className="mt-8 grid gap-5 md:grid-cols-3">
              {[
                ["Enter Your Calculus Problem", "Type the expression, equation, derivative, integral, or limit using keyboard or formula notation."],
                ["Click Solve Problem", "The solver interprets the input and calculates the result while checking supported answers."],
                ["Review the Solution Steps", "Read the answer, explanation, rules, and final result, then try a related practice problem."]
              ].map(([title, text], index) => (
                <li key={title} className="relative rounded-2xl border border-[#d9e5f4] bg-white p-6">
                  <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#0967ed]">Step {index + 1}</span>
                  <h3 className="mt-3 text-lg font-bold text-[#071f4a]">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#5f6f8d]">{text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mx-auto max-w-[1120px] px-4 py-14 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Supported Topics"
            title="What Can Calculus Solver Help With?"
            description="Choose a focused calculator when you already know the topic, or enter the complete problem in the solver above."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {helpTopics.map((topic) => (
              <Link key={topic.title} href={topic.href} className="group rounded-2xl border border-[#d9e5f4] bg-white p-6 shadow-sm transition-[border-color,box-shadow,transform] hover:-translate-y-0.5 hover:border-[#82aff5] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0967ed] focus-visible:ring-offset-2">
                <topic.icon className="h-7 w-7 text-[#0967ed]" aria-hidden="true" />
                <h3 className="mt-4 text-lg font-bold text-[#071f4a]">{topic.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#5f6f8d]">{topic.description}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#0967ed]">Open Tool <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" /></span>
              </Link>
            ))}
          </div>
        </section>

        <section className="border-y border-[#dfe9f6] bg-white/75">
          <div className="mx-auto max-w-[1120px] px-4 py-14 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Worked Notation"
              title="Example Calculus Problems"
              description="Select an example to load it into the solver, or open its dedicated calculator."
            />
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {examples.map((example) => (
                <article key={example.type} className="rounded-2xl border border-[#d9e5f4] bg-white p-6">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#0967ed]">{example.type} Example</p>
                  <div className="mt-5 overflow-x-auto rounded-xl bg-[#f7faff] p-5 text-center text-xl">
                    <MathDisplay latex={example.latex} display="block" />
                  </div>
                  <p className="mt-4 font-mono text-sm text-[#405577]">{example.problem}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <Link href={"/?q=" + encodeURIComponent(example.input)} className="inline-flex min-h-11 items-center rounded-lg bg-[#0967ed] px-4 text-sm font-semibold text-white hover:bg-[#0757c9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0967ed] focus-visible:ring-offset-2">Solve Example</Link>
                    <Link href={example.href} className="inline-flex min-h-11 items-center rounded-lg border border-[#b9d1f2] px-4 text-sm font-semibold text-[#0967ed] hover:bg-[#eff6ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0967ed] focus-visible:ring-offset-2">Open Calculator</Link>
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
            <DailyChallengeGame />
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
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              ["Wrong Input Format", "Use explicit operators when needed: write 2*x instead of an ambiguous expression, and group numerators or denominators with parentheses."],
              ["Unsupported Expressions", "Break a very long problem into smaller operations, or open a focused calculator for bounds, systems, matrices, or special notation."],
              ["Incorrect Mathematical Notation", "Include the variable, integral bounds, or limit point. For example: limit sin(x)/x as x approaches 0."]
            ].map(([title, text]) => (
              <article key={title} className="rounded-2xl border border-[#d9e5f4] bg-white p-6">
                <Lightbulb className="h-6 w-6 text-[#0967ed]" aria-hidden="true" />
                <h3 className="mt-4 text-lg font-bold text-[#071f4a]">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#5f6f8d]">{text}</p>
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
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {relatedCalculators.map(([label, href]) => (
                <Link key={href} href={href} className="group flex min-h-16 items-center justify-between rounded-xl border border-[#d9e5f4] bg-white px-5 py-4 text-sm font-bold text-[#071f4a] hover:border-[#82aff5] hover:text-[#0967ed] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0967ed]">
                  {label}
                  <ArrowRight className="h-4 w-4 text-[#0967ed] transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1120px] px-4 py-14 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Questions & Answers" title="Frequently Asked Questions" />
          <div className="mt-8 divide-y divide-[#d9e5f4] rounded-2xl border border-[#d9e5f4] bg-white">
            {generalFaqs.map((faq) => (
              <details key={faq.question} className="group px-5 py-4">
                <summary className="cursor-pointer list-none pr-8 text-sm font-bold text-[#071f4a] marker:content-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0967ed]">
                  {faq.question}
                  <span className="float-right text-[#0967ed] transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                </summary>
                <p className="mt-3 max-w-4xl text-sm leading-7 text-[#5f6f8d]">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

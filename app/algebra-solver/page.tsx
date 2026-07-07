import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SolverShell } from "@/components/solver/solver-shell";
import { Faq } from "@/components/marketing/faq";
import { algebraFaqs } from "@/data/faqs";

export const metadata: Metadata = {
  title: "Algebra Solver",
  description: "Solve equations, simplify expressions, factor polynomials, and view clear algebra steps."
};

export default function AlgebraSolverPage(): React.JSX.Element {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-content px-4 py-10 sm:px-6 lg:px-8">
        <nav className="mb-6 text-sm text-body">
          <a href="/" className="hover:text-heading">Home</a>
          <span className="mx-2">/</span>
          <span className="text-heading">Algebra Solver</span>
        </nav>
        <h1 className="text-4xl font-bold tracking-tight text-heading sm:text-5xl">Algebra Solver</h1>
        <p className="mt-4 max-w-2xl text-lg text-body">
          Solve equations, simplify expressions, factor polynomials, and view clear algebra steps.
        </p>
        <div className="mt-10">
          <SolverShell mode="algebra" />
        </div>
        <Faq items={algebraFaqs} />
      </main>
      <Footer />
    </>
  );
}

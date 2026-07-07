import { Badge } from "@/components/ui/badge";

export function Hero(): React.JSX.Element {
  return (
    <section className="pt-10 pb-8 text-center sm:pt-16 sm:pb-12">
      <Badge variant="secondary" className="mb-5 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
        AI Powered
      </Badge>
      <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-heading sm:text-6xl">
        Solve Calculus with <span className="text-primary">One Smart Input</span>
      </h1>
      <p className="mx-auto mt-5 max-w-2xl text-lg text-body">
        Ask in natural language, type formulas, or paste expressions. Get clear answers, step-by-step solutions, and
        interactive graphs.
      </p>
    </section>
  );
}

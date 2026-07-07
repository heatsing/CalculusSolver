import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

export function Hero(): React.JSX.Element {
  return (
    <section className="pt-10 pb-6 text-center sm:pt-16 sm:pb-8">
      <Badge
        variant="secondary"
        className="mb-5 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide"
      >
        <Sparkles className="h-3.5 w-3.5" />
        AI Powered
      </Badge>
      <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-heading sm:text-6xl">
        Solve Calculus with <span className="text-primary">One Smart Input</span>
      </h1>
      <p className="mx-auto mt-5 max-w-2xl text-lg text-body">
        Ask in natural language, type formulas, or paste expressions.
        <br className="hidden sm:block" />
        Powered by AI for step-by-step solutions.
      </p>
    </section>
  );
}

import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

export function Hero(): React.JSX.Element {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary-soft/50 via-white to-white py-16 sm:py-20 md:py-32 text-center">
      <Badge
        variant="secondary"
        className="mb-5 inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide"
      >
        <Sparkles className="h-3.5 w-3.5" />
        AI Powered
      </Badge>
      <h1 className="mx-auto max-w-3xl text-3xl font-extrabold tracking-tight text-heading sm:text-4xl md:text-5xl lg:text-6xl">
        Solve Calculus with <span className="text-primary">One Smart Input</span>
      </h1>
      <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-body sm:text-xl">
        Ask in natural language, type formulas, or paste expressions.
        <br className="hidden sm:block" />
        Powered by AI for step-by-step solutions.
      </p>
    </section>
  );
}

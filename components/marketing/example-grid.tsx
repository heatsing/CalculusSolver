import { ArrowRight } from "lucide-react";
import { homeExamples } from "@/data/examples";

export function ExampleGrid(): React.JSX.Element {
  return (
    <section className="mt-20 pb-10">
      <h2 className="text-center font-serif text-3xl font-semibold tracking-tight text-heading sm:text-4xl">
        Try these examples
      </h2>
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {homeExamples.map((example) => (
          <a
            key={example.id}
            href={`/?example=${example.id}`}
            className="group flex items-center gap-4 rounded-card border border-border bg-white p-4 transition-colors hover:border-primary hover:bg-primary-soft/30"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-base font-semibold text-primary">
              {example.symbol}
            </div>
            <p className="flex-1 text-sm font-medium text-heading">{example.problem}</p>
            <ArrowRight className="h-4 w-4 shrink-0 text-body transition-transform group-hover:translate-x-1" />
          </a>
        ))}
      </div>
    </section>
  );
}

import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { homeExamples } from "@/data/examples";

export function ExampleGrid(): React.JSX.Element {
  return (
    <section className="mt-20 pb-10">
      <h2 className="text-center text-3xl font-bold tracking-tight text-heading sm:text-4xl">Try these examples</h2>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {homeExamples.map((example) => (
          <a
            key={example.id}
            href={`/?example=${example.id}`}
            className="group flex items-center justify-between rounded-card border border-border bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <CardContent className="p-0">
              <p className="font-medium text-heading">{example.problem}</p>
              <p className="mt-1 text-xs text-body">{example.operation}</p>
            </CardContent>
            <ArrowRight className="h-5 w-5 shrink-0 text-primary transition-transform group-hover:translate-x-1" />
          </a>
        ))}
      </div>
    </section>
  );
}

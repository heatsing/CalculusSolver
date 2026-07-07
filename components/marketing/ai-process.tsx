import { ArrowDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const steps = [
  { title: "Input", description: "Type or paste your math problem." },
  { title: "AI interpretation", description: "DeepSeek identifies the operation and expression." },
  { title: "Math verification", description: "Local engines cross-check the result." },
  { title: "Answer and steps", description: "View the answer, derivation, and graph." }
];

export function AiProcess(): React.JSX.Element {
  return (
    <section className="mt-20">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-heading sm:text-4xl">
            Built with AI-Powered Math Reasoning
          </h2>
          <p className="mt-4 text-lg text-body">
            The solver understands natural language, formulas, and common calculus or algebra notation.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>How it works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {steps.map((step, index) => (
                <div key={step.title}>
                  <div className="flex items-center gap-4 rounded-lg bg-secondary-background p-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-heading">{step.title}</p>
                      <p className="text-sm text-body">{step.description}</p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="flex justify-center py-2">
                      <ArrowDown className="h-4 w-4 text-body" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

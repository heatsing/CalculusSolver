import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";

const steps = [
  "Understanding your problem",
  "Interpreting the expression",
  "Computing the answer",
  "Verifying the result"
];

export function SolverLoading(): React.JSX.Element {
  return (
    <Card className="mt-8 animate-fade-in">
      <div className="flex items-center gap-3 p-5">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <div>
          <p className="font-semibold text-heading">Solving your problem...</p>
          <p className="text-sm text-body">This usually takes a few seconds.</p>
        </div>
      </div>
      <div className="border-t border-border px-5 py-4">
        <ol className="space-y-2 text-sm text-body">
          {steps.map((step, index) => (
            <li key={step} className="flex items-center gap-3">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold text-primary">
                {index + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>
    </Card>
  );
}

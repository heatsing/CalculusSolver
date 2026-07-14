import { Loader2, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const steps = [
  "Understanding your problem",
  "Interpreting the expression",
  "Computing the answer",
  "Verifying the result"
];

export function SolverLoading({ onCancel }: { onCancel?: () => void }): React.JSX.Element {
  return (
    <Card className="mt-8 animate-fade-in">
      <div className="flex items-center justify-between p-5">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-primary" aria-hidden="true" />
          <div>
            <p className="font-semibold text-heading">Solving Your Problem…</p>
            <p className="text-sm text-body">This usually takes a few seconds.</p>
          </div>
        </div>
        {onCancel && (
          <Button variant="outline" size="sm" onClick={onCancel} aria-label="Cancel solving">
            <X className="mr-1 h-4 w-4" aria-hidden="true" />
            Cancel
          </Button>
        )}
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

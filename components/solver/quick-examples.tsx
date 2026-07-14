import { FunctionSquare, Sigma, Equal, Infinity } from "lucide-react";
import { Button } from "@/components/ui/button";

const quickExamples = [
  { icon: FunctionSquare, label: "Derivative: d/dx x²", value: "d/dx x^2" },
  { icon: Sigma, label: "Integral: ∫ x² dx", value: "integrate x^2" },
  { icon: Infinity, label: "Limit: lim x→0", value: "limit sin(x)/x as x approaches 0" }
];

export function QuickExamples({ onSelect, context = "calculus" }: { onSelect: (value: string) => void; context?: "calculus" | "algebra" }): React.JSX.Element {
  const examples = context === "algebra" ? [
    { icon: Equal, label: "x Solve equation", value: "Solve 2x + 5 = 17" },
    { icon: FunctionSquare, label: "Factor polynomial", value: "Factor x^2 - 5x + 6" },
    { icon: Sigma, label: "Simplify expression", value: "Simplify 3x + 2x - 4" }
  ] : quickExamples;

  return (
    <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
      {examples.map((example) => (
        <Button
          key={example.label}
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onSelect(example.value)}
          className="min-h-11 border-border bg-white px-4 text-body hover:bg-primary-soft hover:text-primary"
        >
          <example.icon className="mr-1.5 h-4 w-4" aria-hidden="true" />
          {example.label}
        </Button>
      ))}
    </div>
  );
}

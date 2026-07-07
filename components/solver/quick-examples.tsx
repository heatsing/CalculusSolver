import { FunctionSquare, Sigma, Equal } from "lucide-react";
import { Button } from "@/components/ui/button";

const quickExamples = [
  { icon: Sigma, label: "∫ Integrate", value: "Solve ∫ x² sin(x) dx" },
  { icon: FunctionSquare, label: "d/dx Differentiate", value: "Find the derivative of x³ + 2x" },
  { icon: Equal, label: "x Solve equation", value: "Solve 2x + 5 = 17" }
];

export function QuickExamples({ onSelect }: { onSelect: (value: string) => void }): React.JSX.Element {
  return (
    <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
      {quickExamples.map((example) => (
        <Button
          key={example.label}
          variant="outline"
          size="sm"
          onClick={() => onSelect(example.value)}
          className="rounded-full border-border bg-white text-body hover:bg-primary-soft hover:text-primary"
        >
          <example.icon className="mr-1.5 h-4 w-4" />
          {example.label}
        </Button>
      ))}
    </div>
  );
}

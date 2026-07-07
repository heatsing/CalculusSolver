import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LatexBlock } from "@/components/solver/latex-render";
import type { SolverResult } from "@/types/solver";

const operationLabels: Record<string, string> = {
  derivative: "Derivative",
  integral: "Integral",
  limit: "Limit",
  solve_equation: "Equation",
  solve_system: "System",
  simplify: "Simplify",
  factor: "Factor",
  expand: "Expand",
  graph: "Graph",
  unknown: "Unknown"
};

export function InterpretedProblem({ result }: { result: SolverResult }): React.JSX.Element {
  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Interpreted as</CardTitle>
          <Badge variant="secondary">{operationLabels[result.operation] ?? result.operation}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <LatexBlock latex={result.interpretedLatex} />
        <p className="mt-2 text-sm text-body">{result.interpretedProblem}</p>
      </CardContent>
    </Card>
  );
}

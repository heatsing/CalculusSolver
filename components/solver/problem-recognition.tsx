"use client";

import { Pencil, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MathDisplay } from "@/components/math/math-display";
import type { SolverResult } from "@/types/solver";

const operationLabels: Record<string, string> = {
  derivative: "Derivative",
  integral: "Integral",
  limit: "Limit",
  solve_equation: "Equation",
  solve_system: "System of equations",
  simplify: "Simplification",
  factor: "Factorization",
  expand: "Expansion",
  graph: "Graph",
  unknown: "Expression"
};

export function ProblemRecognition({
  result,
  originalInput,
  onEdit
}: {
  result: SolverResult;
  originalInput: string;
  onEdit?: () => void;
}): React.JSX.Element {
  const operationLabel = operationLabels[result.operation] ?? "Math problem";

  return (
    <Card className="animate-fade-in">
      <CardHeader className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <CardTitle className="text-base">Problem recognized: {operationLabel}</CardTitle>
        </div>
        {onEdit && (
          <Button type="button" variant="outline" size="sm" onClick={onEdit} className="gap-1.5">
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="text-xs font-medium text-body">Original input</p>
          <p className="text-sm text-heading">{originalInput}</p>
        </div>
        {result.interpretedLatex && (
          <div>
            <p className="text-xs font-medium text-body">Interpreted as</p>
            <div className="rounded-lg border border-border bg-white p-3">
              <MathDisplay latex={result.interpretedLatex} display="block" />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

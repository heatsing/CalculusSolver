"use client";

import * as React from "react";
import { Copy, Check, RotateCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MathDisplay } from "@/components/math/math-display";
import { ShareButton } from "@/components/solver/share-button";
import type { SolverResult } from "@/types/solver";

const operationLabels: Record<string, string> = {
  derivative: "Derivative",
  integral: "Integral",
  limit: "Limit",
  solve_equation: "Equation",
  solve_system: "System",
  simplify: "Simplified",
  factor: "Factor",
  expand: "Expand",
  graph: "Graph"
};

export function AnswerCard({
  result,
  input,
  mode,
  onNewProblem
}: {
  result: SolverResult;
  input: string;
  mode: string;
  onNewProblem: () => void;
}): React.JSX.Element {
  const [copied, setCopied] = React.useState(false);
  const answerType = operationLabels[result.operation] ?? "Answer";
  const answerLatex = result.answerLatex || result.answer;

  async function handleCopyAnswer(): Promise<void> {
    try {
      await navigator.clipboard.writeText(result.answer);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore clipboard errors.
    }
  }

  return (
    <Card className="relative border-border bg-white">
      <CardHeader>
        <CardTitle className="text-base">Answer</CardTitle>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-white">
            {answerType}
          </span>
          <span className="text-xs font-medium text-body">Final Answer</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="overflow-x-auto rounded-xl border border-border bg-secondary-background/50 p-4">
          <MathDisplay latex={answerLatex} display="block" />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleCopyAnswer} className="gap-1.5">
            {copied ? <Check className="h-3.5 w-3.5 text-green-600" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
            {copied ? "Copied" : "Copy answer"}
          </Button>
          <ShareButton input={input} mode={mode} />
          <Button variant="secondary" size="sm" onClick={onNewProblem} className="gap-1.5">
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            New problem
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

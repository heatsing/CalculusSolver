"use client";

import * as React from "react";
import { Copy, Check, Sparkles } from "lucide-react";
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
    <Card className="relative animate-fade-in border-primary/20 bg-gradient-to-br from-primary-soft/60 to-white">
      <CardHeader>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-white">
            {answerType}
          </span>
          <span className="text-xs text-body/70">Final answer</span>
        </div>
        <CardTitle className="sr-only">Final Answer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-xl border border-primary/10 bg-white p-4 shadow-sm">
          <MathDisplay latex={answerLatex} display="block" />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleCopyAnswer} className="gap-1.5">
            {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy answer"}
          </Button>
          <ShareButton input={input} mode={mode} />
          <Button variant="secondary" size="sm" onClick={onNewProblem} className="gap-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            New problem
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

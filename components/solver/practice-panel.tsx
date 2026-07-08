"use client";

import * as React from "react";
import { Dices, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MathDisplay } from "@/components/math/math-display";
import { CheckAnswer } from "@/components/solver/check-answer";
import type { SolverResult } from "@/types/solver";

const practiceTemplates: Record<string, { problem: string; answer: string; latex: string }[]> = {
  derivative: [
    { problem: "Find the derivative of x³ − 3x² + 2x.", answer: "3*x^2 - 6*x + 2", latex: "3x^2 - 6x + 2" },
    { problem: "Find the derivative of sin(x) + cos(x).", answer: "cos(x) - sin(x)", latex: "\\cos(x) - \\sin(x)" }
  ],
  integral: [
    { problem: "Integrate 2x + 1 with respect to x.", answer: "x^2 + x", latex: "x^2 + x + C" },
    { problem: "Integrate cos(x) with respect to x.", answer: "sin(x)", latex: "\\sin(x) + C" }
  ],
  limit: [
    { problem: "Evaluate the limit of (sin x)/x as x approaches 0.", answer: "1", latex: "1" },
    { problem: "Evaluate the limit of (x^2 - 1)/(x - 1) as x approaches 1.", answer: "2", latex: "2" }
  ],
  solve_equation: [
    { problem: "Solve x^2 - 5x + 6 = 0.", answer: "2,3", latex: "x = 2 \\text{ or } x = 3" },
    { problem: "Solve 2x + 4 = 10.", answer: "3", latex: "x = 3" }
  ],
  simplify: [
    { problem: "Simplify (x^2 - 1)/(x - 1).", answer: "x + 1", latex: "x + 1" },
    { problem: "Simplify x^2 * x^3.", answer: "x^5", latex: "x^5" }
  ]
};

export function PracticePanel({ result }: { result: SolverResult }): React.JSX.Element {
  const [current, setCurrent] = React.useState<{ problem: string; answer: string; latex: string } | null>(null);

  function generateProblem(): void {
    const templates = practiceTemplates[result.operation] ?? practiceTemplates.derivative;
    const next = templates[Math.floor(Math.random() * templates.length)];
    setCurrent(next ?? null);
  }

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <BookOpen className="h-4 w-4 text-primary" />
          Practice mode
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-body">Generate a similar problem and test your skills.</p>
        <Button onClick={generateProblem} className="gap-1.5">
          <Dices className="h-4 w-4" />
          Generate practice problem
        </Button>

        {current && (
          <div className="space-y-3 rounded-lg border border-border bg-secondary-background/40 p-4">
            <div>
              <p className="text-xs font-medium text-body/70">Your problem</p>
              <p className="font-medium text-heading">{current.problem}</p>
            </div>
            <CheckAnswer correctAnswer={current.answer} correctLatex={current.latex} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

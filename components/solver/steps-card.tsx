"use client";

import * as React from "react";
import { Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MathDisplay } from "@/components/math/math-display";
import type { SolverResult, SolverStep } from "@/types/solver";

function StepRow({
  step,
  onExplain
}: {
  step: SolverStep;
  onExplain?: (step: SolverStep) => void;
}): React.JSX.Element {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <div className="border-b border-border py-4 last:border-b-0">
      <div className="flex items-start gap-3">
        <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold text-primary">
          {step.number}
        </span>
        <div className="flex-1 space-y-2">
          <p className="font-medium text-heading">{step.title}</p>
          {step.rule && (
            <p className="text-xs font-medium text-primary">Rule: {step.rule}</p>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            {step.latexBefore && (
              <div className="rounded-lg border border-border bg-white p-3">
                <p className="mb-1 text-xs text-body/70">Before</p>
                <MathDisplay latex={step.latexBefore} display="block" />
              </div>
            )}
            {step.latexAfter && (
              <div className="rounded-lg border border-border bg-white p-3">
                <p className="mb-1 text-xs text-body/70">After</p>
                <MathDisplay latex={step.latexAfter} display="block" />
              </div>
            )}
          </div>

          <p className="text-sm text-body">{step.explanation}</p>

          {onExplain && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setExpanded((prev) => !prev);
                onExplain(step);
              }}
              className="gap-1.5 text-xs font-medium text-primary hover:text-primary"
            >
              <Lightbulb className="h-3.5 w-3.5" />
              Explain this step
            </Button>
          )}

          {expanded && (
            <div className="rounded-lg bg-primary-soft/50 p-3 text-sm text-body">
              Deeper explanation will appear here once the AI explanation endpoint is connected.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function StepsCard({
  result,
  onExplainStep
}: {
  result: SolverResult;
  onExplainStep?: (step: SolverStep) => void;
}): React.JSX.Element {
  return (
    <Card className="animate-fade-in">
      <CardHeader className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle className="text-base">Step-by-step solution</CardTitle>
        <span className="text-xs text-body/70">{result.steps.length} steps</span>
      </CardHeader>
      <CardContent className="pt-0">
        {result.steps.map((step) => (
          <StepRow key={step.number} step={step} onExplain={onExplainStep} />
        ))}
      </CardContent>
    </Card>
  );
}

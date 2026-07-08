"use client";

import * as React from "react";
import { Lightbulb, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MathDisplay } from "@/components/math/math-display";
import { useExplainStep } from "@/hooks/use-explain-step";
import type { SolverResult, SolverStep } from "@/types/solver";

function StepExplanation({ input, step }: { input: string; step: SolverStep }): React.JSX.Element {
  const { result, loading, error, explain } = useExplainStep();
  const [expanded, setExpanded] = React.useState(false);
  const explanationRef = React.useRef<HTMLDivElement>(null);

  function handleToggle(): void {
    if (!expanded && !result && !loading) {
      void explain(input, step);
    }
    setExpanded((prev) => {
      const next = !prev;
      if (next) {
        requestAnimationFrame(() => {
          explanationRef.current?.focus();
        });
      }
      return next;
    });
  }

  return (
    <div className="mt-2">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={handleToggle}
        className="gap-1.5 text-xs font-medium text-primary hover:text-primary"
      >
        {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Lightbulb className="h-3.5 w-3.5" />}
        {loading ? "Explaining..." : expanded ? "Hide explanation" : "Explain this step"}
      </Button>

      {expanded && (
        <div
          ref={explanationRef}
          tabIndex={-1}
          aria-live="polite"
          className="mt-2 rounded-lg bg-primary-soft/50 p-3 text-sm text-body outline-none"
        >
          {error && <p className="text-error">{error}</p>}
          {!error && !result && !loading && <p>Click above to get a deeper explanation.</p>}
          {result && (
            <div className="space-y-2">
              <p>{result.explanation}</p>
              {result.latexExample && <MathDisplay latex={result.latexExample} display="block" />}
              {result.commonMistake && <p><strong>Common mistake:</strong> {result.commonMistake}</p>}
              {result.keyTakeaway && <p><strong>Key takeaway:</strong> {result.keyTakeaway}</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StepRow({
  input,
  step
}: {
  input: string;
  step: SolverStep;
}): React.JSX.Element {
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
                <p className="mb-1 text-xs text-body">Before</p>
                <MathDisplay latex={step.latexBefore} display="block" />
              </div>
            )}
            {step.latexAfter && (
              <div className="rounded-lg border border-border bg-white p-3">
                <p className="mb-1 text-xs text-body">After</p>
                <MathDisplay latex={step.latexAfter} display="block" />
              </div>
            )}
          </div>

          <p className="text-sm text-body">{step.explanation}</p>

          <StepExplanation input={input} step={step} />
        </div>
      </div>
    </div>
  );
}

export function StepsCard({
  result,
  input
}: {
  result: SolverResult;
  input: string;
}): React.JSX.Element {
  return (
    <Card className="animate-fade-in">
      <CardHeader className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle className="text-base">Step-by-step solution</CardTitle>
        <span className="text-xs text-body">{result.steps.length} steps</span>
      </CardHeader>
      <CardContent className="pt-0">
        {result.steps.map((step) => (
          <StepRow key={step.number} input={input} step={step} />
        ))}
      </CardContent>
    </Card>
  );
}

"use client";

import * as React from "react";
import { Copy, Check, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { MathDisplay } from "@/components/math/math-display";
import type { SolverResult, SolverStep } from "@/types/solver";

function formatStepText(step: SolverStep): string {
  const parts: string[] = [];
  parts.push(`Step ${step.number}: ${step.title}`);
  if (step.explanation) parts.push(step.explanation);
  if (step.rule) parts.push(`Rule: ${step.rule}`);
  if (step.latexBefore) parts.push(`Before: ${step.latexBefore}`);
  if (step.latexAfter) parts.push(`After: ${step.latexAfter}`);
  return parts.join("\n");
}

function formatAllStepsMarkdown(result: SolverResult): string {
  const lines: string[] = [];
  lines.push("# Step-by-Step Solution\n");
  for (const step of result.steps) {
    lines.push(`## Step ${step.number}: ${step.title}`);
    if (step.explanation) lines.push(step.explanation);
    if (step.rule) lines.push(`**Rule:** ${step.rule}`);
    if (step.latexBefore) lines.push(`**Before:** \`${step.latexBefore}\``);
    if (step.latexAfter) lines.push(`**After:** \`${step.latexAfter}\``);
    lines.push("");
  }
  lines.push(`**Answer:** ${result.answer}`);
  return lines.join("\n");
}

function CopyStepButton({ step }: { step: SolverStep }): React.JSX.Element {
  const [copied, setCopied] = React.useState(false);

  async function handleCopy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(formatStepText(step));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore clipboard errors.
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-7 gap-1 px-2 text-xs text-body hover:text-heading"
      onClick={handleCopy}
      aria-label={`Copy step ${step.number}`}
    >
      {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Copied" : "Copy step"}
    </Button>
  );
}

function CopyAllStepsButton({ result }: { result: SolverResult }): React.JSX.Element {
  const [copied, setCopied] = React.useState(false);

  async function handleCopy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(formatAllStepsMarkdown(result));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore clipboard errors.
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-7 gap-1 px-2 text-xs text-body hover:text-heading"
      onClick={handleCopy}
      aria-label="Copy all steps"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Copied" : "Copy all steps"}
    </Button>
  );
}

export function StepsCard({ result }: { result: SolverResult }): React.JSX.Element {
  const [openAll, setOpenAll] = React.useState(false);
  const allValues = result.steps.map((step) => `step-${step.number}`);

  return (
    <Card className="animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Step-by-Step Solution</CardTitle>
        <div className="flex items-center gap-1">
          <CopyAllStepsButton result={result} />
          <Button variant="ghost" size="sm" onClick={() => setOpenAll((prev) => !prev)}>
            {openAll ? "Collapse steps" : "Show all steps"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {result.steps.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <FileText className="h-10 w-10 text-body/50" />
            <p className="mt-3 max-w-sm text-body">
              No step-by-step explanation is available for this problem.
            </p>
          </div>
        ) : (
          <Accordion type="multiple" value={openAll ? allValues : [allValues[0] ?? ""]}>
            {result.steps.map((step) => (
              <AccordionItem key={step.number} value={`step-${step.number}`}>
                <AccordionTrigger>
                  <span className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold text-primary">
                      {step.number}
                    </span>
                    {step.title}
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pl-9">
                    <p className="text-body">{step.explanation}</p>
                    {step.rule && <p className="text-sm font-medium text-heading">Rule: {step.rule}</p>}
                    {step.latexBefore && (
                      <div className="rounded-lg bg-secondary-background p-3">
                        <MathDisplay latex={step.latexBefore} />
                      </div>
                    )}
                    {step.latexAfter && (
                      <div className="rounded-lg bg-secondary-background p-3">
                        <MathDisplay latex={step.latexAfter} />
                      </div>
                    )}
                    <div className="flex justify-end">
                      <CopyStepButton step={step} />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
}

"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { LatexBlock } from "@/components/solver/latex-render";
import type { SolverResult } from "@/types/solver";

export function StepsCard({ result }: { result: SolverResult }): React.JSX.Element {
  const [openAll, setOpenAll] = React.useState(false);
  const allValues = result.steps.map((step) => `step-${step.number}`);

  return (
    <Card className="animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Step-by-Step Solution</CardTitle>
        <Button variant="ghost" size="sm" onClick={() => setOpenAll((prev) => !prev)}>
          {openAll ? "Collapse steps" : "Show all steps"}
        </Button>
      </CardHeader>
      <CardContent>
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
                      <LatexBlock latex={step.latexBefore} />
                    </div>
                  )}
                  {step.latexAfter && (
                    <div className="rounded-lg bg-secondary-background p-3">
                      <LatexBlock latex={step.latexAfter} />
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}

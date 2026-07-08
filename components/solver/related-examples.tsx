"use client";

import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { examplesData } from "@/data/examples";
import type { SolverResult } from "@/types/solver";

export function RelatedExamples({
  result,
  onSelect
}: {
  result: SolverResult;
  onSelect: (value: string) => void;
}): React.JSX.Element | null {
  const related = examplesData
    .filter((example) => example.operation === result.operation)
    .slice(0, 3);

  if (related.length === 0) return null;

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="text-base">Try similar problems</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          {related.map((example) => (
            <button
              key={example.id}
              type="button"
              onClick={() => onSelect(example.problem)}
              className="group flex items-center justify-between rounded-lg border border-border bg-white p-3 text-left transition-colors hover:border-primary hover:bg-primary-soft/30"
            >
              <span className="text-sm font-medium text-heading">{example.problem}</span>
              <ArrowRight className="h-4 w-4 text-body transition-colors group-hover:text-primary" />
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

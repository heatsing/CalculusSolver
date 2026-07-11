"use client";

import * as React from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useResultFeedback, makeFeedbackKey, type ResultFeedbackValue } from "@/hooks/use-result-feedback";
import type { SolverResult } from "@/types/solver";

interface ResultFeedbackProps {
  result: SolverResult;
  className?: string;
}

export function ResultFeedback({ result, className }: ResultFeedbackProps): React.JSX.Element {
  const feedbackKey = React.useMemo(
    () => makeFeedbackKey(result.interpretedLatex, result.answerLatex),
    [result.interpretedLatex, result.answerLatex]
  );
  const { getFeedback, setFeedback } = useResultFeedback();
  const [optimisticValue, setOptimisticValue] = React.useState<ResultFeedbackValue | null>(null);

  const currentValue = optimisticValue ?? getFeedback(feedbackKey);
  const hasSubmitted = currentValue !== null;

  function handleSelect(value: ResultFeedbackValue): void {
    if (hasSubmitted) return;
    setOptimisticValue(value);
    setFeedback(feedbackKey, value);
    void fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        value,
        operation: result.operation,
        verification: result.localVerification.status
      })
    }).catch(() => undefined);
  }

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="text-sm text-body">Was this result helpful?</span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => handleSelect("up")}
          disabled={hasSubmitted}
          className={cn(
            "inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-white text-body transition-colors",
            "hover:bg-primary-soft hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
            "disabled:cursor-default disabled:opacity-60",
            currentValue === "up" && "border-primary/30 bg-primary-soft text-primary"
          )}
          aria-label="Thumbs up"
          title="Thumbs up"
        >
          <ThumbsUp className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => handleSelect("down")}
          disabled={hasSubmitted}
          className={cn(
            "inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-white text-body transition-colors",
            "hover:bg-error/10 hover:text-error focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
            "disabled:cursor-default disabled:opacity-60",
            currentValue === "down" && "border-error/30 bg-error/10 text-error"
          )}
          aria-label="Thumbs down"
          title="Thumbs down"
        >
          <ThumbsDown className="h-4 w-4" />
        </button>
      </div>
      {hasSubmitted && (
        <span className="text-sm font-medium text-green-600">Feedback recorded. Thank you!</span>
      )}
    </div>
  );
}

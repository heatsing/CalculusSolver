"use client";

import * as React from "react";
import type { SolverStep } from "@/types/solver";

export type ExplainStepResult = {
  explanation: string;
  latexExample?: string | null;
  commonMistake?: string | null;
  keyTakeaway?: string | null;
};

export function useExplainStep() {
  const [result, setResult] = React.useState<ExplainStepResult | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const abortControllerRef = React.useRef<AbortController | null>(null);

  async function explain(input: string, step: SolverStep): Promise<void> {
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/explain-step", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input, step }),
        signal: controller.signal
      });

      const payload = (await response.json()) as unknown;

      if (!response.ok) {
        const message =
          typeof payload === "object" &&
          payload !== null &&
          "error" in payload &&
          typeof (payload as { error?: { message?: string } }).error?.message === "string"
            ? (payload as { error: { message: string } }).error.message
            : "Could not load explanation.";
        setError(message);
        return;
      }

      if (
        typeof payload === "object" &&
        payload !== null &&
        "explanation" in payload &&
        payload.explanation
      ) {
        setResult(payload.explanation as ExplainStepResult);
      } else {
        setError("Unexpected explanation format.");
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        return;
      }
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
    }
  }

  function reset(): void {
    abortControllerRef.current?.abort();
    setResult(null);
    setLoading(false);
    setError(null);
  }

  return { result, loading, error, explain, reset };
}

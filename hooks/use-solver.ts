"use client";

import * as React from "react";
import type { SolverResult } from "@/types/solver";

export type SolverState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; result: SolverResult }
  | { status: "error"; message: string };

export function useSolver() {
  const [state, setState] = React.useState<SolverState>({ status: "idle" });

  async function solve(input: string, mode: string): Promise<void> {
    setState({ status: "loading" });

    try {
      const response = await fetch("/api/solve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input, mode })
      });

      const payload = (await response.json()) as unknown;

      if (!response.ok) {
        const message =
          typeof payload === "object" &&
          payload !== null &&
          "error" in payload &&
          typeof (payload as { error?: { message?: string } }).error?.message === "string"
            ? (payload as { error: { message: string } }).error.message
            : "We could not solve this problem. Please check the expression and try again.";
        setState({ status: "error", message });
        return;
      }

      if (
        typeof payload === "object" &&
        payload !== null &&
        "result" in payload &&
        payload.result
      ) {
        setState({ status: "success", result: payload.result as SolverResult });
        return;
      }

      setState({ status: "error", message: "Unexpected response format." });
    } catch {
      setState({ status: "error", message: "Network error. Please check your connection and try again." });
    }
  }

  function reset(): void {
    setState({ status: "idle" });
  }

  return { state, solve, reset };
}

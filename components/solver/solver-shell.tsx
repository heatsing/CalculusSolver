"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { SmartInput } from "@/components/solver/smart-input";
import { InputModeTabs } from "@/components/solver/input-mode-tabs";
import { QuickExamples } from "@/components/solver/quick-examples";
import { SolverLoading } from "@/components/solver/solver-loading";
import { InterpretedProblem } from "@/components/solver/interpreted-problem";
import { AnswerCard } from "@/components/solver/answer-card";
import { VerificationCard } from "@/components/solver/verification-card";
import { StepsCard } from "@/components/solver/steps-card";
import { GraphCard } from "@/components/solver/graph-card";
import { SolverError } from "@/components/solver/solver-error";
import { PreviewCards } from "@/components/solver/preview-cards";
import { HistoryDrawer } from "@/components/solver/history-drawer";
import { useSolver } from "@/hooks/use-solver";
import { useSolverHistory } from "@/hooks/use-solver-history";
import { examplesData } from "@/data/examples";
import type { SolverResult } from "@/types/solver";

export function SolverShell({ mode }: { mode: string }): React.JSX.Element {
  const searchParams = useSearchParams();
  const exampleId = searchParams.get("example");

  const [input, setInput] = React.useState("");
  const { state, solve, reset } = useSolver();
  const { history, add, clear } = useSolverHistory();

  React.useEffect(() => {
    if (exampleId) {
      const example = examplesData.find((e) => e.id === exampleId);
      if (example) {
        setInput(example.problem);
        const element = document.getElementById("solver-input");
        element?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [exampleId]);

  async function handleSubmit(): Promise<void> {
    const trimmed = input.trim();
    if (!trimmed) return;
    await solve(trimmed, mode);
    if (state.status === "success") {
      add(trimmed, mode, state.result);
    }
  }

  React.useEffect(() => {
    if (state.status === "success") {
      add(input.trim(), mode, state.result);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.status === "success"]);

  function handleNewProblem(): void {
    setInput("");
    reset();
  }

  function handleSelectExample(value: string): void {
    setInput(value);
    reset();
    const element = document.getElementById("solver-input");
    const textarea = element?.querySelector("textarea");
    textarea?.focus();
  }

  return (
    <section className="py-6">
      <SmartInput value={input} onChange={setInput} onSubmit={handleSubmit} loading={state.status === "loading"} />
      <InputModeTabs />
      <QuickExamples onSelect={handleSelectExample} />

      <div className="mt-4 flex justify-end">
        <HistoryDrawer history={history} onClear={clear} onSelect={handleSelectExample} />
      </div>

      {state.status === "loading" && <SolverLoading />}
      {state.status === "error" && <SolverError message={state.message} />}

      {state.status === "success" && (
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          <div className="space-y-5">
            <InterpretedProblem result={state.result} />
            <AnswerCard result={state.result} onNewProblem={handleNewProblem} />
            <VerificationCard result={state.result} />
          </div>
          <div className="space-y-5">
            <StepsCard result={state.result} />
            <GraphCard result={state.result} />
          </div>
        </div>
      )}

      {state.status === "idle" && <PreviewCards />}
    </section>
  );
}

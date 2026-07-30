"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { SmartInput } from "@/components/solver/smart-input";
import { QuickExamples } from "@/components/solver/quick-examples";
import { SolverLoading } from "@/components/solver/solver-loading";
import { SolverError } from "@/components/solver/solver-error";
import { HistoryDrawer } from "@/components/solver/history-drawer";
import { useSolver } from "@/hooks/use-solver";
import { useSolverHistory } from "@/hooks/use-solver-history";
import { examplesData } from "@/data/examples";
import { withOperationHint } from "@/lib/calculator-mode";

const SolverResultView = dynamic(
  () => import("@/components/solver/solver-result-view").then((module) => module.SolverResultView),
  {
    ssr: false,
    loading: () => (
      <div className="mt-8 rounded-xl border border-border bg-secondary-background p-6 text-center text-sm text-body" role="status">
        Preparing the step-by-step solution…
      </div>
    )
  }
);

export function SolverShell({ mode, operationHint }: { mode: string; operationHint?: string }): React.JSX.Element {
  const context = mode === "algebra" ? "algebra" : "calculus";
  const searchParams = useSearchParams();
  const exampleId = searchParams.get("example");
  const queryInput = searchParams.get("q");
  const [inputValue, setInputValue] = React.useState("");
  const { state, solve, cancel, reset } = useSolver();
  const { add } = useSolverHistory();

  const submitCurrentInput = React.useCallback(
    async (): Promise<void> => {
      const input = inputValue.trim();
      if (!input) return;
      await solve(withOperationHint(input, operationHint), mode);
    },
    [inputValue, mode, operationHint, solve]
  );

  React.useEffect(() => {
    if (exampleId) {
      const example = examplesData.find((e) => e.id === exampleId);
      if (example) {
        setInputValue(example.problem);
        void solve(withOperationHint(example.problem, operationHint), mode);
      }
    }
  }, [exampleId, mode, operationHint, solve]);

  React.useEffect(() => {
    if (queryInput) {
      const decoded = decodeURIComponent(queryInput);
      setInputValue(decoded);
      void solve(withOperationHint(decoded.trim(), operationHint), mode);
    }
  }, [queryInput, mode, operationHint, solve]);

  React.useEffect(() => {
    const resultRegion = document.getElementById("solver-result");
    if (state.status === "success") {
      add(inputValue.trim(), mode, state.result);
      resultRegion?.scrollIntoView({ behavior: "smooth", block: "start" });
      resultRegion?.focus({ preventScroll: true });
    }
    if (state.status === "error") {
      resultRegion?.scrollIntoView({ behavior: "smooth", block: "start" });
      resultRegion?.focus({ preventScroll: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.status === "success", state.status === "error"]);

  function focusInput(): void {
    const element = document.getElementById("solver-input");
    const textarea = element?.querySelector("textarea");
    textarea?.focus();
    element?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function handleNewProblem(): void {
    setInputValue("");
    reset();
    focusInput();
  }

  function handleEditProblem(): void {
    focusInput();
  }

  function handleSelectExample(value: string): void {
    setInputValue(value);
    reset();
    const element = document.getElementById("solver-input");
    const textarea = element?.querySelector("textarea");
    textarea?.focus();
  }

  return (
    <section className="py-6">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void submitCurrentInput();
        }}
      >
        <SmartInput
          value={inputValue}
          onChange={setInputValue}
          onSubmit={() => void submitCurrentInput()}
          loading={state.status === "loading"}
          context={context}
        />
      </form>
      <QuickExamples onSelect={handleSelectExample} context={context} />

      <div className="mt-4 flex justify-end">
        <HistoryDrawer onSelect={handleSelectExample} />
      </div>

      <div
        id="solver-result"
        tabIndex={-1}
        aria-live="polite"
        aria-busy={state.status === "loading"}
        className="mt-6 overflow-x-hidden focus-visible:outline-none"
      >
        {state.status === "loading" && (
          <>
            <SolverLoading onCancel={cancel} />
            <p className="sr-only">Solving your problem</p>
          </>
        )}
        {state.status === "error" && (
          <SolverError message={state.message} onRetry={() => void submitCurrentInput()} />
        )}

        {state.status === "success" && (
          <SolverResultView
            result={state.result}
            input={inputValue.trim()}
            mode={mode}
            onEdit={handleEditProblem}
            onNewProblem={handleNewProblem}
            onSelectExample={handleSelectExample}
          />
        )}
      </div>

    </section>
  );
}

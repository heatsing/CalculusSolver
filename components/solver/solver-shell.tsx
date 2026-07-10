"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SmartInput } from "@/components/solver/smart-input";
import { QuickExamples } from "@/components/solver/quick-examples";
import { SolverLoading } from "@/components/solver/solver-loading";
import { ProblemRecognition } from "@/components/solver/problem-recognition";
import { AnswerCard } from "@/components/solver/answer-card";
import { VerificationCard } from "@/components/solver/verification-card";
import { StepsCard } from "@/components/solver/steps-card";
import { GraphCard } from "@/components/solver/graph-card";
import { RelatedExamples } from "@/components/solver/related-examples";
import { CheckAnswer } from "@/components/solver/check-answer";
import { PracticePanel } from "@/components/solver/practice-panel";
import { SolverError } from "@/components/solver/solver-error";
import { HistoryDrawer } from "@/components/solver/history-drawer";
import { useSolver } from "@/hooks/use-solver";
import { useSolverHistory } from "@/hooks/use-solver-history";
import { examplesData } from "@/data/examples";
import { withOperationHint } from "@/lib/calculator-mode";

const solverFormSchema = z.object({
  input: z.string().trim().min(1, "Please enter a math problem")
});

type SolverFormValues = z.infer<typeof solverFormSchema>;

export function SolverShell({ mode, operationHint }: { mode: string; operationHint?: string }): React.JSX.Element {
  const searchParams = useSearchParams();
  const exampleId = searchParams.get("example");
  const queryInput = searchParams.get("q");

  const { handleSubmit, setValue, watch, reset: resetForm } = useForm<SolverFormValues>({
    resolver: zodResolver(solverFormSchema),
    defaultValues: { input: "" }
  });

  const inputValue = watch("input");
  const { state, solve, cancel, reset } = useSolver();
  const { add } = useSolverHistory();

  const onSubmit = React.useCallback(
    async (values: SolverFormValues): Promise<void> => {
      await solve(withOperationHint(values.input, operationHint), mode);
    },
    [mode, operationHint, solve]
  );

  React.useEffect(() => {
    if (exampleId) {
      const example = examplesData.find((e) => e.id === exampleId);
      if (example) {
        setValue("input", example.problem);
        void solve(withOperationHint(example.problem, operationHint), mode);
      }
    }
  }, [exampleId, setValue, mode, operationHint, solve]);

  React.useEffect(() => {
    if (queryInput) {
      const decoded = decodeURIComponent(queryInput);
      setValue("input", decoded);
      void solve(withOperationHint(decoded.trim(), operationHint), mode);
    }
  }, [queryInput, setValue, mode, operationHint, solve]);

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
    resetForm();
    reset();
    focusInput();
  }

  function handleEditProblem(): void {
    focusInput();
  }

  function handleSelectExample(value: string): void {
    setValue("input", value);
    reset();
    const element = document.getElementById("solver-input");
    const textarea = element?.querySelector("textarea");
    textarea?.focus();
  }

  return (
    <section className="py-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <SmartInput
          value={inputValue}
          onChange={(value) => setValue("input", value, { shouldValidate: true })}
          onSubmit={handleSubmit(onSubmit)}
          loading={state.status === "loading"}
        />
      </form>
      <QuickExamples onSelect={handleSelectExample} />

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
          <SolverError message={state.message} onRetry={() => solve(withOperationHint(inputValue.trim(), operationHint), mode)} />
        )}

        {state.status === "success" && (
          <div className="mt-8 grid min-w-0 grid-cols-1 gap-5 lg:grid-cols-2">
            <div className="min-w-0 space-y-5">
              <ProblemRecognition
                result={state.result}
                originalInput={inputValue.trim()}
                onEdit={handleEditProblem}
              />
              <AnswerCard result={state.result} input={inputValue.trim()} mode={mode} onNewProblem={handleNewProblem} />
              <VerificationCard result={state.result} />
              <CheckAnswer correctAnswer={state.result.answer} correctLatex={state.result.answerLatex} />
              <PracticePanel result={state.result} />
              <RelatedExamples result={state.result} onSelect={handleSelectExample} />
            </div>
            <div className="min-w-0 space-y-5">
              <StepsCard result={state.result} input={inputValue.trim()} />
              <GraphCard result={state.result} />
            </div>
          </div>
        )}
      </div>

    </section>
  );
}

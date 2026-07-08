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
import { SolverError } from "@/components/solver/solver-error";
import { PreviewCards } from "@/components/solver/preview-cards";
import { HistoryDrawer } from "@/components/solver/history-drawer";
import { useSolver } from "@/hooks/use-solver";
import { useSolverHistory } from "@/hooks/use-solver-history";
import { examplesData } from "@/data/examples";
import type { SolverStep } from "@/types/solver";

const solverFormSchema = z.object({
  input: z.string().trim().min(1, "Please enter a math problem")
});

type SolverFormValues = z.infer<typeof solverFormSchema>;

export function SolverShell({ mode }: { mode: string }): React.JSX.Element {
  const searchParams = useSearchParams();
  const exampleId = searchParams.get("example");
  const queryInput = searchParams.get("q");

  const { handleSubmit, setValue, watch, reset: resetForm } = useForm<SolverFormValues>({
    resolver: zodResolver(solverFormSchema),
    defaultValues: { input: "" }
  });

  const inputValue = watch("input");
  const { state, solve, cancel, reset } = useSolver();
  const { history, add, remove, clear } = useSolverHistory();

  React.useEffect(() => {
    if (exampleId) {
      const example = examplesData.find((e) => e.id === exampleId);
      if (example) {
        setValue("input", example.problem);
        const element = document.getElementById("solver-input");
        element?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [exampleId, setValue]);

  React.useEffect(() => {
    if (queryInput) {
      setValue("input", decodeURIComponent(queryInput));
      const element = document.getElementById("solver-input");
      const textarea = element?.querySelector("textarea");
      textarea?.focus();
      element?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [queryInput, setValue]);

  async function onSubmit(values: SolverFormValues): Promise<void> {
    await solve(values.input, mode);
  }

  React.useEffect(() => {
    if (state.status === "success") {
      add(inputValue.trim(), mode, state.result);
      document.getElementById("solver-result")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    if (state.status === "error") {
      document.getElementById("solver-result")?.scrollIntoView({ behavior: "smooth", block: "start" });
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

  function handleExplainStep(step: SolverStep): void {
    // Placeholder for Phase 4 AI explanation integration.
    // eslint-disable-next-line no-console
    console.log("Explain step", step.number);
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
        <HistoryDrawer history={history} onClear={clear} onSelect={handleSelectExample} onRemove={remove} />
      </div>

      <div id="solver-result" aria-live="polite" aria-busy={state.status === "loading"}>
        {state.status === "loading" && <SolverLoading onCancel={cancel} />}
        {state.status === "error" && <SolverError message={state.message} onRetry={() => solve(inputValue.trim(), mode)} />}

        {state.status === "success" && (
          <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div className="space-y-5">
              <ProblemRecognition
                result={state.result}
                originalInput={inputValue.trim()}
                onEdit={handleEditProblem}
              />
              <AnswerCard result={state.result} input={inputValue.trim()} mode={mode} onNewProblem={handleNewProblem} />
              <VerificationCard result={state.result} />
              <RelatedExamples result={state.result} onSelect={handleSelectExample} />
            </div>
            <div className="space-y-5">
              <StepsCard result={state.result} onExplainStep={handleExplainStep} />
              <GraphCard result={state.result} />
            </div>
          </div>
        )}
      </div>

      {state.status === "idle" && <PreviewCards />}
    </section>
  );
}

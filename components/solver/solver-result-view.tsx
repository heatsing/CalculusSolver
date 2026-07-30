"use client";

import { AnswerCard } from "@/components/solver/answer-card";
import { CheckAnswer } from "@/components/solver/check-answer";
import { GraphCard } from "@/components/solver/graph-card";
import { PracticePanel } from "@/components/solver/practice-panel";
import { ProblemRecognition } from "@/components/solver/problem-recognition";
import { RelatedExamples } from "@/components/solver/related-examples";
import { StepsCard } from "@/components/solver/steps-card";
import { VerificationCard } from "@/components/solver/verification-card";
import type { SolverResult } from "@/types/solver";

export type SolverResultViewProps = {
  result: SolverResult;
  input: string;
  mode: string;
  onEdit: () => void;
  onNewProblem: () => void;
  onSelectExample: (value: string) => void;
};

export function SolverResultView({
  result,
  input,
  mode,
  onEdit,
  onNewProblem,
  onSelectExample
}: SolverResultViewProps): React.JSX.Element {
  return (
    <div className="mt-8 grid min-w-0 grid-cols-1 gap-5 lg:grid-cols-2">
      <div className="min-w-0 space-y-5">
        <ProblemRecognition result={result} originalInput={input} onEdit={onEdit} />
        <AnswerCard result={result} input={input} mode={mode} onNewProblem={onNewProblem} />
        <VerificationCard result={result} />
        <CheckAnswer correctAnswer={result.answer} correctLatex={result.answerLatex} />
        <PracticePanel result={result} />
        <RelatedExamples result={result} onSelect={onSelectExample} />
      </div>
      <div className="min-w-0 space-y-5">
        <StepsCard result={result} input={input} />
        <GraphCard result={result} />
      </div>
    </div>
  );
}

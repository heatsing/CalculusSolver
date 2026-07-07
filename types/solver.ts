import type { SolverMachine } from "@/lib/solver-schema";

export type SolverMode = "auto" | "calculus" | "algebra";

export type AnswerType =
  | "exact"
  | "approximate"
  | "conditional"
  | "no_closed_form"
  | "unknown";

export type VerificationStatus =
  | "verified"
  | "partially_verified"
  | "not_verified"
  | "uncertain"
  | "unsupported";

export type SolverOperation =
  | "derivative"
  | "integral"
  | "limit"
  | "solve_equation"
  | "solve_system"
  | "simplify"
  | "factor"
  | "expand"
  | "graph"
  | "unknown";

export type SolverStep = {
  number: number;
  title: string;
  explanation: string;
  rule?: string;
  latexBefore?: string;
  latexAfter?: string;
};

export type GraphDefinition = {
  available: boolean;
  expression: string | null;
  variable: string | null;
  domain: [number, number] | null;
  title?: string | null;
};

export type SolverResult = {
  operation: SolverOperation;
  interpretedProblem: string;
  interpretedLatex: string;
  answer: string;
  answerLatex: string;
  answerType: AnswerType;
  steps: SolverStep[];
  aiVerification: {
    status: "verified" | "uncertain";
    explanation: string;
  };
  localVerification: {
    status: VerificationStatus;
    explanation: string;
  };
  graph: GraphDefinition;
  machine: SolverMachine;
  warnings: string[];
};

import { z } from "zod";

export const solveRequestSchema = z.object({
  input: z.string().trim().min(1).max(2000),
  mode: z.enum(["auto", "calculus", "algebra"]).default("auto")
});

export const solverMachineSchema = z.object({
  source_expression: z.string().nullable(),
  answer_expression: z.string().nullable(),
  variable: z.string().nullable(),
  equation_left: z.string().nullable(),
  equation_right: z.string().nullable(),
  solutions: z.array(z.string()),
  lower_bound: z.string().nullable(),
  upper_bound: z.string().nullable(),
  limit_point: z.string().nullable(),
  limit_direction: z.enum(["both", "left", "right"]).nullable()
});

export const solverResultSchema = z.object({
  operation: z.enum([
    "derivative",
    "integral",
    "limit",
    "solve_equation",
    "solve_system",
    "simplify",
    "factor",
    "expand",
    "graph",
    "unknown"
  ]),
  interpreted_problem: z.string(),
  interpreted_latex: z.string(),
  answer: z.string(),
  answer_latex: z.string(),
  answer_type: z.enum(["exact", "approximate", "conditional", "no_closed_form", "unknown"]),
  steps: z.array(
    z.object({
      number: z.number(),
      title: z.string(),
      explanation: z.string(),
      rule: z.string().optional(),
      latex_before: z.string().optional(),
      latex_after: z.string().optional()
    })
  ),
  verification: z.object({
    status: z.enum(["verified", "uncertain"]),
    explanation: z.string()
  }),
  graph: z.object({
    available: z.boolean(),
    expression: z.string().nullable(),
    variable: z.string().nullable(),
    domain: z.tuple([z.number(), z.number()]).nullable(),
    title: z.string().nullable().optional()
  }),
  machine: solverMachineSchema.default({
    source_expression: null,
    answer_expression: null,
    variable: null,
    equation_left: null,
    equation_right: null,
    solutions: [],
    lower_bound: null,
    upper_bound: null,
    limit_point: null,
    limit_direction: null
  }),
  warnings: z.array(z.string())
});

export const apiErrorCodeSchema = z.enum([
  "INVALID_REQUEST",
  "INPUT_TOO_LONG",
  "RATE_LIMITED",
  "AI_UNAVAILABLE",
  "INVALID_AI_RESPONSE",
  "SOLVE_TIMEOUT",
  "SOLVE_FAILED"
]);

export type SolveRequest = z.infer<typeof solveRequestSchema>;
export type SolverResultResponse = z.infer<typeof solverResultSchema>;
export type SolverMachine = z.infer<typeof solverMachineSchema>;
export type ApiErrorCode = z.infer<typeof apiErrorCodeSchema>;

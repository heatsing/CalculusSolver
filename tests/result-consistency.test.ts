import { describe, it, expect } from "vitest";
import { checkResultConsistency } from "@/lib/result-consistency";
import type { SolverResultResponse } from "@/lib/solver-schema";

function baseResult(overrides: Partial<SolverResultResponse> = {}): SolverResultResponse {
  return {
    operation: "derivative",
    interpreted_problem: "derivative of x^2",
    interpreted_latex: "x^2",
    answer: "2x",
    answer_latex: "2x",
    answer_type: "exact",
    steps: [{ number: 1, title: "Differentiate", explanation: "Use the power rule." }],
    verification: { status: "verified", explanation: "Checked." },
    graph: { available: false, expression: null, variable: null, domain: null },
    machine: {
      source_expression: "x^2",
      answer_expression: "2x",
      variable: "x",
      equation_left: null,
      equation_right: null,
      solutions: [],
      lower_bound: null,
      upper_bound: null,
      limit_point: null,
      limit_direction: null
    },
    warnings: [],
    ...overrides
  };
}

describe("checkResultConsistency", () => {
  it("warns when an indefinite integral answer is missing +C", () => {
    const result = baseResult({
      operation: "integral",
      interpreted_problem: "integral of x^2",
      interpreted_latex: "x^2",
      answer: "x^3/3",
      answer_latex: "\\frac{x^3}{3}",
      machine: {
        source_expression: "x^2",
        answer_expression: "x^3/3",
        variable: "x",
        equation_left: null,
        equation_right: null,
        solutions: [],
        lower_bound: null,
        upper_bound: null,
        limit_point: null,
        limit_direction: null
      }
    });

    const warnings = checkResultConsistency(result);
    expect(warnings).toContain("Indefinite integral answer may be missing the constant of integration (+C).");
  });

  it("warns when step numbering is inconsistent", () => {
    const result = baseResult({
      steps: [
        { number: 1, title: "First", explanation: "Step one." },
        { number: 3, title: "Third", explanation: "Step three." }
      ]
    });

    const warnings = checkResultConsistency(result);
    expect(warnings).toContain("Step numbering is inconsistent; steps will be renumbered for display.");
  });

  it("disables the graph when the expression contains forbidden characters", () => {
    const result = baseResult({
      operation: "graph",
      graph: {
        available: true,
        expression: "y = x; {function}",
        variable: "x",
        domain: [-10, 10]
      }
    });

    const warnings = checkResultConsistency(result);
    expect(warnings).toContain("Graph expression contains unsupported characters and has been disabled.");
    expect(result.graph.available).toBe(false);
    expect(result.graph.expression).toBeNull();
  });

  it("warns when an exact answer contains an approximate marker", () => {
    const result = baseResult({
      answer_type: "exact",
      answer: "approximately 3.14",
      answer_latex: "\\approx 3.14"
    });

    const warnings = checkResultConsistency(result);
    expect(warnings).toContain(
      "Answer appears approximate but is marked as exact; answer type may need correction."
    );
  });
});

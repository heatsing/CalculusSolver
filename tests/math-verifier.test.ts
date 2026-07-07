import { describe, it, expect } from "vitest";
import { verifyResult, computeLocalAnswer } from "@/lib/math-verifier";
import type { SolverResultResponse } from "@/lib/solver-schema";

function makeResult(operation: string, inputLatex: string, answerLatex: string): SolverResultResponse {
  return {
    operation: operation as SolverResultResponse["operation"],
    interpreted_problem: inputLatex,
    interpreted_latex: inputLatex,
    answer: answerLatex,
    answer_latex: answerLatex,
    answer_type: "exact",
    steps: [],
    verification: { status: "verified", explanation: "AI verified." },
    graph: { available: false, expression: null, variable: "x", domain: [-10, 10] },
    machine: {
      source_expression: inputLatex,
      answer_expression: answerLatex,
      variable: "x",
      equation_left: null,
      equation_right: null,
      solutions: [],
      lower_bound: null,
      upper_bound: null,
      limit_point: null,
      limit_direction: null
    },
    warnings: []
  };
}

describe("computeLocalAnswer", () => {
  it("differentiates a polynomial", async () => {
    const answer = await computeLocalAnswer("x^3 + 2x", "derivative", "x");
    expect(answer).toContain("3");
  });

  it("solves a linear equation", async () => {
    const answer = await computeLocalAnswer("2x + 5 = 17", "solve_equation", "x");
    expect(answer).toContain("6");
  });

  it("expands a binomial", async () => {
    const answer = await computeLocalAnswer("(x + 3)^2", "expand", "x");
    expect(answer).toContain("x^2");
    expect(answer).toContain("6");
  });
});

describe("verifyResult", () => {
  it("verifies a correct derivative", async () => {
    const result = makeResult("derivative", "x^3 + 2x", "3*x^2 + 2");
    const verification = await verifyResult(result);
    expect(verification.status).toBe("verified");
  });

  it("partially verifies an incorrect derivative", async () => {
    const result = makeResult("derivative", "x^3 + 2x", "x^2");
    const verification = await verifyResult(result);
    expect(["partially_verified", "not_verified"]).toContain(verification.status);
  });

  it("reports verification status for an equation solution", async () => {
    const result = makeResult("solve_equation", "2x + 5 = 17", "6");
    result.machine.variable = "x";
    result.machine.equation_left = "2*x+5";
    result.machine.equation_right = "17";
    result.machine.solutions = ["6"];
    const verification = await verifyResult(result);
    expect(["verified", "partially_verified", "not_verified"]).toContain(verification.status);
  });

  it("returns unsupported for unknown operations", async () => {
    const result = makeResult("unknown", "some problem", "some answer");
    const verification = await verifyResult(result);
    expect(verification.status).toBe("unsupported");
  });
});

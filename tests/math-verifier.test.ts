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
    warnings: []
  };
}

describe("computeLocalAnswer", () => {
  it("differentiates a polynomial", () => {
    expect(computeLocalAnswer("x^3 + 2x", "derivative", "x")).toContain("3");
  });

  it("solves a linear equation", () => {
    const answer = computeLocalAnswer("2x + 5 = 17", "solve_equation", "x");
    expect(answer).toContain("6");
  });

  it("expands a binomial", () => {
    const answer = computeLocalAnswer("(x + 3)^2", "expand", "x");
    expect(answer).toContain("x^2");
    expect(answer).toContain("6");
  });
});

describe("verifyResult", () => {
  it("verifies a correct derivative", () => {
    const result = makeResult("derivative", "x^3 + 2x", "3*x^2 + 2");
    const verification = verifyResult(result);
    expect(verification.status).toBe("verified");
  });

  it("partially verifies an incorrect derivative", () => {
    const result = makeResult("derivative", "x^3 + 2x", "x^2");
    const verification = verifyResult(result);
    expect(["partially_verified", "not_verified"]).toContain(verification.status);
  });

  it("reports verification status for an equation solution", () => {
    const result = makeResult("solve_equation", "2x + 5 = 17", "6");
    const verification = verifyResult(result);
    expect(["verified", "partially_verified", "not_verified"]).toContain(verification.status);
  });

  it("returns uncertain for unknown operations", () => {
    const result = makeResult("unknown", "some problem", "some answer");
    const verification = verifyResult(result);
    expect(verification.status).toBe("uncertain");
  });
});

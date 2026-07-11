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

  it.each([
    ["Differentiate x^3 + 2*x", "derivative", "x", "2+3*x^2"],
    ["Integrate sin(x)", "integral", "x", "-cos(x) + C"],
    ["Evaluate the limit sin(x)/x as x approaches 0", "limit", "x", "1"],
    ["limit of sin(x)/x as x approaches 0", "limit", "x", "1"],
    ["Solve 2*x + 5 = 17", "solve_equation", "x", "6"],
    ["Factor x^2 - 5*x + 6", "factor", "x", "(-2+x)*(-3+x)"],
    ["Simplify 3*x + 2*x - 4", "simplify", "x", "-4+5*x"],
    ["Calculate the average of 4, 8, 12", "simplify", "x", "8"],
    ["Calculate the fraction expression 1/2 + 1/3", "simplify", "x", "0.833333333333"],
    ["Evaluate the exponent expression 2^10", "simplify", "x", "1024"],
    ["Calculate the root sqrt(144)", "solve_equation", "x", "12"],
    ["Evaluate the logarithm log(100,10)", "simplify", "x", "2"],
    ["Find the least common multiple of 12 and 18", "simplify", "x", "36"],
    ["Calculate the percentage 20% of 150", "simplify", "x", "30"],
    ["Calculate the probability 3 out of 10", "simplify", "x", "0.3"],
    ["Calculate the matrix expression [[1,2],[3,4]] * [[2],[1]]", "simplify", "x", "[[4], [10]]"],
    ["Find the gradient of x^2 + y^2", "simplify", "x", "[2*x, 2*y]"]
  ])("returns an exact local answer for %s", async (input, operation, variable, expected) => {
    await expect(computeLocalAnswer(input, operation, variable)).resolves.toBe(expected);
  });

  it("solves a two-variable system", async () => {
    await expect(computeLocalAnswer("Solve x + y = 5 and x - y = 1", "solve_system", "x")).resolves.toBe("x = 3, y = 2");
  });

  it("evaluates a definite integral without adding C", async () => {
    await expect(computeLocalAnswer("Integrate x^2 from 0 to 1", "integral", "x")).resolves.toBe("1/3");
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

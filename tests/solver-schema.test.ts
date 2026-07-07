import { describe, it, expect } from "vitest";
import { solveRequestSchema, solverResultSchema } from "@/lib/solver-schema";

describe("solveRequestSchema", () => {
  it("accepts a valid request", () => {
    const parsed = solveRequestSchema.parse({ input: "Solve 2x + 5 = 17", mode: "algebra" });
    expect(parsed.input).toBe("Solve 2x + 5 = 17");
    expect(parsed.mode).toBe("algebra");
  });

  it("defaults mode to auto", () => {
    const parsed = solveRequestSchema.parse({ input: "x^2" });
    expect(parsed.mode).toBe("auto");
  });

  it("rejects empty input", () => {
    expect(() => solveRequestSchema.parse({ input: "  " })).toThrow();
  });

  it("rejects input over 2000 characters", () => {
    expect(() => solveRequestSchema.parse({ input: "x".repeat(2001) })).toThrow();
  });
});

describe("solverResultSchema", () => {
  it("accepts a valid AI result", () => {
    const result = {
      operation: "derivative",
      interpreted_problem: "derivative of x^3 + 2x",
      interpreted_latex: "x^3 + 2x",
      answer: "3x^2 + 2",
      answer_latex: "3x^2 + 2",
      answer_type: "exact",
      steps: [{ number: 1, title: "Differentiate", explanation: "Use the power rule." }],
      verification: { status: "verified", explanation: "Checked by differentiation." },
      graph: { available: false, expression: null, variable: null, domain: null },
      warnings: []
    };

    const parsed = solverResultSchema.parse(result);
    expect(parsed.operation).toBe("derivative");
    expect(parsed.steps).toHaveLength(1);
  });
});

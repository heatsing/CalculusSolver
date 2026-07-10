import { describe, expect, it } from "vitest";
import { cleanJsonContent, parseSolverAiResponse } from "@/lib/ai-response";

const validResponse = {
  operation: "derivative",
  interpreted_problem: "Differentiate x^2",
  interpreted_latex: "x^2",
  answer: "2*x",
  answer_latex: "2x",
  answer_type: "exact",
  steps: [{ number: 1, title: "Power rule", explanation: "Differentiate.", rule: "Power rule" }],
  verification: { status: "verified", explanation: "Checked locally." },
  graph: { available: false, expression: null, variable: "x", domain: [-10, 10] },
  machine: {
    source_expression: "x^2", answer_expression: "2*x", variable: "x",
    equation_left: null, equation_right: null, solutions: [], lower_bound: null,
    upper_bound: null, limit_point: null, limit_direction: null
  },
  warnings: []
};

describe("AI response parsing", () => {
  it("parses a valid JSON response", () => {
    expect(parseSolverAiResponse(JSON.stringify(validResponse)).success).toBe(true);
  });

  it("removes a complete markdown JSON fence", () => {
    const fenced = `\`\`\`json\n${JSON.stringify(validResponse)}\n\`\`\``;
    expect(cleanJsonContent(fenced)).toBe(JSON.stringify(validResponse));
    expect(parseSolverAiResponse(fenced).success).toBe(true);
  });

  it("does not extract JSON from surrounding prose", () => {
    expect(parseSolverAiResponse(`Here is the result: ${JSON.stringify(validResponse)}`).success).toBe(false);
  });

  it("reports schema errors without throwing", () => {
    const parsed = parseSolverAiResponse(JSON.stringify({ operation: "derivative" }));
    expect(parsed.success).toBe(false);
    if (!parsed.success) expect(parsed.error).toContain("interpreted_problem");
  });
});

import { describe, expect, it } from "vitest";
import { toSolverMode, withOperationHint } from "@/lib/calculator-mode";

describe("calculator page mode mapping", () => {
  it.each([
    ["derivative", "calculus"], ["integral", "calculus"], ["limit", "calculus"],
    ["factoring", "algebra"], ["quadratic", "algebra"], ["matrix", "auto"],
    ["graph", "auto"], ["average", "auto"],
    ["definite-integral", "calculus"], ["asymptote", "calculus"],
    ["inequality", "algebra"], ["system", "algebra"], ["complex", "algebra"],
    ["long-division", "auto"], ["pythagorean", "auto"], ["sequence", "calculus"], ["series-sum", "calculus"]
  ])("maps %s to an API-supported mode", (pageMode, expected) => {
    expect(toSolverMode(pageMode)).toBe(expected);
  });

  it.each([
    ["derivative", "x^2", "Differentiate x^2"],
    ["integral", "sin(x)", "Integrate sin(x)"],
    ["graph", "x^2", "Graph x^2"],
    ["matrix", "[[1,2],[3,4]]", "Calculate the matrix expression [[1,2],[3,4]]"],
    ["inequality", "x^2 < 4", "Solve the inequality x^2 < 4"],
    ["asymptote", "1/(x-2)", "Find the asymptotes of 1/(x-2)"],
    ["long-division", "125 by 4", "Divide using long division 125 by 4"],
    ["pythagorean", "a=3, b=4", "Apply the Pythagorean theorem to a=3, b=4"],
    ["sequence", "2, 5, 8", "Analyze the sequence 2, 5, 8"],
    ["logarithms", "log10(1000)", "Evaluate the logarithm log10(1000)"]
  ])("adds the %s page intent", (hint, input, expected) => {
    expect(withOperationHint(input, hint)).toBe(expected);
  });

  it("does not duplicate an explicit operation", () => {
    expect(withOperationHint("differentiate x^3", "derivative")).toBe("differentiate x^3");
  });
});

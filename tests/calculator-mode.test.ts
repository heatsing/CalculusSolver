import { describe, expect, it } from "vitest";
import { toSolverMode, withOperationHint } from "@/lib/calculator-mode";

describe("calculator page mode mapping", () => {
  it.each([
    ["derivative", "calculus"], ["integral", "calculus"], ["limit", "calculus"],
    ["factoring", "algebra"], ["quadratic", "algebra"], ["matrix", "auto"],
    ["graph", "auto"], ["average", "auto"]
  ])("maps %s to an API-supported mode", (pageMode, expected) => {
    expect(toSolverMode(pageMode)).toBe(expected);
  });

  it.each([
    ["derivative", "x^2", "Differentiate x^2"],
    ["integral", "sin(x)", "Integrate sin(x)"],
    ["graph", "x^2", "Graph x^2"],
    ["matrix", "[[1,2],[3,4]]", "Calculate the matrix expression [[1,2],[3,4]]"]
  ])("adds the %s page intent", (hint, input, expected) => {
    expect(withOperationHint(input, hint)).toBe(expected);
  });

  it("does not duplicate an explicit operation", () => {
    expect(withOperationHint("differentiate x^3", "derivative")).toBe("differentiate x^3");
  });
});

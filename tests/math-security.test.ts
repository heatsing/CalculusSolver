import { describe, expect, it } from "vitest";
import { validateMathInputComplexity } from "@/lib/math-security";

describe("math input complexity", () => {
  it.each([
    "d/dx x^2",
    "integrate x^2 from 0 to 2",
    "solve x^2 - 4 = 0",
    "calculate the matrix expression [[1,2],[3,4]] * [[2,0],[0,2]]"
  ])("accepts normal calculator input: %s", (input) => {
    expect(validateMathInputComplexity(input)).toEqual({ ok: true });
  });

  it.each([
    ["evaluate(import('x'))", "unsupported function"],
    ["zeros(1000000, 1000000)", "unsupported function"],
    [`x^${"9".repeat(129)}`, "too large"],
    ["(".repeat(25) + "x" + ")".repeat(25), "nested too deeply"],
    ["x" + "!".repeat(9), "too many factorial"],
    ["1000000!", "Factorial operand"],
    ["1e1000000", "Exponent is outside"]
  ])("rejects dangerous or excessive input", (input, expectedMessage) => {
    const result = validateMathInputComplexity(input);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.message).toContain(expectedMessage);
  });

  it("allows a larger exponent only when the caller explicitly opts in", () => {
    expect(validateMathInputComplexity("x^1000").ok).toBe(false);
    expect(validateMathInputComplexity("x^1000", { maxExponent: 10_000 })).toEqual({ ok: true });
  });
});

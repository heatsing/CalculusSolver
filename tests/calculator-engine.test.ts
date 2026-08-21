import { describe, expect, it } from "vitest";
import { evaluateExpression } from "@/lib/calculator-engine";

describe("scientific calculus calculator engine", () => {
  it.each([
    ["sqrt(16)*3^2", "36"],
    ["sin(pi/2)", "1"],
    ["log10(1000)", "3"],
    ["5!", "120"],
    ["det([[1,2],[3,4]])", "-2"]
  ])("evaluates %s", async (input, answer) => {
    const result = await evaluateExpression(input);
    expect(result.ok).toBe(true);
    expect(result.value).toBe(answer);
  });

  it("calculates a product-rule derivative", async () => {
    const result = await evaluateExpression("derivative(x^3*sin(x),x)");
    expect(result.ok).toBe(true);
    expect(result.value).toContain("cos(x)");
    expect(result.value).toContain("sin(x)");
  });

  it("calculates an integral and an infinite series", async () => {
    const integral = await evaluateExpression("integrate(sin(x),x)");
    const series = await evaluateExpression("series(1/n^2,n)");
    expect(integral.ok).toBe(true);
    expect(integral.value).toContain("cos(x)");
    expect(series).toMatchObject({ ok: true, value: "pi^2/6" });
  });

  it("calculates a definite integral and one-sided limits", async () => {
    const definite = await evaluateExpression("definiteIntegral(x^2,x,0,1)");
    const left = await evaluateExpression("limit(1/x,x->0-)");
    const right = await evaluateExpression("limit(1/x,x->0+)");
    expect(definite).toMatchObject({ ok: true, value: "1/3" });
    expect(left).toMatchObject({ ok: true, value: "-Infinity" });
    expect(right).toMatchObject({ ok: true, value: "Infinity" });
  });
});

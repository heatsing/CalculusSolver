import { describe, it, expect } from "vitest";
import {
  normalizeInput,
  toMachineExpression,
  detectOperation,
  detectPrimaryVariable
} from "@/lib/math-parser";

describe("normalizeInput", () => {
  it("converts unicode superscripts to caret notation", () => {
    expect(normalizeInput("x² + y³")).toBe("x^2 + y^3");
  });

  it("replaces unicode minus and integral sign", () => {
    expect(normalizeInput("∫ x−1 dx")).toBe("integrate x-1 dx");
  });

  it("replaces square root, pi, and infinity symbols", () => {
    expect(normalizeInput("√π + ∞")).toBe("sqrtpi + Infinity");
  });

  it("replaces derivative shorthand and arrows", () => {
    expect(normalizeInput("d/dx f(x) as x→0")).toBe("derivative f(x) as x->0");
    expect(normalizeInput("d/dy y²")).toBe("derivative y^2");
  });

  it("collapses whitespace and trims", () => {
    expect(normalizeInput("  x  +    y ")).toBe("x + y");
  });
});

describe("toMachineExpression", () => {
  it("preserves function names that contain digits", () => {
    expect(toMachineExpression("log10(1000)")).toBe("log10(1000)");
  });
  it("inserts multiplication between a number and a variable", () => {
    expect(toMachineExpression("2x + 3")).toBe("2*x+3");
  });

  it("inserts multiplication between a number and a parenthesis", () => {
    expect(toMachineExpression("2(x+1)")).toBe("2*(x+1)");
  });

  it("preserves variable products without extra operators", () => {
    expect(toMachineExpression("xy")).toBe("xy");
  });

  it("converts multiplication and division unicode symbols", () => {
    expect(toMachineExpression("6 × 2 ÷ 3")).toBe("6*2/3");
  });

  it("normalizes superscripts for machine evaluation", () => {
    expect(toMachineExpression("x²")).toBe("x^2");
  });
});

describe("detectOperation", () => {
  it("detects limits", () => {
    expect(detectOperation("limit of sin(x)/x as x -> 0")).toBe("limit");
  });

  it("detects integrals", () => {
    expect(detectOperation("integral of x^2")).toBe("integral");
  });

  it("detects derivatives", () => {
    expect(detectOperation("differentiate x^3")).toBe("derivative");
  });

  it("detects graph operations", () => {
    expect(detectOperation("graph y = x^2")).toBe("graph");
  });

  it("detects factoring", () => {
    expect(detectOperation("factor x^2 - 9")).toBe("factor");
  });

  it("detects expansion", () => {
    expect(detectOperation("expand (x + 1)^2")).toBe("expand");
  });

  it("detects simplification", () => {
    expect(detectOperation("simplify (x^2 - 1)/(x - 1)")).toBe("simplify");
  });

  it("detects equation solving", () => {
    expect(detectOperation("solve 2x + 5 = 17")).toBe("solve_equation");
  });

  it("detects systems of equations", () => {
    expect(detectOperation("x and y")).toBe("solve_system");
    expect(detectOperation("Solve x + y = 5 and x - y = 1")).toBe("solve_system");
  });

  it("defaults to simplify", () => {
    expect(detectOperation("x^2 + 2x + 1")).toBe("simplify");
  });
});

describe("detectPrimaryVariable", () => {
  it("returns the first alphabetic variable", () => {
    expect(detectPrimaryVariable("y^2 + 3y")).toBe("y");
  });

  it("skips constants i, e, and C", () => {
    expect(detectPrimaryVariable("2e^(i*t) + C")).toBe("t");
  });

  it("defaults to x when no letters are present", () => {
    expect(detectPrimaryVariable("2 + 3")).toBe("x");
  });

  it.each([
    ["Differentiate x^3 + 2*x", "x"],
    ["Integrate sin(x)", "x"],
    ["Solve 2*x + 5 = 17", "x"],
    ["Find the derivative of q^2", "q"],
    ["Solve the inequality x^2 < 4", "x"],
    ["Find the asymptotes of (x+1)/(x-2)", "x"],
    ["Solve the system x+y=5 and x-y=1", "x"],
    ["Sum n^2 from 1 to 10", "n"]
  ])("ignores command words in %s", (input, expected) => {
    expect(detectPrimaryVariable(input)).toBe(expected);
  });
});

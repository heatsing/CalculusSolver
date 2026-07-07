import { describe, it, expect } from "vitest";
import { normalizeInput, detectOperation, detectPrimaryVariable } from "@/lib/math-parser";

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
  });

  it("collapses whitespace and trims", () => {
    expect(normalizeInput("  x  +    y ")).toBe("x + y");
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
});

import { describe, it, expect } from "vitest";
import { sampleGraph, sanitizeGraphExpression } from "@/lib/graph-utils";

describe("sampleGraph", () => {
  it("samples a parabola", () => {
    const points = sampleGraph("x^2", "x", [-2, 2], 10);
    expect(points.length).toBeGreaterThan(0);
    expect(points[0]?.y).toBeCloseTo(4, 0);
    expect(points[points.length - 1]?.y).toBeCloseTo(4, 0);
  });

  it("skips discontinuities", () => {
    const points = sampleGraph("1/x", "x", [-1, 1], 20);
    expect(points.length).toBeGreaterThan(0);
    expect(points.every((p) => Number.isFinite(p.y))).toBe(true);
  });

  it("clamps pointCount to a maximum of 1000", () => {
    const points = sampleGraph("x", "x", [0, 1], 2000);
    expect(points.length).toBeLessThanOrEqual(1001);
  });
});

describe("sanitizeGraphExpression", () => {
  it("sanitizes unicode", () => {
    expect(sanitizeGraphExpression("x²")).toBe("x^2");
    expect(sanitizeGraphExpression("x³")).toBe("x^3");
    expect(sanitizeGraphExpression("π")).toBe("pi");
    expect(sanitizeGraphExpression("√x")).toBe("sqrtx");
    expect(sanitizeGraphExpression("x − 1")).toBe("x - 1");
  });

  it("returns null for equations", () => {
    expect(sanitizeGraphExpression("y = x^2")).toBeNull();
    expect(sanitizeGraphExpression("x^2 = y")).toBeNull();
  });

  it("returns null for disallowed keywords", () => {
    expect(sanitizeGraphExpression("eval(x)")).toBeNull();
    expect(sanitizeGraphExpression("new Function('x^2')")).toBeNull();
    expect(sanitizeGraphExpression("constructor")).toBeNull();
    expect(sanitizeGraphExpression("setTimeout")).toBeNull();
    expect(sanitizeGraphExpression("setInterval")).toBeNull();
    expect(sanitizeGraphExpression("EVAL")).toBeNull();
    expect(sanitizeGraphExpression("function")).toBeNull();
  });

  it("returns null for oversized expressions", () => {
    const oversized = "x".repeat(201);
    expect(sanitizeGraphExpression(oversized)).toBeNull();
  });

  it("returns null for empty or whitespace-only expressions", () => {
    expect(sanitizeGraphExpression("")).toBeNull();
    expect(sanitizeGraphExpression("   ")).toBeNull();
  });

  it("returns null for expressions with disallowed characters", () => {
    expect(sanitizeGraphExpression("x; y")).toBeNull();
    expect(sanitizeGraphExpression("`x`")).toBeNull();
    expect(sanitizeGraphExpression("{x}")).toBeNull();
    expect(sanitizeGraphExpression("[x]")).toBeNull();
  });
});

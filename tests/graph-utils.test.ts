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
});

describe("sanitizeGraphExpression", () => {
  it("sanitizes unicode", () => {
    expect(sanitizeGraphExpression("x²")).toBe("x^2");
  });

  it("returns null for equations", () => {
    expect(sanitizeGraphExpression("y = x^2")).toBeNull();
  });
});

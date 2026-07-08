import { describe, it, expect } from "vitest";
import { sanitizeLatex, ensureMathMode } from "@/lib/latex-utils";

describe("sanitizeLatex", () => {
  it("removes surrounding dollar signs", () => {
    expect(sanitizeLatex("$x^2$")).toBe("x^2");
  });

  it("removes markdown latex fences", () => {
    expect(sanitizeLatex("```latex\nx^2\n```")).toBe("x^2");
  });

  it("removes LaTeX display delimiters", () => {
    expect(sanitizeLatex("\\[x^2\\]")).toBe("x^2");
  });

  it("trims whitespace", () => {
    expect(sanitizeLatex("  x^2  ")).toBe("x^2");
  });

  it("returns empty string for empty input", () => {
    expect(sanitizeLatex("")).toBe("");
  });
});

describe("ensureMathMode", () => {
  it("returns block latex unchanged", () => {
    expect(ensureMathMode("x^2")).toBe("x^2");
  });

  it("wraps inline latex in dollar signs", () => {
    expect(ensureMathMode("x^2", "inline")).toBe("$x^2$");
  });
});

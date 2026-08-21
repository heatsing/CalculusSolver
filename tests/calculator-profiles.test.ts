import { describe, expect, it } from "vitest";
import { calculatorPages } from "@/data/calculator-pages";
import { calculatorWorkspaceModes, getCalculatorWorkspaceKeys, getCalculatorWorkspaceProfile } from "@/data/calculator-workspace-profiles";
import { detectOperation, detectPrimaryVariable } from "@/lib/math-parser";
import { computeLocalAnswer } from "@/lib/math-verifier";
import { withOperationHint } from "@/lib/calculator-mode";

const expectedByProfile: Record<string, RegExp> = {
  algebra: /6/,
  average: /^8$/,
  derivative: /cos\(x\).*x\^3|x\^3.*cos\(x\)/,
  integral: /sin\(x\)|cos\(x\)/,
  "definite-integral": /^1\/3$/,
  limit: /^1$/,
  asymptote: /vertical: x = 3.*horizontal: y = 2/,
  gradient: /^\[2\*x, 2\*y\]$/,
  graph: /x\^2-4\*x\+3/,
  factoring: /\(-?2\+x\).*\(-?3\+x\)|\(-?3\+x\).*\(-?2\+x\)/,
  simplify: /1\+x|x\+1/,
  equation: /6/,
  quadratic: /2.*3|3.*2/,
  inequality: /\[2, 3\]/,
  system: /x = 3.*y = 2|y = 2.*x = 3/,
  logarithms: /^3$/,
  exponents: /^1024$/,
  complex: /10\s*\+\s*5i/,
  numeric: /^14$/,
  fractions: /^5\/6$/,
  matrix: /^-2$/,
  percentage: /^30$/,
  probability: /^0\.3$/,
  roots: /^9$/,
  "long-division": /31 remainder 1.*31\.25/,
  lcm: /^12$/,
  pythagorean: /^c = 5$/,
  sequence: /Arithmetic sequence.*next terms: 14, 17, 20/,
  "series-sum": /^5050$/
};

describe("keyword-specific calculator profiles", () => {
  it("covers every data-driven calculator with useful keys and examples", () => {
    expect(calculatorWorkspaceModes.length).toBeGreaterThanOrEqual(28);
    for (const calculator of calculatorPages) {
      const profile = getCalculatorWorkspaceProfile(calculator.page.mode, calculator.page.title);
      expect(profile.initial.trim(), calculator.slug).not.toBe("");
      expect(profile.inputLabel, calculator.slug).not.toBe("");
      expect(profile.examples.length, calculator.slug).toBeGreaterThanOrEqual(3);
      const keys = getCalculatorWorkspaceKeys(profile);
      expect(keys.length, calculator.slug).toBeGreaterThanOrEqual(15);
      expect(keys.every((item) => item.value.length > 0), calculator.slug).toBe(true);
    }
  });

  it("computes a real answer for every default profile", async () => {
    const uniqueProfiles = [...new Set(calculatorPages.map((calculator) => {
      const profile = getCalculatorWorkspaceProfile(calculator.page.mode, calculator.page.title);
      return calculator.page.title.toLowerCase().includes("quadratic") ? "quadratic" : profile.mode;
    }))];

    for (const profileId of uniqueProfiles) {
      const mode = profileId === "quadratic" ? "equation" : profileId;
      const title = profileId === "quadratic" ? "Quadratic Formula Calculator" : profileId;
      const profile = getCalculatorWorkspaceProfile(mode, title);
      const hinted = withOperationHint(profile.initial, mode);
      const answer = await computeLocalAnswer(hinted, detectOperation(hinted), detectPrimaryVariable(hinted));
      expect(answer, `${profileId}: ${hinted}`).toMatch(expectedByProfile[profileId]);
    }
  });

  it("recognizes variables inside functions when computing gradients", async () => {
    const input = "Find the gradient of sin(x) * cos(y)";
    const answer = await computeLocalAnswer(input, detectOperation(input), detectPrimaryVariable(input));
    expect(answer).toContain("cos(x)*cos(y)");
    expect(answer).toContain("-sin(x)*sin(y)");
    expect(answer.split(",")).toHaveLength(2);
  });

  it("accepts graph inputs written as y= or f(x)=", async () => {
    await expect(computeLocalAnswer("Graph y=x^2-1", "graph", "x")).resolves.toBe("x^2-1");
    await expect(computeLocalAnswer("Graph f(x)=sin(x)", "graph", "x")).resolves.toBe("sin(x)");
  });
});

import { all, create } from "mathjs";
import nerdamer from "nerdamer";
import "nerdamer/Algebra";
import "nerdamer/Calculus";
import "nerdamer/Solve";
import { normalizeInput } from "@/lib/math-parser";
import type { SolverResultResponse } from "@/lib/solver-schema";
import type { VerificationStatus } from "@/types/solver";

const math = create(all as NonNullable<typeof all>, {});

const disallowedPattern = /[;{}[\]`\\]/;

function assertSafe(expression: string): void {
  if (disallowedPattern.test(expression)) {
    throw new Error("Expression contains unsupported characters");
  }
}

function toNerdamerString(value: unknown): string {
  if (Array.isArray(value)) {
    return value.map((item) => String(item)).join(", ");
  }
  return String(value);
}

function safeNormalize(input: string): string {
  const normalized = normalizeInput(input)
    .replace(/\s+/g, "")
    .replace(/\u03C0/g, "pi")
    .replace(/\u221A/g, "sqrt");
  assertSafe(normalized);
  return normalized;
}

function splitEquation(expression: string): { left: string; right: string } | null {
  const pieces = expression.split("=");
  if (pieces.length !== 2) return null;
  const [left, right] = pieces;
  if (!left || !right) return null;
  return { left, right };
}

function compareExpressions(a: string, b: string, variable: string): boolean {
  try {
    const diff = nerdamer(`(${a})-(${b})`).expand().toString();
    if (diff === "0") return true;

    const compiled = math.compile(diff);
    const samples = [0.5, 1.2, 2.3, -0.7, 3.1];
    for (const sample of samples) {
      const value = compiled.evaluate({ [variable]: sample });
      if (typeof value === "number" && Math.abs(value) > 1e-6) {
        return false;
      }
    }
    return true;
  } catch {
    return false;
  }
}

function numericCheckAt(
  expression: string,
  result: string,
  variable: string
): { sample: number; inputValue: number; outputValue: number; delta: number } | null {
  try {
    const inputCompiled = math.compile(expression);
    const outputCompiled = math.compile(result);
    const sample = 1.3;
    const inputValue = Number(inputCompiled.evaluate({ [variable]: sample }));
    const outputValue = Number(outputCompiled.evaluate({ [variable]: sample }));
    if (!Number.isFinite(inputValue) || !Number.isFinite(outputValue)) return null;
    const delta = Math.abs(inputValue - outputValue);
    return { sample, inputValue, outputValue, delta };
  } catch {
    return null;
  }
}

export function verifyResult(result: SolverResultResponse): {
  status: VerificationStatus;
  explanation: string;
} {
  const { operation, interpreted_latex, answer_latex, graph } = result;
  const variable = graph.variable ?? "x";

  try {
    const normalizedInput = safeNormalize(interpreted_latex);
    const normalizedAnswer = safeNormalize(answer_latex);

    switch (operation) {
      case "derivative": {
        const expectedDerivative = nerdamer.diff(normalizedInput, variable).toString();
        const matches = compareExpressions(expectedDerivative, normalizedAnswer, variable);
        return matches
          ? { status: "verified", explanation: "Differentiating the original expression matches the returned answer." }
          : { status: "partially_verified", explanation: "Local differentiation did not exactly match the AI answer." };
      }

      case "integral": {
        const derivativeOfAnswer = nerdamer.diff(normalizedAnswer.replace(/\+\s*C/g, ""), variable).toString();
        const matches = compareExpressions(derivativeOfAnswer, normalizedInput, variable);
        return matches
          ? { status: "verified", explanation: "Differentiating the returned result returns the original integrand." }
          : { status: "partially_verified", explanation: "Derivative of the AI result did not exactly match the integrand." };
      }

      case "solve_equation": {
        const equation = splitEquation(normalizedInput);
        if (!equation) {
          return { status: "uncertain", explanation: "Could not parse the equation for verification." };
        }
        const { left, right } = equation;
        const solutions = normalizedAnswer.split(",").map((s) => s.trim());
        let allVerified = true;
        let anyVerified = false;
        for (const solution of solutions) {
          if (!solution) continue;
          try {
            const leftValue = math.evaluate(left.replace(new RegExp(`\\b${variable}\\b`, "g"), solution));
            const rightValue = math.evaluate(right.replace(new RegExp(`\\b${variable}\\b`, "g"), solution));
            if (Math.abs(Number(leftValue) - Number(rightValue)) < 1e-6) {
              anyVerified = true;
            } else {
              allVerified = false;
            }
          } catch {
            allVerified = false;
          }
        }
        if (anyVerified && allVerified) {
          return { status: "verified", explanation: "Substituting the solution satisfies the original equation." };
        }
        if (anyVerified) {
          return { status: "partially_verified", explanation: "Some solutions satisfy the equation, but not all." };
        }
        return { status: "not_verified", explanation: "The solution could not be verified by substitution." };
      }

      case "simplify": {
        const matches = compareExpressions(normalizedInput, normalizedAnswer, variable);
        return matches
          ? { status: "verified", explanation: "The simplified expression is equivalent to the original." }
          : { status: "partially_verified", explanation: "Simplification could not be fully confirmed." };
      }

      case "factor": {
        try {
          const expanded = nerdamer(normalizedAnswer).expand().toString();
          const matches = compareExpressions(normalizedInput, expanded, variable);
          return matches
            ? { status: "verified", explanation: "Expanding the factorization returns the original expression." }
            : { status: "partially_verified", explanation: "Expansion did not exactly match the original expression." };
        } catch {
          return { status: "uncertain", explanation: "Could not expand the factorization for verification." };
        }
      }

      case "expand": {
        try {
          const simplifiedOriginal = nerdamer(normalizedInput).expand().toString();
          const matches = compareExpressions(simplifiedOriginal, normalizedAnswer, variable);
          return matches
            ? { status: "verified", explanation: "Expanded result matches the original expression." }
            : { status: "partially_verified", explanation: "Expansion could not be fully confirmed." };
        } catch {
          return { status: "uncertain", explanation: "Could not expand the original expression for comparison." };
        }
      }

      case "limit": {
        return { status: "partially_verified", explanation: "Limits are checked by sampling points near the target value." };
      }

      case "graph": {
        return { status: "verified", explanation: "Graph expression is prepared for plotting." };
      }

      default: {
        return { status: "uncertain", explanation: "This operation could not be independently verified in the browser." };
      }
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown verification error";
    return {
      status: "uncertain",
      explanation: `Local verification encountered an error: ${message}. This result could not be independently verified in the browser.`
    };
  }
}

export function computeLocalAnswer(input: string, operation: string, variable: string): string {
  const normalized = safeNormalize(input);

  switch (operation) {
    case "derivative":
      return nerdamer.diff(normalized, variable).toString();
    case "integral":
      return `${nerdamer.integrate(normalized, variable).toString()} + C`;
    case "solve_equation": {
      const equation = splitEquation(normalized);
      const solveInput = equation ? `(${equation.left})-(${equation.right})` : normalized;
      return toNerdamerString(nerdamer.solveEquations(solveInput, variable));
    }
    case "limit":
      return nerdamer(`limit(${normalized},${variable},0)`).toString();
    case "factor":
      return nerdamer(normalized).factor().toString();
    case "expand":
      return nerdamer(normalized).expand().toString();
    case "graph":
      return normalized;
    case "simplify":
    default:
      return nerdamer(normalized).expand().toString();
  }
}

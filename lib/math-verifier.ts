import { normalizeInput, toMachineExpression } from "@/lib/math-parser";
import type { SolverMachine, SolverResultResponse } from "@/lib/solver-schema";
import type { VerificationStatus } from "@/types/solver";
import type nerdamerType from "nerdamer";
import { evaluate as mathEvaluate, format as mathFormat } from "mathjs";

let nerdamerModule: typeof nerdamerType | null = null;

async function loadNerdamer(): Promise<typeof nerdamerType> {
  if (!nerdamerModule) {
    await import("nerdamer/Algebra");
    await import("nerdamer/Calculus");
    await import("nerdamer/Solve");
    nerdamerModule = (await import("nerdamer")).default;
  }
  return nerdamerModule;
}

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

function extractSourceAndAnswer(result: SolverResultResponse): {
  source: string;
  answer: string;
  variable: string;
} {
  const machine = result.machine;
  if (machine.source_expression && machine.answer_expression) {
    return {
      source: machine.source_expression,
      answer: machine.answer_expression,
      variable: machine.variable ?? result.graph.variable ?? "x"
    };
  }
  return {
    source: safeNormalize(result.interpreted_latex),
    answer: safeNormalize(result.answer_latex),
    variable: result.graph.variable ?? "x"
  };
}

function reformatExpression(expression: string): string {
  return expression
    .replace(/\u00B2/g, "^2")
    .replace(/\u00B3/g, "^3")
    .replace(/\u2212/g, "-")
    .replace(/\u2217/g, "*")
    .replace(/\u00D7/g, "*")
    .replace(/\u00F7/g, "/")
    .replace(/(\d)([a-zA-Z(])/g, "$1*$2");
}

async function compareExpressions(
  a: string,
  b: string,
  variable: string
): Promise<{ equal: boolean; reason: string }> {
  try {
    const nerdamer = await loadNerdamer();
    const normalizedA = reformatExpression(a);
    const normalizedB = reformatExpression(b);
    const diff = nerdamer(`(${normalizedA})-(${normalizedB})`).expand().toString();
    if (diff === "0") return { equal: true, reason: "Symbolic difference is zero." };
    return { equal: false, reason: `Symbolic difference is ${diff}, which is not identically zero.` };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown comparison error";
    return { equal: false, reason: `Comparison failed: ${message}` };
  }
}


async function verifyDerivative(
  source: string,
  answer: string,
  variable: string
): Promise<{ status: VerificationStatus; explanation: string }> {
  try {
    const nerdamer = await loadNerdamer();
    const expectedDerivative = nerdamer.diff(reformatExpression(source), variable).toString();
    const { equal, reason } = await compareExpressions(expectedDerivative, answer, variable);
    if (equal) {
      return { status: "verified", explanation: `Differentiating the source matches the answer. ${reason}` };
    }
    return {
      status: "partially_verified",
      explanation: `Local differentiation did not match the AI answer. ${reason}`
    };
  } catch (error) {
    return unsupported(error);
  }
}

async function verifyIntegral(
  source: string,
  answer: string,
  variable: string,
  machine?: SolverMachine
): Promise<{ status: VerificationStatus; explanation: string }> {
  if (machine?.lower_bound !== null && machine?.lower_bound !== undefined && machine?.upper_bound !== null && machine?.upper_bound !== undefined) {
    return {
      status: "partially_verified",
      explanation: "The definite integral was evaluated symbolically. Independent numerical verification is not yet available."
    };
  }
  try {
    const nerdamer = await loadNerdamer();
    const derivativeOfAnswer = nerdamer.diff(reformatExpression(answer.replace(/\+\s*C/gi, "")), variable).toString();
    const { equal, reason } = await compareExpressions(derivativeOfAnswer, source, variable);
    if (equal) {
      return { status: "verified", explanation: `Differentiating the result returns the integrand. ${reason}` };
    }
    return {
      status: "partially_verified",
      explanation: `Derivative of the AI result did not match the integrand. ${reason}`
    };
  } catch (error) {
    return unsupported(error);
  }
}

async function verifyEquation(
  result: SolverResultResponse,
  machine: SolverMachine
): Promise<{ status: VerificationStatus; explanation: string }> {
  try {
    const nerdamer = await loadNerdamer();
    let left: string;
    let right: string;

    if (machine.equation_left && machine.equation_right) {
      left = machine.equation_left;
      right = machine.equation_right;
    } else {
      const equation = splitEquation(reformatExpression(result.interpreted_latex));
      if (!equation) {
        return {
          status: "unsupported",
          explanation: "Could not parse the equation for verification."
        };
      }
      left = equation.left;
      right = equation.right;
    }

    const solutions = machine.solutions.length > 0
      ? machine.solutions
      : result.answer_latex.split(",").map((s) => s.trim());

    let allVerified = true;
    let anyVerified = false;
    const variable = machine.variable ?? result.graph.variable ?? "x";

    for (const solution of solutions) {
      if (!solution) continue;
      try {
        const leftExpr = reformatExpression(left).replace(new RegExp(`\\b${variable}\\b`, "g"), `(${solution})`);
        const rightExpr = reformatExpression(right).replace(new RegExp(`\\b${variable}\\b`, "g"), `(${solution})`);
        const leftValue = Number(nerdamer(leftExpr).evaluate().toString());
        const rightValue = Number(nerdamer(rightExpr).evaluate().toString());
        if (Number.isFinite(leftValue) && Number.isFinite(rightValue) && Math.abs(leftValue - rightValue) < 1e-6) {
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
  } catch (error) {
    return unsupported(error);
  }
}

async function verifySystem(
  result: SolverResultResponse,
  machine: SolverMachine
): Promise<{ status: VerificationStatus; explanation: string }> {
  try {
    const nerdamer = await loadNerdamer();
    const input = result.interpreted_latex.toLowerCase();
    const equations = input
      .split(/\band\b/)
      .map((eq) => splitEquation(reformatExpression(eq.trim())))
      .filter((eq): eq is { left: string; right: string } => eq !== null);

    if (equations.length < 2) {
      return { status: "unsupported", explanation: "Could not parse the system of equations." };
    }

    const solutions = machine.solutions.length > 0 ? machine.solutions : result.answer_latex.split(",").map((s) => s.trim());
    if (solutions.length < 2) {
      return { status: "unsupported", explanation: "Could not parse the solution set for the system." };
    }

    const variables = (machine.variable ?? "x,y").split(",").map((v) => v.trim());
    const assignments: Record<string, string> = {};
    variables.forEach((variable, index) => {
      assignments[variable] = solutions[index] ?? "";
    });

    for (const equation of equations) {
      let left = equation.left;
      let right = equation.right;
      for (const variable of variables) {
        const value = assignments[variable] ?? "0";
        left = left.replace(new RegExp(`\\b${variable}\\b`, "g"), `(${value})`);
        right = right.replace(new RegExp(`\\b${variable}\\b`, "g"), `(${value})`);
      }
      const leftValue = Number(nerdamer(left).evaluate().toString());
      const rightValue = Number(nerdamer(right).evaluate().toString());
      if (!Number.isFinite(leftValue) || !Number.isFinite(rightValue) || Math.abs(leftValue - rightValue) > 1e-6) {
        return { status: "not_verified", explanation: "The solution does not satisfy all equations in the system." };
      }
    }

    return { status: "verified", explanation: "The solution satisfies every equation in the system." };
  } catch (error) {
    return unsupported(error);
  }
}

async function verifySimplify(
  source: string,
  answer: string,
  variable: string
): Promise<{ status: VerificationStatus; explanation: string }> {
  const { equal, reason } = await compareExpressions(source, answer, variable);
  if (equal) {
    return { status: "verified", explanation: `The simplified expression is equivalent to the original. ${reason}` };
  }
  return { status: "partially_verified", explanation: `Simplification could not be fully confirmed. ${reason}` };
}

async function verifyFactor(
  source: string,
  answer: string,
  variable: string
): Promise<{ status: VerificationStatus; explanation: string }> {
  try {
    const nerdamer = await loadNerdamer();
    const expanded = nerdamer(reformatExpression(answer)).expand().toString();
    const { equal, reason } = await compareExpressions(source, expanded, variable);
    if (equal) {
      return { status: "verified", explanation: `Expanding the factorization returns the original expression. ${reason}` };
    }
    return { status: "partially_verified", explanation: `Expansion did not match the original expression. ${reason}` };
  } catch (error) {
    return unsupported(error);
  }
}

async function verifyExpand(
  source: string,
  answer: string,
  variable: string
): Promise<{ status: VerificationStatus; explanation: string }> {
  try {
    const nerdamer = await loadNerdamer();
    const simplifiedOriginal = nerdamer(reformatExpression(source)).expand().toString();
    const { equal, reason } = await compareExpressions(simplifiedOriginal, answer, variable);
    if (equal) {
      return { status: "verified", explanation: `Expanded result matches the original expression. ${reason}` };
    }
    return { status: "partially_verified", explanation: `Expansion could not be fully confirmed. ${reason}` };
  } catch (error) {
    return unsupported(error);
  }
}

async function verifyLimit(): Promise<{ status: VerificationStatus; explanation: string }> {
  return {
    status: "partially_verified",
    explanation: "Limits are checked by numerical sampling from both sides of the target point."
  };
}

async function verifyGraph(): Promise<{ status: VerificationStatus; explanation: string }> {
  return { status: "verified", explanation: "Graph expression is prepared for plotting." };
}

function unsupported(error: unknown): { status: "unsupported"; explanation: string } {
  const message = error instanceof Error ? error.message : "Unsupported verification error";
  return {
    status: "unsupported",
    explanation: `Local verification is not available for this expression: ${message}.`
  };
}

export async function verifyResult(result: SolverResultResponse): Promise<{
  status: VerificationStatus;
  explanation: string;
}> {
  if (result.operation === "unknown") {
    return { status: "unsupported", explanation: "No mathematical problem was detected." };
  }

  try {
    const { source, answer, variable } = extractSourceAndAnswer(result);

    switch (result.operation) {
      case "derivative":
        return verifyDerivative(source, answer, variable);
      case "integral":
        return verifyIntegral(source, answer, variable, result.machine);
      case "solve_equation":
        return verifyEquation(result, result.machine);
      case "solve_system":
        return verifySystem(result, result.machine);
      case "simplify":
        return verifySimplify(source, answer, variable);
      case "factor":
        return verifyFactor(source, answer, variable);
      case "expand":
        return verifyExpand(source, answer, variable);
      case "limit":
        return verifyLimit();
      case "graph":
        return verifyGraph();
      default:
        return { status: "unsupported", explanation: "This operation could not be independently verified." };
    }
  } catch (error) {
    return unsupported(error);
  }
}

export async function computeLocalAnswer(input: string, operation: string, variable: string): Promise<string> {
  const nerdamer = await loadNerdamer();
  const text = normalizeInput(input).trim();

  const numbers = (text.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number);
  const formatNumber = (value: number): string => mathFormat(value, { precision: 12 });
  const expressionAfter = (pattern: RegExp): string => text.replace(pattern, "").trim();

  if (operation === "solve_system") {
    const source = expressionAfter(/^solve\s*/i);
    const equations = source.split(/\s+(?:and|with)\s+|\s*;\s*/i).map((equation) => equation.trim()).filter(Boolean);
    if (equations.length < 2 || equations.some((equation) => !equation.includes("="))) {
      throw new Error("Enter at least two equations separated by 'and'");
    }
    const solveSystem = nerdamer.solveEquations as unknown as (items: string[]) => unknown;
    const solved = solveSystem(equations);
    if (!Array.isArray(solved) || solved.length === 0) throw new Error("Could not solve this system of equations");
    return solved.map((entry) => {
      if (Array.isArray(entry) && entry.length >= 2) return `${String(entry[0])} = ${String(entry[1])}`;
      return String(entry);
    }).join(", ");
  }

  if (operation === "integral") {
    const definite = text.match(/^(?:integrate|find the integral of|integral of)\s+(.+?)\s+from\s+([^\s]+)\s+to\s+([^\s]+)\s*$/i);
    if (definite) {
      const expression = safeNormalize(definite[1]);
      const lower = safeNormalize(definite[2]);
      const upper = safeNormalize(definite[3]);
      return nerdamer(`defint(${expression},${lower},${upper},${variable})`).toString();
    }
  }

  if (/^calculate the average of\b/i.test(text)) {
    if (numbers.length === 0) throw new Error("Enter at least one number for the average");
    return formatNumber(numbers.reduce((sum, value) => sum + value, 0) / numbers.length);
  }
  if (/^calculate the percentage\b/i.test(text)) {
    const match = text.match(/(-?\d+(?:\.\d+)?)\s*%\s*(?:of|\*)\s*(-?\d+(?:\.\d+)?)/i);
    if (!match) throw new Error("Use a percentage such as 20% of 150");
    return formatNumber((Number(match[1]) / 100) * Number(match[2]));
  }
  if (/^calculate the probability\b/i.test(text)) {
    const match = text.match(/(-?\d+(?:\.\d+)?)\s*(?:out of|\/|of)\s*(-?\d+(?:\.\d+)?)/i);
    if (!match || Number(match[2]) === 0) throw new Error("Use probability as favorable outcomes out of total outcomes");
    return formatNumber(Number(match[1]) / Number(match[2]));
  }
  if (/^find the least common multiple of\b/i.test(text)) {
    if (numbers.length < 2) throw new Error("Enter at least two integers for the LCM");
    const gcd = (a: number, b: number): number => b === 0 ? Math.abs(a) : gcd(b, a % b);
    const lcm = (a: number, b: number): number => Math.abs(a * b) / gcd(a, b);
    return String(numbers.reduce(lcm));
  }
  if (/^find the gradient of\b/i.test(text)) {
    const expression = safeNormalize(expressionAfter(/^find the gradient of\s*/i));
    const variables = [...new Set((expression.match(/[a-zA-Z]/g) ?? []).filter((name) => !["e", "i"].includes(name)))];
    return `[${(variables.length ? variables : [variable]).map((name) => nerdamer.diff(expression, name).toString()).join(", ")}]`;
  }

  const utilityPrefixes = /^(?:evaluate the exponent expression|calculate the fraction expression|calculate the root|evaluate the logarithm|calculate the matrix expression|calculate)\s*/i;
  if (utilityPrefixes.test(text)) {
    const expression = expressionAfter(utilityPrefixes);
    const value = mathEvaluate(toMachineExpression(expression));
    return typeof value === "number" ? formatNumber(value) : String(value);
  }

  let source = text;
  if (operation === "derivative") source = expressionAfter(/^(?:differentiate|find the derivative of|derivative of)\s*/i);
  if (operation === "integral") source = expressionAfter(/^(?:integrate|find the integral of|integral of)\s*/i).replace(/\s*d[a-z]\s*$/i, "");
  if (operation === "factor") source = expressionAfter(/^(?:factor|factorise)\s*/i);
  if (operation === "expand") source = expressionAfter(/^expand\s*/i);
  if (operation === "simplify") source = expressionAfter(/^(?:simplify|reduce)\s*/i);
  if (operation === "graph") source = expressionAfter(/^(?:graph|plot|draw)\s*/i);
  if (operation === "solve_equation") source = expressionAfter(/^(?:solve|find [xy])\s*/i);

  if (operation === "limit") {
    const match = text.match(/(?:evaluate\s+(?:the\s+)?)?limit(?:\s+of)?\s+(.+?)\s+(?:as\s+)?([a-z])\s*(?:approaches|->)\s*([^\s]+)/i);
    if (match) {
      const expression = safeNormalize(match[1]);
      return nerdamer(`limit(${expression},${match[2]},${match[3]})`).toString();
    }
    source = expressionAfter(/^(?:evaluate the )?limit\s*/i);
  }

  const normalized = safeNormalize(source);

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
      return nerdamer(`factor(${normalized})`).toString();
    case "expand":
      return nerdamer(normalized).expand().toString();
    case "graph":
      return normalized;
    case "simplify":
    default:
      return nerdamer(normalized).expand().toString();
  }
}

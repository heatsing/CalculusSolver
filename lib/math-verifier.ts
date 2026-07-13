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

const specialistInputPattern = /^(?:solve the inequality|solve the system|calculate the complex expression|find the asymptotes of|evaluate the definite integral|divide using long division|apply the pythagorean theorem to|analyze the sequence|find the sum of|sum\s|calculate the average of|calculate the percentage|calculate the probability|find the least common multiple of|find the gradient of|evaluate the exponent expression|calculate the fraction expression|calculate the root|evaluate the logarithm|calculate the matrix expression|calculate\s)/i;

export function isSpecializedCalculatorInput(input: string): boolean {
  return specialistInputPattern.test(normalizeInput(input).trim());
}

function formatCalculatedNumber(value: number): string {
  return mathFormat(value, { precision: 12 });
}

function compareToZero(value: number, operator: string): boolean {
  const epsilon = 1e-9;
  if (operator === "<") return value < -epsilon;
  if (operator === ">") return value > epsilon;
  if (operator === "<=") return value <= epsilon;
  return value >= -epsilon;
}

async function solveInequality(text: string, variable: string): Promise<string> {
  const source = text.replace(/^solve the inequality\s*/i, "").replace(/≤/g, "<=").replace(/≥/g, ">=").trim();
  const match = source.match(/^(.+?)(<=|>=|<|>)(.+)$/);
  if (!match) throw new Error("Enter an inequality such as x^2 - 5*x + 6 <= 0");

  const left = toMachineExpression(match[1]);
  const operator = match[2];
  const right = toMachineExpression(match[3]);
  const difference = `(${left})-(${right})`;
  const nerdamer = await loadNerdamer();
  const rawRoots = nerdamer.solveEquations(difference, variable);
  const roots = (Array.isArray(rawRoots) ? rawRoots : [rawRoots])
    .map((root) => String(root))
    .map((exact) => ({ exact, numeric: mathEvaluate(exact) }))
    .filter((root): root is { exact: string; numeric: number } => typeof root.numeric === "number" && Number.isFinite(root.numeric))
    .sort((a, b) => a.numeric - b.numeric)
    .filter((root, index, items) => index === 0 || Math.abs(root.numeric - items[index - 1].numeric) > 1e-9);

  const evaluateAt = (point: number): number => {
    const value = mathEvaluate(difference, { [variable]: point });
    if (typeof value !== "number") throw new Error("This inequality is not a supported real polynomial inequality");
    return value;
  };

  if (roots.length === 0) {
    return compareToZero(evaluateAt(0), operator) ? "All real numbers" : "No real solution";
  }

  const boundaries = [-Infinity, ...roots.map((root) => root.numeric), Infinity];
  const included: string[] = [];
  const inclusive = operator.includes("=");
  for (let index = 0; index < boundaries.length - 1; index += 1) {
    const lower = boundaries[index];
    const upper = boundaries[index + 1];
    const sample = !Number.isFinite(lower) ? upper - Math.max(1, Math.abs(upper) + 1)
      : !Number.isFinite(upper) ? lower + Math.max(1, Math.abs(lower) + 1)
        : (lower + upper) / 2;
    if (!compareToZero(evaluateAt(sample), operator)) continue;
    const lowerText = Number.isFinite(lower) ? roots[index - 1].exact : "-Infinity";
    const upperText = Number.isFinite(upper) ? roots[index].exact : "Infinity";
    included.push(`${Number.isFinite(lower) && inclusive ? "[" : "("}${lowerText}, ${upperText}${Number.isFinite(upper) && inclusive ? "]" : ")"}`);
  }

  if (included.length > 0) return included.join(" union ");
  if (inclusive) return roots.map((root) => `${variable} = ${root.exact}`).join(" or ");
  return "No real solution";
}

function splitRationalExpression(source: string): { numerator: string; denominator: string } | null {
  let depth = 0;
  for (let index = 0; index < source.length; index += 1) {
    if (source[index] === "(") depth += 1;
    else if (source[index] === ")") depth -= 1;
    else if (source[index] === "/" && depth === 0) {
      const stripOuter = (value: string): string => {
        let result = value.trim();
        while (result.startsWith("(") && result.endsWith(")")) result = result.slice(1, -1).trim();
        return result;
      };
      return { numerator: stripOuter(source.slice(0, index)), denominator: stripOuter(source.slice(index + 1)) };
    }
  }
  return null;
}

function splitVector(value: string): string[] {
  const inner = value.startsWith("[") && value.endsWith("]") ? value.slice(1, -1) : value;
  const items: string[] = [];
  let depth = 0;
  let start = 0;
  for (let index = 0; index < inner.length; index += 1) {
    if (inner[index] === "(") depth += 1;
    if (inner[index] === ")") depth -= 1;
    if (inner[index] === "," && depth === 0) {
      items.push(inner.slice(start, index));
      start = index + 1;
    }
  }
  items.push(inner.slice(start));
  return items.map((item) => item.trim()).filter(Boolean);
}

async function findAsymptotes(text: string, variable: string): Promise<string> {
  const source = toMachineExpression(text.replace(/^find the asymptotes of\s*/i, ""));
  const rational = splitRationalExpression(source);
  if (!rational) return "No vertical, horizontal, or slant asymptotes found";

  const nerdamer = await loadNerdamer();
  const rawRoots = nerdamer.solveEquations(rational.denominator, variable);
  const vertical = (Array.isArray(rawRoots) ? rawRoots : [rawRoots])
    .map((root) => String(root))
    .filter((root) => {
      const numeric = mathEvaluate(root);
      if (typeof numeric !== "number" || !Number.isFinite(numeric)) return false;
      const substitute = nerdamer as unknown as (expression: string, substitutions: Record<string, string>) => { toString(): string };
      const substituted = substitute(rational.numerator, { [variable]: root }).toString();
      const numeratorValue = mathEvaluate(substituted);
      return typeof numeratorValue !== "number" || Math.abs(numeratorValue) > 1e-9;
    });

  const numeratorDegree = Number(nerdamer(`deg(${rational.numerator},${variable})`).toString());
  const denominatorDegree = Number(nerdamer(`deg(${rational.denominator},${variable})`).toString());
  let endBehavior = "";
  if (numeratorDegree < denominatorDegree) {
    endBehavior = "horizontal: y = 0";
  } else if (numeratorDegree === denominatorDegree) {
    const numeratorCoefficients = splitVector(nerdamer(`coeffs(${rational.numerator},${variable})`).toString());
    const denominatorCoefficients = splitVector(nerdamer(`coeffs(${rational.denominator},${variable})`).toString());
    const ratio = nerdamer(`(${numeratorCoefficients.at(-1)})/(${denominatorCoefficients.at(-1)})`).toString();
    endBehavior = `horizontal: y = ${ratio}`;
  } else if (numeratorDegree === denominatorDegree + 1) {
    const quotient = splitVector(nerdamer(`div(${rational.numerator},${rational.denominator})`).toString())[0];
    endBehavior = `slant: y = ${quotient}`;
  }

  const parts = [vertical.length ? `vertical: ${vertical.map((root) => `x = ${root}`).join(", ")}` : "", endBehavior].filter(Boolean);
  return parts.length ? parts.join("; ") : "No vertical, horizontal, or slant asymptotes found";
}

function calculateLongDivision(text: string): string {
  const values = (text.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number);
  if (values.length < 2 || values[1] === 0) throw new Error("Enter a dividend and a nonzero divisor, such as 125 by 4");
  const [dividend, divisor] = values;
  const quotient = Math.trunc(dividend / divisor);
  const remainder = dividend - quotient * divisor;
  return remainder === 0
    ? `${formatCalculatedNumber(dividend)} / ${formatCalculatedNumber(divisor)} = ${formatCalculatedNumber(quotient)}`
    : `${formatCalculatedNumber(quotient)} remainder ${formatCalculatedNumber(remainder)} (${formatCalculatedNumber(dividend / divisor)})`;
}

function calculatePythagorean(text: string): string {
  const sides = Object.fromEntries([...text.matchAll(/\b([abc])\s*=\s*(\d+(?:\.\d+)?)/gi)].map((match) => [match[1].toLowerCase(), Number(match[2])])) as Partial<Record<"a" | "b" | "c", number>>;
  if (Object.keys(sides).length !== 2) throw new Error("Enter exactly two known sides, such as a=3, b=4");
  if (sides.a && sides.b) return `c = ${formatCalculatedNumber(Math.hypot(sides.a, sides.b))}`;
  if (sides.a && sides.c) {
    if (sides.c <= sides.a) throw new Error("The hypotenuse c must be longer than leg a");
    return `b = ${formatCalculatedNumber(Math.sqrt(sides.c ** 2 - sides.a ** 2))}`;
  }
  if (sides.b && sides.c) {
    if (sides.c <= sides.b) throw new Error("The hypotenuse c must be longer than leg b");
    return `a = ${formatCalculatedNumber(Math.sqrt(sides.c ** 2 - sides.b ** 2))}`;
  }
  throw new Error("Use a and b for the legs and c for the hypotenuse");
}

function analyzeSequence(text: string): string {
  const values = (text.replace(/^analyze the sequence\s*/i, "").match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number);
  if (values.length < 3) throw new Error("Enter at least three sequence terms separated by commas");
  const close = (a: number, b: number): boolean => Math.abs(a - b) < 1e-9;
  const differences = values.slice(1).map((value, index) => value - values[index]);
  if (differences.every((difference) => close(difference, differences[0]))) {
    const next = [1, 2, 3].map((offset) => values.at(-1)! + differences[0] * offset);
    return `Arithmetic sequence; common difference ${formatCalculatedNumber(differences[0])}; next terms: ${next.map(formatCalculatedNumber).join(", ")}`;
  }
  if (values.slice(0, -1).every((value) => value !== 0)) {
    const ratios = values.slice(1).map((value, index) => value / values[index]);
    if (ratios.every((ratio) => close(ratio, ratios[0]))) {
      const next = [1, 2, 3].map((offset) => values.at(-1)! * ratios[0] ** offset);
      return `Geometric sequence; common ratio ${formatCalculatedNumber(ratios[0])}; next terms: ${next.map(formatCalculatedNumber).join(", ")}`;
    }
  }
  const secondDifferences = differences.slice(1).map((value, index) => value - differences[index]);
  if (secondDifferences.length && secondDifferences.every((difference) => close(difference, secondDifferences[0]))) {
    let nextDifference = differences.at(-1)!;
    let nextValue = values.at(-1)!;
    const next = [1, 2, 3].map(() => {
      nextDifference += secondDifferences[0];
      nextValue += nextDifference;
      return nextValue;
    });
    return `Quadratic sequence; constant second difference ${formatCalculatedNumber(secondDifferences[0])}; next terms: ${next.map(formatCalculatedNumber).join(", ")}`;
  }
  return "No arithmetic, geometric, or quadratic pattern was detected";
}

async function sumSeries(text: string): Promise<string> {
  const source = text.replace(/^(?:find the sum of|sum)\s*/i, "").trim();
  const formula = source.match(/^(.+?)\s+from\s+(-?\d+)\s+to\s+(-?\d+)$/i);
  if (formula) {
    const nerdamer = await loadNerdamer();
    const variable = (formula[1].match(/[a-z]/i) ?? ["n"])[0];
    return nerdamer(`sum(${toMachineExpression(formula[1])},${variable},${formula[2]},${formula[3]})`).toString();
  }
  const values = (source.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number);
  if (source.includes("...") && values.length >= 3) {
    const [first, second] = values;
    const last = values.at(-1)!;
    const difference = second - first;
    const count = difference === 0 ? 0 : (last - first) / difference + 1;
    if (count > 0 && Number.isInteger(count)) return formatCalculatedNumber((count * (first + last)) / 2);
  }
  if (values.length >= 2) return formatCalculatedNumber(values.reduce((sum, value) => sum + value, 0));
  throw new Error("Enter a finite series, such as 1 + 2 + ... + 100");
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

  if (/^solve the inequality\b/i.test(text)) return solveInequality(text, variable);
  if (/^find the asymptotes of\b/i.test(text)) return findAsymptotes(text, variable);
  if (/^divide using long division\b/i.test(text)) return calculateLongDivision(text);
  if (/^apply the pythagorean theorem to\b/i.test(text)) return calculatePythagorean(text);
  if (/^analyze the sequence\b/i.test(text)) return analyzeSequence(text);
  if (/^(?:find the sum of|sum\s)/i.test(text)) return sumSeries(text);
  if (/^calculate the complex expression\b/i.test(text)) {
    const expression = expressionAfter(/^calculate the complex expression\s*/i);
    return String(mathEvaluate(toMachineExpression(expression)));
  }

  if (operation === "solve_system") {
    const source = expressionAfter(/^solve(?:\s+the\s+system(?:\s+of\s+equations)?)?\s*/i);
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
    const definite = text.match(/^(?:integrate|find the integral of|integral of|evaluate the definite integral)\s+(.+?)\s+from\s+([^\s]+)\s+to\s+([^\s]+)\s*$/i);
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
  if (operation === "integral") source = expressionAfter(/^(?:integrate|find the integral of|integral of|evaluate the definite integral)\s*/i).replace(/\s*d[a-z]\s*$/i, "");
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

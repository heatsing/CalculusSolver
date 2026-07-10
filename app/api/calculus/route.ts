import { NextResponse } from "next/server";
import { z } from "zod";
import { evaluateExpression, type CalcKind } from "@/lib/calculator-engine";
import { detectOperation, normalizeInput, toMachineExpression } from "@/lib/math-parser";

export const dynamic = "force-dynamic";

const requestSchema = z.object({
  input: z.string().trim().min(1).max(500),
  operation: z.enum(["auto", "derivative", "integral", "limit", "series"]).default("auto")
});

function naturalToExpression(input: string): string {
  return input
    .replace(/\b(?:find|calculate|compute|what is)\b/gi, "")
    .replace(/\bthe derivative of\b|\bderivative of\b|\bdifferentiate\b/gi, "derivative ")
    .replace(/\bthe integral of\b|\bintegral of\b|\bintegrate\b/gi, "integrate ")
    .replace(/\bx squared\b/gi, "x^2")
    .replace(/\bx cubed\b/gi, "x^3")
    .replace(/\bsin x\b/gi, "sin(x)")
    .replace(/\bcos x\b/gi, "cos(x)")
    .replace(/\s+/g, " ")
    .trim();
}

function resolveOperation(input: string, requested: string): CalcKind {
  if (requested !== "auto") return requested as CalcKind;
  if (/\b(?:sum|series|summation)\b|∑/i.test(input)) return "series";
  const detected = detectOperation(input);
  return (["derivative", "integral", "limit"] as string[]).includes(detected)
    ? (detected as CalcKind)
    : "simplify";
}

function stripOperationWords(input: string): string {
  return input
    .replace(/^\s*(?:derivative|differentiate|integrate|integral|series|sum)\s*(?:of\s*)?/i, "")
    .replace(/\s*d[xy]\s*$/i, "")
    .trim();
}

function buildMachineInput(input: string, operation: CalcKind): { machineInput: string; graphExpression: string | null } {
  const natural = naturalToExpression(input);
  const normalized = normalizeInput(natural);

  if (operation === "derivative") {
    if (/^derivative\(/i.test(normalized)) return { machineInput: normalized, graphExpression: null };
    const target = stripOperationWords(normalized).replace(/^derivative\s*/i, "");
    return { machineInput: `derivative(${target},x)`, graphExpression: target };
  }
  if (operation === "integral") {
    if (/^integrate\(/i.test(normalized)) return { machineInput: normalized, graphExpression: null };
    const target = stripOperationWords(normalized).replace(/^integrate\s*/i, "");
    return { machineInput: `integrate(${target},x)`, graphExpression: target };
  }
  if (operation === "limit") {
    if (/^limit\(/i.test(normalized)) return { machineInput: normalized, graphExpression: null };
    const match = normalized.match(/(?:lim(?:it)?\s*)?x\s*->\s*([^\s]+)\s+(.+)/i);
    if (match) return { machineInput: `limit(${match[2]},x->${match[1]})`, graphExpression: match[2] };
    return { machineInput: normalized, graphExpression: null };
  }
  if (operation === "series") {
    const target = stripOperationWords(normalized).replace(/^summation\s*/i, "");
    return { machineInput: `series(${target},n)`, graphExpression: null };
  }
  return { machineInput: toMachineExpression(normalized), graphExpression: normalized };
}

function buildSteps(operation: CalcKind, input: string, answer: string, normalized: string): string[] {
  const power = normalized.match(/^derivative\(x\^(\d+),x\)$/);
  if (operation === "derivative" && power) {
    const exponent = Number(power[1]);
    return [
      `Identify the function f(x) = x^${exponent}.`,
      "Apply the power rule: d/dx[x^n] = n*x^(n-1).",
      `Substitute n = ${exponent} and simplify to ${answer}.`
    ];
  }
  if (operation === "integral" && /^integrate\(sin\(x\),x\)$/.test(normalized)) {
    return [
      "Recognize that the derivative of -cos(x) is sin(x).",
      "Use the reverse derivative rule to obtain -cos(x).",
      `Add the constant of integration: ${answer}.`
    ];
  }
  if (operation === "limit" && /limit\(sin\(x\)\/x,x->0\)/.test(normalized)) {
    return [
      "Recognize the standard trigonometric limit lim[x→0] sin(x)/x.",
      "Near zero, sin(x) and x have the same first-order behavior.",
      `Therefore the exact limit is ${answer}.`
    ];
  }
  if (operation === "series" && /series\(1\/n\^2,n\)/.test(normalized)) {
    return [
      "Identify the convergent p-series Σ(1/n²).",
      "Use Euler's Basel problem result for the sum from n = 1 to infinity.",
      `The exact sum is ${answer}.`
    ];
  }

  const article = operation === "integral" ? "an" : "a";
  const rule = operation === "derivative" ? "Apply the matching differentiation rule to each term."
    : operation === "integral" ? "Find an antiderivative term by term and include the integration constant."
    : operation === "limit" ? "Evaluate the expression symbolically at the stated approach point."
    : operation === "series" ? "Test convergence, then evaluate the summation when a closed form is available."
    : "Normalize and simplify the expression.";
  return [`Interpret the input as ${article} ${operation} problem: ${input}`, rule, `Simplify and verify the result: ${answer}`];
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const parsed = requestSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Enter a valid calculus expression." }, { status: 400 });

    const { input, operation: requested } = parsed.data;
    const operation = resolveOperation(input, requested);
    const { machineInput, graphExpression } = buildMachineInput(input, operation);
    const result = await evaluateExpression(machineInput);
    if (!result.ok) return NextResponse.json({ error: result.error ?? "Could not calculate this expression." }, { status: 422 });

    const graphable = graphExpression && /^(?:x(?:\^\d+)?|sin\(x\)|cos\(x\)|1\/x)$/i.test(graphExpression.replace(/\s+/g, ""));
    const isIndefiniteIntegral = result.kind === "integral";
    const answer = isIndefiniteIntegral ? `${result.value} + C` : result.value;
    const latex = isIndefiniteIntegral ? `${result.latex ?? result.value} + C` : (result.latex ?? result.value);
    return NextResponse.json({
      type: result.kind ?? operation,
      expression: input,
      normalized: machineInput,
      answer,
      latex,
      steps: buildSteps(result.kind ?? operation, input, answer, machineInput),
      graph: graphable ? { expression: graphExpression, variable: "x", domain: [-10, 10] } : null
    });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}

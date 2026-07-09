/**
 * calculator-engine.ts — Real evaluation engine for the online calculator.
 *
 * Supports four input shapes produced by the calculator button grid:
 *   1. derivative(expr, var)        -> symbolic derivative (nerdamer)
 *   2. integrate(expr, var)         -> symbolic integral   (nerdamer)
 *   3. limit(expr, var->value)      -> numeric limit estimate (mathjs)
 *   4. plain expression / function  -> numeric value       (mathjs)
 *
 * Fallbacks: when mathjs cannot evaluate an expression (e.g. it contains
 * a free variable), nerdamer is tried for symbolic simplification.
 *
 * nerdamer is loaded lazily (dynamic import) to keep the initial bundle
 * small and to match the pattern used in lib/math-verifier.ts.
 */
import { evaluate, format as mathjsFormat } from "mathjs";
import type nerdamerType from "nerdamer";
import { toMachineExpression, normalizeInput } from "./math-parser";

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

export type CalcKind = "numeric" | "derivative" | "integral" | "limit" | "simplify";

export interface CalcResult {
  ok: boolean;
  kind?: CalcKind;
  /** Human-readable result, e.g. "2*x" or "14" or "≈ 4" */
  value: string;
  /** LaTeX representation of the result (optional, for symbolic results) */
  latex?: string;
  error?: string;
}

/**
 * Extract the inner argument of `fnName(...)`. Returns null if `expr` is not
 * a call to `fnName`.
 */
function extractCallArg(expr: string, fnName: string): string | null {
  const prefix = fnName + "(";
  if (!expr.startsWith(prefix)) return null;
  if (!expr.endsWith(")")) return null;
  return expr.slice(prefix.length, -1);
}

/**
 * Split "target, var" by the LAST comma, so targets containing commas
 * (e.g. `log(x,10)`) are preserved. `var` must be a single letter.
 */
function splitTargetVar(args: string, defaultVar = "x"): { target: string; variable: string } {
  const idx = args.lastIndexOf(",");
  if (idx === -1) return { target: args.trim(), variable: defaultVar };
  const target = args.slice(0, idx).trim();
  const variable = args.slice(idx + 1).trim();
  if (!/^[a-zA-Z]$/.test(variable)) return { target: args.trim(), variable: defaultVar };
  return { target, variable };
}

function formatValue(v: unknown): string {
  if (typeof v === "number") {
    if (Number.isNaN(v)) return "NaN";
    if (!Number.isFinite(v)) return v > 0 ? "∞" : "-∞";
    if (Number.isInteger(v)) return String(v);
    // Trim trailing zeros, keep up to 10 significant digits
    return mathjsFormat(v, { precision: 10 }).replace(/\.?0+$/, "");
  }
  if (typeof v === "boolean") return String(v);
  if (v === null || v === undefined) return "";
  // mathjs may return complex numbers, fractions, units, etc.
  if (typeof v === "object" && v !== null && "toString" in v) {
    return String(v);
  }
  return String(v);
}

function safeToTeX(result: { toString(): string }): string | undefined {
  const anyResult = result as { toTeX?: () => string };
  try {
    return anyResult.toTeX?.();
  } catch {
    return undefined;
  }
}

function errorMessage(e: unknown, fallback: string): string {
  if (e instanceof Error && e.message) {
    // Keep messages short and user-friendly
    const msg = e.message.split("\n")[0].trim();
    return msg || fallback;
  }
  return fallback;
}

/**
 * Evaluate a calculator input string and return a structured result.
 * Always resolves (never throws) — failures are reported via `ok: false`.
 */
export async function evaluateExpression(input: string): Promise<CalcResult> {
  const trimmed = input.trim();
  if (!trimmed) return { ok: false, value: "", error: "Please enter an expression" };

  // Normalize: insert implicit multiplication, convert unicode, strip spaces.
  let expr: string;
  try {
    expr = toMachineExpression(trimmed);
  } catch {
    expr = normalizeInput(trimmed).replace(/\s+/g, "");
  }

  // 1. Derivative: derivative(expr, var)
  const derivArg = extractCallArg(expr, "derivative");
  if (derivArg !== null) {
    try {
      const nerdamer = await loadNerdamer();
      const { target, variable } = splitTargetVar(derivArg, "x");
      const result = nerdamer.diff(target, variable);
      return {
        ok: true,
        kind: "derivative",
        value: result.toString(),
        latex: safeToTeX(result),
      };
    } catch (e) {
      return { ok: false, value: "", error: errorMessage(e, "Could not compute derivative") };
    }
  }

  // 2. Integral: integrate(expr, var)
  const integArg = extractCallArg(expr, "integrate");
  if (integArg !== null) {
    try {
      const nerdamer = await loadNerdamer();
      const { target, variable } = splitTargetVar(integArg, "x");
      const result = nerdamer.integrate(target, variable);
      return {
        ok: true,
        kind: "integral",
        value: result.toString(),
        latex: safeToTeX(result),
      };
    } catch (e) {
      return { ok: false, value: "", error: errorMessage(e, "Could not compute integral") };
    }
  }

  // 3. Limit: limit(expr, var->value)
  const limitArg = extractCallArg(expr, "limit");
  if (limitArg !== null) {
    return evalLimit(limitArg);
  }

  // 4. Plain numeric / function expression
  try {
    const value = evaluate(expr);
    const str = formatValue(value);
    if (str === "" || str === "undefined") {
      return await symbolicSimplify(expr);
    }
    return { ok: true, kind: "numeric", value: str, latex: str };
  } catch {
    // mathjs failed (likely a free variable) — try nerdamer symbolic simplify.
    return await symbolicSimplify(expr);
  }
}

async function symbolicSimplify(expr: string): Promise<CalcResult> {
  try {
    const nerdamer = await loadNerdamer();
    const result = nerdamer(expr);
    return {
      ok: true,
      kind: "simplify",
      value: result.toString(),
      latex: safeToTeX(result),
    };
  } catch (e) {
    return { ok: false, value: "", error: errorMessage(e, "Could not evaluate expression") };
  }
}

function evalLimit(args: string): CalcResult {
  const m = args.match(/^(.+),\s*([a-zA-Z])\s*->\s*(.+)$/);
  if (!m) {
    return {
      ok: false,
      value: "",
      error: "Limit format: limit(expr, x->value)",
    };
  }
  const [, target, variable, valueStr] = m;
  try {
    const val = evaluate(valueStr);
    if (typeof val !== "number" || Number.isNaN(val)) {
      return { ok: false, value: "", error: "Limit target must be a number" };
    }

    // Try direct substitution first.
    try {
      const direct = evaluate(target, { [variable]: val });
      if (typeof direct === "number" && Number.isFinite(direct)) {
        return {
          ok: true,
          kind: "limit",
          value: `≈ ${formatValue(direct)}`,
          latex: formatValue(direct),
        };
      }
    } catch {
      // Direct substitution failed (e.g. 0/0); fall through to estimation.
    }

    // Numeric estimation via left/right approach.
    const eps = 1e-6;
    const left = evaluate(target, { [variable]: val - eps });
    const right = evaluate(target, { [variable]: val + eps });
    if (
      typeof left === "number" &&
      typeof right === "number" &&
      Number.isFinite(left) &&
      Number.isFinite(right)
    ) {
      const avg = (left + right) / 2;
      return {
        ok: true,
        kind: "limit",
        value: `≈ ${formatValue(avg)}`,
        latex: formatValue(avg),
      };
    }

    return {
      ok: false,
      value: "",
      error: "Could not compute this limit — try Solve step-by-step",
    };
  } catch (e) {
    return { ok: false, value: "", error: errorMessage(e, "Could not compute limit") };
  }
}

/** Human-readable label for each result kind, for the result panel. */
export function kindLabel(kind?: CalcKind): string {
  switch (kind) {
    case "derivative":
      return "Derivative";
    case "integral":
      return "Integral";
    case "limit":
      return "Limit";
    case "simplify":
      return "Simplified";
    case "numeric":
      return "Result";
    default:
      return "Result";
  }
}

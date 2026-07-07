import type { SolverResultResponse } from "@/lib/solver-schema";

export function checkResultConsistency(result: SolverResultResponse): string[] {
  const warnings: string[] = [];

  if (result.operation === "graph" && !result.graph.available) {
    warnings.push("Graph operation was requested but graph data is unavailable.");
  }

  if (result.answer.trim().length > 0 && result.answer_latex.trim().length === 0) {
    warnings.push("Answer is provided without LaTeX; plain text will be used for display.");
  }

  const stepNumbers = result.steps.map((step) => step.number);
  if (stepNumbers.length > 1) {
    const sorted = [...stepNumbers].sort((a, b) => a - b);
    for (let i = 0; i < sorted.length; i++) {
      if (sorted[i] !== i + 1) {
        warnings.push("Step numbering is inconsistent; steps will be renumbered for display.");
        break;
      }
    }
  }

  if (result.operation === "integral") {
    const hasBounds = result.machine.lower_bound || result.machine.upper_bound;
    if (!hasBounds) {
      const hasC = /\+\s*C/i.test(result.answer) || /\+\s*C/i.test(result.answer_latex);
      if (!hasC) {
        warnings.push("Indefinite integral answer may be missing the constant of integration (+C).");
      }
    }
  }

  if (result.answer_type === "exact") {
    const approximateMarkers = ["approximately", "≈", "~"];
    if (approximateMarkers.some((marker) => result.answer.includes(marker) || result.answer_latex.includes(marker))) {
      warnings.push("Answer appears approximate but is marked as exact; answer type may need correction.");
    }
  }

  if (result.graph.available && result.graph.expression) {
    const forbidden = /[;=\{\}\[\]]|function\b|\bwhile\b|\bfor\b|\bimport\b|\brequire\b/;
    if (forbidden.test(result.graph.expression)) {
      warnings.push("Graph expression contains unsupported characters and has been disabled.");
      result.graph.available = false;
      result.graph.expression = null;
    }
  }

  return warnings;
}

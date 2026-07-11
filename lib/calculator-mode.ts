export type ApiSolverMode = "auto" | "calculus" | "algebra";

export function toSolverMode(mode: string): ApiSolverMode {
  if (["derivative", "integral", "limit", "gradient", "calculus"].includes(mode)) return "calculus";
  if (["algebra", "factor", "factoring", "equation", "quadratic", "simplify"].includes(mode)) return "algebra";
  return "auto";
}

export function withOperationHint(input: string, hint?: string): string {
  if (!hint || ["auto", "calculus", "algebra"].includes(hint)) return input;
  const lower = input.toLowerCase();
  const existingIntent = ["differentiate", "derivative", "integrate", "integral", "limit", "graph", "plot", "factor", "simplify", "solve", "average", "gradient", "matrix", "percentage", "probability", "root", "log", "lcm"];
  if (existingIntent.some((keyword) => lower.includes(keyword))) return input;

  const prefixes: Record<string, string> = {
    derivative: "Differentiate",
    integral: "Integrate",
    limit: "Evaluate the limit",
    graph: "Graph",
    equation: "Solve",
    quadratic: "Solve",
    factoring: "Factor",
    simplify: "Simplify",
    average: "Calculate the average of",
    exponents: "Evaluate the exponent expression",
    fractions: "Calculate the fraction expression",
    gradient: "Find the gradient of",
    lcm: "Find the least common multiple of",
    logarithms: "Evaluate the logarithm",
    matrix: "Calculate the matrix expression",
    numeric: "Calculate",
    percentage: "Calculate the percentage",
    probability: "Calculate the probability",
    roots: "Calculate the root"
  };
  return prefixes[hint] ? `${prefixes[hint]} ${input}` : input;
}

export type ApiSolverMode = "auto" | "calculus" | "algebra";

export function toSolverMode(mode: string): ApiSolverMode {
  if (["derivative", "integral", "definite-integral", "limit", "asymptote", "gradient", "calculus", "sequence", "series-sum"].includes(mode)) return "calculus";
  if (["algebra", "factor", "factoring", "equation", "quadratic", "simplify", "inequality", "system", "complex"].includes(mode)) return "algebra";
  return "auto";
}

export function withOperationHint(input: string, hint?: string): string {
  if (!hint || ["auto", "calculus", "algebra"].includes(hint)) return input;
  const lower = input.toLowerCase();
  const existingIntent = ["differentiate", "derivative", "integrate", "integral", "limit", "asymptote", "graph", "plot", "factor", "simplify", "solve", "average", "gradient", "matrix", "percentage", "probability", "lcm", "divide", "pythagorean", "sequence", "sum", "complex"];
  if (existingIntent.some((keyword) => lower.includes(keyword))) return input;

  const prefixes: Record<string, string> = {
    derivative: "Differentiate",
    integral: "Integrate",
    "definite-integral": "Evaluate the definite integral",
    limit: "Evaluate the limit",
    asymptote: "Find the asymptotes of",
    graph: "Graph",
    equation: "Solve",
    quadratic: "Solve",
    factoring: "Factor",
    simplify: "Simplify",
    inequality: "Solve the inequality",
    system: "Solve the system",
    complex: "Calculate the complex expression",
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
    roots: "Calculate the root",
    "long-division": "Divide using long division",
    pythagorean: "Apply the Pythagorean theorem to",
    sequence: "Analyze the sequence",
    "series-sum": "Find the sum of"
  };
  return prefixes[hint] ? `${prefixes[hint]} ${input}` : input;
}

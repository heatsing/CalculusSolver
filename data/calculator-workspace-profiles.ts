export type CalculatorWorkspaceKey = {
  label: string;
  value: string;
  tone?: "function" | "operator" | "number" | "special";
  ariaLabel?: string;
  behavior?: "insert" | "replace";
};

export type CalculatorWorkspaceProfile = {
  mode: string;
  label: string;
  inputLabel: string;
  placeholder: string;
  initial: string;
  keys: readonly CalculatorWorkspaceKey[];
  examples: readonly string[];
  parameter?: string;
};

const key = (label: string, value: string, tone: CalculatorWorkspaceKey["tone"] = "function", ariaLabel?: string): CalculatorWorkspaceKey => ({ label, value, tone, ariaLabel });
const exampleKey = (label: string, value: string, ariaLabel: string): CalculatorWorkspaceKey => ({ label, value, tone: "special", ariaLabel, behavior: "replace" });
const algebra = [key("x", "x"), key("y", "y"), key("x²", "x^2"), key("x³", "x^3"), key("xⁿ", "x^"), key("√x", "sqrt("), key("|x|", "abs("), key("(", "("), key(")", ")"), key("=", "=", "special")];
const calculus = [key("x", "x"), key("x²", "x^2"), key("xⁿ", "x^"), key("√x", "sqrt("), key("sin", "sin("), key("cos", "cos("), key("tan", "tan("), key("ln", "ln("), key("eˣ", "e^(", "special"), key("π", "pi"), key("∞", "Infinity"), key("(", "("), key(")", ")")];
const numeric = [
  key("7", "7", "number"), key("8", "8", "number"), key("9", "9", "number"), key("÷", "/", "operator", "Divide"),
  key("4", "4", "number"), key("5", "5", "number"), key("6", "6", "number"), key("×", "*", "operator", "Multiply"),
  key("1", "1", "number"), key("2", "2", "number"), key("3", "3", "number"), key("−", "-", "operator", "Subtract"),
  key("0", "0", "number"), key(".", ".", "number", "Decimal point"), key("+", "+", "operator", "Add")
];

const profiles: Record<string, CalculatorWorkspaceProfile> = {
  algebra: { mode: "algebra", label: "Algebra Solver", inputLabel: "Enter an algebra equation", placeholder: "For example 2*x + 5 = 17", initial: "2*x + 5 = 17", keys: algebra, examples: ["2*x + 5 = 17", "x^2 = 16", "x + y = 5 and x - y = 1"], parameter: "Solve for: x" },
  average: { mode: "average", label: "Average", inputLabel: "Enter numbers separated by commas", placeholder: "For example 4, 8, 12", initial: "4, 8, 12", keys: [key(",", ", ", "special"), exampleKey("mean", "4, 8, 12", "Load a mean example")], examples: ["4, 8, 12", "10, 15, 20, 25", "2.5, 3.5, 5"] },
  derivative: { mode: "derivative", label: "Derivative", inputLabel: "Enter your function", placeholder: "For example x^3 * sin(x)", initial: "x^3 * sin(x)", keys: calculus, examples: ["x^2 + 3*x", "sin(x) * e^x", "ln(x) / x"], parameter: "Variable: x" },
  integral: { mode: "integral", label: "Integral", inputLabel: "Enter an integrand", placeholder: "For example x^2 * cos(x)", initial: "x^2 * cos(x)", keys: calculus, examples: ["sin(x)", "x^2 from 0 to 1", "e^x * cos(x)"], parameter: "Variable: x" },
  "definite-integral": { mode: "definite-integral", label: "Definite Integral", inputLabel: "Enter an integrand and bounds", placeholder: "For example x^2 from 0 to 1", initial: "x^2 from 0 to 1", keys: [...calculus, key("from", " from ", "special"), key("to", " to ", "special")], examples: ["x^2 from 0 to 1", "sin(x) from 0 to pi", "e^x from 0 to 1"], parameter: "Variable: x" },
  limit: { mode: "limit", label: "Limit", inputLabel: "Enter a limit", placeholder: "For example sin(x)/x as x approaches 0", initial: "sin(x)/x as x approaches 0", keys: [...calculus, key("x→0", " as x approaches 0", "special"), key("x→∞", " as x approaches Infinity", "special")], examples: ["sin(x)/x as x approaches 0", "(x^2-1)/(x-1) as x approaches 1", "1/x as x approaches Infinity"], parameter: "Variable: x" },
  asymptote: { mode: "asymptote", label: "Asymptotes", inputLabel: "Enter a rational function", placeholder: "For example (2*x+1)/(x-3)", initial: "(2*x+1)/(x-3)", keys: [...algebra, exampleKey("f(x)", "1/(x-2)", "Load a rational-function example")], examples: ["1/(x-2)", "(2*x+1)/(x-3)", "(x^2+1)/(x-1)"], parameter: "Vertical, horizontal, and slant" },
  gradient: { mode: "gradient", label: "Gradient", inputLabel: "Enter a multivariable function", placeholder: "For example x^2 + y^2", initial: "x^2 + y^2", keys: [...calculus, key("y", "y", "special"), key("z", "z", "special"), exampleKey("∂", "x^2+y^2", "Load a partial-derivative example")], examples: ["x^2 + y^2", "x*y + y^2", "sin(x) * cos(y)"], parameter: "Variables detected automatically" },
  graph: { mode: "graph", label: "Graphing", inputLabel: "Enter a function to plot", placeholder: "For example x^2 - 4*x + 3", initial: "x^2 - 4*x + 3", keys: [...calculus, exampleKey("f(x)", "x^2", "Load a function example")], examples: ["x^2", "sin(x)", "1/x"], parameter: "Variable: x" },
  factoring: { mode: "factoring", label: "Factoring", inputLabel: "Enter a polynomial", placeholder: "For example x^2 - 5*x + 6", initial: "x^2 - 5*x + 6", keys: [...algebra, exampleKey("GCF", "2*x^2+4*x", "Load a greatest-common-factor example"), exampleKey("a²−b²", "x^2-9", "Load a difference-of-squares example")], examples: ["x^2 - 9", "x^2 - 5*x + 6", "2*x^2 + 4*x"] },
  simplify: { mode: "simplify", label: "Simplify", inputLabel: "Enter an expression", placeholder: "For example (x^2 - 1)/(x - 1)", initial: "(x^2 - 1)/(x - 1)", keys: algebra, examples: ["3*x + 2*x - 4", "(x^2 - 1)/(x - 1)", "2*(x + 3) - x"] },
  equation: { mode: "equation", label: "Equation", inputLabel: "Enter an equation", placeholder: "For example 2*x + 5 = 17", initial: "2*x + 5 = 17", keys: algebra, examples: ["2*x + 5 = 17", "x^2 = 16", "3*x - 7 = 2*x + 5"], parameter: "Solve for: x" },
  quadratic: { mode: "equation", label: "Quadratic Formula", inputLabel: "Enter a quadratic equation", placeholder: "For example x^2 - 5*x + 6 = 0", initial: "x^2 - 5*x + 6 = 0", keys: [...algebra, key("a", "a"), key("b", "b"), key("c", "c"), key("Δ", "b^2-4*a*c", "special")], examples: ["x^2 - 5*x + 6 = 0", "x^2 - 9 = 0", "2*x^2 + 3*x - 2 = 0"], parameter: "Solve for: x" },
  inequality: { mode: "inequality", label: "Inequality", inputLabel: "Enter an inequality", placeholder: "For example x^2 - 5*x + 6 <= 0", initial: "x^2 - 5*x + 6 <= 0", keys: [...algebra, key("<", "<", "special"), key("≤", "<=", "special"), key(">", ">", "special"), key("≥", ">=", "special")], examples: ["2*x + 3 < 11", "x^2 - 5*x + 6 <= 0", "x^2 - 4 > 0"], parameter: "Solve for: x" },
  system: { mode: "system", label: "System of Equations", inputLabel: "Enter equations separated by and", placeholder: "For example x + y = 5 and x - y = 1", initial: "x + y = 5 and x - y = 1", keys: [...algebra, key("and", " and ", "special"), key(";", "; ", "special")], examples: ["x + y = 5 and x - y = 1", "2*x + y = 7 and x - y = 2", "x + 2*y = 8 and 3*x - y = 3"], parameter: "Solve for: x, y" },
  logarithms: { mode: "logarithms", label: "Logarithm", inputLabel: "Enter a logarithm", placeholder: "For example log10(1000)", initial: "log10(1000)", keys: [key("log", "log10(", "special"), key("ln", "ln(", "special"), key("logₐ", "log(", "special"), key("e", "e"), key("10ˣ", "10^", "special"), key("(", "("), key(")", ")")], examples: ["log10(1000)", "ln(e^2)", "log(8, 2)"] },
  exponents: { mode: "exponents", label: "Exponential Function", inputLabel: "Enter an exponential expression", placeholder: "For example 2^10", initial: "2^10", keys: [key("x²", "^2"), key("x³", "^3"), key("xⁿ", "^"), key("eˣ", "e^(", "special"), key("10ˣ", "10^", "special"), key("ⁿ√x", "^(1/"), key("(", "("), key(")", ")")], examples: ["2^10", "9^(1/2)", "5^0"] },
  complex: { mode: "complex", label: "Complex Numbers", inputLabel: "Enter a complex-number expression", placeholder: "For example (3+4i)*(2-i)", initial: "(3+4i)*(2-i)", keys: [key("i", "i", "special"), key("|z|", "abs(", "special"), key("conj", "conj(", "special"), key("arg", "arg(", "special"), key("(", "("), key(")", ")")], examples: ["(3+4i)*(2-i)", "(1+i)^4", "abs(3+4i)"] },
  numeric: { mode: "numeric", label: "Scientific Math", inputLabel: "Enter a mathematical expression", placeholder: "For example 2 + 3 * 4", initial: "2 + 3 * 4", keys: calculus, examples: ["2 + 3 * 4", "sqrt(144)", "sin(pi/2)"] },
  fractions: { mode: "fractions", label: "Fraction", inputLabel: "Enter a fraction expression", placeholder: "For example 1/2 + 1/3", initial: "1/2 + 1/3", keys: [key("a/b", "/", "special"), key("mixed", " + ", "special"), key("(", "("), key(")", ")")], examples: ["1/2 + 1/3", "3/4 * 2/5", "7/8 - 1/4"] },
  matrix: { mode: "matrix", label: "Matrix", inputLabel: "Enter a matrix operation", placeholder: "For example det([[1,2],[3,4]])", initial: "det([[1,2],[3,4]])", keys: [key("[", "[", "special"), key("]", "]", "special"), key(",", ","), key("det", "det(", "special"), key("inv", "inv(", "special"), key("T", "transpose(", "special"), key("(", "("), key(")", ")")], examples: ["det([[1,2],[3,4]])", "transpose([[1,2],[3,4]])", "[[1,2],[3,4]] + [[2,0],[1,2]]"] },
  percentage: { mode: "percentage", label: "Percentage", inputLabel: "Enter a percentage problem", placeholder: "For example 15% of 200", initial: "15% of 200", keys: [key("%", "%", "special"), key("of", " of ", "special")], examples: ["15% of 200", "25% of 80", "12.5% of 240"] },
  probability: { mode: "probability", label: "Probability", inputLabel: "Enter favorable and total outcomes", placeholder: "For example 3 out of 10", initial: "3 out of 10", keys: [key("out of", " out of ", "special"), exampleKey("P(A)", "3 out of 10", "Load a probability example")], examples: ["3 out of 10", "1 out of 6", "12 out of 52"] },
  roots: { mode: "roots", label: "Square Root", inputLabel: "Enter a radical expression", placeholder: "For example sqrt(81)", initial: "sqrt(81)", keys: [key("√x", "sqrt(", "special"), key("∛x", "cbrt(", "special"), key("ⁿ√x", "^(1/", "special"), key("x²", "^2"), key("(", "("), key(")", ")")], examples: ["sqrt(81)", "sqrt(144)", "cbrt(27)"] },
  "long-division": { mode: "long-division", label: "Long Division", inputLabel: "Enter dividend and divisor", placeholder: "For example 125 by 4", initial: "125 by 4", keys: [key("by", " by ", "special"), key("÷", " by ", "operator")], examples: ["125 by 4", "987 by 12", "144 by 12"] },
  lcm: { mode: "lcm", label: "Least Common Multiple", inputLabel: "Enter two or more integers", placeholder: "For example 4 and 6", initial: "4 and 6", keys: [key("and", " and ", "special"), key(",", ", ", "special"), exampleKey("LCM", "4 and 6", "Load an LCM example")], examples: ["4 and 6", "12 and 18", "8, 12, 20"] },
  pythagorean: { mode: "pythagorean", label: "Pythagorean Theorem", inputLabel: "Enter two known sides", placeholder: "For example a=3, b=4", initial: "a=3, b=4", keys: [key("a=", "a=", "special"), key("b=", "b=", "special"), key("c=", "c=", "special"), key("a²+b²", "a^2+b^2", "special"), key("√", "sqrt(")], examples: ["a=3, b=4", "a=5, c=13", "b=12, c=15"] },
  sequence: { mode: "sequence", label: "Sequence", inputLabel: "Enter at least three sequence terms", placeholder: "For example 2, 5, 8, 11", initial: "2, 5, 8, 11", keys: [key(",", ", ", "special"), exampleKey("aₙ", "2, 5, 8, 11", "Load an arithmetic sequence"), exampleKey("×r", "3, 6, 12, 24", "Load a geometric sequence")], examples: ["2, 5, 8, 11", "3, 6, 12, 24", "1, 4, 9, 16"] },
  "series-sum": { mode: "series-sum", label: "Sum of Series", inputLabel: "Enter a finite series", placeholder: "For example 1 + 2 + ... + 100", initial: "1 + 2 + ... + 100", keys: [key("Σ", "Sum ", "special"), key("…", "...", "special"), key("from", " from ", "special"), key("to", " to ", "special"), key("n", "n")], examples: ["1 + 2 + ... + 100", "n^2 from 1 to 10", "3, 6, 9, 12, 15"] }
};

export const calculatorWorkspaceModes = Object.keys(profiles);

export function getCalculatorWorkspaceProfile(mode: string, title: string): CalculatorWorkspaceProfile {
  if (mode === "equation" && title.toLowerCase().includes("quadratic")) return profiles.quadratic;
  return profiles[mode] ?? profiles.numeric;
}

export function getCalculatorWorkspaceKeys(profile: CalculatorWorkspaceProfile): CalculatorWorkspaceKey[] {
  const candidates = [...profile.keys, ...numeric];
  return candidates.filter((item, index) => candidates.findIndex((candidate) => candidate.label === item.label && candidate.value === item.value) === index);
}

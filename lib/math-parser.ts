export function normalizeInput(input: string): string {
  return input
    .replace(/\u00B2/g, "^2")
    .replace(/\u00B3/g, "^3")
    .replace(/\u2070/g, "^0")
    .replace(/\u2071/g, "^1")
    .replace(/\u2074/g, "^4")
    .replace(/\u2075/g, "^5")
    .replace(/\u2076/g, "^6")
    .replace(/\u2077/g, "^7")
    .replace(/\u2078/g, "^8")
    .replace(/\u2079/g, "^9")
    .replace(/\u2212/g, "-")
    .replace(/\u222B/g, "integrate")
    .replace(/\u2202/g, "partial_derivative")
    .replace(/\u2211/g, "summation")
    .replace(/\u221A/g, "sqrt")
    .replace(/\u03C0/g, "pi")
    .replace(/\u221E/g, "Infinity")
    .replace(/d\/dx/gi, "derivative")
    .replace(/\u2192/g, "->")
    .replace(/\s+/g, " ")
    .trim();
}

export function toMachineExpression(input: string): string {
  let normalized = normalizeInput(input);

  // Insert explicit multiplication where a number precedes a variable or opening parenthesis.
  // Examples: "2x" -> "2*x", "2(x+1)" -> "2*(x+1)", "3sin(x)" -> "3*sin(x)"
  normalized = normalized.replace(/(\d)([a-zA-Z_(])/g, "$1*$2");
  normalized = normalized.replace(/(\d)(\()/g, "$1*$2");

  // Convert common Unicode math operators.
  normalized = normalized.replace(/\u00D7/g, "*").replace(/\u00F7/g, "/");

  return normalized.replace(/\s+/g, "");
}

const equationKeywords = ["solve", "=", "find x", "find y", "root"];
const integralKeywords = ["integrate", "integral", "int ", "\u222B"];
const derivativeKeywords = ["derivative", "differentiate", "d/dx", "d/dy", "df/dx"];
const limitKeywords = ["limit", "lim ", "evaluate lim", "as x approaches", "->"];
const factorKeywords = ["factor", "factorise"];
const expandKeywords = ["expand"];
const simplifyKeywords = ["simplify", "reduce"];
const graphKeywords = ["graph", "plot", "draw"];

function containsAny(text: string, keywords: string[]): boolean {
  const lower = text.toLowerCase();
  return keywords.some((keyword) => lower.includes(keyword.toLowerCase()));
}

export function detectOperation(input: string): string {
  const normalized = normalizeInput(input).toLowerCase();

  const equationCount = (normalized.match(/=/g) ?? []).length;
  if (equationCount >= 2 && /\b(?:and|with)\b|;/.test(normalized)) return "solve_system";

  if (containsAny(normalized, limitKeywords)) return "limit";
  if (containsAny(normalized, integralKeywords)) return "integral";
  if (containsAny(normalized, derivativeKeywords)) return "derivative";
  if (containsAny(normalized, graphKeywords)) return "graph";
  if (containsAny(normalized, factorKeywords)) return "factor";
  if (containsAny(normalized, expandKeywords)) return "expand";
  if (containsAny(normalized, simplifyKeywords)) return "simplify";
  if (containsAny(normalized, equationKeywords)) return "solve_equation";

  if (normalized.includes("and") && (normalized.includes("x") || normalized.includes("y"))) {
    return "solve_system";
  }

  return "simplify";
}

export function detectPrimaryVariable(input: string): string {
  const normalized = normalizeInput(input)
    .replace(/\b(?:differentiate|derivative|integrate|integral|evaluate|limit|approaches|solve|factor|factorise|expand|simplify|reduce|graph|plot|draw|calculate|average|percentage|probability|matrix|expression|exponent|root|logarithm|least|common|multiple|find|the|of|as)\b/gi, " ")
    .replace(/\b(?:sin|cos|tan|sec|csc|cot|sqrt|log|ln|exp|pi|infinity)\b/gi, " ");
  const preferred = normalized.match(/[xyztqn]/i);
  if (preferred) return preferred[0].toLowerCase();

  const matches = normalized.match(/[a-zA-Z]/g);
  if (!matches) return "x";

  const excluded = new Set(["i", "e", "c"]);
  for (const char of matches) {
    const lower = char.toLowerCase();
    if (!excluded.has(lower)) return lower;
  }
  return "x";
}

export type MathInputLimits = {
  maxLength?: number;
  maxDepth?: number;
  maxOperators?: number;
  maxFunctionCalls?: number;
  maxExponent?: number;
};

const blockedFunctionPattern = /\b(?:import|createUnit|reviver|evaluate|parse|resolve|compile|typed|factory|ones|zeros|identity|sparse|range|combinations|combinationsWithRep|permutations|pickRandom)\s*\(/i;
const controlCharacterPattern = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;

export function validateMathInputComplexity(
  input: string,
  limits: MathInputLimits = {}
): { ok: true } | { ok: false; message: string } {
  const maxLength = limits.maxLength ?? 2000;
  const maxDepth = limits.maxDepth ?? 24;
  const maxOperators = limits.maxOperators ?? 256;
  const maxFunctionCalls = limits.maxFunctionCalls ?? 80;
  const maxExponent = limits.maxExponent ?? 512;

  if (input.length > maxLength) {
    return { ok: false, message: `Expression must be ${maxLength} characters or fewer.` };
  }
  if (controlCharacterPattern.test(input)) {
    return { ok: false, message: "Expression contains unsupported control characters." };
  }
  if (blockedFunctionPattern.test(input)) {
    return { ok: false, message: "Expression contains an unsupported function." };
  }
  if (/\d{129,}/.test(input)) {
    return { ok: false, message: "Numeric literals are too large." };
  }

  const stack: string[] = [];
  let maxObservedDepth = 0;
  for (const character of input) {
    if (character === "(" || character === "[") {
      stack.push(character);
      maxObservedDepth = Math.max(maxObservedDepth, stack.length);
    } else if (character === ")" || character === "]") {
      const expectedOpening = character === ")" ? "(" : "[";
      if (stack.pop() !== expectedOpening) {
        return { ok: false, message: "Expression has unbalanced brackets." };
      }
    }
  }
  if (stack.length !== 0) return { ok: false, message: "Expression has unbalanced brackets." };
  if (maxObservedDepth > maxDepth) {
    return { ok: false, message: "Expression is nested too deeply." };
  }

  const operatorCount = (input.match(/[+*/^%=!-]/g) ?? []).length;
  if (operatorCount > maxOperators) {
    return { ok: false, message: "Expression contains too many operations." };
  }

  const functionCallCount = (input.match(/[A-Za-z][A-Za-z0-9_]*\s*\(/g) ?? []).length;
  if (functionCallCount > maxFunctionCalls) {
    return { ok: false, message: "Expression contains too many function calls." };
  }

  const factorialCount = (input.match(/!/g) ?? []).length;
  if (factorialCount > 8) {
    return { ok: false, message: "Expression contains too many factorial operations." };
  }
  const factorialOperands = [...input.matchAll(/(\d+)\s*!/g)];
  if (factorialOperands.some((match) => Number(match[1]) > 1000)) {
    return { ok: false, message: "Factorial operand is outside the supported range." };
  }

  const numericExponents = [...input.matchAll(/\^\s*\(?\s*(-?\d+)/g)];
  const scientificExponents = [...input.matchAll(/\d(?:\.\d+)?e([+-]?\d+)/gi)];
  if (
    numericExponents.some((match) => Math.abs(Number(match[1])) > maxExponent) ||
    scientificExponents.some((match) => Math.abs(Number(match[1])) > maxExponent)
  ) {
    return { ok: false, message: "Exponent is outside the supported range." };
  }

  if ((input.match(/,/g) ?? []).length > 128) {
    return { ok: false, message: "Expression contains too many values." };
  }

  return { ok: true };
}

export function assertMathInputComplexity(input: string, limits?: MathInputLimits): void {
  const result = validateMathInputComplexity(input, limits);
  if (!result.ok) throw new Error(result.message);
}

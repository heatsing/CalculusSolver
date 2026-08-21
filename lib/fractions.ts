export type SimplifiedFraction = { numerator: number; denominator: number };

export function gcd(a: number, b: number): number {
  let x = Math.abs(Math.trunc(a));
  let y = Math.abs(Math.trunc(b));
  while (y) [x, y] = [y, x % y];
  return x || 1;
}

export function simplifyFraction(numerator: number, denominator: number): SimplifiedFraction {
  if (!Number.isInteger(numerator) || !Number.isInteger(denominator) || denominator === 0) {
    throw new Error("A fraction needs integer values and a non-zero denominator.");
  }
  const sign = denominator < 0 ? -1 : 1;
  const divisor = gcd(numerator, denominator);
  return { numerator: sign * numerator / divisor, denominator: Math.abs(denominator) / divisor };
}

export function fractionToDecimal(numerator: number, denominator: number): number {
  if (denominator === 0) throw new Error("A denominator cannot be zero.");
  return numerator / denominator;
}

export function fractionToPercent(numerator: number, denominator: number): number {
  return fractionToDecimal(numerator, denominator) * 100;
}

export function areFractionsEquivalent(a: number, b: number, c: number, d: number): boolean {
  return b !== 0 && d !== 0 && a * d === b * c;
}

export function generateEquivalentFractions(numerator: number, denominator: number, count = 6): SimplifiedFraction[] {
  if (denominator === 0) throw new Error("A denominator cannot be zero.");
  return Array.from({ length: count }, (_, index) => ({
    numerator: numerator * (index + 2),
    denominator: denominator * (index + 2)
  }));
}

export function hasTerminatingDecimal(numerator: number, denominator: number): boolean {
  let value = simplifyFraction(numerator, denominator).denominator;
  while (value % 2 === 0) value /= 2;
  while (value % 5 === 0) value /= 5;
  return value === 1;
}

export function formatDecimal(value: number, places = 8): string {
  if (Number.isInteger(value)) return String(value);
  return value.toFixed(places).replace(/0+$/, "").replace(/\.$/, "");
}

export function formatFractionDecimal(numerator: number, denominator: number): string {
  const value = fractionToDecimal(numerator, denominator);
  return hasTerminatingDecimal(numerator, denominator)
    ? formatDecimal(value, 12)
    : `${formatDecimal(value, 6)}…`;
}

export function formatPercent(value: number): string {
  return `${formatDecimal(value, 6)}%`;
}

export function toMixedNumber(numerator: number, denominator: number): string {
  const simplified = simplifyFraction(numerator, denominator);
  const whole = Math.trunc(simplified.numerator / simplified.denominator);
  const remainder = Math.abs(simplified.numerator % simplified.denominator);
  if (!remainder) return String(whole);
  if (!whole) return `${simplified.numerator}/${simplified.denominator}`;
  return `${whole} ${remainder}/${simplified.denominator}`;
}

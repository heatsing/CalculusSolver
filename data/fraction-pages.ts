import rawCandidates from "@/data/fraction-page-candidates.json";
import { formatFractionDecimal, formatPercent, fractionToPercent, gcd, simplifyFraction } from "@/lib/fractions";

export type FractionFamily = "percent-decimal" | "equivalent-fractions";
export type FractionPriority = "A" | "B" | "C";

export type FractionCandidate = {
  numerator: number;
  denominator: number;
  simplifiedNumerator: number;
  simplifiedDenominator: number;
  decimal: number;
  percent: number;
  priority: FractionPriority;
  score: number;
  pageFamilies: { equivalentFractions: true; percentDecimal: true };
};

export const fractionCandidates = rawCandidates as FractionCandidate[];

export function percentDecimalSlug(item: Pick<FractionCandidate, "numerator" | "denominator">): string {
  return `${item.numerator}-${item.denominator}-as-a-percent-and-decimal`;
}

export function equivalentFractionSlug(item: Pick<FractionCandidate, "numerator" | "denominator">): string {
  return `what-is-equivalent-to-${item.numerator}-${item.denominator}-fraction`;
}

const bySlug = new Map<string, { family: FractionFamily; candidate: FractionCandidate }>();
for (const candidate of fractionCandidates) {
  bySlug.set(percentDecimalSlug(candidate), { family: "percent-decimal", candidate });
  bySlug.set(equivalentFractionSlug(candidate), { family: "equivalent-fractions", candidate });
}

export function getFractionPage(slug: string): { family: FractionFamily; candidate: FractionCandidate } | undefined {
  return bySlug.get(slug);
}

export function getFractionStaticParams(): { slug: string }[] {
  return [...bySlug.keys()].map((slug) => ({ slug }));
}

export function relatedFractionCandidates(candidate: FractionCandidate, count = 6): FractionCandidate[] {
  const sameDenominator = fractionCandidates.filter((item) =>
    item.denominator === candidate.denominator && item.numerator !== candidate.numerator
  );
  const sameValueNeighborhood = fractionCandidates
    .filter((item) => item !== candidate && item.denominator !== candidate.denominator)
    .sort((a, b) => Math.abs(a.decimal - candidate.decimal) - Math.abs(b.decimal - candidate.decimal));
  return [...sameDenominator, ...sameValueNeighborhood]
    .filter((item, index, items) => items.findIndex((entry) => entry.numerator === item.numerator && entry.denominator === item.denominator) === index)
    .slice(0, count);
}

export function fractionPageMetadata(family: FractionFamily, candidate: FractionCandidate) {
  const { numerator: n, denominator: d } = candidate;
  const fraction = `${n}/${d}`;
  const simplified = simplifyFraction(n, d);
  const decimal = formatFractionDecimal(n, d);
  const percent = formatPercent(fractionToPercent(n, d));
  if (family === "percent-decimal") {
    return {
      title: `${fraction} as a Percent and Decimal | Calculus Solver`,
      description: `Convert ${fraction} to ${percent} and ${decimal}. See the division and percent steps, the simplified fraction, and equivalent fraction examples.`,
      path: `/${percentDecimalSlug(candidate)}`,
      h1: `${fraction} as a Percent and Decimal`
    };
  }
  const first = `${n * 2}/${d * 2}`;
  const reduced = `${simplified.numerator}/${simplified.denominator}`;
  return {
    title: `What Is Equivalent to ${fraction}? Equivalent Fractions`,
    description: `${first} is equivalent to ${fraction}. Learn why with multiplication, cross-products, ${reduced} in simplest form, decimal and percent conversions.`,
    path: `/${equivalentFractionSlug(candidate)}`,
    h1: `What Is Equivalent to ${fraction}?`
  };
}

export function fractionProfile(candidate: FractionCandidate): string {
  const reducible = gcd(candidate.numerator, candidate.denominator) > 1;
  if (candidate.numerator > candidate.denominator) return "improper";
  if (candidate.numerator === candidate.denominator) return "whole";
  if (reducible) return "reducible";
  if (candidate.denominator === 10 || candidate.denominator === 100) return "place-value";
  if (candidate.percent % 5 === 0) return "benchmark";
  return "general";
}

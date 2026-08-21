import { describe, expect, it } from "vitest";
import {
  areFractionsEquivalent,
  formatFractionDecimal,
  fractionToPercent,
  generateEquivalentFractions,
  hasTerminatingDecimal,
  simplifyFraction
} from "@/lib/fractions";
import {
  equivalentFractionSlug,
  fractionCandidates,
  fractionPageMetadata,
  getFractionPage,
  getFractionStaticParams,
  percentDecimalSlug
} from "@/data/fraction-pages";

describe("fraction programmatic SEO engine", () => {
  it("uses one approved inventory for exactly 1,500 static pages", () => {
    expect(fractionCandidates).toHaveLength(750);
    expect(getFractionStaticParams()).toHaveLength(1500);
    expect(new Set(getFractionStaticParams().map((item) => item.slug)).size).toBe(1500);
  });

  it("keeps every generated conversion mathematically correct", () => {
    for (const candidate of fractionCandidates) {
      const simplified = simplifyFraction(candidate.numerator, candidate.denominator);
      expect(simplified).toEqual({ numerator: candidate.simplifiedNumerator, denominator: candidate.simplifiedDenominator });
      expect(fractionToPercent(candidate.numerator, candidate.denominator)).toBeCloseTo(candidate.percent, 8);
      for (const equivalent of generateEquivalentFractions(candidate.numerator, candidate.denominator)) {
        expect(areFractionsEquivalent(candidate.numerator, candidate.denominator, equivalent.numerator, equivalent.denominator)).toBe(true);
      }
      expect(getFractionPage(percentDecimalSlug(candidate))?.candidate).toBe(candidate);
      expect(getFractionPage(equivalentFractionSlug(candidate))?.candidate).toBe(candidate);
    }
  });

  it("handles reduction, repeating decimals, and invalid denominators", () => {
    expect(simplifyFraction(18, 24)).toEqual({ numerator: 3, denominator: 4 });
    expect(formatFractionDecimal(1, 8)).toBe("0.125");
    expect(formatFractionDecimal(1, 3)).toBe("0.333333…");
    expect(hasTerminatingDecimal(3, 12)).toBe(true);
    expect(() => simplifyFraction(1, 0)).toThrow(/denominator/i);
  });

  it("generates unique keyword-focused metadata for both families", () => {
    const titles = new Set<string>();
    const descriptions = new Set<string>();
    for (const candidate of fractionCandidates) {
      for (const family of ["percent-decimal", "equivalent-fractions"] as const) {
        const metadata = fractionPageMetadata(family, candidate);
        expect(metadata.path.startsWith("/")).toBe(true);
        expect(metadata.h1).toContain(`${candidate.numerator}/${candidate.denominator}`);
        expect(titles.has(metadata.title)).toBe(false);
        expect(descriptions.has(metadata.description)).toBe(false);
        titles.add(metadata.title);
        descriptions.add(metadata.description);
      }
    }
  });
});

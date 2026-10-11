import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import {
  equivalentFractionSlug,
  fractionCandidates,
  GENERATE_NEW_THIN_FRACTION_PAGES,
  getFractionStaticParams,
  percentDecimalSlug,
  publishableFractionCandidates
} from "@/data/fraction-pages";
import { frozenInventoryMatches, selectPublishableCandidates } from "@/lib/fraction-page-freeze.mjs";

const publishedKeys = JSON.parse(readFileSync("data/fraction-published-keys.json", "utf8")) as string[];
const rawCandidates = JSON.parse(readFileSync("data/fraction-page-candidates.json", "utf8")) as {
  numerator: number;
  denominator: number;
}[];

const unreleasedCandidate = {
  numerator: 99,
  denominator: 97,
  simplifiedNumerator: 99,
  simplifiedDenominator: 97,
  decimal: 99 / 97,
  percent: (99 / 97) * 100,
  priority: "C" as const,
  score: 1,
  pageFamilies: { equivalentFractions: true as const, percentDecimal: true as const }
};

describe("thin fraction page generation freeze", () => {
  it("keeps new percent and equivalent-fraction routes out of static params and the sitemap", () => {
    expect(GENERATE_NEW_THIN_FRACTION_PAGES).toBe(false);
    expect(frozenInventoryMatches(rawCandidates, publishedKeys)).toBe(true);
    expect(fractionCandidates).toHaveLength(publishedKeys.length);
    expect(getFractionStaticParams()).toHaveLength(publishedKeys.length * 2);

    const published = publishableFractionCandidates([...fractionCandidates, unreleasedCandidate]);
    expect(published.some((candidate) => candidate.numerator === 99 && candidate.denominator === 97)).toBe(false);
    expect(published).toHaveLength(publishedKeys.length);

    const opened = selectPublishableCandidates([...rawCandidates, unreleasedCandidate], publishedKeys, true);
    expect(opened).toHaveLength(publishedKeys.length + 1);
    const closed = selectPublishableCandidates([...rawCandidates, unreleasedCandidate], publishedKeys, false);
    expect(closed.some((candidate) => candidate.numerator === 99 && candidate.denominator === 97)).toBe(false);

    const slugs = new Set(getFractionStaticParams().map((item) => item.slug));
    expect(slugs.has(percentDecimalSlug(unreleasedCandidate))).toBe(false);
    expect(slugs.has(equivalentFractionSlug(unreleasedCandidate))).toBe(false);

    const sitemapPaths = new Set(sitemap().map((entry) => new URL(entry.url).pathname));
    const thinPaths = [...sitemapPaths].filter((pathname) =>
      /^\d+-\d+-as-a-percent-and-decimal$/.test(pathname.slice(1)) || /^what-is-equivalent-to-\d+-\d+-fraction$/.test(pathname.slice(1))
    );
    expect(thinPaths).toHaveLength(publishedKeys.length * 2);
    expect(sitemapPaths.has(`/${percentDecimalSlug(unreleasedCandidate)}`)).toBe(false);
    expect(sitemapPaths.has(`/${equivalentFractionSlug(unreleasedCandidate)}`)).toBe(false);
  });

  it("does not rewrite the frozen inventory when the generator runs", () => {
    const candidatesBefore = readFileSync("data/fraction-page-candidates.json", "utf8");
    const keysBefore = readFileSync("data/fraction-published-keys.json", "utf8");
    const output = execFileSync(process.execPath, ["scripts/generate-fraction-pages.mjs"], { encoding: "utf8" });

    expect(output).toMatch(/generation is stopped/i);
    expect(output).toMatch(/No new pages were written/);
    expect(readFileSync("data/fraction-page-candidates.json", "utf8")).toBe(candidatesBefore);
    expect(readFileSync("data/fraction-published-keys.json", "utf8")).toBe(keysBefore);
  });
});

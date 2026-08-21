import fs from "node:fs";
import path from "node:path";

const targetCount = 750;
const commonDenominators = new Set([2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 25, 50]);
const educationalDenominators = new Set([7, 9, 11, 15, 18, 24, 30, 32, 40, 60]);

function gcd(left, right) {
  let a = Math.abs(left);
  let b = Math.abs(right);
  while (b) [a, b] = [b, a % b];
  return a || 1;
}

function simplified(numerator, denominator) {
  const divisor = gcd(numerator, denominator);
  return [numerator / divisor, denominator / divisor];
}

function terminates(denominator) {
  let value = denominator;
  while (value % 2 === 0) value /= 2;
  while (value % 5 === 0) value /= 5;
  return value === 1;
}

function scoreCandidate(numerator, denominator) {
  const [simpleNumerator, simpleDenominator] = simplified(numerator, denominator);
  const value = numerator / denominator;
  const percent = value * 100;
  let score = 0;
  if (commonDenominators.has(denominator)) score += 36;
  else if (educationalDenominators.has(denominator)) score += 24;
  else if (denominator <= 20) score += 18;
  else if (denominator <= 40) score += 10;
  else score += 5;
  if (numerator === 1) score += 18;
  if (numerator <= 12) score += 14;
  else if (numerator <= 25) score += 8;
  if (value < 1) score += 12;
  else if (value < 2) score += 8;
  else score += 3;
  if (terminates(simpleDenominator)) score += 12;
  if (Number.isInteger(percent)) score += 12;
  else if (Number.isInteger(percent * 10)) score += 7;
  if (gcd(numerator, denominator) > 1) score += 4;
  if ([2, 3, 4, 5, 8, 10].includes(simpleDenominator)) score += 8;
  return score;
}

const pool = [];
for (let denominator = 2; denominator <= 60; denominator += 1) {
  const maxNumerator = Math.min(72, denominator * 2 - 1);
  for (let numerator = 1; numerator <= maxNumerator; numerator += 1) {
    const [simpleNumerator, simpleDenominator] = simplified(numerator, denominator);
    pool.push({ numerator, denominator, simpleNumerator, simpleDenominator, score: scoreCandidate(numerator, denominator) });
  }
}

pool.sort((left, right) => right.score - left.score || left.denominator - right.denominator || left.numerator - right.numerator);
const selected = [];
const simplifiedCounts = new Map();
for (const candidate of pool) {
  const key = `${candidate.simpleNumerator}/${candidate.simpleDenominator}`;
  const currentCount = simplifiedCounts.get(key) ?? 0;
  if (currentCount >= 3) continue;
  selected.push(candidate);
  simplifiedCounts.set(key, currentCount + 1);
  if (selected.length === targetCount) break;
}

if (selected.length !== targetCount) throw new Error(`Expected ${targetCount} candidates, generated ${selected.length}`);

const candidates = selected
  .sort((left, right) => left.denominator - right.denominator || left.numerator - right.numerator)
  .map((item) => ({
    numerator: item.numerator,
    denominator: item.denominator,
    simplifiedNumerator: item.simpleNumerator,
    simplifiedDenominator: item.simpleDenominator,
    decimal: Number((item.numerator / item.denominator).toPrecision(12)),
    percent: Number(((item.numerator / item.denominator) * 100).toPrecision(12)),
    priority: item.score >= 80 ? "A" : item.score >= 60 ? "B" : "C",
    score: item.score,
    pageFamilies: { equivalentFractions: true, percentDecimal: true }
  }));

const dataPath = path.resolve("data/fraction-page-candidates.json");
fs.writeFileSync(dataPath, `${JSON.stringify(candidates, null, 2)}\n`);

const csvRows = [["URL", "Page Family", "Numerator", "Denominator", "Simplified Fraction", "Decimal", "Percent", "Priority", "Indexable", "Canonical", "Related Page"]];
for (const item of candidates) {
  const fraction = `${item.numerator}/${item.denominator}`;
  const equivalentUrl = `/what-is-equivalent-to-${item.numerator}-${item.denominator}-fraction`;
  const conversionUrl = `/${item.numerator}-${item.denominator}-as-a-percent-and-decimal`;
  csvRows.push([equivalentUrl, "Equivalent Fractions", item.numerator, item.denominator, `${item.simplifiedNumerator}/${item.simplifiedDenominator}`, item.decimal, `${item.percent}%`, item.priority, "true", equivalentUrl, conversionUrl]);
  csvRows.push([conversionUrl, "Percent and Decimal", item.numerator, item.denominator, `${item.simplifiedNumerator}/${item.simplifiedDenominator}`, item.decimal, `${item.percent}%`, item.priority, "true", conversionUrl, equivalentUrl]);
}
const csv = csvRows.map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")).join("\n");
fs.writeFileSync(path.resolve("FRACTION-PAGE-INVENTORY.csv"), `${csv}\n`);

const excluded = pool.length - candidates.length;
const grades = candidates.reduce((counts, item) => ({ ...counts, [item.priority]: (counts[item.priority] ?? 0) + 1 }), {});
const audit = `# Fraction Programmatic SEO Audit

## Existing state

Before this expansion, CalcSolver had focused fraction, percentage, and decimal calculators but no dedicated equivalent-fraction or combined percent-and-decimal page families.

## Architecture

- Primary product identity remains scientific calculation, algebra, calculus, and mathematical solving.
- Secondary hubs: \`/equivalent-fractions\` and \`/percent-and-decimal\`.
- ${candidates.length} approved fraction candidates feed both page families.
- Equivalent Fractions pages: ${candidates.length}.
- Percent and Decimal pages: ${candidates.length}.
- Total generated child pages: ${candidates.length * 2}.
- Candidate grades: A=${grades.A ?? 0}, B=${grades.B ?? 0}, C=${grades.C ?? 0}.

## Selection and exclusions

Candidates use denominators 2 through 60, useful proper and modest improper fractions, common school denominators, terminating-decimal value, percentage friendliness, and small-numerator search intent. At most three written forms may share one simplified mathematical value.

${excluded} pool combinations were excluded because they ranked below the quality threshold or would over-represent an already-covered simplified value. Denominator-zero inputs are never candidates.

## Duplicate-intent rules

Each written fraction maps to one combined percent-and-decimal URL and one equivalent-fractions URL. Keyword variants such as “to percent,” “in percent,” and “as a percentage” consolidate to the combined canonical. Equivalent-fraction synonyms consolidate to one canonical equivalent-fractions page.

## Content profiles

Pages adapt to proper, improper, unit, reducible, terminating-decimal, repeating-decimal, round-percentage, and non-round-percentage properties. Direct answers, calculations, tables, FAQs, examples, and related fractions are generated from those properties rather than hardcoded answer prose.

## Metadata, schema, sitemap, and linking

Every child page receives a unique title, description, H1, canonical, WebPage schema, BreadcrumbList, and visible FAQ schema. Only approved inventory pages enter the sitemap. Each family links to its hub, its mathematical counterpart, and a small set of nearby relevant fractions.

## Quality validation

Automated tests validate uniqueness, denominator safety, simplification, decimal and percent correctness, equivalent-fraction equality, reciprocal family links, sitemap inclusion, and representative content-profile variation. The build-time SEO audit verifies generated HTML, metadata, canonicals, schema, internal links, encoding, and minimum server-rendered content.
`;
fs.writeFileSync(path.resolve("FRACTION-PROGRAMMATIC-SEO-AUDIT.md"), audit);

console.log(`Generated ${candidates.length} candidates, ${candidates.length * 2} pages, and excluded ${excluded} lower-priority combinations.`);

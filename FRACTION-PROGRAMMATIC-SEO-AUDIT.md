# Fraction Programmatic SEO Audit

## Existing state

Before this expansion, CalcSolver had focused fraction, percentage, and decimal calculators but no dedicated equivalent-fraction or combined percent-and-decimal page families.

## Architecture

- Primary product identity remains scientific calculation, algebra, calculus, and mathematical solving.
- Secondary hubs: `/equivalent-fractions` and `/percent-and-decimal`.
- 750 approved fraction candidates feed both page families.
- Equivalent Fractions pages: 750.
- Percent and Decimal pages: 750.
- Total generated child pages: 1500.
- Candidate grades: A=127, B=164, C=459.

## Selection and exclusions

Candidates use denominators 2 through 60, useful proper and modest improper fractions, common school denominators, terminating-decimal value, percentage friendliness, and small-numerator search intent. At most three written forms may share one simplified mathematical value.

2273 pool combinations were excluded because they ranked below the quality threshold or would over-represent an already-covered simplified value. Denominator-zero inputs are never candidates.

## Duplicate-intent rules

Each written fraction maps to one combined percent-and-decimal URL and one equivalent-fractions URL. Keyword variants such as “to percent,” “in percent,” and “as a percentage” consolidate to the combined canonical. Equivalent-fraction synonyms consolidate to one canonical equivalent-fractions page.

## Content profiles

Pages adapt to proper, improper, unit, reducible, terminating-decimal, repeating-decimal, round-percentage, and non-round-percentage properties. Direct answers, calculations, tables, FAQs, examples, and related fractions are generated from those properties rather than hardcoded answer prose.

## Metadata, schema, sitemap, and linking

Every child page receives a unique title, description, H1, canonical, WebPage schema, BreadcrumbList, and visible FAQ schema. Only approved inventory pages enter the sitemap. Each family links to its hub, its mathematical counterpart, and a small set of nearby relevant fractions.

## Quality validation

Automated tests validate uniqueness, denominator safety, simplification, decimal and percent correctness, equivalent-fraction equality, reciprocal family links, sitemap inclusion, and representative content-profile variation. The build-time SEO audit verifies generated HTML, metadata, canonicals, schema, internal links, encoding, and minimum server-rendered content.

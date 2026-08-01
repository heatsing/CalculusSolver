# ADR 0001: Programmatic SEO calculator registry

## Status

Accepted on 2026-08-01.

## Context

Calculator routes previously stored metadata, page copy, examples, FAQs, and related links in separate `page.tsx` files. Sitemap links lived in another list. That made it possible to publish a route whose canonical, metadata, structured data, internal links, or sitemap entry did not match its visible content.

## Decision

- `data/calculator-pages.ts` is the public calculator inventory.
- Content sources are normalized into a `CalculatorDefinition` with a slug, category, metadata, H1, calculator mode, worked example, instructions, FAQs, related routes, educational content, update date, and SEO quality score.
- `app/(calculator-pages)/[slug]/page.tsx` creates the existing root-level calculator URLs with `generateStaticParams()` and `generateMetadata()`.
- The same inventory drives sitemap entries and the calculator directory.
- Calculator pages emit server-rendered WebPage, WebApplication, BreadcrumbList, and FAQPage JSON-LD that describes visible page content.
- A page scoring below the B threshold is marked non-indexable and omitted from the sitemap until its content is improved.
- `npm run seo:check` validates source data and generated HTML before deployment.

## Helpful-content requirements

Every new calculator must provide more than a keyword-swapped template:

1. A precise search intent and supported problem scope.
2. A usable calculator above the educational sections.
3. A representative mathematical example.
4. Three operation-specific usage steps.
5. Input guidance and operation-specific mistakes.
6. At least two visible, accurate FAQs.
7. At least three contextual internal links.
8. Accurate answers verified by the solver test suite.

Do not invent ratings, reviews, authors, update dates, or capabilities for structured data. Schema must match content visible on the page.

## Adding a calculator

1. Add its complete definition to the calculator content data.
2. Add its route to the appropriate category mapping.
3. Add a supported solver mode and a verified default example.
4. Run `npm run seo:check` and the calculator Playwright suite.

No new route file, sitemap edit, metadata function, or manual “More Calculators” edit should be necessary.

import { coreCalculatorPages } from "@/data/core-calculator-pages";
import { specializedCalculatorPages } from "@/data/specialized-calculator-pages";
import type { CalculatorDefinitionSource } from "@/data/calculator-page-types";
import { calculatorQualityContent, type CalculatorQualityContent, type LearningLink } from "@/data/calculator-quality-content";

export const calculatorCategories = ["Calculus", "Algebra", "Everyday Math", "Geometry and Sequences"] as const;
export type CalculatorCategory = (typeof calculatorCategories)[number];

export type CalculatorEducationalContent = {
  concept: string;
  useCases: readonly string[];
  inputTips: readonly string[];
  commonMistakes: readonly string[];
};

export type CalculatorDefinition = CalculatorDefinitionSource & {
  slug: string;
  type: "calculator";
  category: CalculatorCategory;
  updatedAt: string;
  seoScore: number;
  seoGrade: "A" | "B" | "C";
  indexable: boolean;
  indexReason: string;
  educationalContent: CalculatorEducationalContent;
  qualityContent?: CalculatorQualityContent;
  learningLinks: readonly LearningLink[];
  relatedSlugs: readonly string[];
};

const categoryRoutes: Record<CalculatorCategory, readonly string[]> = {
  Calculus: [
    "derivative-calculator", "integral-calculator", "definite-integral-calculator", "limit-calculator",
    "asymptote-calculator", "gradient-calculator", "graphing-calculator"
  ],
  Algebra: [
    "algebra-solver", "equation-solver", "quadratic-solver", "factoring-calculator", "simplify-calculator",
    "inequality-calculator", "system-of-equations-calculator", "log-calculator", "exponent-calculator",
    "complex-numbers-calculator"
  ],
  "Everyday Math": [
    "math-calculator", "fraction-calculator", "matrix-calculator", "average-calculator", "percentage-calculator",
    "probability-calculator", "root-calculator", "long-division-calculator", "lcm-calculator"
  ],
  "Geometry and Sequences": ["pythagorean-theorem-calculator", "sequence-calculator", "sum-of-series-calculator"]
};

const commonMistakesByMode: Record<string, readonly [string, string]> = {
  algebra: ["Changing one side of an equation without applying the same operation to the other side.", "Accepting a transformed answer without checking it in the original problem."],
  asymptote: ["Treating a removable hole as a vertical asymptote.", "Using only leading coefficients without first comparing polynomial degrees."],
  average: ["Dividing by the wrong number of data values.", "Confusing the arithmetic mean with the median or mode."],
  complex: ["Using the real-number rule for the square root of a negative value.", "Forgetting that i squared equals -1 when multiplying complex numbers."],
  "definite-integral": ["Adding +C to a bounded integral result.", "Reversing the upper and lower endpoint subtraction."],
  derivative: ["Applying the power rule to a product without the product rule.", "Forgetting the inner derivative when using the chain rule."],
  equation: ["Dividing by an expression that may be zero.", "Keeping extraneous roots introduced by squaring or clearing denominators."],
  exponents: ["Applying an exponent to only one factor inside parentheses.", "Treating a negative exponent as a negative value instead of a reciprocal."],
  factoring: ["Skipping the greatest common factor before looking for another pattern.", "Stopping before checking the factors by expanding them."],
  fractions: ["Adding denominators instead of finding a common denominator.", "Canceling terms across addition rather than canceling common factors."],
  gradient: ["Differentiating every variable instead of holding the others constant.", "Returning a scalar when the requested gradient is a vector."],
  graph: ["Ignoring domain restrictions and discontinuities.", "Using a viewing window that hides intercepts or end behavior."],
  inequality: ["Forgetting to reverse the inequality after multiplying or dividing by a negative number.", "Including an endpoint when the inequality is strict."],
  integral: ["Forgetting the constant of integration for an indefinite integral.", "Using a substitution without transforming the differential."],
  lcm: ["Multiplying the inputs without removing shared prime factors.", "Confusing the least common multiple with the greatest common factor."],
  logarithms: ["Taking a real logarithm of zero or a negative number.", "Using a logarithm base of 1 or a non-positive base."],
  "long-division": ["Dividing by zero.", "Dropping place-value zeros in the quotient."],
  matrix: ["Multiplying matrix entries position by position.", "Trying to invert a non-square or singular matrix."],
  numeric: ["Ignoring parentheses and the order of operations.", "Mixing degrees and radians in trigonometric expressions."],
  percentage: ["Using the new value instead of the original value as the percentage-change denominator.", "Entering 15 when the expression expects the decimal 0.15."],
  probability: ["Adding probabilities for events that are not mutually exclusive.", "Multiplying dependent-event probabilities without a conditional probability."],
  pythagorean: ["Using the theorem for a triangle that is not right-angled.", "Treating a leg as the hypotenuse when rearranging the formula."],
  roots: ["Assuming an even root of a negative number is real.", "Forgetting both signs when solving an equation such as x squared equals 9."],
  sequence: ["Assuming a pattern from too few terms.", "Confusing a sequence of terms with the sum of those terms."],
  "series-sum": ["Using an infinite-series formula when the convergence condition fails.", "Miscounting the number of terms in a finite arithmetic series."],
  simplify: ["Canceling terms that are joined by addition.", "Dropping restrictions from the original denominator."],
  system: ["Combining equations without matching coefficients correctly.", "Reporting one variable without substituting back to find and verify the other." ]
};

const specializedByRoute: Record<string, CalculatorDefinitionSource> = Object.fromEntries(
  Object.values(specializedCalculatorPages).map((definition) => [definition.metadata.path.slice(1), definition])
);

const sourceByRoute: Record<string, CalculatorDefinitionSource> = {
  ...coreCalculatorPages,
  ...specializedByRoute
};

function categoryFor(slug: string): CalculatorCategory {
  const category = calculatorCategories.find((item) => categoryRoutes[item].includes(slug));
  if (!category) throw new Error(`Calculator category is missing for ${slug}`);
  return category;
}

function fallbackRelatedSlugs(slug: string, category: CalculatorCategory): string[] {
  const sameTopic = categoryRoutes[category].filter((item) => item !== slug);
  const crossTopic = ["algebra-solver", "equation-solver", "derivative-calculator", "integral-calculator", "math-calculator"]
    .filter((item) => item !== slug && !sameTopic.includes(item));
  return [...sameTopic, ...crossTopic].slice(0, 4);
}

function buildEducationalContent(source: CalculatorDefinitionSource): CalculatorEducationalContent {
  const mistakes = commonMistakesByMode[source.page.mode] ?? [
    "Entering ambiguous notation without parentheses.",
    "Using a final result without checking that it matches the original problem."
  ];
  return {
    concept: source.page.subtitle,
    useCases: source.page.howItWorks.map((item) => item.description),
    inputTips: [source.page.howItWorks[0]?.description ?? "Enter a complete mathematical expression.", source.page.faqs[0]?.answer ?? "Use parentheses to make the intended order clear."],
    commonMistakes: mistakes
  };
}

const supportingCalculusSlugs = new Set(["sequence-calculator", "sum-of-series-calculator"]);

function hasPrimaryTopicFit(slug: string, category: CalculatorCategory): boolean {
  return category === "Calculus" || category === "Algebra" || supportingCalculusSlugs.has(slug);
}

const supportingLearningLinks: Readonly<Record<string, readonly LearningLink[]>> = {
  "complex-numbers-calculator": [{ label: "Solving equations guide", href: "/guides/solving-equations" }, { label: "Algebra examples", href: "/examples" }, { label: "Algebra Solver", href: "/algebra-solver" }],
  "exponent-calculator": [{ label: "Simplifying expressions guide", href: "/guides/simplifying-expressions" }, { label: "Algebra examples", href: "/examples" }, { label: "Algebra Solver", href: "/algebra-solver" }],
  "inequality-calculator": [{ label: "Solving equations guide", href: "/guides/solving-equations" }, { label: "Linear equation example", href: "/examples/linear-equation" }, { label: "Algebra Solver", href: "/algebra-solver" }],
  "log-calculator": [{ label: "Simplifying expressions guide", href: "/guides/simplifying-expressions" }, { label: "Limits guide", href: "/guides/understanding-limits" }, { label: "Algebra Solver", href: "/algebra-solver" }],
  "sequence-calculator": [{ label: "Series and sequences guide", href: "/guides/series-and-sequences" }, { label: "Daily Calculus Challenge", href: "/daily-challenge" }, { label: "Sum of Series Calculator", href: "/sum-of-series-calculator" }],
  "sum-of-series-calculator": [{ label: "Series and sequences guide", href: "/guides/series-and-sequences" }, { label: "Integration basics guide", href: "/guides/integration-basics" }, { label: "Sequence Calculator", href: "/sequence-calculator" }],
  "system-of-equations-calculator": [{ label: "Solving equations guide", href: "/guides/solving-equations" }, { label: "System example", href: "/examples/system-equations" }, { label: "Algebra Solver", href: "/algebra-solver" }]
};

function scoreDefinition(
  slug: string,
  category: CalculatorCategory,
  source: CalculatorDefinitionSource,
  relatedSlugs: readonly string[],
  content: CalculatorEducationalContent,
  qualityContent?: CalculatorQualityContent
): number {
  let score = 0;
  if (source.metadata.title.length >= 30 && source.metadata.title.length <= 75) score += 5;
  if (source.metadata.description.length >= 70 && source.metadata.description.length <= 180) score += 5;
  if (source.page.h1 && source.page.subtitle.length >= 55) score += 5;
  if (hasPrimaryTopicFit(slug, category)) score += 30;
  if (source.page.howItWorks.length >= 3) score += 5;
  if (source.page.faqs.length >= 2) score += 5;
  if (content.commonMistakes.length >= 2 && content.inputTips.length >= 2) score += 10;
  if (relatedSlugs.length >= 3) score += 5;
  if (qualityContent?.searchIntent && qualityContent.methodOverview) score += 5;
  if ((qualityContent?.supportedProblems.length ?? 0) >= 3 && (qualityContent?.limitations.length ?? 0) >= 2) score += 5;
  if ((qualityContent?.workedExamples.length ?? 0) >= 3) score += 15;
  if ((qualityContent?.relatedLearning.length ?? 0) >= 3 && (qualityContent?.additionalFaqs.length ?? 0) >= 2) score += 5;
  return score;
}

export const calculatorPages: readonly CalculatorDefinition[] = Object.entries(sourceByRoute)
  .map(([slug, source]) => {
    const category = categoryFor(slug);
    const explicitRelated = source.page.relatedTools
      .map((tool) => tool.href.replace(/^\//, ""))
      .filter((relatedSlug) => relatedSlug !== slug && relatedSlug in sourceByRoute);
    const relatedSlugs = [...new Set([...explicitRelated, ...fallbackRelatedSlugs(slug, category)])].slice(0, 5);
    const educationalContent = buildEducationalContent(source);
    const qualityContent = calculatorQualityContent[slug];
    const learningLinks = qualityContent?.relatedLearning ?? supportingLearningLinks[slug] ?? [];
    const seoScore = scoreDefinition(slug, category, source, relatedSlugs, educationalContent, qualityContent);
    const seoGrade: CalculatorDefinition["seoGrade"] = seoScore >= 85 ? "A" : seoScore >= 70 ? "B" : "C";
    const indexable = seoGrade !== "C";
    return {
      ...source,
      page: {
        ...source.page,
        faqs: [...source.page.faqs, ...(qualityContent?.additionalFaqs ?? [])],
        relatedTools: relatedSlugs.map((relatedSlug) => ({
          label: sourceByRoute[relatedSlug].page.title,
          href: `/${relatedSlug}`
        }))
      },
      slug,
      type: "calculator" as const,
      category,
      updatedAt: qualityContent ? "2026-08-10" : "2026-08-01",
      seoScore,
      seoGrade,
      indexable,
      indexReason: indexable
        ? qualityContent
          ? "Primary-topic page with calculator-specific worked examples and learning links."
          : "Primary-topic page retained for index monitoring while deeper content is developed."
        : "Supporting utility outside the site's primary calculus and algebra focus; URL and functionality are retained.",
      educationalContent,
      qualityContent,
      learningLinks,
      relatedSlugs
    };
  })
  .sort((a, b) => a.slug.localeCompare(b.slug));

export function getCalculatorPage(slug: string): CalculatorDefinition | undefined {
  return calculatorPages.find((calculator) => calculator.slug === slug);
}

export function getCalculatorPagesByCategory(category: CalculatorCategory): readonly CalculatorDefinition[] {
  return calculatorPages.filter((calculator) => calculator.category === category);
}

export function getCalculatorStaticParams(): { slug: string }[] {
  return calculatorPages.map((calculator) => ({ slug: calculator.slug }));
}

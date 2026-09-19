import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import { calculatorPages, getCalculatorPage, getCalculatorStaticParams } from "@/data/calculator-pages";
import { exampleDetails, getExampleStaticParams } from "@/data/example-details";
import { equivalentFractionSlug, fractionCandidates, getFractionStaticParams, percentDecimalSlug } from "@/data/fraction-pages";
import {
  breadcrumbStructuredData,
  calculatorApplicationStructuredData,
  mathSolverStructuredData,
  serializeJsonLd,
  webPageStructuredData
} from "@/lib/seo";

describe("programmatic SEO architecture", () => {
  it("uses a complete and unique calculator inventory", () => {
    expect(calculatorPages).toHaveLength(29);
    expect(new Set(calculatorPages.map((item) => item.slug)).size).toBe(calculatorPages.length);
    expect(new Set(calculatorPages.map((item) => item.metadata.path)).size).toBe(calculatorPages.length);
    expect(new Set(calculatorPages.map((item) => item.metadata.title)).size).toBe(calculatorPages.length);
    expect(new Set(calculatorPages.map((item) => item.metadata.description)).size).toBe(calculatorPages.length);

    for (const calculator of calculatorPages) {
      expect(calculator.metadata.path).toBe(`/${calculator.slug}`);
      expect(calculator.page.path).toBe(calculator.metadata.path);
      expect(calculator.page.h1).toBeTruthy();
      expect(calculator.page.howItWorks).toHaveLength(3);
      expect(calculator.page.faqs.length).toBeGreaterThanOrEqual(2);
      expect(calculator.educationalContent.commonMistakes).toHaveLength(2);
      expect(calculator.relatedSlugs.length).toBeGreaterThanOrEqual(3);
      expect(calculator.seoScore).toBeGreaterThanOrEqual(0);
      expect(calculator.seoScore).toBeLessThanOrEqual(100);
      expect(calculator.indexable).toBe(calculator.seoGrade !== "C");
      expect(getCalculatorPage(calculator.slug)).toBe(calculator);
      if (calculator.seoGrade === "A") {
        expect(calculator.qualityContent?.workedExamples.length).toBeGreaterThanOrEqual(3);
        expect(calculator.page.faqs.length).toBeGreaterThanOrEqual(4);
      }
      if (calculator.indexable) expect(calculator.learningLinks.length).toBeGreaterThanOrEqual(3);
      for (const relatedSlug of calculator.relatedSlugs) {
        expect(relatedSlug).not.toBe(calculator.slug);
        expect(getCalculatorPage(relatedSlug)).toBeTruthy();
      }
    }
    expect(calculatorPages.filter((item) => item.seoGrade === "A").length).toBeGreaterThanOrEqual(10);
    expect(calculatorPages.filter((item) => item.seoGrade === "B").length).toBeGreaterThanOrEqual(1);
    expect(calculatorPages.filter((item) => item.seoGrade === "C").length).toBeGreaterThanOrEqual(1);
  });

  it("keeps sitemap and indexable route inventory aligned", () => {
    const sitemapPaths = new Set(sitemap().map((entry) => new URL(entry.url).pathname));
    expect(new Set(getCalculatorStaticParams().map((item) => item.slug))).toEqual(new Set(calculatorPages.map((item) => item.slug)));
    expect(new Set(getExampleStaticParams().map((item) => item.slug))).toEqual(new Set(exampleDetails.map((item) => item.slug)));
    for (const calculator of calculatorPages.filter((item) => item.indexable)) {
      expect(sitemapPaths.has(`/${calculator.slug}`)).toBe(true);
    }
    for (const calculator of calculatorPages.filter((item) => !item.indexable)) {
      expect(sitemapPaths.has(`/${calculator.slug}`)).toBe(false);
    }
    for (const example of exampleDetails) {
      expect(sitemapPaths.has(`/examples/${example.slug}`)).toBe(true);
    }
    expect(sitemapPaths.has("/calculus-calculator")).toBe(true);
    expect(sitemapPaths.has("/daily-challenge")).toBe(true);
    expect(sitemapPaths.has("/percent-and-decimal")).toBe(true);
    expect(sitemapPaths.has("/equivalent-fractions")).toBe(true);
    expect(getFractionStaticParams()).toHaveLength(1500);
    for (const candidate of fractionCandidates) {
      expect(sitemapPaths.has(`/${percentDecimalSlug(candidate)}`)).toBe(true);
      expect(sitemapPaths.has(`/${equivalentFractionSlug(candidate)}`)).toBe(true);
    }
    expect(sitemapPaths.has("/contact")).toBe(false);
    expect(sitemapPaths.has("/privacy")).toBe(false);
    expect(sitemapPaths.has("/terms")).toBe(false);
  });

  it("leads the derivative calculator title with the primary query", () => {
    const derivative = getCalculatorPage("derivative-calculator");
    expect(derivative).toBeTruthy();
    if (!derivative) return;

    expect(derivative.metadata.title.startsWith("Derivative Calculator")).toBe(true);
    expect(derivative.metadata.title.toLowerCase().startsWith("calculus solver")).toBe(false);
    expect(derivative.metadata.description.toLowerCase()).toContain("find the derivative");
    expect(derivative.metadata.description.toLowerCase()).toContain("step-by-step differentiation");
    expect(derivative.page.h1.toLowerCase()).toContain("derivative calculator");
    expect(derivative.page.heroRelatedTools?.map((tool) => tool.href)).toEqual([
      "/integral-calculator",
      "/definite-integral-calculator",
      "/limit-calculator",
      "/calculus-calculator"
    ]);
    expect(derivative.page.relatedTools.map((tool) => tool.href)).toEqual(
      expect.arrayContaining(["/integral-calculator", "/definite-integral-calculator", "/limit-calculator"])
    );
    expect(derivative.learningLinks.map((link) => link.href)).toContain("/calculus-calculator");
  });

  it("generates parseable, route-consistent structured data", () => {
    const sample = calculatorPages.find((item) => item.slug === "derivative-calculator");
    expect(sample).toBeTruthy();
    if (!sample) return;

    const schemas = [
      mathSolverStructuredData(),
      webPageStructuredData({ name: sample.page.h1, description: sample.metadata.description, path: sample.page.path }),
      calculatorApplicationStructuredData({ name: sample.page.title, description: sample.metadata.description, path: sample.page.path, category: sample.category, features: sample.page.howItWorks.map((item) => item.description) }),
      breadcrumbStructuredData([{ name: "Home", path: "/" }, { name: sample.page.h1, path: sample.page.path }])
    ];

    for (const schema of schemas) {
      expect(() => JSON.parse(serializeJsonLd(schema))).not.toThrow();
    }
    expect((schemas[0] as { potentialAction: { "mathExpression-input": string } }).potentialAction["mathExpression-input"]).toBe("required name=math_expression_string");
  });

  it("contains no common encoding-corruption markers in generated content", () => {
    const roots = ["app", "components", "data", "lib"];
    const sourceFiles: string[] = [];
    const walk = (directory: string): void => {
      for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
        const fullPath = path.join(directory, entry.name);
        if (entry.isDirectory()) walk(fullPath);
        else if (/\.(ts|tsx)$/.test(entry.name)) sourceFiles.push(fullPath);
      }
    };
    roots.forEach(walk);
    const corrupted = sourceFiles.filter((file) => /\uFFFD|Ã|Â|脳|鈥|馃/.test(fs.readFileSync(file, "utf8")));
    expect(corrupted).toEqual([]);
  });
});

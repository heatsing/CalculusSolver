import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import { calculatorPages, getCalculatorPage } from "@/data/calculator-pages";
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
      expect(calculator.seoScore).toBeGreaterThanOrEqual(70);
      expect(calculator.indexable).toBe(true);
      expect(getCalculatorPage(calculator.slug)).toBe(calculator);
      for (const relatedSlug of calculator.relatedSlugs) {
        expect(relatedSlug).not.toBe(calculator.slug);
        expect(getCalculatorPage(relatedSlug)).toBeTruthy();
      }
    }
  });

  it("keeps sitemap and indexable route inventory aligned", () => {
    const sitemapPaths = new Set(sitemap().map((entry) => new URL(entry.url).pathname));
    for (const calculator of calculatorPages.filter((item) => item.indexable)) {
      expect(sitemapPaths.has(`/${calculator.slug}`)).toBe(true);
    }
    expect(sitemapPaths.has("/calculus-calculator")).toBe(true);
    expect(sitemapPaths.has("/daily-challenge")).toBe(true);
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

import type { MetadataRoute } from "next";
import { calculatorPages } from "@/data/calculator-pages";
import { guides } from "@/data/guides";
import { exampleDetails } from "@/data/example-details";
import { equivalentFractionSlug, fractionCandidates, percentDecimalSlug } from "@/data/fraction-pages";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://calculussolver.net";
  const coreRoutes = ["/", "/calculus-calculator", "/daily-challenge", "/examples", "/calculators", "/guides", "/about", "/percent-and-decimal", "/equivalent-fractions"];
  const coreEntries: MetadataRoute.Sitemap = coreRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: route === "/daily-challenge" ? new Date() : new Date("2026-08-10"),
    changeFrequency: route === "/daily-challenge" ? "daily" : "weekly",
    priority: route === "/" ? 1 : route === "/daily-challenge" ? 0.9 : 0.8
  }));
  const calculatorEntries: MetadataRoute.Sitemap = calculatorPages
    .filter((calculator) => calculator.indexable)
    .map((calculator) => ({
      url: `${baseUrl}/${calculator.slug}`,
      lastModified: new Date(calculator.updatedAt),
      changeFrequency: "weekly",
      priority: calculator.seoGrade === "A" ? 0.9 : 0.8
    }));
  const guideEntries: MetadataRoute.Sitemap = guides.map((guide) => ({
    url: `${baseUrl}/guides/${guide.slug}`,
    lastModified: new Date(guide.updatedAt),
    changeFrequency: "monthly",
    priority: 0.8
  }));
  const exampleEntries: MetadataRoute.Sitemap = exampleDetails.map((example) => ({
    url: `${baseUrl}/examples/${example.slug}`,
    lastModified: new Date(example.updatedAt),
    changeFrequency: "monthly",
    priority: 0.8
  }));

  const fractionEntries: MetadataRoute.Sitemap = fractionCandidates.flatMap((candidate) => [
    {
      url: `${baseUrl}/${percentDecimalSlug(candidate)}`,
      lastModified: new Date("2026-08-22"),
      changeFrequency: "monthly" as const,
      priority: candidate.priority === "A" ? 0.75 : 0.65
    },
    {
      url: `${baseUrl}/${equivalentFractionSlug(candidate)}`,
      lastModified: new Date("2026-08-22"),
      changeFrequency: "monthly" as const,
      priority: candidate.priority === "A" ? 0.75 : 0.65
    }
  ]);

  return [...coreEntries, ...calculatorEntries, ...guideEntries, ...exampleEntries, ...fractionEntries];
}

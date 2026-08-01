import type { MetadataRoute } from "next";
import { calculatorPages } from "@/data/calculator-pages";
import { guides } from "@/data/guides";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://calculussolver.net";
  const stableUpdatedAt = "2026-08-01";
  const coreRoutes = ["/", "/calculus-calculator", "/daily-challenge", "/examples", "/calculators", "/guides", "/about", "/contact", "/privacy", "/terms"];
  const coreEntries: MetadataRoute.Sitemap = coreRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(stableUpdatedAt),
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

  return [...coreEntries, ...calculatorEntries, ...guideEntries];
}

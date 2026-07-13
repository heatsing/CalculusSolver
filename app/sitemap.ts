import type { MetadataRoute } from "next";
import { allCalculatorTools } from "@/data/calculator-tools";
import { guides } from "@/data/guides";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://calculussolver.net";
  const routes = [
    "/",
    "/calculus-solver",
    "/algebra-solver",
    "/calculus-calculator",
    "/daily-challenge",
    ...allCalculatorTools.map((tool) => tool.href),
    "/examples",
    "/calculators",
    "/guides",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
    ...guides.map((guide) => `/guides/${guide.slug}`)
  ];

  return [...new Set(routes)].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "/" ? 1 : 0.8
  }));
}

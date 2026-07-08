import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://calculussolver.net";
  const routes = [
    "/",
    "/calculus-solver",
    "/algebra-solver",
    "/derivative-calculator",
    "/integral-calculator",
    "/limit-calculator",
    "/equation-solver",
    "/quadratic-solver",
    "/factoring-calculator",
    "/examples",
    "/privacy",
    "/terms"
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "/" ? 1 : 0.8
  }));
}

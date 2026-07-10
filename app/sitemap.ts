import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://calculussolver.net";
  const routes = [
    "/",
    "/calculus-solver",
    "/algebra-solver",
    "/calculus-calculator",
    "/daily-challenge",
    "/derivative-calculator",
    "/integral-calculator",
    "/limit-calculator",
    "/equation-solver",
    "/quadratic-solver",
    "/factoring-calculator",
    "/graphing-calculator",
    "/fraction-calculator",
    "/matrix-calculator",
    "/average-calculator",
    "/exponent-calculator",
    "/gradient-calculator",
    "/lcm-calculator",
    "/log-calculator",
    "/math-calculator",
    "/percentage-calculator",
    "/probability-calculator",
    "/root-calculator",
    "/simplify-calculator",
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

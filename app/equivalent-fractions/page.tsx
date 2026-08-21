import type { Metadata } from "next";
import { FractionHubPage } from "@/components/fractions/fraction-hub-page";
import { StructuredData } from "@/components/seo/structured-data";
import { breadcrumbStructuredData, collectionPageStructuredData, webPageStructuredData, createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({ title: "Equivalent Fractions Calculator and Guides | Calculus Solver", description: "Find equivalent fractions, simplify fractions, compare ratios, and verify every result with worked multiplication and cross-product steps.", path: "/equivalent-fractions", keywords: ["equivalent fractions", "equivalent fractions calculator", "fraction equivalents"] });

export default function EquivalentFractionsPage(): React.JSX.Element {
  const description = "Find equivalent fractions, simplify fractions, compare ratios, and verify every result with worked multiplication and cross-product steps.";
  return <><StructuredData data={[webPageStructuredData({ name: "Equivalent Fractions", description, path: "/equivalent-fractions", updatedAt: "2026-08-22" }), breadcrumbStructuredData([{ name: "Home", path: "/" }, { name: "Equivalent Fractions", path: "/equivalent-fractions" }]), collectionPageStructuredData([{ name: "Percent and Decimal", path: "/percent-and-decimal", description: "Convert fractions to percent and decimal form." }], { name: "Equivalent Fractions", description, path: "/equivalent-fractions" })]} /><FractionHubPage family="equivalent-fractions" /></>;
}

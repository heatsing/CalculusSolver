import type { Metadata } from "next";
import { FractionHubPage } from "@/components/fractions/fraction-hub-page";
import { StructuredData } from "@/components/seo/structured-data";
import { breadcrumbStructuredData, collectionPageStructuredData, webPageStructuredData, createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({ title: "Fraction to Percent and Decimal Converter | Calculus Solver", description: "Convert fractions to decimals and percentages with instant answers, simplified forms, equivalent fractions, and clear calculation steps.", path: "/percent-and-decimal", keywords: ["fraction to percent", "fraction to decimal", "percent and decimal converter"] });

export default function PercentAndDecimalPage(): React.JSX.Element {
  const description = "Convert fractions to decimals and percentages with instant answers, simplified forms, equivalent fractions, and clear calculation steps.";
  return <><StructuredData data={[webPageStructuredData({ name: "Percent and Decimal", description, path: "/percent-and-decimal", updatedAt: "2026-08-22" }), breadcrumbStructuredData([{ name: "Home", path: "/" }, { name: "Percent and Decimal", path: "/percent-and-decimal" }]), collectionPageStructuredData([{ name: "Equivalent Fractions", path: "/equivalent-fractions", description: "Find and verify equivalent fractions." }], { name: "Percent and Decimal", description, path: "/percent-and-decimal" })]} /><FractionHubPage family="percent-decimal" /></>;
}

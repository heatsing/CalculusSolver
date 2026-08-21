import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalculatorPage } from "@/components/calculator/calculator-page";
import { FractionSeoPage } from "@/components/fractions/fraction-seo-page";
import { getCalculatorPage, getCalculatorStaticParams } from "@/data/calculator-pages";
import { fractionPageMetadata, getFractionPage, getFractionStaticParams } from "@/data/fraction-pages";
import { createMetadata } from "@/lib/seo";

type CalculatorRouteProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams(): { slug: string }[] {
  return [...getCalculatorStaticParams(), ...getFractionStaticParams()];
}

export async function generateMetadata({ params }: CalculatorRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const calculator = getCalculatorPage(slug);
  if (calculator) return createMetadata({ ...calculator.metadata, indexable: calculator.indexable });
  const fraction = getFractionPage(slug);
  if (!fraction) return {};
  const metadata = fractionPageMetadata(fraction.family, fraction.candidate);
  return createMetadata({ ...metadata, keywords: fraction.family === "equivalent-fractions" ? ["equivalent fractions", `${fraction.candidate.numerator}/${fraction.candidate.denominator} equivalent fractions`] : ["fraction to percent", "fraction to decimal"] });
}

export default async function CalculatorRoute({ params }: CalculatorRouteProps): Promise<React.JSX.Element> {
  const { slug } = await params;
  const calculator = getCalculatorPage(slug);
  if (!calculator) {
    const fraction = getFractionPage(slug);
    if (!fraction) notFound();
    return <FractionSeoPage family={fraction.family} candidate={fraction.candidate} />;
  }

  return (
    <CalculatorPage
      {...calculator.page}
      category={calculator.category}
      updatedAt={calculator.updatedAt}
      educationalContent={calculator.educationalContent}
      qualityContent={calculator.qualityContent}
      learningLinks={calculator.learningLinks}
    />
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalculatorPage } from "@/components/calculator/calculator-page";
import { getCalculatorPage, getCalculatorStaticParams } from "@/data/calculator-pages";
import { createMetadata } from "@/lib/seo";

type CalculatorRouteProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams(): { slug: string }[] {
  return getCalculatorStaticParams();
}

export async function generateMetadata({ params }: CalculatorRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const calculator = getCalculatorPage(slug);
  if (!calculator) return {};
  return createMetadata({ ...calculator.metadata, indexable: calculator.indexable });
}

export default async function CalculatorRoute({ params }: CalculatorRouteProps): Promise<React.JSX.Element> {
  const { slug } = await params;
  const calculator = getCalculatorPage(slug);
  if (!calculator) notFound();

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

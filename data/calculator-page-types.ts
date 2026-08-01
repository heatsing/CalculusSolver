import type { CalculatorPageProps } from "@/components/calculator/calculator-page";
import type { CreateMetadataOptions } from "@/lib/seo";

export type CalculatorDefinitionSource = {
  metadata: CreateMetadataOptions;
  page: CalculatorPageProps;
};

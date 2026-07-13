import { CalculatorPage } from "@/components/calculator/calculator-page";
import { specializedCalculatorPages } from "@/data/specialized-calculator-pages";
import { createMetadata } from "@/lib/seo";

const definition = specializedCalculatorPages["definite-integral"];
export const metadata = createMetadata(definition.metadata);
export default function DefiniteIntegralCalculatorPage(): React.JSX.Element { return <CalculatorPage {...definition.page} />; }

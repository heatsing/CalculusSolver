import { CalculatorPage } from "@/components/calculator/calculator-page";
import { specializedCalculatorPages } from "@/data/specialized-calculator-pages";
import { createMetadata } from "@/lib/seo";

const definition = specializedCalculatorPages["system-of-equations"];
export const metadata = createMetadata(definition.metadata);
export default function SystemOfEquationsCalculatorPage(): React.JSX.Element { return <CalculatorPage {...definition.page} />; }

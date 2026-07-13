import { CalculatorPage } from "@/components/calculator/calculator-page";
import { specializedCalculatorPages } from "@/data/specialized-calculator-pages";
import { createMetadata } from "@/lib/seo";

const definition = specializedCalculatorPages["pythagorean-theorem"];
export const metadata = createMetadata(definition.metadata);
export default function PythagoreanTheoremCalculatorPage(): React.JSX.Element { return <CalculatorPage {...definition.page} />; }

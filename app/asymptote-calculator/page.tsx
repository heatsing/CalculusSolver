import { CalculatorPage } from "@/components/calculator/calculator-page";
import { specializedCalculatorPages } from "@/data/specialized-calculator-pages";
import { createMetadata } from "@/lib/seo";

const definition = specializedCalculatorPages.asymptote;
export const metadata = createMetadata(definition.metadata);
export default function AsymptoteCalculatorPage(): React.JSX.Element { return <CalculatorPage {...definition.page} />; }

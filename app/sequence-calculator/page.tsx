import { CalculatorPage } from "@/components/calculator/calculator-page";
import { specializedCalculatorPages } from "@/data/specialized-calculator-pages";
import { createMetadata } from "@/lib/seo";

const definition = specializedCalculatorPages.sequence;
export const metadata = createMetadata(definition.metadata);
export default function SequenceCalculatorPage(): React.JSX.Element { return <CalculatorPage {...definition.page} />; }

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { StructuredData } from "@/components/seo/structured-data";
import { examplesData } from "@/data/examples";
import { breadcrumbStructuredData, collectionPageStructuredData, createMetadata, webPageStructuredData } from "@/lib/seo";
import ExamplesClient from "./examples-client";

const description = "Browse worked algebra, derivative, integral, limit, and graph examples with focused problem pages and step-by-step explanations.";

export const metadata = createMetadata({
  title: "Worked Math Examples | Calculus Solver",
  description,
  path: "/examples",
  keywords: [
    "math examples",
    "calculus examples",
    "algebra examples",
    "derivative examples",
    "integral examples",
    "limit examples",
    "graph examples"
  ]
});

export default function ExamplesPage(): React.JSX.Element {
  return (
    <>
      <StructuredData data={webPageStructuredData({ name: "Worked Math Examples", description, path: "/examples", updatedAt: "2026-08-10" })} />
      <StructuredData data={collectionPageStructuredData(examplesData.map((example) => ({ name: example.problem, path: `/examples/${example.id}`, description: `${example.difficulty} ${example.category.toLowerCase()} example with a worked solution.` })), { name: "Worked Math Examples", description, path: "/examples" })} />
      <StructuredData data={breadcrumbStructuredData([{ name: "Home", path: "/" }, { name: "Examples", path: "/examples" }])} />
      <Header />
      <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-content px-4 py-10 sm:px-6 lg:px-8 focus-visible:outline-none">
        <ExamplesClient />
      </main>
      <Footer />
    </>
  );
}

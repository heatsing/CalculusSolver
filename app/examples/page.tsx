import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { createMetadata } from "@/lib/seo";
import ExamplesClient from "./examples-client";

export const metadata = createMetadata({
  title: "Examples",
  description:
    "Browse example problems across algebra, derivatives, integrals, limits, and graphs.",
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
      <Header />
      <main className="mx-auto w-full max-w-content px-4 py-10 sm:px-6 lg:px-8">
        <ExamplesClient />
      </main>
      <Footer />
    </>
  );
}

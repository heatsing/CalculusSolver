import { CalculusHomePage } from "@/components/marketing/calculus-home-page";
import { HomepageStructuredData } from "@/components/seo/homepage-structured-data";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Free Calculus Solver with Steps | Derivatives & Integrals",
  description: "Calculus Solver – Solve Your Problems Quickly.",
  path: "/",
  keywords: [
    "calculus solver",
    "calculus solver with steps",
    "derivative calculator with steps",
    "integral calculator with steps",
    "limit calculator",
    "calculus homework solver"
  ]
});

export default function HomePage(): React.JSX.Element {
  return <><HomepageStructuredData /><CalculusHomePage /></>;
}

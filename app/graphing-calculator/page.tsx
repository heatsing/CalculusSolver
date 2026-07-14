import { CalculatorPage } from "@/components/calculator/calculator-page";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Calculus Solver – Free Online Graphing Calculator",
  description:
    "Free online graphing calculator. Plot functions and explore their curves with an interactive graph and step-by-step analysis.",
  path: "/graphing-calculator",
  keywords: [
    "graphing calculator",
    "online graphing calculator",
    "function grapher",
    "plot a function"
  ]
});

export default function GraphingCalculatorPage(): React.JSX.Element {
  return (
    <CalculatorPage
      title="Graphing Calculator"
      description="Free online graphing calculator for plotting and exploring functions."
      path="/graphing-calculator"
      mode="graph"
      h1="Graphing Calculator"
      subtitle="Plot a function, inspect its curve, and explore important features on an interactive graph."
      exampleLatex="y = x^2 - 4x + 3"
      howItWorks={[
        { step: "Enter a function", description: "Type a function such as y = x^2 - 4x + 3." },
        { step: "Create the graph", description: "Ask the calculator to graph or plot the expression." },
        { step: "Explore the curve", description: "Inspect the interactive graph and the accompanying analysis." }
      ]}
      faqs={[
        {
          question: "What kinds of functions can I graph?",
          answer: "You can graph common polynomial, trigonometric, exponential, logarithmic, and rational functions."
        },
        {
          question: "Can I interact with the graph?",
          answer: "Yes. You can zoom, pan, and inspect the plotted curve."
        }
      ]}
      relatedTools={[
        { label: "Calculus Calculator", href: "/calculus-calculator" },
        { label: "Derivative Calculator", href: "/derivative-calculator" },
        { label: "Algebra Calculator", href: "/algebra-solver" }
      ]}
    />
  );
}

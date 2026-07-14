"use client";

import * as React from "react";
import { generalFaqs } from "@/data/faqs";
import { faqPageStructuredData, howToStructuredData, serializeJsonLd } from "@/lib/seo";

const schemas = [
  {
    id: "homepage-faq-schema",
    data: faqPageStructuredData(generalFaqs)
  },
  {
    id: "homepage-how-to-schema",
    data: howToStructuredData({
      name: "How to Use Calculus Solver",
      description: "Enter a calculus problem and review a step-by-step solution.",
      steps: [
        { name: "Enter your calculus problem", text: "Type a derivative, integral, limit, equation, or function into the math input." },
        { name: "Click Solve Problem", text: "Submit the expression for mathematical processing and verification." },
        { name: "Review the solution", text: "Read the answer, step-by-step solution, explanation, and final answer." }
      ]
    })
  }
] as const;

export function HomepageStructuredData(): null {
  React.useEffect(() => {
    const inserted: HTMLScriptElement[] = [];

    for (const schema of schemas) {
      if (document.getElementById(schema.id)) continue;
      const script = document.createElement("script");
      script.id = schema.id;
      script.type = "application/ld+json";
      script.textContent = serializeJsonLd(schema.data);
      document.head.appendChild(script);
      inserted.push(script);
    }

    return () => inserted.forEach((script) => script.remove());
  }, []);

  return null;
}

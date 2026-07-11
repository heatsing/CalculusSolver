"use client";

import * as React from "react";
import { serializeJsonLd } from "@/lib/seo";

export type JsonLdSchemaProps = {
  data: unknown;
  id?: string;
};

export function JsonLdSchema({ data, id }: JsonLdSchemaProps): React.JSX.Element {
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}

export type JsonLdSchemaType =
  | "WebSite"
  | "SoftwareApplication"
  | "FAQPage"
  | "WebPage"
  | "BreadcrumbList";

export type JsonLdSchemaPresetProps = {
  type: JsonLdSchemaType;
  id?: string;
} & (
  | { type: "WebSite"; name: string; url: string; searchUrl?: string }
  | { type: "SoftwareApplication"; name: string; category?: string }
  | { type: "FAQPage"; items: { question: string; answer: string }[] }
  | { type: "WebPage"; title: string; description: string; url: string }
  | { type: "BreadcrumbList"; items: { name: string; url: string }[] }
);

export function JsonLdSchemaPreset(props: JsonLdSchemaPresetProps): React.JSX.Element {
  const data = buildSchemaData(props);
  return <JsonLdSchema data={data} id={props.id} />;
}

function buildSchemaData(props: JsonLdSchemaPresetProps): unknown {
  switch (props.type) {
    case "WebSite":
      return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: props.name,
        url: props.url,
        ...(props.searchUrl
          ? {
              potentialAction: {
                "@type": "SearchAction",
                target: props.searchUrl,
                "query-input": "required name=search_term_string"
              }
            }
          : {})
      };
    case "SoftwareApplication":
      return {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: props.name,
        applicationCategory: props.category ?? "Education",
        applicationSubCategory: "EducationalApplication",
        operatingSystem: "Any",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD"
        }
      };
    case "FAQPage":
      return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: props.items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer
          }
        }))
      };
    case "WebPage":
      return {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: props.title,
        description: props.description,
        url: props.url
      };
    case "BreadcrumbList":
      return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: props.items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: item.url
        }))
      };
    default:
      return {};
  }
}

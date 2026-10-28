import type { Metadata } from "next";

export const siteUrl = (process.env.NEXT_PUBLIC_APP_URL ?? "https://calculussolver.net").replace(/\/$/, "");
const ogImage = `${siteUrl}/og-image.png`;

function absoluteUrl(path: string): string {
  return path === "/" ? siteUrl : `${siteUrl}${path}`;
}

export type CreateMetadataOptions = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  indexable?: boolean;
};

export function createMetadata({
  title,
  description,
  path,
  keywords,
  indexable = true
}: CreateMetadataOptions): Metadata {
  const url = absoluteUrl(path);
  const normalizedDescription = description.replace(/CalculusSolver\.net/gi, "Calculus Solver");
  const pageTitle = title.toLowerCase().includes("calculus solver")
    ? { absolute: title }
    : title;

  return {
    metadataBase: new URL(siteUrl),
    title: pageTitle,
    description: normalizedDescription,
    ...(keywords ? { keywords } : {}),
    openGraph: {
      title,
      description: normalizedDescription,
      url,
      siteName: "Calculus Solver",
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${title} - Calculus Solver` }]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: normalizedDescription,
      images: [{ url: ogImage, alt: `${title} - Calculus Solver` }]
    },
    alternates: {
      canonical: path
    },
    robots: {
      index: indexable,
      follow: true,
      googleBot: {
        index: indexable,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1
      }
    }
  };
}

export function websiteStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Calculus Solver",
    alternateName: "CalculusSolver.net",
    url: siteUrl,
    inLanguage: "en",
    publisher: {
      "@id": `${siteUrl}/#organization`
    }
  };
}

export function organizationStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: "Calculus Solver",
    url: siteUrl,
    logo: {
      "@type": "ImageObject",
      url: `${siteUrl}/android-chrome-512x512.png`,
      width: 512,
      height: 512
    },
    description: "A free educational math platform for calculus, algebra, and step-by-step problem solving.",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      url: `${siteUrl}/contact`
    }
  };
}

export function softwareApplicationStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Calculus Solver",
    url: siteUrl,
    description: "Solve derivatives, integrals, limits, equations, and other calculus problems with step-by-step explanations.",
    applicationCategory: "Education",
    applicationSubCategory: "EducationalApplication",
    operatingSystem: "Any",
    isAccessibleForFree: true,
    featureList: [
      "Step-by-step calculus solutions",
      "Derivative solver",
      "Integral solver",
      "Limit solver",
      "Math symbol keyboard",
      "Symbolic answer verification"
    ],
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD"
    }
  };
}

export function mathSolverStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": ["MathSolver", "LearningResource"],
    name: "Calculus Solver",
    description: "Solve calculus and algebra problems with step-by-step explanations.",
    url: siteUrl,
    learningResourceType: "Math Solver",
    provider: {
      "@type": "Organization",
      name: "Calculus Solver",
      url: siteUrl
    }
  };
}

export function webPageStructuredData(item: {
  name: string;
  description: string;
  path: string;
  updatedAt?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: item.name,
    description: item.description,
    url: absoluteUrl(item.path),
    ...(item.updatedAt ? { dateModified: item.updatedAt } : {}),
    isPartOf: {
      "@type": "WebSite",
      name: "Calculus Solver",
      url: siteUrl
    },
    about: {
      "@type": "Thing",
      name: item.name.replace(/ Calculator$| Solver$/, "")
    }
  };
}

export function calculatorApplicationStructuredData(item: {
  name: string;
  description: string;
  path: string;
  category: string;
  features: readonly string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: item.name,
    description: item.description,
    url: absoluteUrl(item.path),
    applicationCategory: "EducationalApplication",
    applicationSubCategory: item.category,
    operatingSystem: "Any",
    browserRequirements: "Requires a modern web browser with JavaScript enabled for interactive calculations.",
    isAccessibleForFree: true,
    featureList: item.features,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD"
    },
    provider: {
      "@type": "Organization",
      name: "Calculus Solver",
      url: siteUrl
    }
  };
}

export function howToStructuredData({
  name,
  description,
  steps
}: {
  name: string;
  description: string;
  steps: { name: string; text: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    step: steps.map((step) => ({
      "@type": "HowToStep",
      name: step.name,
      text: step.text
    }))
  };
}

export function faqPageStructuredData(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer
      }
    }))
  };
}

export function collectionPageStructuredData(
  items: { name: string; path: string; description: string }[],
  collection: { name: string; description: string; path: string } = {
    name: "Calculus and Algebra Guides",
    description: "Step-by-step learning guides for calculus, algebra, and linear algebra.",
    path: "/guides"
  }
) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: collection.name,
    description: collection.description,
    url: absoluteUrl(collection.path),
    mainEntity: {
      "@type": "ItemList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        description: item.description,
        url: absoluteUrl(item.path)
      }))
    }
  };
}

export function learningResourceStructuredData(item: {
  title: string;
  description: string;
  path: string;
  category: string;
  difficulty: string;
  updatedAt: string;
  objectives: readonly string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": ["Article", "LearningResource"],
    headline: item.title,
    name: item.title,
    description: item.description,
    url: absoluteUrl(item.path),
    dateModified: item.updatedAt,
    author: { "@type": "Organization", name: "Calculus Solver", url: siteUrl },
    reviewedBy: { "@type": "Organization", name: "Calculus Solver editorial team", url: `${siteUrl}/about` },
    publisher: { "@type": "Organization", name: "Calculus Solver", url: siteUrl },
    learningResourceType: "Guide",
    educationalLevel: item.difficulty,
    about: item.category,
    teaches: item.objectives
  };
}

export function dailyChallengeStructuredData(item: {
  name: string;
  description: string;
  path: string;
  category: string;
  difficulty: string;
  dateKey: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: item.name,
    description: item.description,
    url: absoluteUrl(item.path),
    dateModified: item.dateKey,
    learningResourceType: "Practice",
    educationalUse: "Practice",
    educationalLevel: item.difficulty,
    about: {
      "@type": "Thing",
      name: item.category
    },
    provider: {
      "@type": "Organization",
      name: "Calculus Solver",
      url: siteUrl
    },
    isAccessibleForFree: true
  };
}

export function breadcrumbStructuredData(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path)
    }))
  };
}

export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

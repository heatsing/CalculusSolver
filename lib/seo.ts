import type { Metadata } from "next";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
const ogImage = `${appUrl}/og-image.png`;

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
  const url = `${appUrl}${path}`;
  const normalizedDescription = description.replace(/CalculusSolver\.net/gi, "Calculus Solver");
  const pageTitle = title.toLowerCase().includes("calculus solver")
    ? { absolute: title }
    : title;

  return {
    metadataBase: new URL(appUrl),
    title: pageTitle,
    description: normalizedDescription,
    ...(keywords ? { keywords } : {}),
    openGraph: {
      title,
      description: normalizedDescription,
      url,
      siteName: "Calculus Solver",
      type: "website",
      images: [ogImage]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: normalizedDescription,
      images: [ogImage]
    },
    alternates: {
      canonical: path
    },
    robots: {
      index: indexable,
      follow: true
    }
  };
}

export function websiteStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Calculus Solver",
    url: appUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${appUrl}/?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };
}

export function softwareApplicationStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Calculus Solver",
    url: appUrl,
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
    url: appUrl,
    usageInfo: `${appUrl}/privacy`,
    learningResourceType: "Math Solver",
    provider: {
      "@type": "Organization",
      name: "Calculus Solver",
      url: appUrl
    },
    potentialAction: {
      "@type": "SolveMathAction",
      target: `${appUrl}/?q={math_expression_string}`,
      "mathExpression-input": "required name=math_expression_string",
      eduQuestionType: [
        "Derivative",
        "Integral",
        "Limit",
        "Equation",
        "Simplify",
        "Factor"
      ]
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
    url: `${appUrl}${item.path}`,
    ...(item.updatedAt ? { dateModified: item.updatedAt } : {}),
    isPartOf: {
      "@type": "WebSite",
      name: "Calculus Solver",
      url: appUrl
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
    url: `${appUrl}${item.path}`,
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
      url: appUrl
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

export function collectionPageStructuredData(items: { name: string; path: string; description: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Calculus and Algebra Guides",
    description: "Step-by-step learning guides for calculus, algebra, and linear algebra.",
    url: `${appUrl}/guides`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        description: item.description,
        url: `${appUrl}${item.path}`
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
    url: `${appUrl}${item.path}`,
    dateModified: item.updatedAt,
    author: { "@type": "Organization", name: "Calculus Solver", url: appUrl },
    reviewedBy: { "@type": "Organization", name: "Calculus Solver editorial team", url: `${appUrl}/about` },
    publisher: { "@type": "Organization", name: "Calculus Solver", url: appUrl },
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
    url: `${appUrl}${item.path}`,
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
      url: appUrl
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
      item: `${appUrl}${item.path}`
    }))
  };
}

export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

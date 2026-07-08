import type { Metadata } from "next";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
const ogImage = `${appUrl}/og-image.png`;
const siteName = "Calculus Solver";

export type AppRouterMetadataOptions = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  ogType?: "website" | "article";
  noIndex?: boolean;
};

export function createAppRouterMetadata({
  title,
  description,
  path,
  keywords,
  ogType = "website",
  noIndex = false
}: AppRouterMetadataOptions): Metadata {
  const url = `${appUrl}${path}`;

  return {
    metadataBase: new URL(appUrl),
    title,
    description,
    ...(keywords ? { keywords } : {}),
    openGraph: {
      title,
      description,
      url,
      siteName,
      type: ogType,
      images: [ogImage]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage]
    },
    alternates: {
      canonical: path
    },
    robots: noIndex
      ? {
          index: false,
          follow: false
        }
      : {
          index: true,
          follow: true
        }
  };
}

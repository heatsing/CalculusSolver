"use client";

import * as React from "react";
import Head from "next/head";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
const ogImage = `${appUrl}/og-image.png`;
const siteName = "Calculus Solver";

export type PagesRouterHeadProps = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  ogType?: "website" | "article";
  noIndex?: boolean;
  children?: React.ReactNode;
};

export function PagesRouterHead({
  title,
  description,
  path,
  keywords,
  ogType = "website",
  noIndex = false,
  children
}: PagesRouterHeadProps): React.JSX.Element {
  const url = `${appUrl}${path}`;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(", ")} />
      )}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}
      <link rel="canonical" href={url} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {children}
    </Head>
  );
}

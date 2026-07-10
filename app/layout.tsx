import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Roboto } from "next/font/google";
import "./globals.css";
import { StructuredData } from "@/components/seo/structured-data";
import {
  websiteStructuredData,
  softwareApplicationStructuredData
} from "@/lib/seo";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "Calculus Solver | Step-by-Step Math Problems",
    template: "%s | Calculus Solver"
  },
  description:
    "Solve calculus and algebra problems with clear step-by-step explanations, LaTeX rendering, and interactive graphs.",
  keywords: [
    "calculus solver",
    "algebra solver",
    "derivative calculator",
    "integral calculator",
    "limit calculator",
    "step by step math"
  ],
  authors: [{ name: "Calculus Solver" }],
  openGraph: {
    title: "Calculus Solver",
    description: "Step-by-step solutions for calculus and algebra problems.",
    url: appUrl,
    siteName: "Calculus Solver",
    type: "website",
    images: [`${appUrl}/og-image.png`]
  },
  twitter: {
    card: "summary_large_image",
    title: "Calculus Solver",
    description: "Step-by-step solutions for calculus and algebra problems.",
    images: [`${appUrl}/og-image.png`]
  },
  robots: {
    index: true,
    follow: true
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    other: [
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        url: "/favicon-16x16.png"
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        url: "/favicon-32x32.png"
      },
      {
        rel: "manifest",
        url: "/site.webmanifest"
      }
    ]
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1E3A5F"
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>): React.JSX.Element {
  return (
    <html lang="en" className={roboto.variable}>
      <head>
        <StructuredData data={websiteStructuredData()} />
        <StructuredData data={softwareApplicationStructuredData()} />
        <Script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="1932d792-2720-4ed8-bb65-b1c7e98517f3"
          strategy="afterInteractive"
        />
      </head>
      <body className="min-h-screen bg-background font-sans text-heading antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-button focus:bg-primary focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}

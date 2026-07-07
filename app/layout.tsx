import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "Calculus Solver | AI Math Solver",
    template: "%s | Calculus Solver"
  },
  description:
    "Solve calculus and algebra problems with one smart input. Get step-by-step solutions, LaTeX rendering, local verification, and interactive graphs.",
  keywords: [
    "calculus solver",
    "algebra solver",
    "AI math solver",
    "derivative",
    "integral",
    "limit",
    "step by step math"
  ],
  authors: [{ name: "Calculus Solver" }],
  openGraph: {
    title: "Calculus Solver",
    description: "One smart input for calculus and algebra problems.",
    url: appUrl,
    siteName: "Calculus Solver",
    type: "website"
  },
  robots: {
    index: true,
    follow: true
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#6D3EF2"
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>): React.JSX.Element {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+Math&display=swap"
          rel="stylesheet"
        />
        <Script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="1932d792-2720-4ed8-bb65-b1c7e98517f3"
          strategy="afterInteractive"
        />
      </head>
      <body className="min-h-screen bg-background font-sans text-heading antialiased">
        {children}
      </body>
    </html>
  );
}

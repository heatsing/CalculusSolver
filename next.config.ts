import type { NextConfig } from "next";

const scriptSource = process.env.NODE_ENV === "development"
  ? "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cloud.umami.is"
  : "script-src 'self' 'unsafe-inline' https://cloud.umami.is";

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  images: {
    unoptimized: true
  },
  async redirects() {
    return [
      {
        source: "/calculus-solver",
        destination: "/",
        permanent: true
      }
    ];
  },
  async headers() {
    return [{
      source: "/(.*)",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
        { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
        { key: "Content-Security-Policy", value: `default-src 'self'; ${scriptSource}; script-src-attr 'none'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self' https://cloud.umami.is https://api-gateway.umami.is https://gateway.umami.is; worker-src 'self' blob:; object-src 'none'; frame-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; manifest-src 'self'` }
      ]
    }];
  }
};

export default nextConfig;

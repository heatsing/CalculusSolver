import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./types/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#FFFFFF",
        "secondary-background": "#F8F8FC",
        primary: {
          DEFAULT: "#6D3EF2",
          hover: "#5A2ED6",
          soft: "#F2EDFF"
        },
        heading: "#101828",
        body: "#667085",
        border: "#E4E7EC",
        success: "#16A34A",
        warning: "#D97706",
        error: "#DC2626"
      },
      borderRadius: {
        card: "16px",
        button: "10px",
        input: "18px"
      },
      maxWidth: {
        content: "1200px",
        "solver-input": "920px"
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "SFMono-Regular", "monospace"]
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" }
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      },
      animation: {
        shimmer: "shimmer 2s linear infinite",
        "fade-in": "fade-in 0.35s ease-out forwards"
      }
    }
  },
  plugins: []
};

export default config;

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
        background: "#FAFAF8",
        "secondary-background": "#F2F2EF",
        primary: {
          DEFAULT: "#1E3A5F",
          hover: "#152A45",
          soft: "#E8EDF2"
        },
        accent: {
          DEFAULT: "#D97706",
          hover: "#B45309",
          soft: "#FEF3C7"
        },
        heading: "#111827",
        body: "#57534E",
        border: "#E7E5E4",
        success: "#15803D",
        warning: "#B45309",
        error: "#B91C1C"
      },
      borderRadius: {
        card: "12px",
        button: "8px",
        input: "12px"
      },
      maxWidth: {
        content: "1100px",
        "solver-input": "760px"
      },
      fontFamily: {
        sans: ['"Source Sans 3"', '"Noto Sans Math"', "system-ui", "sans-serif"],
        serif: ['"Source Serif 4"', "Georgia", "serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "SFMono-Regular", "monospace"]
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" }
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      },
      animation: {
        shimmer: "shimmer 2s linear infinite",
        "fade-in": "fade-in 0.25s ease-out forwards"
      }
    }
  },
  plugins: []
};

export default config;

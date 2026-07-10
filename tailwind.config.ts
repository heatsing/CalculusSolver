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
        "secondary-background": "#F4F4F4",
        primary: {
          DEFAULT: "#0F62FE",
          hover: "#0050E6",
          soft: "#EDF5FF"
        },
        accent: {
          DEFAULT: "#D97706",
          hover: "#B45309",
          soft: "#FEF3C7"
        },
        heading: "#161616",
        body: "#525252",
        border: "#E0E0E0",
        success: "#24A148",
        warning: "#F1C21B",
        error: "#DA1E28"
      },
      borderRadius: {
        card: "0px",
        button: "0px",
        input: "0px"
      },
      maxWidth: {
        content: "1312px",
        "solver-input": "760px"
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', '"Noto Sans Math"', "system-ui", "sans-serif"],
        serif: ['"IBM Plex Sans"', "system-ui", "sans-serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "SFMono-Regular", "monospace"]
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

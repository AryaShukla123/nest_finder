import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1B4FFF",
          dark: "#1440CC",
          light: "#EEF2FF",
        },
        accent: {
          DEFAULT: "#FF6B35",
          dark: "#E5541F",
          light: "#FFF3EF",
        },
        ink: "#111827",
        muted: "#6B7280",
        border: "#E5E7EB",
        surface: "#F9FAFB",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-playfair)", "Georgia", "serif"],
      },
      borderRadius: {
        DEFAULT: "12px",
        sm: "8px",
      },
      boxShadow: {
        sm: "0 1px 3px rgba(0,0,0,.08)",
        md: "0 4px 16px rgba(0,0,0,.10)",
        lg: "0 12px 40px rgba(0,0,0,.13)",
      },
      maxWidth: {
        container: "1200px",
      },
    },
  },
  plugins: [],
};
export default config;
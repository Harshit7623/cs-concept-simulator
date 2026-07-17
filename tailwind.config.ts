import type { Config } from "tailwindcss";
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        surface: "var(--surface)",
        "surface-hover": "var(--surface-hover)",
        border: "var(--border)",
        foreground: "var(--foreground)",
        muted: "var(--foreground-muted)",
        accent: {
          algorithms: "var(--accent-algorithms)",
          os: "var(--accent-os)",
          networking: "var(--accent-networking)",
          systems: "var(--accent-systems)",
          languages: "var(--accent-languages)",
        },
      },
      fontFamily: { sans: "var(--font-sans)", mono: "var(--font-mono)" },
      boxShadow: { panel: "0 20px 60px rgba(0,0,0,.14)" },
    },
  },
  plugins: [],
} satisfies Config;

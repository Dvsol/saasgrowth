/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        ink: "#142B4A",
        blue: "#2563EB",
        paper: "#FFFFFF",
        surface: "#F7F9FC",
        border: "#E2E8F0",
        muted: "#475569",
        lab: "#0B1220",
        success: "#15803D",
        danger: "#B91C1C",
        warning: "#A16207",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      maxWidth: {
        content: "1280px",
        prose: "740px",
      },
      borderRadius: {
        card: "12px",
        pill: "999px",
      },
      boxShadow: {
        subtle: "0 1px 2px rgba(20, 43, 74, 0.06)",
      },
    },
  },
  plugins: [],
};

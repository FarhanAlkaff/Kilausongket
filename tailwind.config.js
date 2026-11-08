/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: "#263B32",
          dark: "#1B2A24",
          light: "#365246",
          subtle: "#17231E",
        },
        gold: {
          DEFAULT: "#C5A46D",
          light: "#E3CCA2",
          dark: "#9E7E47",
          shine: "#F3E4C8",
        },
        ivory: {
          DEFAULT: "#F7F4EE",
          dark: "#ECE7DD",
          warm: "#FAF8F5",
        },
        charcoal: {
          DEFAULT: "#292724",
          light: "#5A5650",
          muted: "#8C867E",
        },
      },
      fontFamily: {
        serif: ["'Playfair Display'", "ui-serif", "Georgia", "Cambria", "'Times New Roman'", "serif"],
        sans: ["'Plus Jakarta Sans'", "system-ui", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      boxShadow: {
        luxury: "0 10px 40px -10px rgba(38, 59, 50, 0.15)",
        goldGlow: "0 4px 25px rgba(197, 164, 109, 0.25)",
      },
    },
  },
  plugins: [],
};

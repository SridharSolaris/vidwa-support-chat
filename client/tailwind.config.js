/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#6366f1",
          light: "#818cf8",
          dark: "#4f46e5",
        },
        secondary: {
          DEFAULT: "#f59e0b",
          light: "#fbbf24",
          dark: "#d97706",
        },
        background: {
          DEFAULT: "#f1f5f9",
          dark: "#1f2937",
        },
        surface: {
          DEFAULT: "#f8fafc",
          dark: "#111827",
        },
        "text-primary": {
          DEFAULT: "#1f2937",
          dark: "#f9fafb",
        },
        "text-secondary": {
          DEFAULT: "#4b5563",
          dark: "#9ca3af",
        },
        "user-message": {
          DEFAULT: "#dbeafe",
          dark: "#1e3a8a",
        },
        "bot-message": {
          DEFAULT: "#e5e7eb",
          dark: "#374151",
        },
      },
      fontFamily: {
        audiowide: ['"Audiowide"', "sans-serif"],
        ubuntu: ['"Ubuntu"', "sans-serif"],
        rokkitt: ['"Rokkitt"', "serif"],
        sans: ['"Audiowide"', '"Ubuntu"', "sans-serif"],
        serif: ['"Rokkitt"', "serif"],
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "church-red":        "#C8102E",
        "church-red-dark":   "#9B0C23",
        "church-red-light":  "#E8304A",
        "church-navy":       "#1B2A6B",
        "church-navy-dark":  "#0F1B4A",
        "church-navy-light": "#2A3F8F",
        "church-green":      "#2D6A2D",
        "church-green-light":"#3D8C3D",
        "church-gold":       "#B8960C",
        "church-gold-light": "#D4AC12",
        "church-cream":      "#FEF9F0",
      },
      fontFamily: {
        serif:  ["Playfair Display", "Georgia", "serif"],
        sans:   ["Nunito Sans", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-up":    "fadeInUp 0.7s ease forwards",
        "fade-left":  "fadeInLeft 0.7s ease forwards",
        "fade-right": "fadeInRight 0.7s ease forwards",
        "scale-in":   "scaleIn 0.5s ease forwards",
        float:        "float 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

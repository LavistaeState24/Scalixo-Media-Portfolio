/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./**/*.html",
    "./script.js",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0b0b0b",
        accent: "#1c58e3",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Anton", "Impact", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },

      // ═══════════ KEYFRAMES ═══════════
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        scrollLine: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(400%)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },

      // ═══════════ ANIMATIONS ═══════════
      animation: {
        fadeUp: "fadeUp 0.9s ease-out both",
        fadeIn: "fadeIn 1s ease-out both",
        "scroll-line": "scrollLine 2s ease-in-out infinite",
        marquee: "marquee 40s linear infinite",
      },
    },
  },
  plugins: [],
};
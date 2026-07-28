/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./features/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F5F6F2",
        ink: "#1F2A44",
        "ink-light": "#3D4A6B",
        sage: "#6B8F71",
        amber: "#E0A458",
        rose: "#C1666B",
        line: "#D9DCD3",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
      backgroundImage: {
        "dot-grid":
          "radial-gradient(circle, #D9DCD3 1px, transparent 1px)",
      },
      backgroundSize: {
        "dot-grid": "18px 18px",
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "#0a0a0a",
        coal: "#141414",
        steel: "#1f1f1f",
        ash: "#8a8a8a",
        blood: "#e11d2e",
        blooddim: "#991b1b",
        ember: "#f97316",
      },
      fontFamily: {
        display: ['"Oswald"', "system-ui", "sans-serif"],
        body: ['"Inter"', "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
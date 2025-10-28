/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
    "./src/screens/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#4CAF50",
        "primary-dark": "#388E3C",
        background: "#F5F5F5",
        card: "#FFFFFF",
        "text-dark": "#333333",
        "text-light": "#666666",
      },
    },
  },
  plugins: [],
};

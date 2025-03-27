/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Scan all JS/TS/JSX/TSX files in src
  ],
  theme: {
    extend: {}, // You can extend Tailwind's default theme here (e.g., custom colors, fonts)
  },
  plugins: [], // Add Tailwind plugins here if needed
};

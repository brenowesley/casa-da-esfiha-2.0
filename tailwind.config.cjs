/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          cream: "#F5F1EB",
          dark: "#1A0F08",
          orange: "#FF6A00",
          yellow: "#FFD400",
        },
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      colors: {
        brand: {
          red: '#d32f2f',
          darkRed: '#b71c1c',
          yellow: '#ffcf33',
          yellowHover: '#ffd84d',
        }
      }
    },
  },
  plugins: [],
}
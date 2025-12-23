/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          yellow: "#FBD104", // Amarelo do Gênio
          orange: "#ff0000ff", // Laranja do Círculo
          dark: "#1A0D06",   // Marrom do Contorno
          cream: "#FDFCF7",  // Fundo Premium
        }
      },
      boxShadow: {
        'premium': '0 20px 50px rgba(26, 13, 6, 0.05)',
        'floating': '0 15px 35px rgba(245, 130, 31, 0.25)',
      }
    },
  },
  plugins: [],
}
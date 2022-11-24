/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {

    extend: {
      backgroundImage: {
        'logo': "url('../data/logo.png')",
        'shopping-cart': "url('../data/shopping-cart.png')",
      },
      
      colors: {
        'titles': '#26395c',
        'classic-blue': '#0e8bff',
        'white': "#FFF"
      },
      fontFamily: {
        'redHat': ['Red Hat', 'sans-serif']
    },
    },
  },
  plugins: [],
}
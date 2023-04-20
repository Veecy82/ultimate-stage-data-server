/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./views/*.pug'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
        fjalla: ['"Fjalla One"', 'sans-serif'],
      },
      grayscale: {
        25: '25%',
        50: '50%',
        75: '75%',
      },
    },
    screens: {
      sm: '640px',

      md: '768px',

      lg: '1024px',

      xl: '1200px',
    },
  },
  plugins: [],
}

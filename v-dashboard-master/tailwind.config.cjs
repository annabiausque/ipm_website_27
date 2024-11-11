const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require("tailwindcss/colors")
module.exports = {
  mode: 'jit',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}', "./node_modules/vue-tailwind-datepicker/**/*.js"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      spacing: {
        '55vh': '55vh',
        '80vw': '80vw',
        '100vw': '100vw',
      },
      boxShadow: {
        card: '0 0 10px rgba(0, 0, 0, 0.1)',
      },
      scale: {
        '0.8': '0.8',
      },
      transitionTimingFunction: {
        'ease-out-back': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
      colors: {
        'primary-start': '#color-start', // remplace par ta couleur
        'primary-end': '#color-end', // remplace par ta couleur
        'black': '#000000',
        'white': '#ffffff',
        'red-25': '#FCE4E4',
        'red-50': '#F8B4B4',
  
        "vtd-primary": colors.sky, // Light mode Datepicker color
        "vtd-secondary": colors.gray, // Dark mode Datepicker color
  
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}


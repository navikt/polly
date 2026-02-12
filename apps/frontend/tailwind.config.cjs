const dsTailwind = require('@navikt/ds-tailwind')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', '!./node_modules'],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
  presets: [dsTailwind],
}

import dsTailwind from '@navikt/ds-tailwind'

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", '!./node_modules'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  presets: [dsTailwind]
}


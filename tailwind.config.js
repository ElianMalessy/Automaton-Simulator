/** @type {import('tailwindcss').Config} */
const production = !process.env.ROLLUP_WATCH;
module.exports = {
  important: true,
  content: [],
  theme: {
    extend: {},
  },
  plugins: [],
  future: {
    purgeLayersByDefault: true,
    removeDeprecatedGapUtilities: true,
  },
  purge: {
    content: ['./src/**/*.svelte'],
    enabled: production,
  },
};

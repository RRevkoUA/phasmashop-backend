/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./views/**/*.{html,hbs}', './src/**/*.{js,ts}'],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
};

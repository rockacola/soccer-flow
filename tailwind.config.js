/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}', './index.ts'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {},
  },
};

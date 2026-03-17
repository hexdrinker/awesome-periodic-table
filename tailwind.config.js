/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#a1faff',
        secondary: '#ff59e3',
        tertiary: '#c3ff96',
        surface: '#0b0e14',
        'surface-low': '#10131a',
        'surface-mid': '#15192280',
        'surface-high': '#1c2028',
        'surface-highest': '#22262f',
      },
      fontFamily: {
        space: ['Space Grotesk', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

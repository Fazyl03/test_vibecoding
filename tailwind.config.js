/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Onest', 'sans-serif'],
        serif: ['"Instrument Serif"', 'serif'],
      },
      colors: {
        cream: '#F7F6F2',
        surface: '#FDFCF9',
        ink: { DEFAULT: '#111111', soft: '#444444', muted: '#999999' },
        blue: { DEFAULT: '#2563EB', deep: '#1A44C2', soft: '#EEF3FF', mid: '#BFCFFF' },
        border: '#E2E0D8',
      },
    },
  },
  plugins: [],
}

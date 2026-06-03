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
        serif: ['Instrument Serif', 'serif'],
      },
      colors: {
        cream: '#FAFAF7',
        ink: '#1A1A1A',
        'ink-soft': '#4A4A4A',
        'ink-muted': '#9A9A9A',
        blue: {
          DEFAULT: '#2563EB',
          soft: '#EEF3FF',
          mid: '#BFCFFF',
        },
        border: '#E8E8E4',
      },
      borderRadius: {
        '2xl': '16px',
        'xl': '12px',
      },
    },
  },
  plugins: [],
}

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'yaalgo-primary': '#2563eb',
        'yaalgo-secondary': '#1e40af',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
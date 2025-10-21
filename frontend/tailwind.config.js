// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          'Segoe UI',
          'Roboto',
          'Arial',
          'Noto Sans',
          'Apple Color Emoji',
          'Segoe UI Emoji'
        ],
      },
      colors: {
        ink: 'rgba(6, 12, 24, 1)',
        jo: {
          bg: 'rgb(var(--jo-bg) / <alpha-value>)',
          gold: 'rgb(var(--jo-gold) / <alpha-value>)',
          gold2: 'rgb(var(--jo-gold2) / <alpha-value>)',
          blue: 'rgb(var(--jo-blue) / <alpha-value>)',
          sand: 'rgb(var(--jo-sand) / <alpha-value>)',
          white: 'rgb(var(--jo-white) / <alpha-value>)',
        },
      },
      boxShadow: {
        jo: '0 10px 30px rgba(0,0,0,.15)',
        subtle: '0 6px 18px rgba(0,0,0,.06)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}

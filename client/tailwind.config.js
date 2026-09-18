/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        yac: {
          red: '#D91F2B',
          redDark: '#B81724',
          redDeep: '#8F1019',
          dark: '#101522',
          darkCard: '#181E2E',
          soft: '#FFF7F7',
          border: '#F0D5D7',
          gold: '#C89B3C',
          goldLight: '#F5E8C7',
        },
        brand: {
          dark: '#101522',
          darker: '#0B0E17',
          primary: '#D91F2B',
          primaryHover: '#B81724',
          accent: '#C89B3C',
          accentLight: '#F5E8C7',
          gold: '#C89B3C',
          emerald: '#059669',
          crimson: '#D91F2B',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        heading: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(16, 21, 34, 0.06), 0 2px 6px -1px rgba(16, 21, 34, 0.03)',
        'card-hover': '0 16px 36px -4px rgba(217, 31, 43, 0.12), 0 6px 14px -2px rgba(16, 21, 34, 0.05)',
        'ticket': '0 25px 50px -12px rgba(16, 21, 34, 0.25)',
        'yac-glow': '0 0 35px -5px rgba(217, 31, 43, 0.35)',
      }
    },
  },
  plugins: [],
}

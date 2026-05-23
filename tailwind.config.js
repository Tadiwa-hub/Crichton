/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#1B4332',
          dark: '#143326',
        },
        ivory: {
          DEFAULT: '#FAF7F2',
          dark: '#F0EBE0',
        },
        earth: {
          DEFAULT: '#6B4226',
        },
        gold: {
          DEFAULT: '#C9A84C',
          light: '#D4BB71',
        },
      },
      fontFamily: {
        cormorant: ['"Cormorant Garamond"', 'serif'],
        inter: ['Inter', 'sans-serif'],
      },
      animation: {
        'shimmer': 'shimmer 2s infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}

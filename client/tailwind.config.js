/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './screens/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        bebas: ['var(--font-bebas)'],
        electrolize: ['var(--font-electrolize)'],
      },
      colors: {
        primary: '#58DCDE',
        'neutral-100': '#CECECE',
        'neon-orange': '#FD8D26',
        'dark-81': 'rgba(0, 0, 0, 0.81)',
        'neon-green': '#0EEB81',
        'neon-purple': '#FC62FF',
        'neon-green-yellow': '#AAFF3E',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1.25rem',
        },
      },
      fontSize: {
        ...defaultTheme.fontSize,
        // 24px/400
        large: [
          '1.5rem',
          {
            fontWeight: '400',
          },
        ],
        // 24px/400
        'extra-large': [
          '4rem',
          {
            fontWeight: '400',
          },
        ],
      },
      screens: {
        ...defaultTheme.screens,
        '2xl': '1440px',
        '3xl': '1536px',
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#292D3E',
        surface: '#363c50',
        sidebar: '#33384d',
        accent: '#C4A8FF',
        purple: '#705697',
        highlight: '#9273c2',
        muted: '#a598b8',
        selection: '#454a5e',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
      },
    },
  },
  plugins: [],
};

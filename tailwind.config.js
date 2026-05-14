/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
        serif: ['"DM Serif Display"', 'serif'],
      },
      colors: {
        bg: '#F7F5F0',
        bg2: '#EDEAE2',
        bg3: '#E3DFD5',
        surface: '#FFFFFF',
        accent: '#2D6A4F',
        'accent-light': '#D8EDDF',
        'accent-text': '#1B4332',
        amber: '#B45309',
        'amber-light': '#FEF3C7',
      },
    },
  },
  plugins: [],
}
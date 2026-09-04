/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        honey: {
          50: '#FFF8E7',
          100: '#FFEFC2',
          200: '#FFE09A',
          300: '#FFD06B',
          400: '#F5B83C',
          500: '#D4920A',
          600: '#C17A0E',
          700: '#A66208',
          800: '#8B4E06',
          900: '#6B3A04',
        },
        ivory: {
          50: '#FDFCF9',
          100: '#FAF7F2',
          200: '#F5F0E8',
          300: '#EDE6D8',
          400: '#E0D5C0',
          500: '#C8B99A',
        },
        olive: {
          50: '#F4F6EE',
          100: '#E6EBD8',
          200: '#CED8B4',
          300: '#A9B87F',
          400: '#7A8C4A',
          500: '#5C6B3C',
          600: '#485530',
        },
        charcoal: {
          50: '#F5F5F5',
          100: '#E5E5E5',
          200: '#CCCCCC',
          300: '#999999',
          400: '#6B6B6B',
          500: '#4A4A4A',
          600: '#333333',
          700: '#1C1C1C',
          800: '#111111',
          900: '#0D0D0D',
        },
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04)',
        'elevated': '0 10px 30px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.05)',
        'dark-card': '0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)',
        'dark-elevated': '0 10px 30px rgba(0, 0, 0, 0.4), 0 4px 8px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'nexus-dark': '#0a0a0a',
        primary: '#1a1a1a',
        'primary-dark': '#000000',
        'primary-light': '#333333',
        accent: '#ff0000',
        'accent-light': '#ff3333',
        yellow: {
          50: '#fefce8', 100: '#fef3c7', 200: '#fde68a', 300: '#fcd34d',
          400: '#fbbf24', 500: '#f59e0b', 600: '#d97706', 700: '#b45309',
          800: '#92400e', 900: '#78350f',
        },
        red: {
          50: '#fef2f2', 100: '#fee2e2', 200: '#fecaca', 300: '#fca5a5',
          400: '#f87171', 500: '#ef4444', 600: '#dc2626', 700: '#b91c1c',
          800: '#991b1b', 900: '#7f1d1d',
        },
      },
      backgroundImage: {
        'safety-gradient': 'linear-gradient(135deg, #b91c1c 0%, #dc2626 50%, #ef4444 100%)',
      },
    },
  },
  plugins: [],
};

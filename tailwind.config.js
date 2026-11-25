/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,html}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fffbf0',
          100: '#fef5c7',
          200: '#fee885',
          300: '#fed542',
          400: '#fdc012',
          500: '#e5a506',
          600: '#b87903',
          700: '#8c5405',
          800: '#73420c',
          900: '#62370f',
        },
        brand: {
          dark: '#0a0a0f',
          surface: '#12121c',
          card: '#1a1a2b',
          border: '#2a2a40',
          accent: '#e11d48',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}

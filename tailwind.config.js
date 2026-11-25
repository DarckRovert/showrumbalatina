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
          accent: '#e11d48', // pasión latina
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Montserrat', 'sans-serif'],
        display: ['Cabinet Grotesk', 'Playfair Display', 'serif'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 2.5s infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}

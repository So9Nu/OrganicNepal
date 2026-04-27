/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        forest: {
          50: '#f4f9f0',
          100: '#e2f0d8',
          200: '#c5e1b1',
          300: '#9dcb82',
          400: '#71b255',
          500: '#568061',
          600: '#3d6b47',
          700: '#2e5237',
          800: '#263d2b',
          900: '#1e3022',
          950: '#0f1c13',
        },
        orange: {
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
        },
        cream: {
          50: '#fefdf8',
          100: '#fdf9ed',
          200: '#faf3d6',
          300: '#f5e8b0',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-pattern': 'linear-gradient(135deg, #14532d 0%, #166534 30%, #15803d 60%, #568061 100%)',
        'glass': 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 12px 40px rgba(0, 0, 0, 0.15)',
        'glow': '0 0 20px rgba(34, 197, 94, 0.3)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'bounce-slow': 'bounce 3s infinite',
        'pulse-slow': 'pulse 4s infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },
    },
  },
  plugins: [],
}

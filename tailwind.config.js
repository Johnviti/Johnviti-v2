/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        '3xl': '1920px',
      },
      colors: {
        background: '#020617',
        text: {
          primary: 'rgba(255, 255, 255, 0.87)',
          secondary: '#94a3b8',
          muted: '#64748b',
        },
        primary: {
          main: '#38bdf8',
          light: 'rgba(56, 189, 248, 0.1)',
        },
        success: {
          main: '#22c55e',
        },
        border: {
          light: 'rgba(255, 255, 255, 0.1)',
          lighter: 'rgba(255, 255, 255, 0.05)',
          highlight: 'rgba(255, 255, 255, 0.2)',
        },
      },
      fontFamily: {
        sans: ["'Inter'", 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
        serif: ["'Times New Roman'", 'serif'],
      },
      spacing: {
        'section': '8rem',
      },
      boxShadow: {
        'success-glow': '0 0 8px #22c55e',
      },
      zIndex: {
        'background': '-20',
        'header': '50',
        'modal': '100',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-reverse': 'float 6s ease-in-out infinite reverse',
        'blob': 'blob 20s infinite alternate cubic-bezier(0.4, 0, 0.2, 1)',
        'aurora': 'aurora 60s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(5vw, -5vh) scale(1.1)' },
          '66%': { transform: 'translate(-4vw, 4vh) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        aurora: {
          from: { backgroundPosition: '50% 50%, 50% 50%' },
          to: { backgroundPosition: '350% 50%, 350% 50%' },
        }
      }
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",],
  theme: {
    extend: {
      keyframes: {
        modalOverlayAppear: {
          '0%': {opacity: 0},
          '100%': {opacity: 0.5},
        },
        modalAppear: {
          '0%': {
            opacity: 0,
            transform: 'translate(-50%, -48%) scale(0.96)'},
          '100%': {
            opacity: 1,
            transform: 'translate(-50%, -50%) scale(1)',
          },
        },
        slideIn: {
          '0%': {
            transform: 'translateX(100%)',
          },
          '100%': {
            transform: 'translateX(0)',
          }
        },
        fadeOut: {
          '0%': {
            opacity: 1,
          },
          '100%': {
            opacity: 0,
          }
        },
        fadeIn: {
          '0%': {
            opacity: 0,
          },
          '100%': {
            opacity: 1,
          }
        },
        fadeInDelay: {
          '0%': {
            opacity: 0,
          },
          '50%': {
            opacity: 0,
          },
          '100%': {
            opacity: 1,
          }
        }
      },
      animation: {
        'modalOverlayAppear': 'modalOverlayAppear 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        'modalAppear': 'modalAppear 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        'slideIn': 'slideIn 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        'fadeOut': 'fadeOut 100ms ease-in;',
        'fadeIn': 'fadeIn 100ms ease-in',
        'fadeInSlow': 'fadeIn 800ms ease-in',
        'fadeInSlowDelay': 'fadeInDelay 4000ms ease-in',


      }
    },
  },
  plugins: [],
}


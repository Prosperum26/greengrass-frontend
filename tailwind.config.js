/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#fff8f5',
          low: '#fbf1eb',
          high: '#f7ebe4',
          highest: '#f3e6de',
        },
        primary: {
          DEFAULT: '#3A5E27',
          light: '#859448'
        },
        secondary: {
          DEFAULT: '#57641e',
        },
        accent: {
          DEFAULT: '#F75A0D',
          hover: '#F34508'
        },
        ink: {
          DEFAULT: '#211a14',
        },
        brown: {
          800: '#3D362B',
          900: '#251E18'
        }
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'system-ui', 'Segoe UI', 'Roboto', 'sans-serif'],
        sans: ['Manrope', 'system-ui', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        md: '12px',
        lg: '16px',
        xl: '24px',
      },
    },
  },
  plugins: [],
}


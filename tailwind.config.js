/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3A5E27',
          light: '#859448'
        },
        accent: {
          DEFAULT: '#F75A0D',
          hover: '#F34508'
        },
        brown: {
          800: '#3D362B',
          900: '#251E18'
        }
      }
    },
  },
  plugins: [],
}


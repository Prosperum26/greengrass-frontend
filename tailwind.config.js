/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "on-surface-variant": "#43493e",
        "on-primary-fixed-variant": "#2c4f1a",
        "tertiary-fixed": "#ffdbcf",
        "tertiary": "#722300",
        "primary-container": "#3a5e27",
        "surface-container": "#faebe1",
        "on-secondary": "#ffffff",
        "outline": "#73796c",
        "secondary-fixed": "#daeb95",
        "surface-container-high": "#f4e6dc",
        "surface-container-low": "#fff1e8",
        "primary-fixed-dim": "#a8d38e",
        "error-container": "#ffdad6",
        "surface-tint": "#436830",
        "on-primary-fixed": "#072100",
        "surface-container-highest": "#eee0d6",
        "outline-variant": "#c3c9ba",
        "secondary-fixed-dim": "#bece7b",
        "background": "#fff8f5",
        "surface-container-lowest": "#ffffff",
        "surface-bright": "#fff8f5",
        "primary": "#234612",
        "on-error": "#ffffff",
        "tertiary-container": "#993200",
        "secondary-container": "#d7e892",
        "surface": "#fff8f5",
        "inverse-surface": "#372f28",
        "inverse-on-surface": "#fdeee4",
        "on-primary-container": "#acd692",
        "on-surface": "#211a14",
        "on-tertiary-container": "#ffbaa1",
        "surface-dim": "#e5d7ce",
        "on-error-container": "#93000a",
        "on-tertiary-fixed": "#380d00",
        "error": "#ba1a1a",
        "on-secondary-fixed-variant": "#3f4c05",
        "on-secondary-container": "#5b6922",
        "on-background": "#211a14",
        "secondary": "#57641e",
        "inverse-primary": "#a8d38e",
        "primary-fixed": "#c4efa8",
        "on-secondary-fixed": "#181e00",
        "tertiary-fixed-dim": "#ffb59a",
        "on-tertiary-fixed-variant": "#812900",
        "on-primary": "#ffffff",
        "on-tertiary": "#ffffff",
        "surface-variant": "#eee0d6",
        
        "accent": {
          DEFAULT: '#F75A0D',
          hover: '#F34508'
        },
        "ink": {
          DEFAULT: '#211a14',
          50: '#211a1480',
          60: '#211a1499',
        },
        "brown": {
          800: '#3D362B',
          900: '#251E18'
        },
        "primary-light": '#859448',
        "surface-low": '#fbf1eb',
        "surface-high": '#f7ebe4'
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        "full": "9999px"
      },
      fontFamily: {
        "display": ["Plus Jakarta Sans", "sans-serif"],
        "headline": ["Plus Jakarta Sans", "sans-serif"],
        "body": ["Manrope", "sans-serif"],
        "label": ["Manrope", "sans-serif"],
        "sans": ["Manrope", "sans-serif"]
      }
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      'xs': '480px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      maxWidth: {
        'container': '1440px',
      },
      colors: {
        "on-surface-variant": "rgb(var(--on-surface-variant))",
        "on-primary-fixed-variant": "rgb(var(--on-primary-fixed-variant))",
        "tertiary-fixed": "rgb(var(--tertiary-fixed))",
        "tertiary": "rgb(var(--tertiary))",
        "primary-container": "rgb(var(--primary-container))",
        "surface-container": "rgb(var(--surface-container))",
        "on-secondary": "rgb(var(--on-secondary))",
        "outline": "rgb(var(--outline))",
        "secondary-fixed": "rgb(var(--secondary-fixed))",
        "surface-container-high": "rgb(var(--surface-container-high))",
        "surface-container-low": "rgb(var(--surface-container-low))",
        "primary-fixed-dim": "rgb(var(--primary-fixed-dim))",
        "error-container": "rgb(var(--error-container))",
        "surface-tint": "rgb(var(--surface-tint))",
        "on-primary-fixed": "rgb(var(--on-primary-fixed))",
        "surface-container-highest": "rgb(var(--surface-container-highest))",
        "outline-variant": "rgb(var(--outline-variant))",
        "secondary-fixed-dim": "rgb(var(--secondary-fixed-dim))",
        "background": "rgb(var(--background))",
        "surface-container-lowest": "rgb(var(--surface-container-lowest))",
        "surface-bright": "rgb(var(--surface-bright))",
        "primary": "rgb(var(--primary))",
        "on-error": "rgb(var(--on-error))",
        "tertiary-container": "rgb(var(--tertiary-container))",
        "secondary-container": "rgb(var(--secondary-container))",
        "surface": "rgb(var(--surface))",
        "inverse-surface": "rgb(var(--inverse-surface))",
        "inverse-on-surface": "rgb(var(--inverse-on-surface))",
        "on-primary-container": "rgb(var(--on-primary-container))",
        "on-surface": "rgb(var(--on-surface))",
        "on-tertiary-container": "rgb(var(--on-tertiary-container))",
        "surface-dim": "rgb(var(--surface-dim))",
        "on-error-container": "rgb(var(--on-error-container))",
        "on-tertiary-fixed": "rgb(var(--on-tertiary-fixed))",
        "error": "rgb(var(--error))",
        "on-secondary-fixed-variant": "rgb(var(--on-secondary-fixed-variant))",
        "on-secondary-container": "rgb(var(--on-secondary-container))",
        "on-background": "rgb(var(--on-background))",
        "secondary": "rgb(var(--secondary))",
        "inverse-primary": "rgb(var(--inverse-primary))",
        "primary-fixed": "rgb(var(--primary-fixed))",
        "on-secondary-fixed": "rgb(var(--on-secondary-fixed))",
        "tertiary-fixed-dim": "rgb(var(--tertiary-fixed-dim))",
        "on-tertiary-fixed-variant": "rgb(var(--on-tertiary-fixed-variant))",
        "on-primary": "rgb(var(--on-primary))",
        "on-tertiary": "rgb(var(--on-tertiary))",
        "surface-variant": "rgb(var(--surface-variant))",

        "accent": ({ opacityValue }) => {
          if (opacityValue === undefined) {
            return 'rgb(var(--accent))';
          }
          return `rgba(var(--accent), ${opacityValue})`;
        },
        "ink": ({ opacityValue }) => {
          if (opacityValue === undefined) {
            return 'rgb(var(--ink))';
          }
          return `rgba(var(--ink), ${opacityValue})`;
        },
        "brown": {
          800: 'rgb(var(--brown-800))',
          900: 'rgb(var(--brown-900))'
        },
        "primary-light": 'rgb(var(--primary-light))',
        "surface-low": 'rgb(var(--surface-container-low))',
        "surface-high": 'rgb(var(--surface-container-high))'
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

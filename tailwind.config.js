/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(210, 80%, 50%)',
        accent: 'hsl(140, 60%, 45%)',
        bg: 'hsl(210, 30%, 10%)',
        surface: 'hsl(210, 30%, 15%)',
        'text-primary': 'hsl(0, 0%, 95%)',
        'text-secondary': 'hsl(0, 0%, 70%)',
        positive: 'hsl(110, 60%, 45%)',
        negative: 'hsl(0, 70%, 50%)',
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
      },
      boxShadow: {
        'card': '0 4px 16px hsla(0, 0%, 0%, 0.1)',
      },
      maxWidth: {
        'container': '1024px',
      },
    },
  },
  plugins: [],
}
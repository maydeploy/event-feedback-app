/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#F5F3EF',
        'grid-gray': '#D0CCC7',
        'burnt-orange': '#E8573E',
        'text-primary': '#4A4A4A',
        'text-secondary': '#787878',
        'pastel-yellow': '#F7DC6F',
        'pastel-pink': '#F8B4C0',
        'pastel-sage': '#B8D4B8',
        'pastel-blue': '#A8D8EA',
        'pastel-lavender': '#D4C4E0',
      },
      fontFamily: {
        serif: ['Lora', 'Crimson Pro', 'serif'],
        sans: ['Inter', 'Work Sans', 'sans-serif'],
        handwritten: ['Caveat', 'Indie Flower', 'cursive'],
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 4px 16px rgba(0, 0, 0, 0.12)',
      },
      borderRadius: {
        'card': '10px',
        'button': '12px',
        'chip': '12px',
      },
      fontSize: {
        'h1': '32px',
        'h2': '24px',
        'h3': '18px',
      },
      lineHeight: {
        'relaxed-custom': '1.6',
      },
      transitionDuration: {
        '250': '250ms',
      }
    },
  },
  plugins: [],
}

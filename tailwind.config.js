/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: {
            DEFAULT: '#0f4c81', // Classic Deep Blue
            light: '#2a6b9a',
            dark: '#082b4a',
            50: '#eef6fc',
            100: '#dcebfa',
            200: '#badcfa',
            900: '#0a3254',
          },
          yellow: {
            DEFAULT: '#ffb81c', // Bright Professional Yellow
            light: '#ffcd53',
            dark: '#d69700',
            50: '#fffbf0',
            100: '#fff5d6',
            200: '#ffebad',
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

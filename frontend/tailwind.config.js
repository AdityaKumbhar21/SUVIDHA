/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          blue: "#2457A7",    // Fun Blue (Primary)
          navy: "#1A365D",    // Deep Navy (Header)
          orange: "#F36D20",  // Saffron
          green: "#1E8A43",   // Success Green
          gray: "#58575A",    // Text Gray
          light: "#F0F5FA",   // Background
          white: "#FFFFFF",
        }
      },
      fontFamily: {
        sans: ['"Noto Sans"', 'Inter', 'sans-serif'], 
      }
    },
  },
  plugins: [],
}
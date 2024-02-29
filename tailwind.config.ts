/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: "class",
  theme: {
      
    colors: {
        'white': '#FFFFFF',
        'black': '#242424',
        'grey': '#F3F3F3',
        'dark-grey': '#6B6B6B',
        'red': '#FF4E4E',
        'transparent': 'transparent',
        'twitter': '#1DA1F2',
        'purple': '#8B46FF',
        'emerald': '#10b981',
        'danger': '#F54438',
        'green': '#0f730c',
    },

    fontSize: {
        'sm': '12px',
        'base': '14px',
        'xl': '16px',
        '2xl': '20px',
        '3xl': '28px',
        '4xl': '38px',
        '5xl': '50px',
    },

    extend: {
        fontFamily: {
          inter: ["Inter", "sans-serif"],
          gelasio: ["Gelasio", "serif"],
          spartan: ["League Spartan", "sans-serif"]
        
        },
    },

},
plugins: [],
};
  
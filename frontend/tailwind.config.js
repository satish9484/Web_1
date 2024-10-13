/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,js,ts,tsx,jsx}"],
    theme: {
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
      },
      extend: {
        backgroundImage: {
          'custom-gradient': 'linear-gradient(176deg, rgba(5,117,230,1) 0%, rgba(2,41,138,1) 84.7%, rgba(2,27,121,1) 88%)',
        },
      }
    },
    plugins: [],
  }
  
  
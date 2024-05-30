module.exports = {
  content: [
    // Example content paths...
    './public/index.html',
    './src/**/*.{js,jsx,ts,tsx,vue}',
  ],
  theme: {
    extend: {},
    screens:{
      'sm': '430px',
      'md': '640px',
      'lg': '720px',
      'xl': '1024px'

    }
  },
  plugins: [require("tailwind-scrollbar")],
};

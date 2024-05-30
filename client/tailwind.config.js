module.exports = {
  content: [
    // Example content paths...
    './public/index.html',
    './src/**/*.{js,jsx,ts,tsx,vue}',
  ],
  theme: {
    extend: {},
  },
  plugins: [require("tailwind-scrollbar")],
};

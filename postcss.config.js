module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./node_modules/@shadcn/ui/**/*.{js,ts,tsx}"
  ],
  
  theme: { extend: {} },
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  };
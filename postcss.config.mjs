const config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./node_modules/@shadcn/ui/**/*.{js,ts,tsx}",
  ],
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
export default config;


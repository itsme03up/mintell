/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    turbo: true,
    // 以下はTurbopackと新しいTailwindCSSプラグインの互換性のため
    transpilePackages: ['tailwindcss', '@tailwindcss/postcss'],
  },
}

module.exports = nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    // Your turbopack options here (or leave as empty object)
  },
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig;

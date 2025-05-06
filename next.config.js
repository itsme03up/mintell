/** @type {import('next').NextConfig} */
const nextConfig = {
  // turbopack は experimental から移動して最上位に配置
  turbopack: true,
  
  // transpilePackages は experimental から最上位に移動
  transpilePackages: [], // 必要なパッケージをここに追加
  
  // 他の設定があればここに追加
}

module.exports = nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  basePath: "/rebuilt.github.io",
  assetPrefix: "/rebuilt.github.io/",
}

export default nextConfig
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  basePath: "/rebuilt.standalone",
  assetPrefix: "/rebuilt.standalone/",
}

export default nextConfig
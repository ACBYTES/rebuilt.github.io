/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',   // replaces next export
  eslint: {
    ignoreDuringBuilds: true,  // optional: avoids CI failures
  },
}

export default nextConfig
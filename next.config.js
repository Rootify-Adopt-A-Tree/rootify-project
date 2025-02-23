/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'encrypted-tbn0.gstatic.com',
      'firebasestorage.googleapis.com'  // Add this if you're using Firebase Storage
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

module.exports = nextConfig 
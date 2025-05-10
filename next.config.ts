/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'novarace.s3.amazonaws.com',
      // Keep any other existing domains you might have here
    ],
  },
  // Preserve any other existing configuration options
}

module.exports = nextConfig
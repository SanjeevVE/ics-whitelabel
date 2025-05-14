/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'novarace.s3.amazonaws.com',

    ],
  },
  async rewrites() {
    return [
      {
        source: '/api-proxy/:path*',
        destination: 'https://novarace.in/api/:path*', // Proxy to the actual API
      },
    ];
  },
};

module.exports = nextConfig;

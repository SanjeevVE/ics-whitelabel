/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'novarace.s3.amazonaws.com',
      'novarace.s3.us-east-2.amazonaws.com', 
    ],
  },
};

module.exports = nextConfig;

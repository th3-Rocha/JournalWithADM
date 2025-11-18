/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      'ufrn-laperme-server-dev.s3.amazonaws.com',
      'ufrn-laperme-dev.s3.amazonaws.com',
      'img.freepik.com',
    ],
  },
  devIndicators: {
    buildActivity: false
  },
};

module.exports = nextConfig;
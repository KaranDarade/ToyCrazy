/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@toycraze/types', '@toycraze/utils', '@toycraze/database'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'via.placeholder.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
    ],
  },
  experimental: {
    optimizePackageImports: ['@toycraze/types', '@toycraze/utils'],
  },
};

module.exports = nextConfig;

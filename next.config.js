/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.pexels.com', 'res.cloudinary.com'],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb'
    },
  },
};

module.exports = nextConfig; 
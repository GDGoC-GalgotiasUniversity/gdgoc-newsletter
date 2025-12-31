import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prevent Next.js from looking in parent directory for dependencies
  experimental: {
    outputFileTracingRoot: undefined,
  },
  images: {
    // Allowed remote image patterns and allowed widths for the Next image optimizer
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      // Allow local backend images during development (e.g. http://localhost:5000/uploads/...)
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '5000',
        pathname: '/uploads/**',
      },
    ],
    // include common device widths and 800 so optimizer requests with w=800 are allowed
    deviceSizes: [320, 420, 640, 768, 800, 1024, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
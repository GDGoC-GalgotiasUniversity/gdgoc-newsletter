import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
<<<<<<< HEAD
=======
    // Allowed remote image patterns and allowed widths for the Next image optimizer
>>>>>>> 3a9b743 (fixed cloudinary errors and env errors)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
<<<<<<< HEAD
    ],
=======
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
    // include common device widths and 800 so optimizer requests with w=800 are allowed
    deviceSizes: [320, 420, 640, 768, 800, 1024, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
>>>>>>> 3a9b743 (fixed cloudinary errors and env errors)
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

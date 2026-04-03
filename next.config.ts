import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: 'idamantsl-webapp',
  images: {
    unoptimized: true,
    qualities: [25, 50, 75, 100],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  // Oprava 416 — Next.js musí posílat správné hlavičky pro video streaming
  async headers() {
    return [
      {
        source: '/:file*.mp4',
        headers: [
          { key: 'Accept-Ranges',  value: 'bytes' },
          { key: 'Content-Type',   value: 'video/mp4' },
          { key: 'Cache-Control',  value: 'public, max-age=31536000' },
        ],
      },
      {
        source: '/:file*.webm',
        headers: [
          { key: 'Accept-Ranges',  value: 'bytes' },
          { key: 'Content-Type',   value: 'video/webm' },
        ],
      },
    ];
  },
};

export default nextConfig;
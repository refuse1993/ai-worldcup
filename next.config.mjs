/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  // Vercel 최적화
  swcMinify: true,
  compress: true,
  // 프로덕션 소스맵 비활성화 (보안)
  productionBrowserSourceMaps: false,
};

export default nextConfig;

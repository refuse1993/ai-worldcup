/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true, // Netlify 502 에러 방지
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  compress: true,
  productionBrowserSourceMaps: false,
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/study-management',
        permanent: true,  // 301リダイレクト（ブラウザはキャッシュ）
      },
    ];
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },

  async redirects() {
    // 🔽 環境変数で切り替え
    if (process.env.DISABLE_REDIRECT === 'true') {
      return [];
    }

    return [
      {
        source: '/',
        destination: '/geography',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

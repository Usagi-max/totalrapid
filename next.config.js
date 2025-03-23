// next.config.js
module.exports = {
  reactStrictMode: true,
  trailingSlash: true, // URLの末尾にスラッシュを付ける設定

  async redirects() {
    return [
      {
        source: '/old-page', // リダイレクト元のURL
        destination: '/new-page', // リダイレクト先のURL
        permanent: true, // true: 301リダイレクト, false: 302リダイレクト
      },
    ];
  },
};

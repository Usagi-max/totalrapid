// next.config.js
module.exports = {
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
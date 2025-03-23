// next.config.js
module.exports = {
  reactStrictMode: true,
  trailingSlash: true, // URLの末尾にスラッシュを付ける設定
  //output: 'export',  // 静的サイトをエクスポート

  images: {
    unoptimized: true, // 画像の最適化を無効化
  },
};

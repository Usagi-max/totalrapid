// lib/gtag.js
export const GA_MEASUREMENT_ID = 'G-VBYJEXTTMP'; // 自分のIDに置き換える

// ページビューのトラッキング
export const pageview = (url) => {
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
  });
};

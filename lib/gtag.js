// /lib/gtag.js

// ★ あなたの GA4 ID を環境変数または直書きで
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || "";

// ページビュー送信
export const pageview = (url) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

// カスタムイベント送信（クリックなど）
export const event = ({ action, category, label, value }) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

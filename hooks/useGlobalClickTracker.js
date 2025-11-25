// /hooks/useGlobalClickTracker.js
import { useEffect } from "react";
import { v4 as uuid } from "uuid";

export default function useGlobalClickTracker() {
  useEffect(() => {
    // --- Session ID（Cookie で保存） ---
    const getSessionId = () => {
      const existing = document.cookie
        .split("; ")
        .find((row) => row.startsWith("session_id="));

      if (existing) return existing.split("=")[1];

      const newId = uuid();
      document.cookie = `session_id=${newId}; path=/; max-age=7200`; // 2時間
      return newId;
    };

    const session_id = getSessionId();

    // --- クリック発火 ---
    const handleClick = (e) => {
      const target = e.target.closest("[data-track]");
      if (!target) return;

      const buttonName =
        target.dataset.track ||
        target.innerText?.trim() ||
        target.id ||
        "unknown";

      const page = window.location.pathname;

      const timestamp = new Date().toISOString();

      // --- API に送信 ---
      fetch("/api/trackClick", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          timestamp,
          session_id,
          buttonName,
          page,
        }),
      });

      // --- GA4 へ送信 ---
      if (window.gtag) {
        window.gtag("event", "button_click", {
          event_category: "interaction",
          event_label: buttonName,
          page_location: window.location.href,
          page_path: page,
          session_id,
        });
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);
}

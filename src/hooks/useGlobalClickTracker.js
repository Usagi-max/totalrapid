// /src/hooks/useGlobalClickTracker.js
import { useEffect } from "react";
import { v4 as uuid } from "uuid";

export default function useGlobalClickTracker() {
  useEffect(() => {
    console.log("🔥 useGlobalClickTracker initialized");

    // --- Session ID（Cookie） ---
    const getSessionId = () => {
      const existing = document.cookie
        .split("; ")
        .find((row) => row.startsWith("session_id="));

      if (existing) return existing.split("=")[1];

      const newId = uuid();
      document.cookie = `session_id=${newId}; path=/; max-age=7200`;
      return newId;
    };

    const session_id = getSessionId();

    const extractName = (el) => {
      if (!el) return null;

      return (
        el.dataset.track ||
        el.getAttribute("aria-label") ||
        el.name ||
        el.id ||
        el.innerText?.trim() ||
        el.className ||
        null
      );
    };

    // --- クリック発火 ---
    const handleClick = (e) => {
      console.log("👉 click detected");

      const target = e.target;
      const tracked = target.closest("[data-track]") || target;

      const buttonName = extractName(tracked) || "unknown";
      const page = window.location.pathname;
      const timestamp = new Date().toISOString();

      // ★ 保存された URL パラメータ
      const savedParams = sessionStorage.getItem("saved_params") || "";

      // ★ パラメータ付き完全URL
      const fullUrl = window.location.origin + page + savedParams;

      // --- API に送信 ---
      fetch("/api/trackClick", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          timestamp,
          session_id,
          buttonName,
          page,
          parameters: savedParams,
          fullUrl,
        }),
      });

      // --- GA4 ---
      if (window.gtag) {
        window.gtag("event", "button_click", {
          event_category: "interaction",
          event_label: buttonName,
          page_location: fullUrl,
          session_id,
        });
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);
}

import { useEffect } from "react";

export default function useGlobalClickTracker() {
  useEffect(() => {
    // -------------------------------------------------------
    // ① クリック者ID（UUID）を Cookie に保存（匿名ユーザーID）
    // -------------------------------------------------------
    const getClientId = () => {
      const COOKIE_NAME = "client_id";

      const existing = document.cookie
        .split("; ")
        .find((c) => c.startsWith(COOKIE_NAME + "="));

      if (existing) return existing.split("=")[1];

      const newId = crypto.randomUUID();
      document.cookie = `${COOKIE_NAME}=${newId}; path=/; max-age=31536000`; // 1年
      return newId;
    };

    const clientId = getClientId();

    // -------------------------------------------------------
    // ② イベント名を自動判定（ID → class → text）
    // -------------------------------------------------------
    const cleanStr = (str) =>
      str
        ?.trim()
        .replace(/\s+/g, "_")
        .replace(/[^a-zA-Z0-9_-]/g, "") || "";

    const detectEventName = (target) => {
      if (target.id) return cleanStr(target.id);

      if (target.className) {
        const cls =
          typeof target.className === "string"
            ? target.className.split(" ")[0]
            : "";
        if (cls) return cleanStr(cls);
      }

      const text = target.innerText || target.textContent;
      if (text) return cleanStr(text);

      return "unknown_click";
    };

    // -------------------------------------------------------
    // ③ クリックイベントの監視
    // -------------------------------------------------------
    const handleClick = (e) => {
      const target = e.target.closest("a, button, div, span");
      if (!target) return;

      const eventName = detectEventName(target);

      const payload = {
        timestamp: new Date().toISOString(),
        clientId,
        eventName,
        page: window.location.pathname,
      };

      // ---- API Route へ送信（sendBeacon） ----
      try {
        const blob = new Blob([JSON.stringify(payload)], {
          type: "application/json",
        });
        navigator.sendBeacon("/api/log", blob);
      } catch {
        fetch("/api/log", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          keepalive: true,
        });
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);
}

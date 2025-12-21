// hooks/useGlobalClickTracker.js
import { useEffect, useRef } from "react";
import { v4 as uuid } from "uuid";

export default function useGlobalClickTracker() {
  const initialized = useRef(false);

  useEffect(() => {
    // ===============================
    // 二重初期化防止（StrictMode / HMR）
    // ===============================
    if (initialized.current) return;
    if (window.__GLOBAL_CLICK_TRACKER_INITIALIZED__) return;

    initialized.current = true;
    window.__GLOBAL_CLICK_TRACKER_INITIALIZED__ = true;

    /* ===============================
       Session ID
    =============================== */
    const getSessionId = () => {
      const existing = document.cookie
        .split("; ")
        .find((row) => row.startsWith("session_id="));

      if (existing) return existing.split("=")[1];

      const id = uuid();
      document.cookie = `session_id=${id}; path=/; max-age=7200`;
      return id;
    };

    const session_id = getSessionId();
    const page = window.location.pathname;
    const startTime = Date.now();

    /* ===============================
       URL / parameters（★固定保持）
    =============================== */
    const getInitialParams = () => {
      const stored = sessionStorage.getItem("__ENTRY_PARAMS__");
      if (stored) return stored;

      const params = window.location.search || "";
      sessionStorage.setItem("__ENTRY_PARAMS__", params);
      return params;
    };

    const entryParams = getInitialParams();
    const entryFullUrl = `${location.origin}${location.pathname}${entryParams}`;

    /* ===============================
       Utility
    =============================== */
    const extractName = (el) =>
      el?.dataset?.track ||
      el?.getAttribute?.("aria-label") ||
      el?.innerText?.replace(/\s+/g, " ").trim() ||
      el?.id ||
      el?.className ||
      "unknown";

    const isIgnored = (el) =>
      !el || el.closest?.("[data-scroll-ignore]");

    const send = (payload) => {
      fetch("/api/trackClick", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        body: JSON.stringify({
          ...payload,
          parameters: entryParams,
          fullUrl: entryFullUrl,
        }),
      });
    };

    /* ===============================
       page_enter
    =============================== */
    send({
      type: "page_enter",
      timestamp: new Date().toISOString(),
      session_id,
      page,
      label: "page_enter",
    });

    /* ===============================
       click
    =============================== */
    const onClick = (e) => {
      const target =
        e.target.closest?.("[data-track]") ||
        e.target.closest?.("a,button,h1,h2,h3,h4,h5,h6");

      if (!target || isIgnored(target)) return;

      send({
        type: "click",
        timestamp: new Date().toISOString(),
        session_id,
        page,
        label: extractName(target),
      });
    };

    document.addEventListener("click", onClick);

    /* ===============================
       scroll tracking（最新要素を常に更新）
    =============================== */
    let lastScrollY = window.scrollY;
    let lastDir = null;
    let lastVisibleElement = null;

    const getCurrentVisibleElement = () => {
      const candidates = Array.from(
        document.querySelectorAll(
          "a,button,h1,h2,h3,h4,h5,h6,[data-track]"
        )
      ).filter((el) => {
        if (isIgnored(el)) return false;
        const rect = el.getBoundingClientRect();
        return rect.top >= 0 && rect.top < window.innerHeight * 0.6;
      });

      return candidates[candidates.length - 1] || null;
    };

    const onScroll = () => {
      const y = window.scrollY;
      const dir = y > lastScrollY ? "down" : "up";

      const currentVisible = getCurrentVisibleElement();
      if (currentVisible) {
        lastVisibleElement = currentVisible;
      }

      if (dir !== lastDir && lastVisibleElement) {
        send({
          type: dir === "up" ? "scroll_turn_up" : "scroll_turn_down",
          timestamp: new Date().toISOString(),
          session_id,
          page,
          label: extractName(lastVisibleElement),
        });
        lastDir = dir;
      }

      lastScrollY = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    /* ===============================
       page_leave（最後に見ていた要素）
    =============================== */
    let left = false;

    const leave = () => {
      if (left) return;
      left = true;

      send({
        type: "page_leave",
        timestamp: new Date().toISOString(),
        session_id,
        page,
        label: lastVisibleElement
          ? extractName(lastVisibleElement)
          : "unknown",
        stayTime: Math.floor((Date.now() - startTime) / 1000),
      });
    };

    window.addEventListener("beforeunload", leave);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") leave();
    });

    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
}

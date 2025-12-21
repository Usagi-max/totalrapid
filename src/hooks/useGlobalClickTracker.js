// src/hooks/useGlobalClickTracker.js
import { useEffect } from "react";
import { v4 as uuid } from "uuid";

export default function useGlobalClickTracker() {
  useEffect(() => {
    if (window.__GLOBAL_CLICK_TRACKER_INITIALIZED__) return;
    window.__GLOBAL_CLICK_TRACKER_INITIALIZED__ = true;

    /* ===============================
       Session
    =============================== */
    const getSessionId = () => {
      const found = document.cookie
        .split("; ")
        .find((v) => v.startsWith("session_id="));
      if (found) return found.split("=")[1];

      const id = uuid();
      document.cookie = `session_id=${id}; path=/; max-age=7200`;
      return id;
    };

    const session_id = getSessionId();
    const page = location.pathname;
    const startTime = Date.now();

    /* ===============================
       utils
    =============================== */
    const isIgnored = (el) =>
      !el || el.closest?.("[data-scroll-ignore]");

    const extractName = (el) =>
      el?.dataset?.track ||
      el?.getAttribute?.("aria-label") ||
      el?.innerText?.replace(/\s+/g, " ").trim() ||
      el?.id ||
      "unknown";

    const send = (payload) => {
      fetch("/api/trackClick", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    };

    /* ===============================
       page_enter
    =============================== */
    send({
      type: "page_enter",
      label: "page_enter",
      timestamp: new Date().toISOString(),
      session_id,
      page,
      fullUrl: location.href,
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
        label: extractName(target),
        timestamp: new Date().toISOString(),
        session_id,
        page,
        fullUrl: location.href,
      });
    };

    document.addEventListener("click", onClick);

    /* ===============================
       scroll tracking
    =============================== */
    let lastY = window.scrollY;
    let lastDir = null;
    let lastReportedKey = null;

    let currentVisibleElement = null;

    const getScrollTarget = () => {
      const centerY = window.innerHeight * 0.45;

      const candidates = Array.from(
        document.querySelectorAll(
          "a,button,h1,h2,h3,h4,h5,h6,[data-track]"
        )
      ).filter((el) => !isIgnored(el));

      let best = null;
      let minDist = Infinity;

      for (const el of candidates) {
        const rect = el.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) continue;

        const elCenter = rect.top + rect.height / 2;
        const dist = Math.abs(elCenter - centerY);

        if (dist < minDist) {
          minDist = dist;
          best = el;
        }
      }

      return best;
    };

    const onScroll = () => {
      const y = window.scrollY;
      const dir = y > lastY ? "down" : y < lastY ? "up" : null;

      const target = getScrollTarget();
      if (target) {
        currentVisibleElement = extractName(target);
      }

      if (!dir || dir === lastDir) {
        lastY = y;
        return;
      }

      if (target) {
        const key = `${dir}:${currentVisibleElement}`;
        if (key !== lastReportedKey) {
          send({
            type: dir === "up" ? "scroll_turn_up" : "scroll_turn_down",
            label: currentVisibleElement,
            timestamp: new Date().toISOString(),
            session_id,
            page,
            fullUrl: location.href,
          });
          lastReportedKey = key;
        }
      }

      lastDir = dir;
      lastY = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    /* ===============================
       page_leave（常に最新の表示要素）
    =============================== */
    const leave = () => {
      send({
        type: "page_leave",
        label: currentVisibleElement || "page_leave",
        timestamp: new Date().toISOString(),
        session_id,
        page,
        stayTime: Math.floor((Date.now() - startTime) / 1000),
        fullUrl: location.href,
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

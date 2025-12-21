// src/hooks/useGlobalClickTracker.ts
import { useEffect, useRef } from "react";
import { v4 as uuid } from "uuid";

type Dir = "up" | "down";

export default function useGlobalClickTracker() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    /* ===============================
       Session / Params
    =============================== */
    const getSessionId = () => {
      const m = document.cookie.match(/session_id=([^;]+)/);
      if (m) return m[1];
      const id = uuid();
      document.cookie = `session_id=${id}; path=/; max-age=7200`;
      return id;
    };

    const session_id = getSessionId();
    const page = location.pathname;
    const parameters =
      sessionStorage.getItem("saved_params") ||
      location.search.replace(/^\?/, "");

    /* ===============================
       Utils
    =============================== */
    const isIgnored = (el: HTMLElement) => {
      if (!el) return true;
      if (el.closest("[data-scroll-ignore]")) return true;
      const style = getComputedStyle(el);
      if (style.position === "fixed" || style.position === "sticky")
        return true;
      if (style.display === "none" || style.opacity === "0") return true;
      return false;
    };

    const extractName = (el: HTMLElement) => {
      return (
        el.dataset.track ||
        el.getAttribute("aria-label") ||
        el.textContent?.replace(/\s+/g, " ").trim() ||
        el.id ||
        el.className ||
        "unknown"
      );
    };

    const send = (payload: any) => {
      fetch("/api/trackClick", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id,
          page,
          parameters,
          fullUrl: location.href,
          timestamp: new Date().toISOString(),
          ...payload,
        }),
        keepalive: true,
      });
    };

    /* ===============================
       対象要素キャッシュ
    =============================== */
    const selector =
      "a,button,h1,h2,h3,h4,h5,h6,[data-track]";
    let elements: HTMLElement[] = [];

const refreshElements = () => {
  elements = Array.from(
    document.querySelectorAll(selector)
  )
    .filter(
      (el): el is HTMLElement => el instanceof HTMLElement
    )
    .filter((el) => !isIgnored(el));
};


    refreshElements();

    /* ===============================
       viewport中央基準ロジック
    =============================== */
    let currentEl: HTMLElement | null = null;

    const getCurrentVisibleElement = () => {
      const centerY = window.innerHeight / 2;
      let best: HTMLElement | null = null;
      let min = Infinity;

      for (const el of elements) {
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) continue;
        const elCenter = r.top + r.height / 2;
        const dist = Math.abs(centerY - elCenter);
        if (dist < min) {
          min = dist;
          best = el;
        }
      }
      return best;
    };

    /* ===============================
       page_enter
    =============================== */
    send({ type: "page_enter", label: "page_enter" });

    /* ===============================
       click
    =============================== */
    const onClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest(
        selector
      ) as HTMLElement | null;
      if (!target || isIgnored(target)) return;

      send({
        type: "click",
        label: extractName(target),
      });
    };
    document.addEventListener("click", onClick);

    /* ===============================
       scroll / scroll_turn
    =============================== */
    let lastY = window.scrollY;
    let lastDir: Dir | null = null;
    let lastSentKey = "";

    const onScroll = () => {
      const y = window.scrollY;
      const dir: Dir = y > lastY ? "down" : "up";
      lastY = y;

      currentEl = getCurrentVisibleElement();

      if (!currentEl) return;

      if (lastDir && dir !== lastDir) {
        const label = extractName(currentEl);
        const key = `${dir}:${label}`;

        if (key !== lastSentKey) {
          lastSentKey = key;
          send({
            type:
              dir === "up"
                ? "scroll_turn_up"
                : "scroll_turn_down",
            label,
          });
        }
      }

      lastDir = dir;
    };

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    /* ===============================
       page_leave（常に再計算）
    =============================== */
    const leave = () => {
      refreshElements();
      const el = getCurrentVisibleElement();
      send({
        type: "page_leave",
        label: el ? extractName(el) : "unknown",
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

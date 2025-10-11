"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./Marker.module.css";

const defaultMarkers = [
  {
    name: "blueFade",
    primaryColor: "#5b86e5",
    secondColor: "#36d1dc",
    textColor: "#000000",
    gradationType: "diagonal",
    fadeInType: "floatFade",
    opacity: 0.6,
  },
];

export default function Marker({ markers = defaultMarkers, use, children }) {
  const ref = useRef(null);
  const timerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const config = markers.find((m) => m.name === use);
  if (!config) {
    console.warn(`[Marker:${use}] markers 配列に該当なし`);
    return <span>{children}</span>;
  }

  // IntersectionObserver でスクロール検知（表示されたら 0.5s 後に有効化）
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // 既にタイマーがあるならクリアして重複を防ぐ
            if (timerRef.current) {
              clearTimeout(timerRef.current);
              timerRef.current = null;
            }
            // 0.5秒後にマーカーを表示
            timerRef.current = window.setTimeout(() => {
              setIsVisible(true);
              timerRef.current = null;
            }, 0);
          } else {
            // 見えなくなったらタイマーをクリアして即非表示
            if (timerRef.current) {
              clearTimeout(timerRef.current);
              timerRef.current = null;
            }
            setIsVisible(false);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(el);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      observer.disconnect();
    };
  }, [use, markers]);

  // グラデーション生成
  const gradient =
    config.gradationType === "vertical"
      ? `linear-gradient(to bottom, ${config.primaryColor}, ${config.secondColor})`
      : config.gradationType === "horizontal"
      ? `linear-gradient(to right, ${config.primaryColor}, ${config.secondColor})`
      : config.gradationType === "radial"
      ? `radial-gradient(circle, ${config.primaryColor}, ${config.secondColor})`
      : `linear-gradient(135deg, ${config.primaryColor}, ${config.secondColor})`;

  return (
    <span ref={ref} className={styles.wrapper}>
      {/* マーカー（初期は opacity:0、isVisible=true でフェードイン） */}
      <span
        className={`${styles.marker} ${isVisible ? styles.visible : ""}`}
        style={{
          backgroundImage: gradient,
          // 不透明度・グラデーション色を CSS 変数として渡す（直接 opacity を指定しない）
          ["--marker-opacity"]: config.opacity,
          ["--marker-gradient-start"]: config.primaryColor,
          ["--marker-gradient-end"]: config.secondColor,
        }}
        aria-hidden="true"
      />
      {/* テキストは常に最前面で最初から表示 */}
      <span className={styles.text} style={{ color: config.textColor }}>
        {children}
      </span>
    </span>
  );
}

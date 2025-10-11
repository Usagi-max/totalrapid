//GradientHeading.tsx
import { useEffect, useRef, useState } from "react";
import styles from "./GradientHeading.module.css";
import React from "react";

type Props = {
  children: React.ReactNode;
  delay?: number; // 遅延秒数（任意）
  gradientStart?: string; // グラデーション開始色
  gradientEnd?: string;   // グラデーション終了色
};

const GradientHeading = ({
  children,
  delay = 0,
  gradientStart = "#ff7e5f", // デフォルト
  gradientEnd = "#feb47b",   // デフォルト
}: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.3 }
    );

    const el = containerRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`${styles.GradientHeading_container} ${
        isVisible ? styles.visible : ""
      }`}
      style={{
        transitionDelay: `${delay}s`,
        // CSS変数を注入
        ["--gradient-start" as any]: gradientStart,
        ["--gradient-end" as any]: gradientEnd,
      }}
    >
      <div>{children}</div>
    </div>
  );
};

export default GradientHeading;

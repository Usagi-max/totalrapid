// StepFlow.js
"use client";

import styles from "./StepFlow.module.css";
import { useEffect, useState } from "react";

export default function StepFlow({
  steps,
  primaryColor = "#5b86e5",  // グラデーション開始色
  secondColor = "#36d1dc",   // グラデーション終了色
  textColor = "#ffffff",     // 内側背景色や文字色
  gradationType = "diagonal" // vertical | horizontal | diagonal | radial
}) {
  const [isVertical, setIsVertical] = useState(false);

  // ✅ 画面サイズに応じて縦 or 横に切り替え
  useEffect(() => {
    const handleResize = () => setIsVertical(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const columns = isVertical
    ? "1fr"
    : steps.map((_, i) => (i < steps.length - 1 ? "1fr 60px" : "1fr")).join(" ");

  // ✅ グラデーション設定関数
  const getGradient = () => {
    switch (gradationType) {
      case "vertical":
        return `linear-gradient(180deg, ${primaryColor}, ${secondColor})`;
      case "horizontal":
        return `linear-gradient(90deg, ${primaryColor}, ${secondColor})`;
      case "radial":
        return `radial-gradient(circle, ${primaryColor}, ${secondColor})`;
      default:
        return `linear-gradient(135deg, ${primaryColor}, ${secondColor})`;
    }
  };

  const gradient = getGradient();

  return (
    <div
      className={`${styles.container} ${isVertical ? styles.vertical : ""}`}
      style={!isVertical ? { gridTemplateColumns: columns } : {}}
    >
      {steps.map((step, index) => (
        <div key={`step-${index}`} className={styles.stepWrapper}>
          {/* ステップカード */}
          <div
            className={styles.stepBox}
            style={{
              "--gradient-border": gradient, // ✅ 枠線グラデーションをCSS変数で渡す
              "--step-bg": textColor,
            }}
          >
            <div className={styles.numberBadge}>
              <div
                className={styles.badgeBackground}
                style={{ backgroundImage: `url("/images/glove.png")` }}
              >
                <div
                  className={styles.badgeOverlay}
                  style={{ backgroundImage: gradient }}
                />
                <span className={styles.badgeNumber} style={{ color: textColor }}>
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
            </div>

            <h4 className={styles.title}>{step.title}</h4>
            <p className={styles.description}>{step.description}</p>
          </div>

          {/* ✅ ダブル矢印 */}
          {index < steps.length - 1 && (
            <div
              key={`arrow-${index}`}
              className={`${styles.arrow} ${isVertical ? styles.arrowDown : ""}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                className={styles.arrowIcon}
              >
                <defs>
                  {gradationType === "radial" ? (
                    <radialGradient id={`grad-${index}`}>
                      <stop offset="0%" stopColor={primaryColor} />
                      <stop offset="100%" stopColor={secondColor} />
                    </radialGradient>
                  ) : (
                    <linearGradient
                      id={`grad-${index}`}
                      gradientTransform={
                        gradationType === "vertical"
                          ? "rotate(90)"
                          : gradationType === "diagonal"
                          ? "rotate(135)"
                          : "rotate(0)"
                      }
                    >
                      <stop offset="0%" stopColor={primaryColor} />
                      <stop offset="100%" stopColor={secondColor} />
                    </linearGradient>
                  )}
                </defs>

                {/* ✅ ダブルアロー */}
                <path
                  d="M14 16 l10 10 -10 10"
                  fill="none"
                  stroke={`url(#grad-${index})`}
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M24 16l10 10 -10 10"
                  fill="none"
                  stroke={`url(#grad-${index})`}
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

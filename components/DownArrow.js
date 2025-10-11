// DownArrow.js
"use client";
import styles from "./DownArrow.module.css";

export default function DownDoubleArrow({
  size = 48,
  primaryColor = "#5b86e5",   // グラデーション開始色
  secondColor = "#36d1dc",    // グラデーション終了色
  strokeColor = "#2196f3",    // 矢印線の色（単色フォールバック）
  gradationType = "diagonal"  // vertical | horizontal | diagonal | radial
}) {
  // グラデーション方向設定
  const getTransform = () => {
    switch (gradationType) {
      case "vertical":
        return "rotate(90)";
      case "horizontal":
        return "rotate(0)";
      case "diagonal":
        return "rotate(135)";
      case "radial":
        return null;
      default:
        return "rotate(0)";
    }
  };

  const gradientId = "grad-double-arrow";

  return (
    <div className={styles.arrow}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        width={size}
        height={size}
        className={styles.arrowIcon}
      >
        <defs>
          {gradationType === "radial" ? (
            <radialGradient id={gradientId}>
              <stop offset="0%" stopColor={primaryColor} />
              <stop offset="100%" stopColor={secondColor} />
            </radialGradient>
          ) : (
            <linearGradient id={gradientId} gradientTransform={getTransform()}>
              <stop offset="0%" stopColor={primaryColor} />
              <stop offset="100%" stopColor={secondColor} />
            </linearGradient>
          )}
        </defs>

        {/* 1本目の下向き矢印 */}
        <path
          d="M14 16l10 10 10-10"
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* 2本目の下向き矢印 */}
        <path
          d="M14 26l10 10 10-10"
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}


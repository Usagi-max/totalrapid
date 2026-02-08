// DownArrow.js
"use client";
import styles from "./DownArrow.module.css";

export default function DownArrow({
  count = 2,
  areaHeight = 48,

  size = 48,
  primaryColor = "#999999",
  secondColor = "#bbbbbb",
  strokeColor = "#999999",
  gradationType = "diagonal"
}) {
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

  /* ===== 元デザイン基準 ===== */
  const baseY = 16;
  const arrowHeight = 10;

  /* ===== gap を areaHeight 連動で計算 ===== */
  const availableHeight = areaHeight - baseY - arrowHeight;
  const gap = count > 1 ? availableHeight / (count - 1) : 0;

  return (
    <div className={styles.arrow}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${size} ${areaHeight}`}
        width={size}
        height={areaHeight}
        preserveAspectRatio="xMidYMid meet"
        className={styles.arrowIcon}
      >
        <defs>
          {gradationType === "radial" ? (
            <radialGradient id={gradientId}>
              <stop offset="0%" stopColor={primaryColor} />
              <stop offset="100%" stopColor={secondColor} />
            </radialGradient>
          ) : (
            <linearGradient
              id={gradientId}
              gradientTransform={getTransform()}
            >
              <stop offset="0%" stopColor={primaryColor} />
              <stop offset="100%" stopColor={secondColor} />
            </linearGradient>
          )}
        </defs>

        {Array.from({ length: count }).map((_, i) => (
          <path
            key={i}
            d={`M14 ${baseY + i * gap} l10 10 10-10`}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
      </svg>
    </div>
  );
}

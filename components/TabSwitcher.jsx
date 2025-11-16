// TabSwitcher.jsx
"use client";

import React, { useState } from "react";
import styles from "./TabSwitcher.module.css";

/**
 * props:
 * - tabs: { label: string, image: string }[]
 * - textColor: string
 * - activeBg: string (グラデーション可)
 * - inactiveBg: string
 */
const TabSwitcher = ({ tabs, textColor, activeBg, inactiveBg }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className={styles.tabSwitcher}>
      {/* タブボタン */}
      <div className={styles.tabButtons}>
        {tabs.map((tab, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={index}
              className={`${styles.tabButton} ${isActive ? styles.activeTab : ""}`}
              onClick={() => setActiveIndex(index)}
              style={{
                color: textColor,
                background: isActive ? activeBg : inactiveBg,
                border: isActive ? `2px solid ${activeBg}` : "none",
                borderRadius: "12px 12px 0 0",
                zIndex: isActive ? 2 : 1,
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* タブ表示エリア */}
      <div className={styles.tabContent}>
        {tabs.map((tab, index) => {
          const isActive = index === activeIndex;
          return (
            <div
              key={index}
              className={`${styles.tabPane} ${isActive ? styles.activePane : ""}`}
            >
              <div className={styles.imageWrapper}>
                <img
                  src={tab.image}
                  alt={tab.label}
                  className={styles.tabImage}
                  onError={(e) => console.error("Failed to load image:", tab.image, e)}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TabSwitcher;

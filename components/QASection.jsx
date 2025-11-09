"use client";
import React, { useState, useRef, useEffect } from "react";

/**
 * QASection コンポーネント
 */
export default function QASection({
  title,
  qaData = [],
  accentColors = ["#36d1dc", "#5b86e5"],
  textColor = "#222",
  bgColor = "#fff",
}) {
  const [openIndex, setOpenIndex] = useState(null);

  const accentStyle =
    accentColors.length === 2
      ? `linear-gradient(90deg, ${accentColors[0]}, ${accentColors[1]})`
      : accentColors[0];

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      style={{
        background: bgColor,
        color: textColor,
        maxWidth: "1080px",
        margin: "2rem auto",
        transition: "all 0.3s ease",
      }}
    >
      {/* タイトル */}
      <h2
        style={{
          textAlign: "center",
          marginBottom: "1rem",
          backgroundImage: accentStyle,
          WebkitBackgroundClip: "text",
          color: "transparent",
          fontWeight: "bold",
        }}
      >
        {title}
      </h2>

      {/* 件数 */}
      <p
        style={{
          textAlign: "center",
          fontSize: "0.9rem",
          opacity: 0.7,
          marginBottom: "2rem",
        }}
      >
        全{qaData.length}件
      </p>

      {/* QAリスト */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {qaData.map((item, index) => (
          <AccordionItem
            key={index}
            index={index}
            isOpen={openIndex === index}
            question={item.q}
            answer={item.a}
            accentColors={accentColors}
            textColor={textColor}
            onToggle={() => handleToggle(index)}
          />
        ))}
      </div>
    </section>
  );
}

/**
 * アコーディオンアイテム
 */
function AccordionItem({
  index,
  isOpen,
  question,
  answer,
  accentColors,
  textColor,
  onToggle,
}) {
  const contentRef = useRef(null);
  const [height, setHeight] = useState("0px");

  // 🆕 画面サイズを監視してボタンのpaddingを調整
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 600);
    };
    handleResize(); // 初期判定
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isOpen && contentRef.current) {
      setHeight(`${contentRef.current.scrollHeight}px`);
    } else {
      setHeight("0px");
    }
  }, [isOpen]);

  return (
    <div
      style={{
        borderRadius: "10px",
        overflow: "hidden",
        borderLeft: `6px solid ${accentColors[0]}`,
        background:
          accentColors.length === 2
            ? `linear-gradient(90deg, ${accentColors[0]}11, ${accentColors[1]}11)`
            : `${accentColors[0]}11`,
        transition: "box-shadow 0.3s ease",
        boxShadow: isOpen
          ? "0 6px 18px rgba(0,0,0,0.1)"
          : "0 3px 8px rgba(0,0,0,0.05)",
      }}
    >
      {/* 質問ボタン */}
      <button
        onClick={onToggle}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          background: "transparent",
          border: "none",
          // 🆕 画面サイズでpaddingを切り替え
          padding: isSmallScreen ? "0.8rem 1rem" : "1.2rem 1.5rem",
          textAlign: "left",
          fontWeight: "bold",
          fontSize: "1.1rem",
          cursor: "pointer",
          color: textColor,
        }}
      >
        <p>
          <span>
            Q{index + 1}. {question}
          </span>
        </p>
        <span
          style={{
            transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
            transition: "transform 0.3s ease",
            color: accentColors[0],
            fontWeight: "bold",
          }}
        >
          ＋
        </span>
      </button>

      {/* 回答部分（スムーズ開閉） */}
      <div
        ref={contentRef}
        style={{
          height,
          overflow: "hidden",
          transition: "height 0.35s ease",
        }}
      >
        <div style={{ padding: "0 1.5rem 1.2rem 1.5rem" }}>
          <p
            style={{
              lineHeight: "1.7",
              whiteSpace: "pre-line",
              opacity: 0.95,
            }}
          >
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

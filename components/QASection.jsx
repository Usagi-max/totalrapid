"use client";
import React, { useState, useRef, useEffect } from "react";

/**
 * QASection コンポーネント
 * @param {string} title - セクションタイトル
 * @param {Array<{ q: string, a: string }>} qaData - 質問と回答の配列
 * @param {string[]} accentColors - アクセントカラー（1色または2色）
 * @param {string} textColor - テキストカラー
 * @param {string} bgColor - 背景色
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
        padding: "3rem 2rem",
        borderRadius: "12px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
        maxWidth: "1080px",
        margin: "2rem auto",
        transition: "all 0.3s ease",
      }}
    >
      {/* タイトル */}
      <h2
        style={{
          fontSize: "1.8rem",
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
function AccordionItem({ index, isOpen, question, answer, accentColors, textColor, onToggle }) {
  const contentRef = useRef(null);
  const [height, setHeight] = useState("0px");

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
          padding: "1.2rem 1.5rem",
          textAlign: "left",
          fontWeight: "bold",
          fontSize: "1.1rem",
          cursor: "pointer",
          color: textColor,
        }}
      >
        <span>
          Q{index + 1}. {question}
        </span>
        <span
          style={{
            transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
            transition: "transform 0.3s ease",
            fontSize: "1.6rem",
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
              fontSize: "1rem",
            }}
          >
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

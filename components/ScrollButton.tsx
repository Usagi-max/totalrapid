"use client";

import { useEffect, useState } from "react";
import styles from "./ScrollButton.module.css"; // CSSモジュール

interface ScrollButtonProps {
  targetId?: string;
  targetClass?: string;
  children: React.ReactNode;
}

const ScrollButton = ({ targetId, targetClass, children }: ScrollButtonProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      let target: HTMLElement | null = null;

      if (targetId) {
        target = document.getElementById(targetId);
      } else if (targetClass) {
        target = document.querySelector(`.${targetClass}`);
      }

      if (!target) return;

      const rect = target.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      setIsVisible(inView);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // 初回判定

    return () => window.removeEventListener("scroll", handleScroll);
  }, [targetId, targetClass]);

  return (
    <div
      className={styles.button_container}
      style={{ display: isVisible ? "block" : "none" }}
    >
      {children}
    </div>
  );
};

export default ScrollButton;
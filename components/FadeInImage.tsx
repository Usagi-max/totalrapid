// components/FadeInImage.tsx
import { useEffect, useRef, useState } from "react";
import Image, { ImageProps } from "next/image";
import styles from "./FadeInImage.module.css";
import React from "react";

type FadeInImageProps = ImageProps & {
  delay?: number; // 秒単位で遅延指定（例: 0.5, 1, 1.5）
};

const FadeInImage = ({ delay = 0, ...props }: FadeInImageProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`${styles.fadeInImage_container} ${isVisible ? styles.visible : ""}`}
      style={{
        transitionDelay: `${delay}s`, // ← 遅延をここで適用
      }}
    >
      <Image
        {...props}
        style={{
          ...props.style,
          display: "block",
        }}
      />
    </div>
  );
};

export default FadeInImage;

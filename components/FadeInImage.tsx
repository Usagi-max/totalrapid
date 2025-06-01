// components/FadeInImage.tsx
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./FadeInImage.module.css";
import React from "react";

type FadeInImageProps = {
  src: string;
  alt: string;
  delay?: number;
  aspectRatio?: string; // 追加: '16/9', '4/3' など任意
  objectFit?: "contain" | "cover";
};

const FadeInImage = ({
  delay = 0,
  aspectRatio = "16/9",
  objectFit = "cover",
  ...props
}: FadeInImageProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
        else setIsVisible(false);
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`${styles.fadeInImage_container} ${isVisible ? styles.visible : ""}`}
      style={{ transitionDelay: `${delay}s`, aspectRatio }}
    >
      <Image
        src={props.src}
        alt={props.alt}
        fill
        style={{
          objectFit,
        }}
        sizes="100vw"
        priority
      />
    </div>
  );
};

export default FadeInImage;

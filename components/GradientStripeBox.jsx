//GradientStripeBox.jsx
"use client";

import React, { useEffect, useRef } from "react";
import styles from "./GradientStripeBox.module.css";

/**
 * GradientStripeBox コンポーネント 🌈
 *
 * 新props:
 * - backgroundColor：背景色を指定（デフォルト: #E8FEFE）
 * - shadow：影のオンオフ制御（デフォルト: true）
 */

const GradientStripeBox = ({
  children,
  striped = true,
  randomObject = false,
  accentColors = ["#36d1dc", "#5b86e5"],
  squareCount = 40,
  speed = 1.0,
  opacityRange = [0.25, 0.5],
  blur = false,
  mixBlend = false,
  roundedSquares = true,
  shapeType = "square",
  backgroundColor = "#E8FEFE", // 背景色指定
  shadow = true, // 🆕 影制御
}) => {
  const canvasRef = useRef(null);
  const isGradient3 = accentColors.length >= 3;

  useEffect(() => {
    if (!randomObject) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const hexToRgb = (hex) => {
      const v = hex.replace("#", "");
      const bigint = parseInt(v, 16);
      return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
    };

    const rgbs = accentColors.map((c) => hexToRgb(c));

    const interpolateColor = (factor) => {
      const idx = Math.floor(factor * (rgbs.length - 1));
      const nextIdx = Math.min(idx + 1, rgbs.length - 1);
      const localFactor = factor * (rgbs.length - 1) - idx;
      const r = Math.round(
        rgbs[idx][0] + (rgbs[nextIdx][0] - rgbs[idx][0]) * localFactor
      );
      const g = Math.round(
        rgbs[idx][1] + (rgbs[nextIdx][1] - rgbs[idx][1]) * localFactor
      );
      const b = Math.round(
        rgbs[idx][2] + (rgbs[nextIdx][2] - rgbs[idx][2]) * localFactor
      );
      const opacity =
        opacityRange[0] + Math.random() * (opacityRange[1] - opacityRange[0]);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    };

    const shapeArray = Array.isArray(shapeType) ? shapeType : [shapeType];

    const shapes = Array.from({ length: squareCount }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: 40 + Math.random() * 100,
      color: interpolateColor(Math.random()),
      angle: Math.random() * Math.PI * 2,
      speedX: (Math.random() - 0.5) * 0.15 * speed,
      speedY: (Math.random() - 0.5) * 0.15 * speed,
      rotationSpeed: (Math.random() - 0.5) * 0.002 * speed,
      type: shapeArray[Math.floor(Math.random() * shapeArray.length)],
    }));

    const drawShape = (sq) => {
      ctx.save();
      ctx.translate(sq.x, sq.y);
      ctx.rotate(sq.angle);
      ctx.fillStyle = sq.color;
      ctx.strokeStyle = sq.color;
      ctx.lineWidth = 2;

      switch (sq.type) {
        case "circle":
          ctx.beginPath();
          ctx.arc(0, 0, sq.size / 2, 0, Math.PI * 2);
          ctx.fill();
          break;
        case "square":
          const r = roundedSquares ? sq.size / 6 : 0;
          ctx.beginPath();
          ctx.moveTo(-sq.size / 2 + r, -sq.size / 2);
          ctx.lineTo(sq.size / 2 - r, -sq.size / 2);
          ctx.quadraticCurveTo(
            sq.size / 2,
            -sq.size / 2,
            sq.size / 2,
            -sq.size / 2 + r
          );
          ctx.lineTo(sq.size / 2, sq.size / 2 - r);
          ctx.quadraticCurveTo(
            sq.size / 2,
            sq.size / 2,
            sq.size / 2 - r,
            sq.size / 2
          );
          ctx.lineTo(-sq.size / 2 + r, sq.size / 2);
          ctx.quadraticCurveTo(
            -sq.size / 2,
            sq.size / 2,
            -sq.size / 2,
            sq.size / 2 - r
          );
          ctx.lineTo(-sq.size / 2, -sq.size / 2 + r);
          ctx.quadraticCurveTo(
            -sq.size / 2,
            -sq.size / 2,
            -sq.size / 2 + r,
            -sq.size / 2
          );
          ctx.closePath();
          ctx.fill();
          break;
        case "triangle":
          ctx.beginPath();
          ctx.moveTo(0, -sq.size / 1.5);
          ctx.lineTo(sq.size / 1.2, sq.size / 1.5);
          ctx.lineTo(-sq.size / 1.2, sq.size / 1.5);
          ctx.closePath();
          ctx.fill();
          break;
        case "line":
          ctx.beginPath();
          const len = sq.size * 1.5;
          ctx.moveTo(-len / 2, 0);
          ctx.lineTo(len / 2, 0);
          ctx.stroke();
          break;
      }
      ctx.restore();
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = mixBlend ? "overlay" : "source-over";
      shapes.forEach((sq) => {
        sq.x += sq.speedX;
        sq.y += sq.speedY;
        sq.angle += sq.rotationSpeed;
        if (sq.x < -sq.size) sq.x = canvas.width + sq.size;
        if (sq.x > canvas.width + sq.size) sq.x = -sq.size;
        if (sq.y < -sq.size) sq.y = canvas.height + sq.size;
        if (sq.y > canvas.height + sq.size) sq.y = -sq.size;
        drawShape(sq);
      });
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [
    randomObject,
    accentColors,
    squareCount,
    speed,
    opacityRange,
    mixBlend,
    roundedSquares,
    shapeType,
  ]);

  const stripeGradient = isGradient3
    ? `linear-gradient(180deg, ${accentColors[0]} 0%, ${accentColors[1]} 50%, ${accentColors[2]} 100%)`
    : `linear-gradient(180deg, ${accentColors[0]} 0%, ${accentColors[1]} 100%)`;

  return (
    <div
      className={`${styles.gradientStripeBox} ${
        striped ? styles.striped : styles.plain
      }`}
      style={{
        "--stripe-gradient": stripeGradient,
        "--plain-bg": backgroundColor,
        "--box-shadow": shadow
          ? "0 4px 14px rgba(0, 0, 0, 0.1)"
          : "none", // 🆕 CSS変数で影制御
      }}
    >
      {randomObject && (
        <canvas
          ref={canvasRef}
          className={`${styles.bgCanvas} ${blur ? styles.blurCanvas : ""}`}
        />
      )}

      {Array.isArray(children) ? (
        <div className={styles.innerBoxContainer}>
          {React.Children.map(children, (child, i) => (
            <div key={i} className={styles.innerBox}>
              {child}
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.innerBox}>{children}</div>
      )}
    </div>
  );
};

export default GradientStripeBox;


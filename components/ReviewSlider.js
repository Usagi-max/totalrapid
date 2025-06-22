'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from './ReviewSlider.module.css';

const ReviewSlider = ({ reviews, interval = 3000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [maxDisplay, setMaxDisplay] = useState(3); // 初期値は3
  const totalReviews = reviews.length;

  const updateMaxDisplay = () => {
    const width = window.innerWidth;
    if (width <= 470) {
      setMaxDisplay(1);
    } else if (width <= 800) {
      setMaxDisplay(2);
    } else {
      setMaxDisplay(3);
    }
  };

  useEffect(() => {
    updateMaxDisplay();
    window.addEventListener('resize', updateMaxDisplay);
    return () => window.removeEventListener('resize', updateMaxDisplay);
  }, []);

  const loopedReviews = [...reviews, ...reviews.slice(0, maxDisplay)];
  const slideWidth = 100 / loopedReviews.length;
  const sliderRef = useRef();

  useEffect(() => {
    const id = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, interval);
    return () => clearInterval(id);
  }, [interval]);

  useEffect(() => {
    if (currentIndex === totalReviews) {
      setTimeout(() => {
        if (sliderRef.current) {
          sliderRef.current.style.transition = 'none';
          setCurrentIndex(0);
          requestAnimationFrame(() => {
            if (sliderRef.current) {
              sliderRef.current.style.transition = 'transform 0.5s ease-in-out';
            }
          });
        }
      }, 500);
    }
  }, [currentIndex, totalReviews]);

  return (
    <div className={styles.sliderWrapper}>
      <div
        className={styles.slider}
        ref={sliderRef}
        style={{
          transform: `translateX(-${currentIndex * slideWidth}%)`,
          width: `${(loopedReviews.length * 100) / maxDisplay}%`,
        }}
      >
        {loopedReviews.map((review, index) => (
          <div
            className={styles.slide}
            key={index}
            style={{ width: `${100 / loopedReviews.length}%` }}
          >
            <div className={styles.card}>
              <div className={styles.topSection}>
                <img src={review.icon} alt="icon" className={styles.icon} />
                <p className={styles.meta}>
                  {review.grade} / {review.gender} / {review.nickname}
                </p>
              </div>
              <div className={styles.comment}>
                {review.comment}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewSlider;

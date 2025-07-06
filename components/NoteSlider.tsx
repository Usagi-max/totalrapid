import React, { useEffect, useState } from "react";
import NoteCard from "./NoteCard";
import styles from "../src/styles/Prices.module.css";

type Note = {
  title: string;
  description: string;
  imageUrl: string;
  link: string;
};

type NoteSliderProps = {
  notes: Note[];
  displayCount?: number;
};

const NoteSlider: React.FC<NoteSliderProps> = ({ notes, displayCount = 3 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(displayCount);

  // 自動スライド
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + cardsToShow) % notes.length);
    }, 5000); // 5秒ごとに切り替え
    return () => clearInterval(interval);
  }, [cardsToShow, notes.length]);

  // ウィンドウサイズに応じたカード枚数
  useEffect(() => {
    const updateCardsToShow = () => {
      const width = window.innerWidth;
      if (width > 1024) setCardsToShow(3);
      else if (width > 768) setCardsToShow(2);
      else setCardsToShow(1);
    };
    updateCardsToShow();
    window.addEventListener("resize", updateCardsToShow);
    return () => window.removeEventListener("resize", updateCardsToShow);
  }, []);

  const visibleNotes = [...notes, ...notes].slice(currentIndex, currentIndex + cardsToShow);

  return (
    <div className={styles.sliderWrapper}>
      {visibleNotes.map((note, index) => (
        <div key={index} className={styles.cardContainer}>
          <NoteCard {...note} />
        </div>
      ))}
    </div>
  );
};

export default NoteSlider;

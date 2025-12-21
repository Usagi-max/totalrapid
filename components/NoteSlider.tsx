// components/NoteSlider.tsx
import React, { useEffect, useState } from "react";
import NoteCard from "./NoteCard";
import styles from "../src/styles/Prices.module.css";

type Note = {
  title: string;
  description: string;
  imageUrl: string;
  link: string;
};

type Props = {
  notes: Note[];
  displayCount?: number;
};

const NoteSlider: React.FC<Props> = ({ notes, displayCount = 3 }) => {
  const [index, setIndex] = useState(0);
  const [count, setCount] = useState(displayCount);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + count) % notes.length);
    }, 5000);
    return () => clearInterval(id);
  }, [count, notes.length]);

  useEffect(() => {
    const resize = () => {
      const w = window.innerWidth;
      if (w > 1024) setCount(3);
      else if (w > 768) setCount(2);
      else setCount(1);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const visible = [...notes, ...notes].slice(index, index + count);

  return (
    <div className={styles.sliderWrapper}>
      {visible.map((note, i) => (
        <div
          key={`${note.link}-${i}`} // ✅ 安定 key
          className={styles.cardContainer}
        >
          <NoteCard {...note} />
        </div>
      ))}
    </div>
  );
};

export default NoteSlider;

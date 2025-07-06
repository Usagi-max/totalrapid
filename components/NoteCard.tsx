import React from "react";
import styles from "./NoteCard.module.css";

type NoteCardProps = {
  title: string;
  description: string;
  imageUrl: string;
  link: string;
};

const NoteCard: React.FC<NoteCardProps> = ({ title, description, imageUrl, link }) => {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.card}
    >
      <img src={imageUrl} alt="Noteサムネイル" className={styles.image} />
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
      </div>
    </a>
  );
};

export default NoteCard;

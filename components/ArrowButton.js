import styles from "./ArrowButton.module.css";

export default function ArrowButton({ text = "次へ進む", width = "auto" }) {
  return (
    <div className={styles.wrapper} style={{ width }}>
      <div className={styles.arrow}>
        <div className={styles.text}>{text}</div>
      </div>
    </div>
  );
}

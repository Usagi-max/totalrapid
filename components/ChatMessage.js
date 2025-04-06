import styles from "./ChatMessage.module.css";

export default function ChatMessage({
  message,
  icon,
  isUser,
  bubbleColor = isUser ? "white" : "white", // blue / gray
  textColor = isUser ? "#1F2937" : "#1F2937",   // white / dark
  isTyping = false,
}) {
  return (
    <div className={`${styles.messageWrapper} ${isUser ? styles.user : styles.bot}`}>
      {!isUser && <img src={icon} alt="icon" className={styles.icon} />}
      <div className={styles.bubbleWrapper}>
        <div
          className={`${styles.bubble} ${isUser ? styles.userCorner : styles.botCorner}`}
          style={{ backgroundColor: bubbleColor, color: textColor }}
        >
          {isTyping ? (
            <div className={styles.typing}>
              <span></span><span></span><span></span>
            </div>
          ) : (
            message
          )}
        </div>
        <div
          className={`${styles.tail} ${isUser ? styles.userTail : styles.botTail}`}
          style={{ backgroundColor: bubbleColor }}
        ></div>
      </div>
      {isUser && <img src={icon} alt="icon" className={styles.icon} />}
    </div>
  );
}

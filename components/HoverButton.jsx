import { useState } from "react";

const HoverButton = ({
  text,
  linkTo,
  normalTextColor,
  hoverTextColor,
  normalBgColor,
  hoverBgColor,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  const handleClick = () => setIsActive(true);

  const buttonStyle = {
    padding: "10px 20px",
    fontSize: "16px",
    fontWeight: "bold",
    borderRadius: "5px",
    color: isHovered ? hoverTextColor || "#ffffff" : normalTextColor || "#ffffff",
    backgroundColor: isHovered ? hoverBgColor || "#ff6347" : normalBgColor || "#6495ed",
    transition: "all 0.3s ease",
    cursor: "pointer",
    border: "none",
    outline: "none",
    textDecoration: "none", // リンクの下線を消す
    display: "inline-block", // サイズ調整
  };

  return (
    <a
      href={linkTo}
      target="_blank"
      rel="noopener noreferrer"
      style={buttonStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {text}
    </a>
  );
};

export default HoverButton;

import { useState } from "react";
import Link from "next/link";

const HoverButton = ({
  text,
  linkTo,
  normalTextColor,
  hoverTextColor,
  normalBgColor,
  hoverBgColor,
  normalBorderColor, // ✅ 追加
  hoverBorderColor,  // ✅ 既存
  openInNewTab = true,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const isInternal = linkTo.startsWith("/");

  const defaultHoverBorderColor = "#333";

  const buttonStyle = {
    padding: "10px 20px",
    fontSize: "16px",
    fontWeight: "bold",
    borderRadius: "5px",
    color: isHovered ? hoverTextColor || "#ffffff" : normalTextColor || "#ffffff",
    backgroundColor: isHovered ? hoverBgColor || "#ff6347" : normalBgColor || "#6495ed",
    transition: "all 0.3s ease",
    cursor: "pointer",
    textDecoration: "none",
    display: "inline-block",

    // ✅ ボーダー条件分岐
    border: isHovered
      ? `2px solid ${hoverBorderColor || defaultHoverBorderColor}`
      : normalBorderColor
      ? `2px solid ${normalBorderColor}`
      : "none",
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const ButtonTag = isInternal ? Link : "a";
  const buttonProps = isInternal
    ? {
        href: linkTo,
        passHref: true,
        legacyBehavior: true,
      }
    : {
        href: linkTo,
        target: openInNewTab ? "_blank" : "_self",
        rel: openInNewTab ? "noopener noreferrer" : undefined,
      };

  return isInternal ? (
    <Link {...buttonProps}>
      <a
        style={buttonStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {text}
      </a>
    </Link>
  ) : (
    <a
      {...buttonProps}
      style={buttonStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {text}
    </a>
  );
};

export default HoverButton;

import React, { useEffect, useState } from "react";

type SpacerProps = {
  large: number;
  small?: number;
  breakpoint?: number;
};

const Spacer: React.FC<SpacerProps> = ({
  large,
  small = large * 0.7,
  breakpoint = 760,
}) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    // 初回ロード後に正しい幅を取得
    const updateSize = () => {
      setIsSmallScreen(window.innerWidth < breakpoint);
    };

    updateSize();
    window.addEventListener("resize", updateSize);

    return () => {
      window.removeEventListener("resize", updateSize);
    };
  }, [breakpoint]);

  const height = isSmallScreen ? small : large;

  return <div style={{ height: `${height}px` }} />;
};

export default Spacer;

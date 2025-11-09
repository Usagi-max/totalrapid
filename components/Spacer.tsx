import React, { useEffect, useState } from 'react';

type SpacerProps = {
  /** 大画面（例：PC）での高さ(px) */
  large: number;
  /** 小画面（例：スマホ）での高さ(px) */
  small?: number;
  /** ブレークポイント（デフォルト: 760px） */
  breakpoint?: number;
};

const Spacer: React.FC<SpacerProps> = ({
  large,
  small = large * 0.7, // small が指定されていなければ自動的に 0.7 倍
  breakpoint = 760,
}) => {
  const [isSmallScreen, setIsSmallScreen] = useState(
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : false
  );

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < breakpoint);
    };

    handleResize(); // 初期判定
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  const height = isSmallScreen ? small : large;

  return <div style={{ height: `${height}px` }} />;
};

export default Spacer;

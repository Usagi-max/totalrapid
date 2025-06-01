import React, { useEffect, useState } from 'react';

type SpacerProps = {
  height: number; // ピクセル数で指定するためのプロパティ
};

const Spacer: React.FC<SpacerProps> = ({ height }) => {
  const [scaledHeight, setScaledHeight] = useState(height);

  useEffect(() => {
    const updateHeight = () => {
      const isSmallScreen = window.innerWidth < 760;
      setScaledHeight(isSmallScreen ? height * 0.7 : height);
    };

    updateHeight(); // 初期チェック
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, [height]);

  return <div style={{ height: `${scaledHeight}px` }} />;
};

export default Spacer;

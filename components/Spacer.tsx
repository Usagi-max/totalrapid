// Spacer.tsx

import React from 'react';

type SpacerProps = {
  height: number; // ピクセル数で指定するためのプロパティ
};

const Spacer: React.FC<SpacerProps> = ({ height }) => {
  return <div style={{ height: `${height}px` }} />;
};

export default Spacer;

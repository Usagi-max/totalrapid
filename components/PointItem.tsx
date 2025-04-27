// PointItem.tsx

import React from 'react';
import styles from './PointItem.module.css';

type PointItemProps = {
  label: string;
  text: string;
  content: string;
};

const PointItem: React.FC<PointItemProps> = ({ label, text, content}) => {
  return (
    <div className={styles['point-container']}>
        <div className={styles['point-item']}>
        <h3>{label}</h3>
        <p>{text}</p>
        </div>
        <p>{content}</p>
    </div>
  );
};

export default PointItem;

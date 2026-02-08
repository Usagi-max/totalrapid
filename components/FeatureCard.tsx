import Image from 'next/image';
import styles from './FeatureCard.module.css';

type Props = {
  no: string;
  title: string;
  desc: string;
  image: string;
};

export const FeatureCard = ({ no, title, desc, image }: Props) => {
  return (
    <div className={styles.card}>
      <div className={styles.no}>{no}</div>

      <div className={styles.body}>
        <div className={styles.icon}>
          <Image
            src={image}
            alt={title}
            width={64}
            height={64}
          />
        </div>

        <div>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.desc}>{desc}</p>
        </div>
      </div>
    </div>
  );
};

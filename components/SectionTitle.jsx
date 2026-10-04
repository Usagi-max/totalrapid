import PropTypes from 'prop-types';
import styles from './SectionTitle.module.css';

const defaultColors = { accent: 'var(--warm-deep)', text: 'var(--text-dark)' };

export default function SectionTitle({
  kicker,
  title,
  description,
  backdrop,
  colors = defaultColors,
  backdropOpacity = 0.08,
  className = '',
  titleAs: Title = 'h2',
}) {
  const palette = { ...defaultColors, ...colors };
  return (
    <div className={`${styles.root} ${className}`.trim()} style={{ '--section-title-accent': palette.accent, '--section-title-text': palette.text }}>
      {backdrop && <span className={styles.backdrop} aria-hidden="true" style={{ color: palette.accent, opacity: backdropOpacity }}>{backdrop}</span>}
      {kicker && <span className={styles.kicker} style={{ color: palette.accent }}>{kicker}</span>}
      <Title className={styles.title} style={{ color: palette.text }}>{title}</Title>
      {description && <p className={styles.description} style={{ color: palette.description ?? palette.accent }}>{description}</p>}
    </div>
  );
}

SectionTitle.propTypes = {
  kicker: PropTypes.node,
  title: PropTypes.node.isRequired,
  description: PropTypes.node,
  backdrop: PropTypes.node,
  colors: PropTypes.shape({ accent: PropTypes.string, text: PropTypes.string, description: PropTypes.string }),
  backdropOpacity: PropTypes.number,
  className: PropTypes.string,
  titleAs: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4']),
};

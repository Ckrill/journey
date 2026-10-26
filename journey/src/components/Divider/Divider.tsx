// Styles
import styles from './Divider.module.scss';

interface Props {
  appearance?: 'faint';
  spacing?: 'spacious';
  text?: string;
}

const Divider = ({ appearance, spacing, text }: Props) => (
  <div
    className={styles.divider}
    data-appearance={appearance}
    data-spacing={spacing}
  >
    <hr className={styles.ruler} />
    {text && (
      <span className={styles.mask}>
        <span className={styles.text}>{text}</span>
      </span>
    )}
  </div>
);

export default Divider;

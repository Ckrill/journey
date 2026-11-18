// Styles
import styles from './Divider.module.scss';

interface Props {
  appearance?: 'faint';
  text?: string;
}

const Divider = ({ appearance, text }: Props) => (
  <div className={styles.divider} data-appearance={appearance}>
    <hr className={styles.ruler} />
    {text && (
      <span className={styles.mask}>
        <span className={styles.text}>{text}</span>
      </span>
    )}
  </div>
);

export default Divider;

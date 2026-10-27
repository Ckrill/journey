// External
import { BsAsterisk } from 'react-icons/bs';

// Styles
import styles from './FieldLabel.module.scss';

interface Props {
  children: React.ReactNode;
  htmlFor: string;
  required?: boolean;
}

const FieldLabel = ({ children, htmlFor, required }: Props) => (
  <label className={styles.label} htmlFor={htmlFor}>
    <span className={styles.text}>{children}</span>
    {required && <BsAsterisk aria-hidden className={styles.required} />}
  </label>
);

export default FieldLabel;

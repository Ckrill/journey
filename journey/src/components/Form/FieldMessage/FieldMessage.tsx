// Styles
import styles from './FieldMessage.module.scss';

interface Props {
  assistiveText?: string;
  errorText?: string;
}

const FieldMessage = ({ assistiveText, errorText }: Props) =>
  errorText ? (
    <p className={styles.error}>{errorText}</p>
  ) : (
    <p className={styles.assistive}>{assistiveText}</p>
  );

export default FieldMessage;

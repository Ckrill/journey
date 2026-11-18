// Styles
import styles from './FieldMessage.module.scss';

interface Props {
  assistiveText?: string;
  errorText?: string;
}

const FieldMessage = ({ assistiveText, errorText }: Props) => {
  if (errorText) return <p className={styles.error}>{errorText}</p>;
  if (assistiveText) return <p className={styles.assistive}>{assistiveText}</p>;

  return null;
};

export default FieldMessage;

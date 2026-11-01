// Miscellaneous
import FieldMessage from '../FieldMessage/FieldMessage';

// Styles
import styles from './CheckboxGroup.module.scss';

interface Props {
  assistiveText?: string;
  children: React.ReactNode;
  errorText?: string;
}

const CheckboxGroup = ({ assistiveText, children, errorText }: Props) => (
  <div className={styles.container}>
    <div className={styles.group}>{children}</div>

    <FieldMessage assistiveText={assistiveText} errorText={errorText} />
  </div>
);

export default CheckboxGroup;

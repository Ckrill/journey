// Miscellaneous
import FieldMessage from '../Form/FieldMessage/FieldMessage';

// Styles
import styles from './ButtonGroup.module.scss';

interface Props {
  align?: 'center' | 'left';
  assistiveText?: string;
  children: React.ReactNode;
  errorText?: string;
}

const ButtonGroup = ({
  align = 'left',
  assistiveText,
  children,
  errorText,
}: Props) => (
  <div className={styles.group} data-align={align}>
    {children}

    {(assistiveText ?? errorText) && (
      <FieldMessage assistiveText={assistiveText} errorText={errorText} />
    )}
  </div>
);

export default ButtonGroup;

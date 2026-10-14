// Styles
import styles from './FormActions.module.scss';

interface Props {
  children: React.ReactNode;
}

const FormActions = ({ children }: Props) => (
  <div className={styles.actions}>{children}</div>
);

export default FormActions;

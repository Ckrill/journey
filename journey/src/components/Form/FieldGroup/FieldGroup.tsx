// Styles
import styles from './FieldGroup.module.scss';

const FieldGroup = ({ children }: { children: React.ReactNode }) => {
  return <div className={styles.fieldGroup}>{children}</div>;
};

export default FieldGroup;

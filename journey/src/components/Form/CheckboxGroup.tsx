// Styles
import styles from './CheckboxGroup.module.scss';

type Props = {
  children: React.ReactNode;
};

const CheckboxGroup = ({ children }: Props) => (
  <div className={styles.group}>{children}</div>
);

export default CheckboxGroup;

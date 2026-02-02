// Styling
import styles from './Section.module.scss';

type Props = {
  children: React.ReactNode;
};

const SectionContainer = (props: Props) => (
  <div className={styles.container}>{props.children}</div>
);

export default SectionContainer;

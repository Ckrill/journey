// Styles
import styles from './SectionContainer.module.scss';

type Props = {
  children: React.ReactNode;
};

const SectionContainer = (props: Props) => (
  <div className={styles.container}>{props.children}</div>
);

export default SectionContainer;
